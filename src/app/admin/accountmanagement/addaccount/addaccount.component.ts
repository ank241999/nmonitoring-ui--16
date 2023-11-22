import { Component, Inject, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../assets/services/user.service';
import { IUser } from '../../../../assets/interfaces/iuser';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../assets/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { environment } from '../../../../environments/environment';
import { Location } from '@angular/common';

// import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

// import * as _moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { TextValidator } from '../.../../../../../assets/common/text.validator';
import { IRoles } from '../../../../assets/interfaces/iroles';
import { UserRoleAuthService } from '../../../../assets/services/user-role-auth.service';
import { IAccesslevel } from '../../../../assets/interfaces/iuserroleauth';
import { ShareDataService } from '../../../../assets/services/share-data.service';

// const moment = _moment;

const $ = require('jquery');

@Component({
  selector: 'app-addaccount',
  templateUrl: './addaccount.component.html',
  styleUrls: ['./styles/addaccount.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // providers: [DatePipe, { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  //   { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})
export class AddaccountComponent implements OnInit {
  user: IUser = {};
  isPasswordValid = true;
  isEmailValid = true;
  public showPasswordOnPress: boolean;
  public showConfirmPasswordOnPress: boolean;

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
    confirmemail: [
      { type: 'required', message: 'email must be same.' }
    ],
    equal: [
      { type: 'areEqual', message: 'This fields should be equal.' }
    ],
    terms: [
      { type: 'pattern', message: 'You must accept terms and conditions.' }
    ],
    role: [
      { type: 'required', message: 'Acccess level is required.' }
    ],
    expiryDate: [
      { type: 'required', message: 'Expiration date is required.' },
      { type: 'valid', message: 'Please ensure that the expiration date is greater than the current Date.' }
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

  userRoles = [{ 'id': '', 'role': 'Select Access level', 'label': 'Label' }/*,
  { "id": "BASIC", "role": "Basic" },
  { "id": "ADVANCE", "role": "Advance" }*/
  ];
  expiryDays = [1, 2, 7, 30];

  // Full form
  form: FormGroup;
  progress = '0';
  disableSelect = new FormControl(false);


  @ViewChild('passcode', { static: false }) passcode4Ref: ElementRef;


  @ViewChild('confPasscode', { static: false }) confPasscode4Ref: ElementRef;

  expiryDateU = 0;
  currentDate = new Date();
  currMonth = this.currentDate.getMonth();
  currYear = this.currentDate.getFullYear();
  expiryDay: number = this.currentDate.getDate() + environment.expiryDays;
  isValidExpiryDate = 0;
  date: Date;

  constructor(
    public formBuilder: FormBuilder,
    // private http: HttpClient,
    private location: Location,
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService,
    private translate: TranslateService,
    public datepipe: DatePipe,
    // private spinnerService: NgxSpinnerService,
    private userRoleAuthService: UserRoleAuthService,
    private shareDataService: ShareDataService
  ) {
    translate.setDefaultLang(shareDataService.getLabels());
    this.translateValidationMessages();
    this.date = new Date();
    this.date.setFullYear(this.date.getFullYear() + 1);
    this.form = formBuilder.group({
      // firstName: new FormControl('', Validators.required),
      firstName: new FormControl('', [Validators.required, Validators.minLength(3), TextValidator.cannotContainSpace]),
      lastName: new FormControl(''),
      email: new FormControl('', Validators.compose([
        // Validators.email,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        Validators.required
      ])),

      confirmemail: new FormControl('', Validators.compose([
        // Validators.email,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        Validators.required
      ])),

      role: new FormControl('', Validators.required),
      // expiryDays: new FormControl('1')
      // expiryDate: new FormControl(moment([this.currYear, this.currMonth, this.expiryDay]))
      // expiryDate: new FormControl('', Validators.required)
      expiryDate: new FormControl(this.date)
    });

    this.form.valueChanges.subscribe(form => { this.dateFilter(form); });
  }

  ngOnInit() {
    $('#expiryDate').hide();
    this.getRoleModule();
    this.changeRole('BASIC');
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
    this.expiryDateU = new Date(this.datepipe.transform(this.form.value.expiryDate, 'yyyy-MM-dd')).getTime();
    this.isValidExpiryDate = 0;

    if (['3ACCESS', '1ACCESS', '2ACCESS'].includes(this.form.controls['role'].value) === true) {
      if (this.expiryDateU === 0) {
        this.isValidExpiryDate = 2;
      } else {
        this.expiryDateU = this.expiryDateU + (new Date().getTimezoneOffset() * 60000);

        const currDate: any = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd'));
        const expDate: any = new Date(this.datepipe.transform(this.form.value.expiryDate, 'yyyy-MM-dd'));

        if (expDate < currDate) {
          this.isValidExpiryDate = 1;
        }
      }
    }
  }

  onSubmit(isCreateANother: boolean = false) {
    // this.spinnerService.show();
    let expiryDay = 0;

    if (this.form.controls['role'].value === 'ZACCESS') {
      expiryDay = environment.expiryDays;
    }

    const userObject = {
      firstName: this.form.controls['firstName'].value,
      lastName: this.form.controls['lastName'].value,
      email: this.form.controls['email'].value,
      confirmemail: this.form.controls['confirmemail'].value,

      password: this.form.controls['email'].value.toString(),
      // roleId: this.form.controls["role"].value,
      roleName: this.form.controls['role'].value,
      expiryDays: expiryDay,
      expiryDate: this.expiryDateU
    };

    this.userService.registerUser(userObject).subscribe(res => {
      if (res['status'] === 201) {
        // this.spinnerService.hide();
        const response: IUser = res['data'];

        this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
          this.notificationService.showNotification('User created successfully', 'top', 'center', '', 'info-circle');
        });

        if (!isCreateANother) {
          setTimeout(() => {
            this.router.navigate(['/admin/accountmanagement']);
          }, 3000);
        } else {
          this.form.reset();
          this.form.patchValue({
            role: '',
            expiryDate: ''
          });
        }
      } else if (res['status'] === 500) {
        // this.spinnerService.hide();
        // let response: IUser = res["data"];
        // localStorage.setItem("id", response.id);
        // already exists
        this.notificationService.showNotification(res['error'], 'top', 'center', 'warning', 'info-circle');
        this.translate.get('lblAlreadyAcc').subscribe((text: string) => {
          this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
        });
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
    return this.datepipe.transform(date, 'MM-dd-yyyy hh:mm');
  };

  compareEmail() {
    this.form.controls['confirmemail'].setErrors(null);
    this.isEmailValid = true;
    const Email: string = this.form.controls['email'].value;
    const confirmEmail: string = this.form.controls['confirmemail'].value;

    if (Email !== confirmEmail) {
      this.isEmailValid = false;
      this.form.controls['confirmemail'].setErrors({ 'incorrect': true });
    }
  }
  changeRole(val) {
    if (val === 'ZACCESS') {
      $('#expiryDate').hide();
      $('.basic-user').each(function () {
        $(this).hide();
      });
    } else {
      $('#expiryDate').show();
      $('.basic-user').each(function () {
        $(this).show();
      });
    }
  }

  createAnother() {
    this.onSubmit(true);
  }

  translateValidationMessages() {
    this.translate.get('requiredfield').subscribe((text: string) => {
      this.validationMessages.firstName[0].message = text;
    });

    this.translate.get('requiredemail').subscribe((text: string) => {
      this.validationMessages.email[0].message = text;
    });

    this.translate.get('validemail').subscribe((text: string) => {
      this.validationMessages.email[1].message = text;
    });

    this.translate.get('requiredconfirmemail').subscribe((text: string) => {
      this.validationMessages.confirmemail[0].message = text;
    });

    this.translate.get('requiredrole').subscribe((text: string) => {
      this.validationMessages.role[0].message = text;
    });

    this.translate.get('requiredexpirationdate').subscribe((text: string) => {
      this.validationMessages.expiryDate[0].message = text;
    });

    this.translate.get('validexpirationdate').subscribe((text: string) => {
      this.validationMessages.expiryDate[1].message = text;
    });
  }

  getRoleModule() {
    try {
      // this.userService.getRole().subscribe(res => {
      //   if (res["status"] == 200) {
      //     let roles: IRoles[] = res["data"];
      //     if (roles.length > 0) {
      //       roles.forEach(e => {
      //         this.userRoles.push({ "id": e.roleName, "role": e.roleName.toUpperCase() });
      //       });
      //     }
      //   }
      // },
      //   err => {
      //     console.log("Error occurred: " + err.message);
      //   });
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

            this.userRoles = [];

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
}
