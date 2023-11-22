import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { UserService } from '../../../assets/services/user.service';
import { TranslateService } from '@ngx-translate/core';
// import { NotificationService } from '../../../assets/services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { IUser } from '../../../assets/interfaces/iuser';
import { environment } from '../../../environments/environment';
import { AccessdeniedComponent } from '../accessdenied/accessdenied.component';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['../login/login.component.scss', '../styles.css']
})
export class TermsComponent implements OnInit {
  form: FormGroup;
  agreement = false;
  public showPasswordOnPress!: boolean;
  public showConfirmPasswordOnPress!: boolean;
  isPasswordValid = true;
  firstName = '';
  lastName = '';
  privacyPolicy = '';
  user: IUser;
  lastpassword = '';
  languages = [{ id: 'en-US', value: 'Default(English)' },
  { id: 'fr-FR', value: 'French' }];

  validationMessages = {
    password: [
      {
        type: 'required',
        message: 'Password is required.'
      },
      {
        type: 'minlength',
        message: 'Password must be at least 8 characters.'
      },
      {
        type: 'pattern',
        message: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase,1 number and 1 special character from !@#$%^&*_=+-'
      },
      {
        type: 'username',
        message: 'Password should not include first or last name.'
      },
      {
        type: 'repetation',
        message: 'No two same letters should be repeated.'
      }
    ],
    confirmpassword: [
      {
        type: 'required',
        message: 'Password must be same.'
      },
      {
        type: 'minlength',
        message: 'Passwords must be at least 8 characters.'
      }
    ]
  };

