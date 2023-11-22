import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { UserService } from '../../../assets/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { IUser } from '../../../assets/interfaces/iuser';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  email = '';
  password = '';
  users: IUser[] = [];
  message = '';

  constructor(private route: ActivatedRoute,
    // private userService: UserService,
    private http: HttpClient,
    private translate: TranslateService,
    // private spinnerService: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      // this.spinnerService.show();

      this.email = queryParams.get('email') as string;
      this.password = queryParams.get('password') as string;

      if (!this.email) {
        this.message = 'Email parameter is missing';
      }

      if (!this.password) {
        this.password = '1234';
      }

      if (this.email) {
        this.http.get(environment.apiGatewayUrl + '/user?searchString=' + this.email).subscribe(res => {
          this.users = (res as { data: IUser[] })['data'];
          this.users = this.users.filter(x => x.email === this.email);

          if (this.users.length > 0) {
            localStorage.setItem('user', JSON.stringify(this.users[0]));
            this.resetUser();
          } else {
            this.message = 'Email you provide is not exists. Please provide valid email.';
            // this.spinnerService.hide();
          }
        }, error => {
          // Handle the error here
          console.error(error);
        });
        // this.resetUser();
      }
    });
  }

  resetUser() {
    const users = JSON.parse(localStorage.getItem('user') as string);

    console.log(users);

    let expiryDay = 0;

    if (users.role === '[ZACCESS]') {
      expiryDay = environment.expiryDays;
    }

    const userObject = {
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      // roleId: this.form.controls["role"].value,
      password: this.password,
      roleName: users.role.replace(/[\[\]]/g, ''),
      expiryDays: expiryDay,
      enabled: 1,
      expiryDate: users.expiryTimestamp
    };

    // this.userService.updateUser(userObject).subscribe(res => {
    //   if (res['status'] === 201) {

    //     this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
    //       const userAgreementObject = {
    //         id: users.id,
    //         isAgree: false,
    //         languageCode: 'en-US'
    //       };

    //       this.userService.updateUserAgreement(userAgreementObject).subscribe(response => {
    //         if (response['status'] === 201) {
    //           this.spinnerService.hide();
    //           this.message = 'Password reset successfully';
    //         } else if (response['status'] === 500) {
    //           this.spinnerService.hide();
    //           this.translate.get('lblAlreadyAcc').subscribe((translatedText: string) => {
    //             this.message = translatedText;
    //           });
    //         }
    //       },
    //         err => {
    //           console.log('Error occurred: ' + err.message);
    //           this.spinnerService.hide();
    //           this.message = 'Error occurred: ' + err.message;
    //         });
    //     });
    //   } else if (res['status'] === 500) {
    //     this.spinnerService.hide();
    //     this.message = res['error'];
    //   }
    // },
    //   err => {
    //     console.log('Error occurred: ' + err.message);
    //     this.spinnerService.hide();

    //     if (err['status'] === 500) {
    //       this.translate.get('msgInternalError').subscribe((text: string) => {
    //         this.message = text;
    //       });
    //     } else {
    //       this.message = 'Error occurred: ' + err.message;
    //     }
    //   });
    localStorage.removeItem('user');
    // this.spinnerService.hide();
  }

}
