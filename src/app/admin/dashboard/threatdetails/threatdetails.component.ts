import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { TranslateService } from '@ngx-translate/core';
import { GuardlogsComponent } from './guardlogs/guardlogs.component';
import { LaneDeviceService } from '../../../../assets/services/lanedevice.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { IDeviceDetails, IThreatDetails, ThreatDetails } from '../../../../assets/interfaces/idashboarddetails';
import { ShareDataService } from '../../../../assets/services/share-data.service';

@Component({
  selector: 'app-threatdetails',
  templateUrl: './threatdetails.component.html',
  styleUrls: ['./threatdetails.component.scss'],
})
export class ThreatdetailsComponent implements OnInit {
  dataSourceDevice: MatTableDataSource<IThreatDetails>;
  @ViewChild(MatPaginator, { static: false }) paginatorGate: MatPaginator;
  @ViewChild(MatSort, { static: false }) sortGate: MatSort;
  displayedColumnsGate = [
    'threatIcon',
    // 'threatType',

    'creation_timestamp',
    'time',

    'user_name',
    'tablet_name'
  ];

  deviceDetails: IDeviceDetails[] = [];
  threatDetails: IThreatDetails[] = [];
  laneName = 'Lane';
  entranceName = 'Entrance';

  constructor(private router: Router,
    public dialog: MatDialog,
    private location: Location,
    private shareDataService: ShareDataService,
    private translate: TranslateService,
    private lanedeviceService: LaneDeviceService,
    // private spinnerService: NgxSpinnerService,
    private route: ActivatedRoute) {
    translate.setDefaultLang(shareDataService.getLabels());
    document.body.style.background = '#EBEBEB';

    const data = this.shareDataService.getSharedData();
    this.laneName = data.laneName;
    this.entranceName = data.entranceName;
  }

  ngOnInit() {
    let leftDeviceMacAddress = '';
    this.route.queryParams.subscribe(params => {
      leftDeviceMacAddress = params['leftDeviceMacAddress'];
    });

    // this.spinnerService.show();

    this.lanedeviceService.getDeviceDetails(leftDeviceMacAddress).subscribe(ent => {
      if (ent['status'] = '200') {
        let threatIcon = ActivityConstants.noImageIcon;
        let threatType = '--';

        this.deviceDetails = ent['data']['#result-set-1'];
        if (this.deviceDetails.length === 0) {
          // Handle the situation where there are no device details
          this.threatDetails = []; // Clear any existing threat details
          // this.spinnerService.hide();
        } else {
          this.deviceDetails.forEach(e => {
            const date = this.format(e.creation_timestamp, 'MM/dd/yyyy');
            const time = this.format(e.creation_timestamp, 'HH:mm:ss');

            if (e.no_threat_config !== undefined) {
              if (e.no_objects !== undefined && e.no_objects === true) {
                threatType = ActivityConstants.threat;
                threatIcon = ActivityConstants.smallThreatIcon;
              } else {
                threatType = ActivityConstants.threatNoObject;
                threatIcon = ActivityConstants.smallNoThreatIcon;
              }
            }

            // let iact: IActivity = this.addThreats("", "", this.acms[i], false);
            const threatDetail: IThreatDetails = new ThreatDetails(threatIcon, threatType, date, time, e.user_name,
              e.tablet_name);
            // iact.deviceId = this.devices[Math.floor(Math.random() * this.devices.length)].id;
            this.threatDetails.push(threatDetail);
          });
          this.filterDeployments();
        }
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });
  }

  filterDeployments() {
    setTimeout(() => {
      this.dataSourceDevice = new MatTableDataSource<IThreatDetails>(this.threatDetails);
      this.dataSourceDevice.paginator = this.paginatorGate;
      this.dataSourceDevice.sort = this.sortGate;

      // this.spinnerService.hide();
    }, 0);
  }

  onScreenClose() {
    this.location.back();
  }

  openGuardLogs() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(GuardlogsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  format(time, format) {
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