  constructor(
    private router: Router,
    private translate: TranslateService,
    // private notificationService: NotificationService,
    public formBuilder: FormBuilder,
    private http: HttpClient,
    // private spinnerService: NgxSpinnerService,
    // private userService: UserService,
    private shareDataService: ShareDataService,
    public dialog: MatDialog
  ) {

    translate.setDefaultLang(shareDataService.getLabels());
    document.body.style.background = '#EBEBEB';

    this.form = formBuilder.group({
      language: new FormControl('', Validators.required),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$'
          )
        ])
      ),

      confirmPassword: new FormControl(
        '',
        Validators.compose([
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$'
          ),
          Validators.required,
          Validators.minLength(8)
        ])
      )
    });

    this.user = JSON.parse(localStorage.getItem('userLoggedin') as string);
    localStorage.removeItem('userLoggedin');
    this.lastpassword = JSON.parse(localStorage.getItem('lastpassword') as string);
    localStorage.removeItem('lastpassword');

    this.form.patchValue({
      language: 'en-US'
    });

    this.getLoggedInUser();
  }

  ngOnInit() {
    this.http.get(environment.apiGatewayUrl + '/api/setting/audio/privacyPolicy', { responseType: 'text' }).subscribe(
      (data: string) => {
        this.privacyPolicy = data;
      },
      (error) => {
        console.error('Error loading audio file:', error);
      }
    );
  }

  changeCheck(event: { checked: boolean; }) {
    this.agreement = event.checked;
  }

  onclick() {
    if (this.form.controls['password'].value === this.lastpassword) {
      this.dialog.open(AccessdeniedComponent, {
        data: {
          title: 'Password Match',
          text: 'Please provide different password',
          longtext: false
        },
        panelClass: 'custom-dialog-container'
      });
    } else {
      // this.spinnerService.show();

      let expiryDay = 0;
      console.log(this.user);

      if (this.user.role === '[ADVANCE]') {
        expiryDay = environment.expiryDays;
      }

      const userupdateObject = {
        id: this.user.id,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        password: this.form.controls['password'].value,
        roleName: this.user.role.substring(1, this.user.role.length - 1),
        expiryDays: expiryDay,
        expiryDate: this.user.expiryTimestamp,
        enabled: 1
      };

      console.log(userupdateObject);

      // this.userService.updateUser(userupdateObject).subscribe(res => {
      //   if (res['status'] === 201) {
      //     this.spinnerService.hide();
      //     const response: IUser = res['data'];
      //     console.log(res['status']);

      //     this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
      //       const userObject = {
      //         id: this.shareDataService.id,
      //         isAgree: this.agreement,
      //         languageCode: this.form.controls['language'].value
      //       };

      //       this.userService.updateUserAgreement(userObject).subscribe(result => {
      //         if (result['status'] === 201) {
      //           localStorage.setItem('scanCount', JSON.stringify({ number: Number(0) }));
      //           this.spinnerService.hide();

      //           /*
      //           if (this.shareDataService.role == 'technicianltd') {
      //             //this.router.navigate(['./admin/dashboard']);
      //             this.router.navigate(['./' + this.shareDataService.moduleName]);
      //           }
      //           else if (this.shareDataService.role == 'techniciancust') {
      //             //this.router.navigate(['./admin/dashboard']);
      //             this.router.navigate(['./' + this.shareDataService.moduleName]);
      //           }
      //           else {
      //             this.router.navigate(['./admin/activitymonitoring']);
      //           }*/
      //           if (this.shareDataService.userRoleAuth != null
      //             && this.shareDataService.userRoleAuth.filter(a => a.endPoint.includes('/admin/activitymonitoring')).length > 0
      //             && this.shareDataService.role !== 'ZACCESS') {
      //             this.router.navigate(['./admin/activitymonitoring']);
      //           } else {
      //             this.router.navigate(['./admin/dashboard']);
      //           }
      //         } else if (result['status'] === 500) {
      //           this.spinnerService.hide();
      //           this.translate.get('lblAlreadyAcc').subscribe((translatedText: string) => {
      //             this.notificationService.showNotification(translatedText, 'top', 'center', 'warning', 'info-circle');
      //           });
      //         }
      //       },
      //         err => {
      //           console.log('Error occurred: ' + err.message);
      //           this.spinnerService.hide();
      //           this.notificationService.showNotification('Error occurred: ' + err.message, 'top', 'center', 'danger', 'info-circle');
      //         });
      //     });
      //   } else if (res['status'] === 500) {
      //     this.spinnerService.hide();

      //     this.notificationService.showNotification(res['error'], 'top', 'center', 'warning', 'info-circle');
      //   }
      // },
      //   err => {
      //     console.log('Error occurred: ' + err.message);
      //     this.spinnerService.hide();

      //     if (err['status'] === 500) {
      //       this.translate.get('msgInternalError').subscribe((text: string) => {
      //         this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
      //       });
      //     } else {
      //       this.notificationService.showNotification('Error occurred: ' + err.message, 'top', 'center', 'danger', 'info-circle');
      //     }
      //   });

      // this.spinnerService.hide();
    }
  }

  comparePassword() {
    this.form.controls['confirmPassword'].setErrors(null);
    this.isPasswordValid = true;
    // const password: string = this.form.controls.password.value.toString();
    // const confirmPassword: string = this.form.controls.confirmPassword.value.toString();

    // if (password !== confirmPassword) {
    //   this.isPasswordValid = false;
    //   this.form.controls['confirmPassword'].setErrors({ 'incorrect': true });
    // }
  }

  getLoggedInUser() {
    // this.userService.getUsers(this.shareDataService.email).subscribe(res => {
    //   if (res['status'] === 200) {
    //     const user: IUser[] = res['data'];
    //     if (user.length > 0) {
    //       this.firstName = user[0].firstName;
    //       this.lastName = user[0].lastName;
    //     }
    //   } else if (res['status'] === 500) {
    //   }
    // },
    //   err => {
    //     console.log('Error occurred: ' + err.message);
    //   });
  }

  passwordValidation(event: any) {
    this.form.controls['confirmPassword'].setErrors(null);
    this.isPasswordValid = true;
    // const password: string = this.form.controls.password.value.toString();
    // const confirmPassword: string = this.form.controls.confirmPassword.value.toString();

    // if (password !== confirmPassword) {
    //   this.isPasswordValid = false;
    //   this.form.controls['confirmPassword'].setErrors({ 'incorrect': true });
    // }

    // const pass = event.target.value;
    // if (this.firstName && this.lastName && this.shareDataService.email) {

    //   if (pass.toUpperCase().includes(this.firstName.toUpperCase())) {
    //     this.form.controls['password'].setErrors({ 'username': true });
    //   } else if (pass.includes(this.firstName)) {
    //     this.form.controls['password'].setErrors({ 'username': true });
    //   } else if (pass.toUpperCase().includes(this.lastName.toUpperCase())) {
    //     this.form.controls['password'].setErrors({ 'username': true });
    //   } else if (pass.includes(this.lastName)) {
    //     this.form.controls['password'].setErrors({ 'username': true });
    //   } else if (pass.toUpperCase().includes(this.shareDataService.email.toUpperCase())) {
    //     this.form.controls['password'].setErrors({ 'username': true });
    //   } else if (pass.includes(this.shareDataService.email)) {
    //     this.form.controls['password'].setErrors({ 'username': true });
    //   } else {
    //     const passarray = pass.split('');
    //     for (let i = 1; i < passarray.length; i++) {
    //       if (passarray[i - 1] === passarray[i]) {
    //         this.form.controls['password'].setErrors({ 'repetation': true });
    //         break;
    //       }
    //     }
    //   }
    // }
  }

  // onScreenClose() {
  //   let langCode = this.form.controls['language'].value;
  //   this.dialogRef.close(this.agreement.toString() + ':' + langCode);
  // }
}
