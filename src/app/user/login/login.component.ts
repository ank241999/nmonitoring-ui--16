import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, first } from 'rxjs/operators';
import { UserService } from '../../../assets/services/user.service';
import { IUser } from '../../../assets/interfaces/iuser';
import { Router } from '@angular/router';
import { NotificationService } from '../../../assets/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { HttpClient } from '@angular/common/http';
import { IAuth } from '../../../assets/interfaces/iauth';
import { environment } from '../../../environments/environment';
import { LocationService } from '../../../assets/services/location.service';
import { ILocation } from '../../../assets/interfaces/ilocation';
import { ServerURLComponent } from '../../../app/user/login/server-url/server-url.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { NgxSpinnerService } from 'ngx-spinner';import { IUserLoginLog } from '../../../assets/interfaces/iuserloginlog';
import { IRoleModule } from '../../../assets/interfaces/irolemodule';
import { ConfirmComponent } from '../confirm/confirm.component';
import { AccessdeniedComponent } from '../accessdenied/accessdenied.component';
import { DatePipe } from '@angular/common';
import { UserRoleAuthService } from '../../../assets/services/user-role-auth.service';
import { IUserRoleAuth } from '../../../assets/interfaces/iuserroleauth';
import { UserSettingService } from '../../../assets/services/userSettingService';

import jwtDecode from 'jwt-decode';
const $ = require('jquery');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../styles.css']
})
export class LoginComponent implements OnInit {

  popup = false;
  isForgotPassword = false;
  filteredOptions: Observable<IUser[]>;
  selectedUser: IUser[] = [];
  users: IUser[] = [];
  showIt = false;
  iAuth: IAuth = {};
  isPaste = false;
  public showPasswordOnPress: boolean;
  public selfRegistration = false;
  public blockTime = 15;

