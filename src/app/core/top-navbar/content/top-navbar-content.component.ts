import { Component, Input, ViewEncapsulation, Inject, OnDestroy, OnInit } from '@angular/core';
import { SideMenuService } from '../../side-menu/side-menu.service';
import { ResponsiveBreakpointsService } from '../../responsive-breakpoints/responsive-breakpoints.service';
// import { APP_BASE_HREF } from '@angular/common';
import { filter, first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IUser } from '../../../../assets/interfaces/iuser';
// import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { IActivityMonitoring } from '../../../../assets/interfaces/iactivity-monitoring';
import { NotificationsMenuService } from '../../../core';
import { MatDialog } from '@angular/material/dialog';
import { AlertboxComponent } from 'src/app/admin/activitymonitoring/alertbox/alertbox.component';
import { AddnoteComponent } from 'src/app/admin/activitymonitoring/addnote/addnote.component';
import { MessagingService } from 'src/assets/services/messaging.service';
import { Message } from '@stomp/stompjs';
import { StompState } from '@stomp/ng2-stompjs';
import { UserService } from 'src/assets/services/user.service';
import { CommunicationService } from 'src/assets/services/communication-service';
import { ThreatNotificationService } from 'src/app/shared/threatnotification/threatnotification.service';

const $ = require('jquery');

