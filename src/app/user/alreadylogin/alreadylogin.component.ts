import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from '../../../assets/services/user.service';
import { IUser } from '../../../assets/interfaces/iuser';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../assets/services/notification.service';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { IAuth } from '../../../assets/interfaces/iauth';
import { environment } from '../../../environments/environment';
import { LocationService } from '../../../assets/services/location.service';
import { ILocation } from '../../../assets/interfaces/ilocation';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { IRoleModule } from '../../../assets/interfaces/irolemodule';
import { AccessdeniedComponent } from '../accessdenied/accessdenied.component';
import { MatDialog } from '@angular/material/dialog';
import { UserRoleAuthService } from '../../../assets/services/user-role-auth.service';
import { IUserRoleAuth } from '../../../assets/interfaces/iuserroleauth';
import jwtDecode from 'jwt-decode';
const $ = require('jquery');

@Component({
  selector: 'app-alreadylogin',
  templateUrl: './alreadylogin.component.html',
  styleUrls: ['./alreadylogin.component.scss', '../styles.css']
})
export class AlreadyloginComponent implements OnInit, AfterViewInit {
  filteredOptions: Observable<IUser[]>;
  selectedUser: IUser[] = [];
  users: IUser[] = [];
  alreadyLoggedInButtonText = 'LOGOUT AT DEVICE ';
  id = '';
  roleId = 0;
  iAuth: IAuth = {};
  isAgree = false;
  public showPasswordOnPress: boolean;

  loginForm = new FormGroup({
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])),

    password: new FormControl('', [Validators.required, Validators.minLength(1)])
  });


  @ViewChild('password', { static: false }) passwordRef: ElementRef;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private translate: TranslateService,
    private notificationService: NotificationService, 
    public dialog: MatDialog, private locationService: LocationService,
    private shareDataService: ShareDataService,
    //private spinnerService: NgxSpinnerService,
    private userRoleAuthService: UserRoleAuthService) {
    translate.setDefaultLang(shareDataService.getLabels());
    document.body.style.background = '#EBEBEB';
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      const device = params['device'];
      this.id = params['id'];
      this.roleId = params['roleId'];
      this.isAgree = params['isAgree'];

      if (email) {
        this.loginForm.controls['email'].setValue(email);
      }
      if (device) {
        this.alreadyLoggedInButtonText = this.alreadyLoggedInButtonText + device;
      }
    });
  }

  ngAfterViewInit() {
    this.passwordRef.nativeElement.focus();
  }

  onSubmit() {
    //this.spinnerService.show();
    const userObject = {
      device: 'pc',
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls.password.value.toString()
    };

    this.userService.logOutAll(userObject.email, userObject.password, userObject.device).subscribe(res => {
      if (res && res['access_token']) {
        this.shareDataService.clearSessionVariables();
        this.shareDataService.currentUser = res['access_token'];
        this.shareDataService.refreshToken = res['refresh_token'];
        this.shareDataService.id = this.id;

        this.shareDataService.locale = ActivityConstants.getLocale();
        this.getLocation();

        console.log("assdasdadasd");

        console.log(jwtDecode(res['access_token']));

        this.iAuth = jwtDecode(res['access_token']);
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
                  this.getRoleAuthModule(this.isAgree);
                } else {
                  this.notificationService.showNotification(
                    'Your login account has expired. Please contact to System Administrator.',
                    'top',
                    'center',
                    'warning',
                    'info-circle'
                  );
                }
              } else {
                this.userService.loginLog();
                this.getRoleAuthModule(this.isAgree);
              }
            }
          }
        },
          err => {
            console.log('Error occurred: ' + err.message);
            //this.spinnerService.hide();

            if (err['status'] === 401) {
              this.notificationService.showNotification(err['error'], 'top', 'center', 'danger', 'info-circle');
            } else if (err['status'] === 500) {
              this.clearPassword();
            }
          });
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
        //this.spinnerService.hide();
        this.clearPassword();
        this.passwordRef.nativeElement.focus();
        this.dialog.open(AccessdeniedComponent, {
          data: {
            title: 'Access Denied !',
            text: 'Username or Password is Invalid',
            longtext: false
          },
          panelClass: 'custom-dialog-container'
        });

        if (err['status'] === 401) {
          this.notificationService.showNotification(err['error'], 'top', 'center', 'danger', 'info-circle');
        } else if (err['status'] === 500) {
          // this.translate.get('msgInternalError').subscribe((text: string) => {
          //   this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
          // });
          $('#passwordTickWrong').show();
          $('#passwordToolTip').show();
        }
      });
  }

  // getRoleModule(isAgree: boolean) {
  //   try {
  //     this.userService.getRolebyname(this.shareDataService.role).subscribe(res => {
  //       if (res["status"] == 200) {
  //         localStorage.setItem("notificationCount", "0");
  //         let roleModule: IRoleModule[] = res["data"];
  //         if (roleModule.length > 0) {
  //           this.shareDataService.moduleName = roleModule[0].moduleName;

  //           if (isAgree == null || isAgree == false) {
  //             this.router.navigate(['./terms']);
  //           }
  //           else {
  //             //this.router.navigate(['./admin/dashboard']);
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
  //           this.clearPassword();
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

        if (environment.isMobile) {
          this.shareDataService.setApplicationVariables();
        }

        //this.spinnerService.hide();
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
        //this.spinnerService.hide();
      });
  }



  cancel() {
    this.router.navigate(['/']);
  }

  clearPassword() {

    this.loginForm.controls.password.setValue('');
  }

  getRoleAuthModule(isAgree: boolean) {
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

            if (isAgree == null || isAgree === false) {
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
          //this.spinnerService.hide();

          if (err['status'] === 401) {
            this.notificationService.showNotification(err['error'], 'top', 'center', 'danger', 'info-circle');
          } else if (err['status'] === 500) {
            this.clearPassword();
          }
        });
    } catch (e) {
      console.log(e.message);
    }
  }
}
