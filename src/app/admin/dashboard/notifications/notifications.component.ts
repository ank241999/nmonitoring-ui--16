import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ThreatActivityService } from '../../../../assets/services/threat-activity.service';
import { IActivityMonitoring, OldActivityMonitoring } from '../../../../assets/interfaces/iactivity-monitoring';
import { IActivity, Activity } from '../../../../assets/interfaces/iactivity';
import { Router } from '@angular/router';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { LaneDeviceService } from '../../../../assets/services/lanedevice.service';
import { IEntrance } from '../../../../assets/interfaces/ientrance';
import { IDevice } from '../../../../assets/interfaces/idevice';
import { IActivityDashboard, ActivityDashboard } from '../../../../assets/interfaces/iactivitydashboard';
import { environment } from '../../../../environments/environment';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DevicedetailsComponent } from '../devicedetails/devicedetails.component';
import { ThreaticondetailsComponent } from '../threaticondetails/threaticondetails.component';
import { Location } from '@angular/common';
import { NotificationsMenuService } from '../../../core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../../../../assets/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],


})
export class NotificationsComponent implements OnInit {
  iactivity: IActivity[] = [];
  filteredActivities: IActivity[] = [];
  threatIds: string[] = [];

  dataSourceThreats: MatTableDataSource<IActivity>;
  @ViewChild(MatPaginator, { static: false }) paginatorThreats: MatPaginator;
  @ViewChild(MatSort, { static: false }) sortThreats: MatSort;
  displayedColumnsThreats = [
    'threatIcon',
    'creationTimestamp',
    'entranceName',
    'laneName',
    'guardName',
    'tabletId',
    'timeIn',
    'timeOut',
    'view'
  ];

  acms: IActivityMonitoring[] = [];
  status = 'Ok';
  threatType = 'No';
  date = '';
  time = '';
  threatIcon = '';
  gate = '';
  lane = '';
  selectedThreatStatusImage = '';

  threatLocationsCoordinates = {
    'Upper Front': { 'front-x': 122, 'front-y': 140, 'back-x': 0, 'back-y': 0, 'front': 'R1', 'back': '' },
    'Lower Front': { 'front-x': 166, 'front-y': 379, 'back-x': 0, 'back-y': 0, 'front': 'R2', 'back': '' },
    'Upper Back': { 'front-x': 0, 'front-y': 0, 'back-x': 123, 'back-y': 140, 'front': '', 'back': 'R14' },
    'Lower Back': { 'front-x': 0, 'front-y': 0, 'back-x': 168, 'back-y': 372, 'front': '', 'back': 'R13' },
    'Right Hip Front, Back': { 'front-x': 109, 'front-y': 380, 'back-x': 224, 'back-y': 370, 'front': 'R3', 'back': 'R4' },
    'Left Hip Front, Back': { 'front-x': 225, 'front-y': 380, 'back-x': 109, 'back-y': 370, 'front': 'R4', 'back': 'R3' },
    'Left Arm Front, Back': { 'front-x': 270, 'front-y': 203, 'back-x': 30, 'back-y': 203, 'front': 'R6', 'back': 'R5' },
    'Right Arm Front, Back': { 'front-x': 30, 'front-y': 203, 'back-x': 269, 'back-y': 203, 'front': 'R5', 'back': 'R6' },
    'Left Upper Leg Front, Back': { 'front-x': 210, 'front-y': 500, 'back-x': 110, 'back-y': 490, 'front': 'R9', 'back': 'R7' },
    'Left Lower Leg Front, Back': { 'front-x': 245, 'front-y': 670, 'back-x': 75, 'back-y': 670, 'front': 'R10', 'back': 'R8' },
    'Right Upper Leg Front, Back': { 'front-x': 109, 'front-y': 500, 'back-x': 208, 'back-y': 490, 'front': 'R7', 'back': 'R9' },
    'Right Lower Leg Front, Back': { 'front-x': 74, 'front-y': 670, 'back-x': 243, 'back-y': 670, 'front': 'R8', 'back': 'R10' },
  };

