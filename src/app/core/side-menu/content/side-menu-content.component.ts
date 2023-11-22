import { Component, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../../../assets/services/user.service';
import { IUser } from '../../../../assets/interfaces/iuser';
import { SideMenuService } from '../../side-menu/side-menu.service';
import { ResponsiveBreakpointsService } from '../../responsive-breakpoints/responsive-breakpoints.service';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// import { ActivityConstants } from '../../../../assets/constants/activity-constants';

import { ShareDataService } from '../../../../assets/services/share-data.service';
import { IDeviceDetect } from '../../../../assets/interfaces/idevicedetect';
import { DeviceDetectSimulatorService } from '../../../../assets/services/device-detect-simulator.service';
import { NotificationService } from '../../../../assets/services/notification.service';
import { stat } from 'fs';
import { ThreatLogService } from '../../../../assets/services/threatlog.service';
import { ThreatActivityService } from '../../../../assets/services/threat-activity.service';
import { forkJoin } from 'rxjs';
import { DevicemanagementService } from '../../../../assets/services/devicemanagement.service';
import { IDevice } from '../../../../assets/interfaces/idevice';
import { environment } from '../../../../environments/environment';
import { UserSettingService } from '../../../../assets/services/userSettingService';
import { IUserSetting } from '../../../../assets/interfaces/iuser-setting';
import { TabletService } from '../../../../assets/services/tablet.service';
const $ = require('jquery');

@Component({
  selector: 'app-side-menu-content',
  styleUrls: [
    './styles/side-menu-content.scss'
  ],
  templateUrl: './side-menu-content.component.html',
  encapsulation: ViewEncapsulation.None
})

export class SideMenuContentComponent {
  isAdmin = false;
  user?: IUser;
  sideMenuVisible = true;
  logggedInUser = '';
  istechnicianltd = false;
  istechniciancust = false;
  betaTestMode = false;
  logoutCalled = false;
  leftPairedDevice?: string;
  rightPairedDevice?: string;
  device: IDevice[] = [];
  startCallTimer: any;
  notificationShown = false;

  primaryDevice = false;
  primaryTablet = false;
  isTabletAssociatedWithDevices: boolean = false

  constructor(
    private userService: UserService,
    private sideMenuService: SideMenuService,
    private responsiveService: ResponsiveBreakpointsService,
    private router: Router,
    private translate: TranslateService,
    public deviceDetectService: DeviceDetectSimulatorService,
    private notificationService: NotificationService,
    private threatActivityService: ThreatActivityService,
    private threatLogService: ThreatLogService,
    public deviceService: DevicemanagementService,
    private shareDataService: ShareDataService,
    private userSettingService: UserSettingService,
    public tabletService: TabletService) {
    translate.setDefaultLang(shareDataService.getLabels());
    this.getLoggedInUser();
    this.connectedDevices();
    this.getSettings();
    // this.isAdmin = (this.shareDataService.role === "advance" ? true : false);
    // this.istechnicianltd = (this.shareDataService.role === "technicianltd" ? true : false);
    // this.istechniciancust = (this.shareDataService.role === "techniciancust" ? true : false);

    this.betaTestMode = shareDataService.getBetaTestMode();

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
          this.sideMenuService.sidenav.mode = 'over';
        }
      });
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
    this.closeSettingsPanel();
  }

  toggleSideMenu_setting(): void {
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

  openSettingsPanel() {
    $('.btn_setting').hide();
    $('.setting_panel').animate({ width: '430px', opacity: '1' }, 'fast');
    $('.tab').animate({ opacity: '1' }, 'slow');
    document.getElementById('advanced')!.style.display = 'block';
    // this.toggleSideMenu();
    this.toggleSideMenu_setting();
  }

  closeSettingsPanel() {
    $('.btn_setting').show();
    $('.tab').animate({ opacity: '0' }, 'fast');
    // document.getElementById("tab_heading_accesspoint").style.display = "none";
    // document.getElementById("tab_heading_cta").style.display = "none";
    // document.getElementById("accesspoint").style.display = "none";
    // document.getElementById("cta").style.display = "none";
    $('.setting_panel').animate({ width: '0px', opacity: '0' }, 'fast');
  }

  getLoggedInUser() {
    this.userService.getUsers(this.shareDataService.email).subscribe(res => {
      if (res['status'] === 200) {
        const user: IUser[] = res['data'];
        if (user.length > 0) {
          this.user = user[0];
          this.logggedInUser = user[0].firstName + ' ' + user[0].lastName;
        }
      } else if (res['status'] === 500) {
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });
  }

  ngOnDestroy(): void {
    if (this.startCallTimer) {
      clearTimeout(this.startCallTimer);
    }
  }

  forceclear() {
    if (this.primaryDevice === true && this.primaryTablet === true
      && (this.leftPairedDevice !== null && this.rightPairedDevice !== null) && this.isTabletAssociatedWithDevices === true) {
    }
    else {
      this.notificationService.showNotification('You are not authorized to run this command.', 'top', 'center', 'warning', 'info-circle');
      return false;
    }

    const status: IDeviceDetect = {
      left_mac_address: this.leftPairedDevice,
      right_mac_address: this.rightPairedDevice,
      status: 'THREAT_DISPLAY_END'
    };

    const observables = [];

    if (this.leftPairedDevice) {
      observables.push(this.deviceDetectService.sendStatus(this.leftPairedDevice, status));
    }

    if (this.rightPairedDevice) {
      observables.push(this.deviceDetectService.sendStatus(this.rightPairedDevice, status));
    }

    if (observables.length > 0) {
      forkJoin(observables).subscribe(
        responses => {
          let success = false;
          for (const res of responses) {
            if (res['status' as keyof typeof res] === 200) {
              success = true;
              break; // No need to continue checking other responses
            }
          }

          if (success) {
            this.notificationService.showNotification('Threat Display End Successfully', 'top', 'center', '', 'info-circle');
          }
        },
        err => {
          console.log('Error occurred: ' + err.message);
        }
      );
    } else {
      console.log('All devices are null. No calls to run.');
    }

    const observablesForStartCall = [];

    if (this.leftPairedDevice !== null) {
      observablesForStartCall.push(this.threatLogService.startThreatMessage(this.leftPairedDevice));
    }

    if (this.rightPairedDevice !== null) {
      observablesForStartCall.push(this.threatLogService.startThreatMessage(this.rightPairedDevice));
    }

    if (observablesForStartCall.length > 0) {
      forkJoin(observablesForStartCall).subscribe(
        () => {
          console.log('Start call sent successfully');
        },
        error => {
          console.log('Error occurred in Start call: ' + error.message);
        }
      );
    } else {
      console.log('All devices are null. No start calls to run.');
    }

  }

  connectedDevices() {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const hostname = ipRegex.test(window.location.hostname)
      ? window.location.hostname
      : environment.threatMessageUrl.replace('http://', '').replace(':8123', '');

    this.deviceService.getDevices().subscribe(deviceres => {
      if (deviceres['status' as keyof typeof deviceres] === 200) {
        this.device = deviceres['data'];
        const matchingDevice = this.device.find(x => x.ipAddress === hostname);

        let lane: number | null | undefined = null;
        if (matchingDevice) {
          lane = matchingDevice.laneId;
        }
        if (lane === 0) {
          this.leftPairedDevice = hostname;
          this.rightPairedDevice = undefined;
        }
        else {
          const leftPairedDevice = this.device.find(x => x.laneId === lane && x.side === 'left');
          const rightPairedDevice = this.device.find(x => x.laneId === lane && x.side === 'right');

          this.leftPairedDevice = leftPairedDevice ? leftPairedDevice.ipAddress : undefined;
          this.rightPairedDevice = rightPairedDevice ? rightPairedDevice.ipAddress : undefined;
        }

        const leftPairedDevice = this.leftPairedDevice || "";
        localStorage.setItem("leftPairedDevice", leftPairedDevice);

        const rightPairedDevice = this.rightPairedDevice || "";
        localStorage.setItem("rightPairedDevice", rightPairedDevice);
      }
    }, err => {
      console.log('Error occurred: ' + err.message);
    });
  }

  stopScanning() {//alert(this.primaryDevice+"::"+this.primaryTablet+"::"+this.leftPairedDevice+"::"+this.rightPairedDevice)
    if (this.primaryDevice === true && this.primaryTablet === true
      && (this.leftPairedDevice !== null && this.rightPairedDevice !== null) && this.isTabletAssociatedWithDevices === true) {
    }
    else {
      this.notificationService.showNotification('You are not authorized to run this command.', 'top', 'center', 'warning', 'info-circle');
      return false;
    }
    // Send status update immediately
    const observables = [];

    if (this.leftPairedDevice) {
      observables.push(this.deviceDetectService.stopScanning(this.leftPairedDevice));
    }

    if (this.rightPairedDevice) {
      observables.push(this.deviceDetectService.stopScanning(this.rightPairedDevice));
    }

    if (observables.length > 0) {
      forkJoin(observables).subscribe(
        responses => {
          let success = false;
          for (const res of responses) {
            if (res['status' as keyof typeof res] === 200) {
              success = true;
              break; // No need to continue checking other responses
            }
          }

          if (success) {
            // Check if the notification has already been shown
            if (!this.notificationShown) {
              // Show the notification
              localStorage.setItem('rkaStop', 'true');
              this.notificationService.showNotification('Scanning Stopped', 'top', 'center', '', 'info-circle');

              // Set the flag to true to indicate that the notification has been shown
              this.notificationShown = true;
            }
            localStorage.setItem('rkaStop', 'true');
            this.shareDataService.setIsScanningStopped(true);

          }
        },
        err => {
          console.log('Error occurred: ' + err.message);
        }
      );
    } else {
      console.log('All devices are null. No calls to run.');
    }

    const observablesForStopCall = [];

    if (this.leftPairedDevice !== null) {
      observablesForStopCall.push(this.threatLogService.stopThreatMessage(this.leftPairedDevice));
    }

    if (this.rightPairedDevice !== null) {
      observablesForStopCall.push(this.threatLogService.stopThreatMessage(this.rightPairedDevice));
    }

    if (observablesForStopCall.length > 0) {
      forkJoin(observablesForStopCall).subscribe(
        () => {
          console.log('Stop call sent successfully');
        },
        error => {
          console.log('Error occurred in Stop call: ' + error.message);
        }
      );
    } else {
      console.log('All devices are null. No stop calls to run.');
    }

    // Set the timer to run again after the specified interval
    //this.startCallTimer = setTimeout(() => this.stopScanning(), environment.stopCallInterval);
    if (this.startCallTimer) {
      clearTimeout(this.startCallTimer);
    }
    this.startCallTimer = setTimeout(this.stopScanning.bind(this), environment.stopCallInterval);
  }

  resumeScanning() {
    if (this.primaryDevice === true && this.primaryTablet === true
      && (this.leftPairedDevice !== null && this.rightPairedDevice !== null) && this.isTabletAssociatedWithDevices === true) {
    }
    else {
      this.notificationService.showNotification('You are not authorized to run this command.', 'top', 'center', 'warning', 'info-circle');
      return false;
    }

    this.notificationShown = false;

    clearInterval(this.startCallTimer);

    // Send status update immediately
    const observables = [];

    if (this.leftPairedDevice) {
      observables.push(this.deviceDetectService.resumeScanning(this.leftPairedDevice));
    }

    if (this.rightPairedDevice) {
      observables.push(this.deviceDetectService.resumeScanning(this.rightPairedDevice));
    }

    if (observables.length > 0) {
      forkJoin(observables).subscribe(
        responses => {
          let success = false;
          for (const res of responses) {
            if (res['status' as keyof typeof res] === 200) {
              success = true;
              break; // No need to continue checking other responses
            }
          }

          if (success) {
            localStorage.setItem('rkaStop', 'false');
            this.notificationService.showNotification('Scanning Resumed', 'top', 'center', '', 'info-circle');
            this.shareDataService.setIsScanningStopped(false);
          }
        },
        err => {
          console.log('Error occurred: ' + err.message);
        }
      );
    } else {
      console.log('All devices are null. No calls to run.');
    }


    const observablesForStartCall = [];

    if (this.leftPairedDevice !== null) {
      observablesForStartCall.push(this.threatLogService.startThreatMessage(this.leftPairedDevice));
    }

    if (this.rightPairedDevice !== null) {
      observablesForStartCall.push(this.threatLogService.startThreatMessage(this.rightPairedDevice));
    }

    if (observablesForStartCall.length > 0) {
      forkJoin(observablesForStartCall).subscribe(
        () => {
          console.log('Start call sent successfully');
        },
        error => {
          console.log('Error occurred in Start call: ' + error.message);
        }
      );
    } else {
      console.log('All devices are null. No start calls to run.');
    }
  }

  logout() {
    this.userService.logOutUser().subscribe(res => {
      if (res['status'] === 200) {
        // ActivityConstants.retainRequiredValues();
        this.userService.logoutLog();
        this.shareDataService.clearSessionVariables();
        localStorage.setItem('rkaStop', 'false');
        // localStorage.clear();

        localStorage.removeItem('userLogId');
        this.router.navigate(['/login']);
      } else if (res['status'] === 400) {
        this.userService.logoutLog();
        this.shareDataService.clearSessionVariables();

        localStorage.removeItem('userLogId');
        this.router.navigate(['/login']);
      } else if (res['status'] === 500) {
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });
  }

  showProfile() {
    if (this.checkAcccessLevel('modifyaccount')) {
      this.shareDataService.setSharedData(this.user);
      this.router.navigate(['./admin/accountmanagement/modifyaccount']);
    } else if (this.checkAcccessLevel('profiledetails')) {
      this.shareDataService.setSharedData(this.user);
      this.router.navigate(['./admin/profiledetails']);
    }
  }

  checkAcccessLevel(endPoint: string) {// alert(endPoint)
    if (this.shareDataService.userRoleAuth != null &&
      this.shareDataService.userRoleAuth.filter(a => a.endPoint?.includes(endPoint)).length > 0) {
      // alert("Exists")
      // console.log(endPoint + " :: " + this.shareDataService.userRoleAuth.filter(a=> a.endPoint.includes(endPoint)).length);

      return true;
    } else if (this.shareDataService.userRoleAuth != null &&
      this.shareDataService.userRoleAuth.filter(a => a.endPoint?.includes(endPoint)).length === 0) {
      return false;
    } else {
      if (!this.logoutCalled) {
        this.logoutCalled = true;
        this.logout();
      }
    }
  }

  getSettings() {
    this.userSettingService.getUserSetting('global_setting').subscribe(res => {
      const iUserSetting: IUserSetting = res['data'].filter((a: { locationId: string; }) => a.locationId = '1')[0];

      this.primaryDevice = iUserSetting.primaryDevice !== undefined ? iUserSetting.primaryDevice : true;
      this.getPrimaryTabletFlag();
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });
  }

  getPrimaryTabletFlag() {
    this.tabletService.getTablets().subscribe(res => {
      const prTab = res['data'].filter((a: { tabletMacAddress: string; }) => a.tabletMacAddress === this.shareDataService.email);
      if (prTab !== undefined && JSON.stringify(prTab) !== '[]') {
        this.primaryTablet = prTab[0]['primaryTablet'];
        this.isTabletAssociatedWithDevices = (prTab[0].devices.filter((t: { ipAddress: string | undefined; }) => t.ipAddress == this.leftPairedDevice || t.ipAddress == this.rightPairedDevice).length > 0 ? true : false);
      }

      console.log('primaryTablet: ' + this.primaryTablet);
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });
  }
}