  loginForm = new FormGroup({
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])),
    password: new FormControl('', [Validators.required, Validators.minLength(1)])
  });

  @ViewChild('email', { static: false }) emailRef: ElementRef;

  @ViewChild('password', { static: false }) passwordRef: ElementRef;

  isMobile = false;
  intervalId: NodeJS.Timeout;
  time: Date;
  scancountstring = '000000';

  constructor(private userService: UserService,
    private router: Router,
    private notificationService: NotificationService,
    private translate: TranslateService,
    public http: HttpClient,
    private locationService: LocationService,
    public dialog: MatDialog,
    private shareDataService: ShareDataService,
    private spinnerService: NgxSpinnerService,
    private userSettingService: UserSettingService,
    private userRoleAuthService: UserRoleAuthService) {
    translate.setDefaultLang(shareDataService.getLabels());
    document.body.style.background = '#EBEBEB';
    // localStorage.setItem("disableBeta","false");
  }

  ngOnInit() {
    this.http.get('/assets/environment.json').subscribe((config) => {
      this.shareDataService.setAvtarImage(config['avtarImage']);
      this.shareDataService.setLabels(config['labels']);
      this.shareDataService.setScanCountBasis(config['scanCountBasis']);
      this.shareDataService.setBetaTestMode(config['betaTestMode']);
      this.selfRegistration = config['selfRegistration'];
      this.blockTime = config['blockTime'];
    });

    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);

    this.userService.getScancountTimezone().subscribe(res => {
      this.scancountstring = this.shareDataService.getScanCountBasis() !== 'All'
        ? this.leftPad(res['person_out_threat'], 6)
        : this.leftPad(res['total_threat'], 6);
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });

    localStorage.clear();
    $('#email').focus();
    this.shareDataService.setApplicationVariables();

    this.filteredOptions = this.loginForm.controls['email'].valueChanges
      .pipe(
        startWith(''),
        // map(value => this.emailFilter(value))
        map(val => val.length >= 1 && val !== '' ? this.emailFilter(val) : [])
      );

    this.isMobile = environment.isMobile;
    if (environment.isMobile && this.shareDataService.serverUrl == null) {
      // this.openAddDialog();
    }
  }

  emailFilter(value: string): IUser[] {
    const filterValue = (value === undefined ? '' : value.toLowerCase());
    this.userService.getUsers(filterValue).subscribe(res => {
      this.users = res['data'];
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });

    return (filterValue === '' ? []
      : (this.users.length > 0 ? this.users.filter(a => a.email.toLowerCase().includes(filterValue)) : []));
  }

  onSubmit() {

    const userObject = {
      device: 'pc',
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls.password.value.toString()
    };

    this.userService.getUsers(this.loginForm.controls['email'].value).subscribe(res => {
      this.users = res['data'];

      if (this.users.length > 0 && this.users[0].loggedIn && this.users[0].isAgree) {
        this.router.navigate(['./alreadyloginalert'],
          {
            queryParams: {
              email: this.users[0].email,
              device: this.users[0].loggedInDevice,
              id: this.users[0].id,
              roleId: this.users[0].role.id,
              isAgree: this.users[0].isAgree
            }
          });
      } else if (this.users.length === 0) {
        this.loginForm.controls.email.setValue('');
        this.clearPasscodes();
        this.emailRef.nativeElement.focus();
        this.dialog.open(AccessdeniedComponent, {
          data: {
            title: 'Access Denied !',
            text: 'Username or Password is Invalid',
            longtext: false
          },
          panelClass: 'custom-dialog-container'
        });
      } else {
        if (!this.users[0].enabled) {

          const timestamp = this.users[0].blockTimestamp;

          // Extract the components from the timestamp
          const year = +timestamp.slice(0, 4);
          const month = +timestamp.slice(4, 6);
          const day = +timestamp.slice(6, 8);
          const hour = +timestamp.slice(8, 10);
          const minute = +timestamp.slice(10, 12);
          const second = +timestamp.slice(12, 14);

          // Create a new Date object with the extracted components
          const date = new Date(year, month - 1, day, hour, minute, second);

          // Get the local time zone offset in minutes
          const timezoneOffsetMinutes = date.getTimezoneOffset();

          // Adjust the date and time with the time zone offset
          date.setMinutes(date.getMinutes() - timezoneOffsetMinutes);

          // Add 15 minutes to the adjusted date and time
          date.setMinutes(date.getMinutes() + this.blockTime);

          // Get the current date and time
          const currentDate = new Date();

          // Calculate the difference in minutes
          const differenceMinutes = Math.floor((date.getTime() - currentDate.getTime()) / 60000);

          if (differenceMinutes > 0) {
            this.loginForm.controls.email.setValue('');
            this.clearPasscodes();
            this.emailRef.nativeElement.focus();
            this.dialog.open(AccessdeniedComponent, {
              data: {
                title: 'Access Denied !',
                text: 'Your account has been blocked. You will be able to login after ' + differenceMinutes + ' minute(s).',
                longtext: false
              },
              panelClass: 'custom-dialog-container'
            });

            return;
          }
        }

        this.spinnerService.show();
        this.userService.loginUser(userObject).subscribe(res_resopnse => {
          if (res_resopnse && res_resopnse['access_token']) {
            this.shareDataService.currentUser = res_resopnse['access_token'];
            this.shareDataService.refreshToken = res_resopnse['refresh_token'];
            this.shareDataService.id = '1';

            this.shareDataService.locale = ActivityConstants.getLocale();
            this.getLocation();

            this.iAuth = jwtDecode(res_resopnse['access_token']);
            this.shareDataService.email = this.iAuth.email;

            const roles = this.iAuth.resource_access[environment.tokenVerifyClientId]['roles'];
            const rolesLowerCase = [];
            for (let i = 0; i < roles.length; i++) {
              rolesLowerCase.push(roles[i].toLowerCase());
            }

            this.userService.getUsers(this.iAuth.email).subscribe(response => {
              if (response['status'] === 200) {
                localStorage.setItem('notificationCount', '0');
                localStorage.setItem('deviceNotificaions', '');
                const users: IUser[] = response['data'];
                if (users.length > 0) {
                  this.shareDataService.id = users[0].id;
                  localStorage.setItem('scanCount', JSON.stringify({ number: Number(0) }));

                  this.shareDataService.role = roles[0].toString();
                  if (this.shareDataService.role !== 'ZACCESS') {
                    if (users[0].expiryTimestamp > new Date().getTime()) {
                      this.userService.loginLog();
                      // this.getRoleModule(users[0]);
                      this.getRoleAuthModule(users[0]);
                    } else {
                      this.notificationService.showNotification('Your login account has expired. Please contact System Administrator.',
                        'top', 'center', 'warning', 'info-circle');
                    }
                  } else {
                    this.userService.loginLog();
                    this.getRoleAuthModule(users[0]);
                  }
                }
              }
              this.spinnerService.hide();
            },
              err => {
                console.log('Error occurred: ' + err.message);
                this.spinnerService.hide();

                if (err['status'] === 401) {
                  this.notificationService.showNotification(err['error'], 'top', 'center', 'danger', 'info-circle');
                } else if (err['status'] === 500) {
                  this.clearPasscodes();
                }
              });

            // if (rolesLowerCase.indexOf("basic") > -1) {
            //   this.shareDataService.role = "basic";
            // }
            // else if (rolesLowerCase.indexOf("advance") > -1) {
            //   this.shareDataService.role = "advance";
            //   this.router.navigate(['./admin/dashboard']);
            // }
          }

        },
          err => {
            console.log('Error occurred: ' + err.message);
            this.spinnerService.hide();
            this.clearPasscodes();
            this.passwordRef.nativeElement.focus();

            if (this.users[0].incorrectAttempt === 1) {
              this.dialog.open(AccessdeniedComponent, {
                data: {
                  title: 'Alerts',
                  text: 'You have made 2 unsuccessful attempt(s). The maximum retry attempts allowed are 3.'
                    + 'If 3 is exceeded, then your account will be blocked.',
                  longtext: true
                },
                panelClass: 'custom-dialog-container'
              });
            } else if (this.users[0].incorrectAttempt === 2) {
              this.dialog.open(AccessdeniedComponent, {
                data: {
                  title: 'Access Denied !',
                  text: 'Your account has been blocked. You will be able to login after ' + this.blockTime + ' minute(s).',
                  longtext: false
                },
                panelClass: 'custom-dialog-container'
              });
            } else {
              this.dialog.open(AccessdeniedComponent, {
                data: {
                  title: 'Access Denied !',
                  text: 'Username or Password is Invalid',
                  longtext: false
                },
                panelClass: 'custom-dialog-container'
              });
            }

            if (err['status'] === 401) {
              this.notificationService.showNotification(err['error'], 'top', 'center', 'danger', 'info-circle');
            } else if (err['status'] === 500) {
              // this.translate.get('msgInternalError').subscribe((text: string) => {
              //   this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
              // });
              $('#passcodeToolTip').show();
              $('#passcodeTickWrong').css('display', 'block');
            }

          });
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });

    this.userSettingService.getUserSetting('global_setting').subscribe(res => {
      localStorage.setItem('idleTimeout', (res['data']['0']['idleTimeout'] * 60 * 1000).toString());
      // localStorage.setItem('betaTestMode', res['data']['0']['betaTestMode']);
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });
  }

  // getRoleModule(users: IUser) {
  //   try {
  //     this.userService.getRolebyname(this.shareDataService.role).subscribe(res => {
  //       if (res["status"] == 200) {
  //         localStorage.setItem("notificationCount", "0");
  //         let roleModule: IRoleModule[] = res["data"];
  //         if (roleModule.length > 0) {
  //           this.shareDataService.moduleName = roleModule[0].moduleName;

  //           if (users.isAgree == null || users.isAgree == false) {
  //             localStorage.setItem("userLoggedin", JSON.stringify(users));
  //             localStorage.setItem("lastpassword", JSON.stringify(this.loginForm.controls.password.value.toString()));
  //             this.router.navigate(['./terms']);
  //           }
  //           else {
  //             //this.router.navigate(['./admin/activitymonitoring']);
  //             this.router.navigate(['./' + this.shareDataService.moduleName]);
  //           }
  //         }
  //       }
  //     },
  //       err => {
  //         console.log("Error occurred: " + err.message);
  //         this.spinnerService.hide();

  //         if (err["status"] == 401) {
  //           this.notificationService.showNotification(err["error"], 'top', 'center', 'danger', 'info-circle');
  //         }
  //         else if (err["status"] == 500) {
  //           this.clearPasscodes();
  //         }
  //       });
  //   }
  //   catch (e) {
  //     console.log(e.message);
  //   }
  // }

  getLocation() {
    this.locationService.getLocationById(1).subscribe(res => {
      if (res['status'] === 200) {
        const loc: ILocation = res['data'];

        this.shareDataService.logoImageName = loc.logoImageName;
        this.shareDataService.logoImagePath = loc.logoImagePath;
        this.shareDataService.footPrintImageName = loc.footPrintImageName;
        this.shareDataService.footPrintImagePath = loc.footPrintImagePath;

        this.shareDataService.setApplicationVariables();
        this.spinnerService.hide();
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
        this.spinnerService.hide();
      });
  }

  navigateRegister() {
    localStorage.setItem('notificationCount', '0');
    localStorage.setItem('deviceNotificaions', '');
    if (!this.isForgotPassword) {
      if (this.selectedUser.length > 0) {
        if (this.selectedUser[0].loggedIn) {
          this.userService.deleteUser([parseInt(this.selectedUser[0].id, 10)]).subscribe(res => {
            if (res['status'] === 200) {
              this.cancel();
              this.isForgotPassword = false;
            }
            // else if (res['status'] == 401){

            // }
          },
            err => {
              console.log('Error occurred: ' + err.message);
              this.notificationService.showNotification('Error occurred: ' + err.message, 'top', 'center', 'danger', 'info-circle');
            });
        }
      }
    }
    this.router.navigate(['register']);
  }

  onPaste(event: ClipboardEvent) {
    this.isPaste = true;
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    let maxTry = 1;
    const root = this;
    const delay = 600;

    setTimeout(function request() {
      maxTry = maxTry + 1;
      if (root.users.length === 0 && maxTry < 4) {
        setTimeout(request, delay);
      } else {
        root.isPaste = false;
        root.loginForm.controls['email'].setValue(pastedText);
      }
    }, delay);
  }

  autofill(val: any) {
    this.loginForm.controls['email'].setValue(val);
    $('.autocomplete_container').hide();
    this.passwordRef.nativeElement.focus();
  }

  cancel() {
    this.defaultControls();
    this.clearPasscodes();
    this.loginForm.controls['email'].setValue('');
  }

  setAlreadyLoginControls() {
    $('#txtAlreadyLogin').show();
    $('#emailTickRight').css('display', 'none');
    $('#emailTickWrong').css('display', 'none');
  }

  defaultControls() {
    $('#emailTickRight').css('display', 'none');
    $('#emailTickWrong').css('display', 'none');
    $('#txtAlreadyLogin').hide();
  }

  clearPasscodes() {
    this.loginForm.controls.password.setValue('');
  }

  forgotPassword = function () {
    // if (this.loginForm.controls["email"].valid) {
    //   if (this.selectedUser.length > 0) {
    //     this.router.navigate(['registeragain'], { queryParams: { id: this.selectedUser[0].id, _rev: this.selectedUser[0]._rev } });
    //   }
    // }
    return false;
  };

  leftPad(number, targetLength) {
    let output = number + '';
    while (output.length < targetLength) {
      output = '0' + output;
    }
    return output;
  }

  // onAddClick() {
  //   this.openAddDialog();
  // }
  // openAddDialog() {
  //   const dialogConfig = new MatDialogConfig();

  //   dialogConfig.autoFocus = true;
  //   dialogConfig.panelClass = "custom-serverurl-popup";
  //   let dialogRef = this.dialog.open(ServerURLComponent, dialogConfig);

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.shareDataService.serverUrl = result;
  //     this.ngOnInit();
  //   });
  // }

  getRoleAuthModule(users: IUser) {
    try {
      this.userRoleAuthService.getUserEndPoint(this.shareDataService.id).subscribe(res => {
        // alert(JSON.stringify(res))
        if (res['status'] === 200) {
          localStorage.setItem('notificationCount', '0');
          localStorage.setItem('deviceNotificaions', '');
          const userRoleAuth: IUserRoleAuth[] = res['data'];
          if (userRoleAuth.length > 0) {
            this.shareDataService.userRoleAuth = userRoleAuth;
            this.shareDataService.setApplicationVariables();

            if (users.isAgree === null || users.isAgree === false) {
              localStorage.setItem('userLoggedin', JSON.stringify(users));
              localStorage.setItem('lastpassword', JSON.stringify(this.loginForm.controls.password.value.toString()));
              this.router.navigate(['./terms']);
            } else {
              // this.router.navigate(['./admin/activitymonitoring']);
              // this.router.navigate(['./' + this.shareDataService.moduleName]);
              if (this.shareDataService.userRoleAuth != null
                && this.shareDataService.userRoleAuth.filter(a => a.endPoint.includes('/admin/activitymonitoring')).length > 0
                && (this.shareDataService.role !== 'ZACCESS' && this.shareDataService.role !== '1ACCESS')) {
                this.router.navigate(['./admin/activitymonitoring']);
              } else {
                this.router.navigate(['./admin/dashboard']);
              }
            }
          }
        }
      },
        err => {
          console.log('Error occurred: ' + err.message);
          this.spinnerService.hide();

          if (err['status'] === 401) {
            this.notificationService.showNotification(err['error'], 'top', 'center', 'danger', 'info-circle');
          } else if (err['status'] === 500) {
            this.clearPasscodes();
          }
        });
    } catch (e) {
      console.log(e.message);
    }
  }
}
