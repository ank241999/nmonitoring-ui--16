import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserService } from '../../../../assets/services/user.service';
import { IUser } from '../../../../assets/interfaces/iuser';
import { NotificationService } from '../../../../assets/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { Router, ActivatedRoute } from '@angular/router';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { environment } from '../../../../environments/environment';

import { DatePipe } from '@angular/common';
// import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TextValidator } from '../.../../../../../assets/common/text.validator';
import { IRoles } from '../../../../assets/interfaces/iroles';

// import * as _moment from 'moment';
import { IAccesslevel } from '../../../../assets/interfaces/iuserroleauth';
import { UserRoleAuthService } from '../../../../assets/services/user-role-auth.service';
// import { MatDialog } from '@angular/material';
// import { AlertboxComponent } from '../../activitymonitoring/alertbox/alertbox.component';

// const moment = _moment;

const $ = require('jquery');

@Component({
  selector: 'app-modifyaccount',
  templateUrl: './modifyaccount.component.html',
  styleUrls: ['../modifyaccount/styles/modifyaccount.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // providers: [DatePipe, { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  //   { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})
export class ModifyaccountComponent implements OnInit {
  user: IUser = {};

  // Form validation messages
  validationMessages = {
    firstName: [
      { type: 'required', message: 'This field is required.' },
      { type: 'cannotContainSpace', message: 'This field can not contain space.' }
    ],
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'email', message: 'Email must be valid.' }
    ],
    password: [
      { type: 'required', message: 'Password is required.' }
    ],
    equal: [
      { type: 'areEqual', message: 'This fields should be equal.' }
    ],
    terms: [
      { type: 'pattern', message: 'You must accept terms and conditions.' }
    ],
    role: [
      { type: 'required', message: 'Access level is required.' }
    ],
    phone: [
      { type: 'required', message: 'Phone is required.' },
      { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }
    ],
    textNumber: [
      { type: 'pattern', message: 'Number must be an integer.' }
    ],
    minLength: [
      { type: 'minlength', message: 'Min length is 11.' }
    ],
    maxLength: [
      { type: 'maxlength', message: 'Max length is 8.' }
    ],
    range: [
      { type: 'range', message: 'Range should be a number between 5 and 10.' }
    ],
    minValue: [
      { type: 'min', message: 'Min value is 4.' }
    ],
    maxValue: [
      { type: 'max', message: 'Max value is 5.' }
    ]
  };

  // userRoles = [{ "id": "BASIC", "role": "Basic" },
  // { "id": "ADVANCE", "role": "Advance" }];
  userRoles = [];
  expiryDays = [1, 2, 7, 30];

  // Full form
  form: FormGroup;
  progress = '0';
  disableSelect = new FormControl(false);
  currentDate = new Date();
  currMonth = this.currentDate.getMonth();
  currYear = this.currentDate.getFullYear();
  userRole = 'BASIC';
  expiryDateU = 0;
  isValidExpiryDate = 0;
  isblocked = false;

  constructor(
    public formBuilder: FormBuilder,
    private location: Location,
    private userService: UserService,
    // private dialogRef: MatDialogRef<IUser>,
    // @Inject(MAT_DIALOG_DATA) data,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private router: Router,
    // public dialog: MatDialog,
    private route: ActivatedRoute,
    private shareDataService: ShareDataService,
    private datePipe: DatePipe,
    // private spinnerService: NgxSpinnerService,
    private userRoleAuthService: UserRoleAuthService
  ) {
    this.getRoleModule();
    translate.setDefaultLang(shareDataService.getLabels());
    this.translateValidationMessages();
    const LastDay = new Date(this.currYear, this.currMonth + 1, 0);
    this.form = formBuilder.group({
      // firstName: new FormControl('', Validators.required),
      firstName: new FormControl('', [Validators.required, Validators.minLength(3), TextValidator.cannotContainSpace]),
      lastName: new FormControl(''),
      email: new FormControl('', Validators.compose([
        // Validators.email,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        Validators.required
      ])),
      role: new FormControl('', Validators.required),
      // expiryDays: new FormControl('1'),
      expiryDate: new FormControl('')
    });

    this.form.valueChanges.subscribe(form => { this.dateFilter(form); });

    this.user = shareDataService.getSharedData();
    // shareDataService.setSharedData(null);

    this.userRole = this.user.role.replace('[', '').replace(']', '');
    this.isblocked = (this.user.enabled === 1 ? false : true);

    this.form.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      // role: this.user.role.id,
      role: this.userRole,
      expiryDate: (this.userRole === 'ZACCESS' ? new Date(new Date().getFullYear() + 1,
        new Date().getMonth(), new Date().getDate()) : new Date(this.user.expiryTimestamp))
    });
  }

  ngOnInit() {
    this.changeRole(this.userRole);
  }

  validateFields(): void {
    if (!this.form.valid) {
      // Mark the form and inputs as touched so the errors messages are shown
      this.form.markAsTouched();
      for (const control in this.form.controls) {
        if (this.form.controls.hasOwnProperty(control)) {
          this.form.controls[control].markAsTouched();
          this.form.controls[control].markAsDirty();
        }
      }
    }
  }

  updateProgress(): void {
    const controls = this.form.controls;
    let size = 0;
    let completed = 0;
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        size++;
        const control = controls[key];
        if ((control.value) && (control.dirty) && (control.valid)) {
          completed++;
        }
      }
    }

    // Size - 4 to not consider the optional fields
    this.progress = (Math.floor((completed / (size - 4)) * 100)).toString();
  }

  dateFilter(form): void {
    this.expiryDateU = new Date(this.datePipe.transform(this.form.value.expiryDate, 'yyyy-MM-dd')).getTime();
    this.isValidExpiryDate = 0;

    if (['3ACCESS', '1ACCESS', '2ACCESS'].includes(this.form.controls['role'].value) === true) {
      if (this.expiryDateU === 0) {
        this.isValidExpiryDate = 2;
      } else {
        this.expiryDateU = this.expiryDateU + (new Date().getTimezoneOffset() * 60000);

        const currDate: any = new Date(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
        const expDate: any = new Date(this.datePipe.transform(this.form.value.expiryDate, 'yyyy-MM-dd'));

        if (expDate < currDate) {
          this.isValidExpiryDate = 1;
        }
      }
    }
  }

  onSubmit() {
    // this.spinnerService.show();
    let expiryDay = 0;

    if (this.form.controls['role'].value === 'ZACCESS') {
      expiryDay = environment.expiryDays;
    }

    const userObject = {
      id: this.user.id,
      firstName: this.form.controls['firstName'].value,
      lastName: this.form.controls['lastName'].value,
      // roleId: this.form.controls["role"].value,
      password: '',
      roleName: this.form.controls['role'].value,
      expiryDays: expiryDay,
      enabled: 1,
      expiryDate: this.expiryDateU
    };

    this.userService.updateUser(userObject).subscribe(res => {
      if (res['status'] === 201) {
        // this.spinnerService.hide();
        const response: IUser = res['data'];

        this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
          this.notificationService.showNotification('User updated successfully', 'top', 'center', '', 'info-circle');
        });

        setTimeout(() => {
          this.router.navigate(['/admin/accountmanagement']);
        }, 3000);
      } else if (res['status'] === 500) {
        // this.spinnerService.hide();
        // let response: IUser = res["data"];
        // localStorage.setItem("id", response.id);

        this.notificationService.showNotification(res['error'], 'top', 'center', 'warning', 'info-circle');
        // this.translate.get('msgInternalError').subscribe((text: string) => {
        // });
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
        // this.spinnerService.hide();

        if (err['status'] === 500) {
          this.translate.get('msgInternalError').subscribe((text: string) => {
            this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
          });
        } else {
          this.notificationService.showNotification('Error occurred: ' + err.message, 'top', 'center', 'danger', 'info-circle');
        }
      });
  }

  onScreenClose() {
    this.router.navigate(['/admin/accountmanagement']);
  }

  formatDate = function (date: Date) {
    return (date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()) +
      '-' + (date.getDay() < 10 ? '0' + date.getDay() : date.getDay()) +
      '-' + date.getFullYear() + ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
      ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  };

  changeRole(val) {
    if (val === 'ZACCESS') {
      $('.basic-user').each(function () {
        $(this).hide();
      });
    } else {
      $('.basic-user').each(function () {
        $(this).show();
      });
    }
  }

  resetDatePicker(): void {
    this.form.controls.dateTo.reset('');
  }

  translateValidationMessages() {
    this.translate.get('modifyrequiredfield').subscribe((text: string) => {
      this.validationMessages.firstName[0].message = text;
    });

    this.translate.get('requiredemail').subscribe((text: string) => {
      this.validationMessages.email[0].message = text;
    });

    this.translate.get('requiredpassword').subscribe((text: string) => {
      this.validationMessages.password[0].message = text;
    });

    this.translate.get('requiredequal').subscribe((text: string) => {
      this.validationMessages.equal[0].message = text;
    });

    this.translate.get('requiredterms').subscribe((text: string) => {
      this.validationMessages.terms[0].message = text;
    });
  }

  getRoleModule() {
    try {
      // this.userService.getRole().subscribe(res => {
      //   if (res["status"] == 200) {
      //     let roles: IRoles[] = res["data"];
      //     if (roles.length > 0) {
      //       roles.forEach(e=>{
      //         this.userRoles.push({"id":e.roleName,"role":e.roleName.toUpperCase()});
      //       });
      //     }
      //   }
      // },
      // err => {
      //   console.log("Error occurred: " + err.message);
      // });
      this.userRoleAuthService.getAccessibilities().subscribe(res => {
        if (res['status'] === 200) {
          let roles: IAccesslevel[] = res['data'];
          if (roles.length > 0) {
            if (this.shareDataService.role === 'ZACCESS') {
              roles = roles.filter(x => ['ZACCESS', '1ACCESS', '2ACCESS', '3ACCESS'].includes(x.keyName));
            } else if (this.shareDataService.role === '1ACCESS') {
              roles = roles.filter(x => ['1ACCESS', '2ACCESS', '3ACCESS'].includes(x.keyName));
            } else if (this.shareDataService.role === '2ACCESS') {
              roles = roles.filter(x => ['2ACCESS', '3ACCESS'].includes(x.keyName));
            } else if (this.shareDataService.role === '3ACCESS') {
              roles = roles.filter(x => ['3ACCESS'].includes(x.keyName));
            }

            roles.forEach(e => {
              this.userRoles.push({ 'id': e.keyName, 'role': e.accessLevels.toUpperCase(), 'label': e.label });
            });
          }
        }
      },
        err => {
          console.log('Error occurred: ' + err.message);
        });
    } catch (e) {
      console.log(e.message);
    }
  }

  changeStatus() {
    // this.spinnerService.show();
    let expiryDay = 0;

    if (this.form.controls['role'].value === 'ZACCESS') {
      expiryDay = environment.expiryDays;
    }

    const userObject = {
      id: this.user.id,
      firstName: this.form.controls['firstName'].value,
      lastName: this.form.controls['lastName'].value,
      // roleId: this.form.controls["role"].value,
      password: '',
      roleName: this.form.controls['role'].value,
      expiryDays: expiryDay,
      enabled: 1,
      expiryDate: this.expiryDateU
    };

    this.userService.updateUser(userObject).subscribe(res => {
      if (res['status'] === 201) {
        // this.spinnerService.hide();
        const response: IUser = res['data'];

        this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
          this.notificationService.showNotification('User unblocked successfully', 'top', 'center', '', 'info-circle');
        });
        this.isblocked = false;
      } else if (res['status'] === 500) {
        // this.spinnerService.hide();
        this.notificationService.showNotification(res['error'], 'top', 'center', 'warning', 'info-circle');
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
        // this.spinnerService.hide();

        if (err['status'] === 500) {
          this.translate.get('msgInternalError').subscribe((text: string) => {
            this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
          });
        } else {
          this.notificationService.showNotification('Error occurred: ' + err.message, 'top', 'center', 'danger', 'info-circle');
        }
      });
  }

  resetUser() {
    // const dialogRef = this.dialog.open(AlertboxComponent, {
    //   data: {
    //     text: 'After the reset, the password will be 1234',
    //   },
    //   panelClass: 'custom-dialog-container'
    // });

    // dialogRef.afterClosed().subscribe(() => {
    //   this.spinnerService.show();
    //   let expiryDay = 0;

    //   if (this.form.controls['role'].value === 'ZACCESS') {
    //     expiryDay = environment.expiryDays;
    //   }

    //   const userObject = {
    //     id: this.user.id,
    //     firstName: this.form.controls['firstName'].value,
    //     lastName: this.form.controls['lastName'].value,
    //     // roleId: this.form.controls["role"].value,
    //     password: '1234',
    //     roleName: this.form.controls['role'].value,
    //     expiryDays: expiryDay,
    //     enabled: 1,
    //     expiryDate: this.expiryDateU
    //   };

    //   this.userService.updateUser(userObject).subscribe(res => {
    //     if (res['status'] === 201) {

    //       this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
    //         const userAgreementObject = {
    //           id: this.user.id,
    //           isAgree: false,
    //           languageCode: 'en-US'
    //         };

    //         this.userService.updateUserAgreement(userAgreementObject).subscribe(response => {
    //           if (response['status'] === 201) {
    //             this.spinnerService.hide();
    //             this.notificationService.showNotification('Password reset successfully', 'top', 'center', '', 'info-circle');
    //           } else if (response['status'] === 500) {
    //             this.spinnerService.hide();
    //             this.translate.get('lblAlreadyAcc').subscribe((translatedText: string) => {
    //               this.notificationService.showNotification(translatedText, 'top', 'center', 'warning', 'info-circle');
    //             });
    //           }
    //         },
    //           err => {
    //             console.log('Error occurred: ' + err.message);
    //             this.spinnerService.hide();
    //             this.notificationService.showNotification('Error occurred: ' + err.message, 'top', 'center', 'danger', 'info-circle');
    //           });
    //       });
    //     } else if (res['status'] === 500) {
    //       this.spinnerService.hide();

    //       this.notificationService.showNotification(res['error'], 'top', 'center', 'warning', 'info-circle');
    //     }
    //   },
    //     err => {
    //       console.log('Error occurred: ' + err.message);
    //       this.spinnerService.hide();

    //       if (err['status'] === 500) {
    //         this.translate.get('msgInternalError').subscribe((text: string) => {
    //           this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
    //         });
    //       } else {
    //         this.notificationService.showNotification('Error occurred: ' + err.message, 'top', 'center', 'danger', 'info-circle');
    //       }
    //     });
    // });
  }
}