  constructor(
    private router: Router,
    private location: Location,
    private threatActivityService: ThreatActivityService,
    private shareDataService: ShareDataService,
    private notificationsMenuService: NotificationsMenuService,
    // private spinnerService: NgxSpinnerService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang(shareDataService.getLabels());

    this.threatActivityService.getThreatActivities('').subscribe(res => {
      const activitydata: OldActivityMonitoring = res['data'];
      // console.log(JSON.stringify(this.acms))
      // for (const i in activitydata) {
      //   const iact: IActivity = this.addThreats('', '', activitydata[i], false);
      //   this.iactivity.push(iact);
      //   this.threatIds.push(this.acms[i].id);
      // }

      for (const i in activitydata) {
        if (activitydata.hasOwnProperty(i)) { // Check if the property belongs to the object
          const iact: IActivity = this.addThreats('', '', activitydata[i], false);
          this.iactivity.push(iact);
          this.threatIds.push(this.acms[i].id);
        }
      }


      console.log(this.iactivity);

      // this.setDashboardSource();
      this.filterDeployments('');
      if (this.acms.length > 0) {
        this.setThreatIsViewedStatus();
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });
  }

  ngOnInit() {
  }

  filterDeployments(filter: string) {
    setTimeout(() => {
      this.dataSourceThreats = new MatTableDataSource<IActivity>(this.iactivity);
      this.dataSourceThreats.paginator = this.paginatorThreats;
      this.dataSourceThreats.sort = this.sortThreats;
    }, 0);
  }

  addThreats(contextFront, context, acm: OldActivityMonitoring, showThreat: boolean) {
    this.date = this.format(parseInt(acm.creationTimestamp, 10), 'MM/dd/yyyy');
    this.time = this.format(parseInt(acm.creationTimestamp, 10), 'HH:mm');
    acm.timeIn = this.format(parseInt(acm.creationTimestamp, 10), 'HH:mm:ss');
    acm.timeOut = this.format((acm.timeOut == null ? 0 : acm.timeOut), 'HH:mm:ss');

    this.status = '--';
    this.threatType = '--';
    this.gate = '';
    this.lane = '';

    let recentactivitythreat: IActivityMonitoring;
    recentactivitythreat = {
      'noThreatConfig': '',
      'objectDetected': true,
      'devices': [],
      'anomalies': {
        'cellphone': [],
        'keys': [],
        'genericAnomaly': []
      },
      'threats': {
        'handgun': [],
        'rifle': [],
        'pipeBomb': [],
        'knife': [],
        'genericThreat': []
      },
      'personsScannedId': []
    };
    recentactivitythreat.id = acm.id;
    recentactivitythreat.noThreatConfig = acm.noThreatConfig;
    recentactivitythreat.creationTime = acm.creationTime;
    recentactivitythreat.creationTimestamp = acm.creationTimestamp;
    recentactivitythreat.devices.push(acm.leftDeviceMacAddress);
    recentactivitythreat.devices.push(acm.rightDeviceMacAddress);
    recentactivitythreat.logId = acm.logId;
    recentactivitythreat.actualResult = acm.actualResult;
    recentactivitythreat.timeIn = acm.timeIn;
    recentactivitythreat.timeOut = acm.timeOut;

    // fulldisplay
    if (acm.noThreatConfig !== undefined) {
      if (acm.noObjects !== undefined && acm.noObjects === false) {
        this.status = ActivityConstants.statusOk;
        this.threatType = ActivityConstants.threatNoObject;
        this.threatIcon = ActivityConstants.smallNoThreatIcon;
        recentactivitythreat.objectDetected = false;
      } else {
        recentactivitythreat.anomalies.cellphone = acm.nonThreatCellphone.split('-');
        recentactivitythreat.anomalies.keys = acm.nonThreatKeys.split('-');
        recentactivitythreat.anomalies.genericAnomaly = acm.anomaly.split('-');
        recentactivitythreat.threats.handgun = acm.threatHandgun.split('-');
        recentactivitythreat.threats.rifle = acm.threatRifle.split('-');
        recentactivitythreat.threats.pipeBomb = acm.threatPipeBomb.split('-');
        recentactivitythreat.threats.knife = acm.threatKnife.split('-');
        recentactivitythreat.threats.genericThreat = acm.threatThreat.split('-');

        this.showThreats(showThreat, contextFront, context, acm, [], ActivityConstants.anomaly,
          ActivityConstants.statusOk, ActivityConstants.smallAnomalyIcon,
          ActivityConstants.largeAnomalyIcon, ActivityConstants.threatCellphone);
      }
    }

    this.acms.push(recentactivitythreat);

    const iact: Activity = new Activity(acm.id, this.status, this.time, this.threatIcon, acm.creationTimestamp, this.threatType,
      null, null, null, acm.deviceName, acm.laneName, acm.gateName,
      acm.timeIn, acm.timeOut, acm.tabletName, acm.userName, acm.tid);
    return iact;
  }

  showThreats(showThreat: boolean, contextFront, context, acm: IActivityMonitoring, threatLocation: string[],
    threat: string, statusThreat: string, smallThreatIcon: string, largeThreatIcon: string, threatType: string) {
    this.status = statusThreat;
    this.threatType = threatType;
    this.threatIcon = smallThreatIcon;
    this.selectedThreatStatusImage = largeThreatIcon;

    this.gate = 'North Entrance';
    this.lane = 'One';
  }

  viewThreat(row) {
    this.shareDataService.setSharedData(this.acms.filter(a => a.id === row.id)[0]);
    this.router.navigate(['./admin/activitymonitoring/activitythreats']);
  }

  format(time, format) {
    if (time !== 0) {
      const t = new Date(time);
      const tf = function (i) { return (i < 10 ? '0' : '') + i; };
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
          case 'yyyy':
            return tf(t.getFullYear());
            break;
          case 'MM':
            return tf(t.getMonth() + 1);
            break;
          case 'mm':
            return tf(t.getMinutes());
            break;
          case 'dd':
            return tf(t.getDate());
            break;
          case 'HH':
            return tf(t.getHours());
            break;
          case 'ss':
            return tf(t.getSeconds());
            break;
        }
      });
    }
  }

  onScreenClose() {
    this.router.navigate(['admin/dashboard']);
  }

  setThreatIsViewedStatus() {
    // this.spinnerService.show();
    const obj = {
      ids: this.threatIds,
      viewedById: this.shareDataService.id
    };

    this.threatActivityService.setThreatViewed(obj).subscribe(res => {
      if (res['status'] === 201) {
        // this.spinnerService.hide();

        this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
          this.notificationService.showNotification('Threat view status updated', 'top', 'center', '', 'info-circle');
        });
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
}