@Component({
  selector: 'app-top-navbar-content',
  styleUrls: ['./styles/top-navbar-content.scss'],
  templateUrl: './top-navbar-content.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TopNavbarContentComponent implements OnInit, OnDestroy {
  @Input() messages = [];
  @Input() notifications = [];

  isAdmin = false;
  sideMenuVisible = true;
  baseUrl = '';
  logggedInUser = '';

  messageHistory = [];
  acmList: IActivityMonitoring[] = [];
  acm: IActivityMonitoring = {};
  state = 'NOT CONNECTED';
  timerFlag = false;
  notifCount = 0;
  isconnection = true;
  connection: any;

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  constructor(
    private sideMenuService: SideMenuService,
    private responsiveService: ResponsiveBreakpointsService,
    private router: Router,
    private userService: UserService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private shareDataService: ShareDataService,
    private communicationService: CommunicationService,
    private messagingService: MessagingService,
    private notificationsMenuService: NotificationsMenuService,
    private threatNotificationService: ThreatNotificationService
    // @Inject(APP_BASE_HREF) private baseHref: string
  ) {
    // this.baseUrl = baseHref;
    this.shareDataService.setApplicationVariables();
    this.getLoggedInUser();
    this.isAdmin = (this.shareDataService.role === 'ZACCESS') ? true : false;
    responsiveService.responsiveSubject
      .pipe(
        filter(breakpoint => breakpoint.screen === 'xs-or-sm')
      )
      .subscribe(breakpoint => {
        if (breakpoint.active) {
          this.sideMenuService.sidenav.mode = 'push';
          this.sideMenuService.sidenav.close().then(
            () => {
              // console.log('ok closing');
              this.sideMenuVisible = false;
            },
            () => {
              // console.log('error closing');
            },
            () => {
              // console.log('all closing');
            }
          );
        } else {
          this.sideMenuService.sidenav.mode = 'side';
        }
      });
  }

  ngOnInit() {
    localStorage.setItem('isNotify', 'false');
    // if (this.isAdmin)
    this.setNotifications();

    this.connection = setInterval(() => {
      this.connectionState();
    }, 3000);
  }

  ngOnDestroy() {
    if (this.connection) {
      clearInterval(this.connection);
    }
  }

  toggleSideMenu(): void {
    this.sideMenuService.sidenav.toggle().then(
      () => {
        this.sideMenuVisible = !this.sideMenuVisible;
      },
      () => {
        // console.log('error toggle');
      },
      () => {
        // console.log('all toggle');
      }
    );
  }

  getLoggedInUser() {
    this.userService.getUsers(this.shareDataService.email).subscribe(res => {
      if (res['status'] === 200) {
        const user: IUser[] = res['data'];
        if (user.length > 0) {
          this.logggedInUser = user[0].firstName + ' ' + user[0].lastName;
        }
      } else if (res['status'] === 500) {
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });
  }

  logout() {
    if (this.router.url === '/admin/activitymonitoring' && JSON.parse(localStorage.getItem('isthreatflag') as string)['boolean']) {
      this.dialog.open(AlertboxComponent, { panelClass: 'custom-dialog-container' });
    } else {
      this.dialog.open(AddnoteComponent, { panelClass: 'custom-dialog-container' });
    }
  }

  setNotifications() {
    try {
      // Subscribe to its stream (to listen on messages)
      this.messagingService.connect();
      this.messagingService.stream().subscribe((message: Message) => {
        if (message.body) {
          if (message.body.includes('logout')) {
            if (this.shareDataService.email === JSON.parse(message.body)['email']) {
              this.messagingService.disconnect();
              this.communicationService = null;

              this.userService.logoutLog();
              this.shareDataService.clearSessionVariables();

              localStorage.removeItem('userLogId');
              this.router.navigate(['/login']);
            }
          } else {
            this.messageHistory.unshift(message.body);
            this.acm = JSON.parse(message.body);

            const deviceNotifications = (localStorage.getItem('deviceNotificaions') ?
              JSON.parse(localStorage.getItem('deviceNotificaions')) : []);
            const newNotification = { leftDeviceMacAddress: this.acm.devices[0], threatId: this.acm.id };

            if (!deviceNotifications.some(notification => notification.threatId === newNotification.threatId) && !this.acm.screenerMessage) {
              this.notifCount = parseInt(localStorage.getItem('notificationCount'), 10) + 1;
              localStorage.setItem('notificationCount', this.notifCount.toString());
              deviceNotifications.push(newNotification);
              localStorage.setItem('deviceNotificaions', JSON.stringify(deviceNotifications));
            }

            // this.notificationsMenuService.setNotifications(this.acm);
            this.communicationService.raiseEvent(this.acm);

            if (this.acm.gateName !== undefined && this.acm.gateName != null) {
              // if ((this.shareDataService.role == 'advance' ? true : false) && this.shareDataService.role != null) {
              if (this.shareDataService.role != null && ['ZACCESS', '1ACCESS'].includes(this.shareDataService.role) === true) {
                if (localStorage.getItem('isNotify') === 'false') {
                  localStorage.setItem('isNotify', 'true');
                  this.threatNotificationService.success(message.body, this.options);
                }
              }
            }

            setTimeout(() => {
              localStorage.setItem('isNotify', 'false');
            }, environment.threatNotificationPopupInterval);
          }
        }
      });

      // Subscribe to its state (to know its connected or not)
      this.messagingService.state().subscribe((state: StompState) => {
        this.state = StompState[state];
      });
    } catch (e) {
    }
  }

  // Use this methods to send message back to server
  sendAction() {
    console.log('Sending message');
    // this.messagingService.send('/server-receiver', {
    //   text: 'Threat activity',
    //   text2: 'Threat activity acknolodgement'
    // });
  }

  connectionState() {
    this.messagingService.state().subscribe((state: StompState) => {
      if (StompState[state] === 'CLOSED') {
        this.isconnection = false;
      } else if (StompState[state] === 'CONNECTED') {
        this.isconnection = true;
      }
    });
  }

  // disableBeta() {
  //   try {
  //     if(localStorage.getItem("disableBeta")=="false"){
  //       $("#dv_log").hide();
  //       $("#dv_confirm").hide();
  //       $("#dv_actual_logs").hide();
  //       $("#dv_rcact").css("background-color", "#ffffff");

  //       $("#btnDisableBeta").text("ENABLE BETA TEST MODE");
  //       localStorage.setItem("disableBeta", "true");
  //     }
  //     else{
  //       $("#dv_log").show();
  //       $("#dv_confirm").hide();
  //       $("#dv_actual_logs").hide();
  //       $("#dv_rcact").css("background-color", "cyan");

  //       $("#btnDisableBeta").text("DISABLE BETA TEST MODE");
  //       localStorage.setItem("disableBeta", "false");
  //     }
  //   }
  //   catch (ex) {

  //   }
  // }
}
