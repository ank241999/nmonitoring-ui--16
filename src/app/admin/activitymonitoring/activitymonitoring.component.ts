import { Component, HostListener } from '@angular/core';
import { ViewEncapsulation, ViewChild, ElementRef, asNativeElements, OnDestroy, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { ThreatActivityService } from '../../../assets/services/threat-activity.service';
import { IActivityMonitoring, OldActivityMonitoring, Logactualthreat } from '../../../assets/interfaces/iactivity-monitoring';
import { IActivity, Activity } from '../../../assets/interfaces/iactivity';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { Router } from '@angular/router';
import { UserService } from '../../../assets/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { IUserSetting } from '../../../assets/interfaces/iuser-setting';
import { NotificationService } from '../../../assets/services/notification.service';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddnoteComponent } from './addnote/addnote.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IThreatLog } from '../../../assets/interfaces/ithreatlog';
import { ThreatLogService } from '../../../assets/services/threatlog.service';
import { UserSettingService } from '../../../assets/services/userSettingService';
import { CommunicationService } from '../../../assets/services/communication-service';
import { LogdetailsComponent } from './logdetails/logdetails.component';
import { TabletService } from '../../../assets/services/tablet.service';
import { ITablet } from '../../../assets/interfaces/itablet';
import { DeviceDetectSimulatorService } from '../../../assets/services/device-detect-simulator.service';
import { IDeviceDetect } from '../../../assets/interfaces/idevicedetect';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { DevicemanagementService } from '../../../assets/services/devicemanagement.service';
import { IDevice } from '../../../assets/interfaces/idevice';
import { ResetcountalertComponent } from './resetcountalert/resetcountalert.component';
import { HttpClient } from '@angular/common/http';
import { SysteminformationService } from '../../../assets/services/systeminformation.service';
import { IKeySystemInfo } from '../../../assets/interfaces/isystemInfo';
import { Subscription } from 'rxjs';
import { MessagingService } from 'src/assets/services/messaging.service';
import { StompState } from '@stomp/ng2-stompjs';

const $ = require('jquery');

@Component({
  selector: 'app-activitymonitoring-page',
  templateUrl: './activitymonitoring.component.html',
  styleUrls: ['./styles/_forms-wizard.scss', './styles/activitymonitoring.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})

export class ActivityMonitoringComponent implements OnInit, OnDestroy {
  isTabletAssociatedWithDevices: boolean = false;
  leftPairedDevice: string = "";
  rightPairedDevice: string = "";
  isShowScreenerMessage: boolean = false;
  //
  tabletDeviceAssociated: boolean = false;

  constructor(private systeminformationService: SysteminformationService, private threatActivityService: ThreatActivityService,
    public tabletService: TabletService,
    private http: HttpClient,
    private fb: FormBuilder,
    private messagingService: MessagingService, 
    private router: Router,
    private userService: UserService, private translate: TranslateService,
    private notificationService: NotificationService,
    public deviceService: DevicemanagementService,
    public deviceDetectService: DeviceDetectSimulatorService,
    private spinnerService: NgxSpinnerService,
    public dialog: MatDialog,
    public formBuilder: FormBuilder, private threatLogService: ThreatLogService,
    private userSettingService: UserSettingService,
    private shareDataService: ShareDataService,
    private communicationService: CommunicationService) {
    this.form = formBuilder.group({
      r_result: new FormControl(''),
      threatType: new FormControl(''),
      weaponType: new FormControl(''),
      threatLocation: new FormControl('')
    });

    translate.setDefaultLang(shareDataService.getLabels());
    $('#dv_rightpanel').height(window.innerHeight - 120);

    document.body.style.background = '#EBEBEB';
    this.spinnerService.show();

    this.scancount = JSON.parse(localStorage.getItem('scanCount'))['number'];
    this.scancountstring = this.leftPad(this.scancount, 6);
    localStorage.setItem('isthreatflag', JSON.stringify({ boolean: Boolean(this.isThreatFlag) }));
    this.devicesIP();

    this.http.get(environment.apiGatewayUrl + '/api/setting/audio/alertSound', { responseType: 'blob' }).subscribe(
      (data: Blob) => {
        const url = URL.createObjectURL(data);
        this.audio = new Audio(url);
        this.audio.load();
      },
      (error) => {
        console.error('Error loading audio file:', error);
      }
    );


    // this.getThreatLogFlag();

    // Instantiate a messagingService
    // this.messagingService = new MessagingService();
    // Subscribe to its stream (to listen on messages)
    try {
      // this.messagingService.stream().subscribe((message: Message) => {
      if (Array.isArray(this.communicationService.receivedFilter.observers) &&
        this.communicationService.receivedFilter.observers.length === 0) {
        this.spinnerService.hide();
      }

      this.receivedFilterSubscription = this.communicationService.receivedFilter.subscribe((acm: IActivityMonitoring) => {
        // if (!this.isThreatFlag) {
        //   if (this.primaryDevice) {
        //     const foundDevice = this.connectedDevicesMap.get(acm.devices[0]);

        //     if (foundDevice && this.primaryTablet) {
        //       this.defaultSettings();
        //       this.showObjects({}, false);
        //       this.totalalarms = 0;
        //       this.scanresult = '--';
        //       this.selectedThreatStatusImage = '';
        //       $('.canvas_wrapper').attr('style', 'border-color: #939594;');
        //       $('.btn_clear').attr('style', 'background: #f5f5f5;');
        //       $('.btn_clear').prop('disabled', true);

        //       $('.threat-act').each(function () {
        //         $(this).parent().attr('style', 'background: #f8f8f8; cursor: pointer');
        //       });

        //       $('#dv_log').hide();

        //       //this.screenerMessageToShow = acm.screenerMessage;
        //     }
        //   }
        //   else {
        //     this.defaultSettings();
        //     this.showObjects({}, false);
        //     this.totalalarms = 0;
        //     this.scanresult = '--';
        //     this.selectedThreatStatusImage = '';
        //     $('.canvas_wrapper').attr('style', 'border-color: #939594;');
        //     $('.btn_clear').attr('style', 'background: #f5f5f5;');
        //     $('.btn_clear').prop('disabled', true);

        //     $('.threat-act').each(function () {
        //       $(this).parent().attr('style', 'background: #f8f8f8; cursor: pointer');
        //     });

        //     $('#dv_log').hide();

        //     this.screenerMessageToShow = acm.screenerMessage;
        //   }
        // }
        // else {
        this.screenerMessageToShow = '';
        const { personIn, id } = acm;

        const betaTestMode = this.betaTestMode;
        const connectedDevices = this.connectedDevices;
        const acms = this.acms;

        const foundDevice = !!this.connectedDevicesMap.get(acm.devices[0]);

        if (acm.screenerMessage && !this.isThreatFlag) {
          this.screenerMessageToShow = acm.screenerMessage;
          this.screenerMessageSettings();
          this.isThreatFlag = false;
        }
        // else if (!this.isTabletAssociatedWithDevices && acm.screenerMessage && !this.isThreatFlag) {
        //   this.screenerMessageToShow = acm.screenerMessage;
        //   this.screenerMessageSettings();
        //   this.isThreatFlag = false;
        // }


        // alert(this.primaryDevice + ":TTTTTTT:" + acm.objectDetected + "::" + this.primaryGuardMode + "::" + this.primaryTablet);
        // alert(":SSSSS:" + foundDevice + "::" + this.isTabletAssociatedWithDevices)
        //alert(personIn + "::" + this.isThreatFlag + console.log(JSON.stringify(acms.some(a => a.id === id))) + "::" + this.tabletDeviceAssociated)
        if (!personIn && !this.isThreatFlag && !acm.screenerMessage) {
          if (!this.tabletDeviceAssociated) {
            this.acm = acm;
            this.threatProcessed();

            $('.btn_clear').attr('style', 'background: #f5f5f5;');
            $('.btn_clear').prop('disabled', true);
            this.isThreatFlag = false;

            if (!acm.objectDetected) {
              this.sendDisplayStart(acm, this.isThreatFlag);
              if (betaTestMode) {
                this.checkBetaTestMode(acm);
              }
              this.stopCall(this.isThreatFlag);
            }

          } else {
            //alert(this.isTabletAssociatedWithDevices + "::" + acm.objectDetected + "::" + this.primaryGuardMode + "::" + this.primaryTablet)
            this.acm = acm;
            this.threatProcessed();

            $('.btn_clear').attr('style', 'background: #f5f5f5;');
            $('.btn_clear').prop('disabled', true);
            this.isThreatFlag = false;

            if (acm.objectDetected && foundDevice) {
              $('.btn_clear').attr('style', 'background: #339900;');
              $('.btn_clear').prop('disabled', false);
              this.isThreatFlag = true;

              localStorage.setItem('isthreatflag', JSON.stringify({ boolean: this.isThreatFlag }));
              this.playSound();
            }
            else if (acm.objectDetected) {
              localStorage.setItem('isthreatflag', JSON.stringify({ boolean: this.isThreatFlag }));
              this.playSound();
            }

            this.sendDisplayStart(acm, this.isThreatFlag);
            if (betaTestMode) {
              this.checkBetaTestMode(acm);
            }
            this.stopCall(this.isThreatFlag);
          }
        } else if (personIn && !acms.some(a => a.id === id) && !acm.screenerMessage) {
          this.acm = acm;
          this.threatProcessed();
        }

        this.spinnerService.hide();
        // }
      });

      // Subscribe to its state (to know its connected or not)
      this.messagingService.state().subscribe((state: StompState) => {
        this.state = StompState[state];
      });
    } catch (e) {
      console.log(e);
      this.spinnerService.hide();
    }
  }
  private receivedFilterSubscription: Subscription;
  systemInformationForm: FormGroup;
  iKeySystemInfo: IKeySystemInfo[];
  enableAddButton = 0;
  messageHistory = [];
  startCallTimer: any;
  stopCallTimer: any;

  private audio = new Audio('../../../assets/media/threat-sound.mp3');

  iactivity: IActivity[] = [];
  filteredActivities: IActivity[] = [];
  devices: IDevice[] = [];

  dataSource: MatTableDataSource<IActivity>;
  displayedColumns = [
    'status',
    'timestamp',
    'actualResult'
  ];

  logactualselectthreattype: string[] = [];

  acm: IActivityMonitoring = {};
  acms: IActivityMonitoring[] = [];
  state = 'NOT CONNECTED';

  status = 'Ok';
  threatType = 'No';
  threatLocate = '';
  date = '';
  time = '';

  threatDisplayImg = '';
  tmpthreatDisplayImg = '';

  threatIcon = '';
  selectedThreatStatusImage = '';
  timerFlag = false;

  scanresult = '--';
  totalalarms = 0;
  scanresultI = '--';
  totalalarmsI = 0;

  statusI = 'Ok';
  threatTypeI = 'No';
  threatIconI = '';
  selectedThreatStatusImageI = '';

  r_resultSelected = '';

  logPopHide = true;
  startInterval: any;
  stopThreat: boolean;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('filter', { static: false }) filter: ElementRef;
  @ViewChild('canvasfront', { static: false }) canvasRefFront: ElementRef;
  @ViewChild('canvasback', { static: false }) canvasRefBack: ElementRef;
  // image: string = '../../assets/images/DefaultBackgroundScreen.png';
  frontimage = new Image();
  backimage = new Image();

  scanCountBasis: string;

  gate = '';
  lane = '';
  email: string;
  isThreatFlag = false;
  isScanStopped = false;
  screenerMessageToShow: string;
  currentThreatId = '0';
  currentShownToUserThreatId = '0';
  // isNonThreatFlag: boolean = false;
  //
  // logActualResult: boolean = false;
  // isStopThreat: boolean = false;
  betaTestMode: boolean;
  primaryGuardMode: boolean;
  primaryDevice: boolean;
  primaryTablet = false;
  noThreatIndication = false;
  playSoundAlert = false;
  timeoutId: any;

  form: FormGroup;
  formcontrol: FormControl;

  intervalId: NodeJS.Timeout;
  livetime: Date;

  connectedDevices: IDevice[] = [];
  connectedDevicesMap = new Map();

  typeOfWeapon = [
    { item: 'No weapon', value: 'No weapon' },
    { item: 'Handgun', value: 'Handgun' },
    { item: 'Rifle', value: 'Rifle' },
    { item: 'Pipe Bomb', value: 'Pipebomb' },
    { item: 'Knife', value: 'Knife' },
    { item: 'Threat', value: 'Threat' },
    { item: 'Generic Anomaly', value: 'Generic Anomaly' },
    { item: 'Cellphone', value: 'Cellphone' },
    { item: 'Keys', value: 'Keys' }
  ];

  threatTypes = [
    { item: 'Alarm', value: 'Alarm' },
    { item: 'No Alarm', value: 'No Alarm' }
  ];

  threatLocations = [
    { item: 'Upper Front', value: 'Upper Front' },
    { item: 'Upper Back', value: 'Upper Back' },
    { item: 'Lower Front', value: 'Lower Front' },
    { item: 'Lower Back', value: 'Lower Back' },
    { item: 'Right Hip Front, Back', value: 'Right Hip Front, Back' },
    { item: 'Left Hip Front, Back', value: 'Left Hip Front, Back' },
    { item: 'Right Arm Front, Back', value: 'Right Arm Front, Back' },
    { item: 'Left Arm Front, Back', value: 'Left Arm Front, Back' },
    { item: 'Right Upper Leg Front, Back', value: 'Right Upper Leg Front, Back' },
    { item: 'Right Lower Leg Front, Back', value: 'Right Lower Leg Front, Back' },
    { item: 'Left Upper Leg Front, Back', value: 'Left Upper Leg Front, Back' },
    { item: 'Left Lower Leg Front, Back', value: 'Left Lower Leg Front, Back' },
    { item: 'Right Hip Front, Front', value: 'Right Hip Front, Front' },
    { item: 'Left Hip Front, Front', value: 'Left Hip Front, Front' },
    { item: 'Right Arm Front, Front', value: 'Right Arm Front, Front' },
    { item: 'Left Arm Front, Front', value: 'Left Arm Front, Front' },
    { item: 'Right Upper Leg Front, Front', value: 'Right Upper Leg Front, Front' },
    { item: 'Right Lower Leg Front, Front', value: 'Right Lower Leg Front, Front' },
    { item: 'Left Upper Leg Front, Front', value: 'Left Upper Leg Front, Front' },
    { item: 'Left Lower Leg Front, Front', value: 'Left Lower Leg Front, Front' }
  ];


  threatLocationsCoordinates_hexwave = {
    'Upper Front': { 'Front-x': 85, 'Front-y': 145, 'Back-x': 0, 'Back-y': 0, 'Front': 'R1-hexwave', 'Back': '' },
    'Lower Front': { 'Front-x': 166, 'Front-y': 387, 'Back-x': 0, 'Back-y': 0, 'Front': 'R2-hexwave', 'Back': '' },
    'Upper Back': { 'Front-x': 0, 'Front-y': 0, 'Back-x': 85, 'Back-y': 145, 'Front': '', 'Back': 'R11-hexwave' },
    'Lower Back': { 'Front-x': 0, 'Front-y': 0, 'Back-x': 164, 'Back-y': 392, 'Front': '', 'Back': 'R12-hexwave' },
    'Right Hip Front': { 'Front-x': 108, 'Front-y': 380, 'Back-x': 222, 'Back-y': 390, 'Front': 'R3-hexwave', 'Back': 'R4-hexwave' },
    'Left Hip Front': { 'Front-x': 221, 'Front-y': 380, 'Back-x': 108, 'Back-y': 390, 'Front': 'R4-hexwave', 'Back': 'R3-hexwave' },
    'Left Arm Front': { 'Front-x': 270, 'Front-y': 188, 'Back-x': 0, 'Back-y': 188, 'Front': 'R6-hexwave', 'Back': 'R5-hexwave' },
    'Right Arm Front': { 'Front-x': 0, 'Front-y': 188, 'Back-x': 270, 'Back-y': 188, 'Front': 'R5-hexwave', 'Back': 'R6-hexwave' },
    'Left Upper Leg Front': { 'Front-x': 207, 'Front-y': 500, 'Back-x': 100, 'Back-y': 510, 'Front': 'R9-hexwave', 'Back': 'R7-hexwave' },
    'Left Lower Leg Front': { 'Front-x': 255, 'Front-y': 670, 'Back-x': 56, 'Back-y': 670, 'Front': 'R10-hexwave', 'Back': 'R8-hexwave' },
    'Right Upper Leg Front': { 'Front-x': 103, 'Front-y': 500, 'Back-x': 207, 'Back-y': 510, 'Front': 'R7-hexwave', 'Back': 'R9-hexwave' },
    'Right Lower Leg Front': { 'Front-x': 56, 'Front-y': 670, 'Back-x': 255, 'Back-y': 670, 'Front': 'R8-hexwave', 'Back': 'R10-hexwave' },
  };

  threatLocationsCoordinates = {
    'Upper Front': { 'Front-x': 122, 'Front-y': 140, 'Back-x': 0, 'Back-y': 0, 'Front': 'R1-tsa', 'Back': '' },
    'Lower Front': { 'Front-x': 166, 'Front-y': 379, 'Back-x': 0, 'Back-y': 0, 'Front': 'R2-tsa', 'Back': '' },
    'Upper Back': { 'Front-x': 0, 'Front-y': 0, 'Back-x': 123, 'Back-y': 140, 'Front': '', 'Back': 'R14-tsa' },
    'Lower Back': { 'Front-x': 0, 'Front-y': 0, 'Back-x': 168, 'Back-y': 372, 'Front': '', 'Back': 'R13-tsa' },
    'Right Hip Front': { 'Front-x': 109, 'Front-y': 380, 'Back-x': 224, 'Back-y': 370, 'Front': 'R3-tsa', 'Back': 'R4-tsa' },
    'Left Hip Front': { 'Front-x': 225, 'Front-y': 380, 'Back-x': 109, 'Back-y': 370, 'Front': 'R4-tsa', 'Back': 'R3-tsa' },
    'Left Arm Front': { 'Front-x': 270, 'Front-y': 203, 'Back-x': 30, 'Back-y': 203, 'Front': 'R6-tsa', 'Back': 'R5-tsa' },
    'Right Arm Front': { 'Front-x': 30, 'Front-y': 203, 'Back-x': 269, 'Back-y': 203, 'Front': 'R5-tsa', 'Back': 'R6-tsa' },
    'Left Upper Leg Front': { 'Front-x': 210, 'Front-y': 500, 'Back-x': 110, 'Back-y': 490, 'Front': 'R9-tsa', 'Back': 'R7-tsa' },
    'Left Lower Leg Front': { 'Front-x': 245, 'Front-y': 670, 'Back-x': 75, 'Back-y': 670, 'Front': 'R10-tsa', 'Back': 'R8-tsa' },
    'Right Upper Leg Front': { 'Front-x': 109, 'Front-y': 500, 'Back-x': 208, 'Back-y': 490, 'Front': 'R7-tsa', 'Back': 'R9-tsa' },
    'Right Lower Leg Front': { 'Front-x': 74, 'Front-y': 670, 'Back-x': 243, 'Back-y': 670, 'Front': 'R8-tsa', 'Back': 'R10-tsa' },
  };

  logactualthreat: Logactualthreat[] = [];
  logactualresultdata: Logactualthreat[] = [];
  rowwisedata: number[] = [];
  islogdataEnabled: boolean[] = [];
  scancount = 0;
  scancountstring = '000000';
  public algorithmsTag: string;

  noteThreatId = '';

  note = '';

  enableSaveFlag = false;

  private isScanStoppedSubscription: Subscription;

  scheduleExecution() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(this.timerExecution.bind(this), environment.timerThreatConfigInterval); // 60000 milliseconds = 1 minute
  }

  timerExecution() {
    if (!this.isThreatFlag) {
      this.defaultSettings();
      this.showObjects({}, false);
      this.totalalarms = 0;
      this.scanresult = '--';
      this.selectedThreatStatusImage = '';
      $('.canvas_wrapper').attr('style', 'border-color: #939594;');
      $('.btn_clear').attr('style', 'background: #f5f5f5;');
      $('.btn_clear').prop('disabled', true);

      $('.threat-act').each(function () {
        $(this).parent().attr('style', 'background: #f8f8f8; cursor: pointer');
      });

      $('#dv_log').hide();
    }
  }

  threatProcessed() {
    this.acms.push(this.acm);
    this.currentThreatId = this.acm.id;

    const iact: IActivityMonitoring = this.addThreats('', '', this.acm, false);
    this.iactivity.push(iact);

    if (!this.isThreatFlag) {
      this.updateSeenandClearStatus(this.acm.id, false);
      this.showObjects(this.acm, true);

      this.checkPrimaryGuardMode(this.acm);

      if (!this.acm.screenerMessage) {
        if (this.scanCountBasis === 'All') {
          this.scancount++;
          localStorage.setItem('scanCount', JSON.stringify({ number: Number(this.scancount) }));
          this.scancountstring = this.scancount.toString().padStart(6, '0');
        }
        else if (this.scanCountBasis !== 'All' && !this.acm.personIn) {
          this.scancount++;
          localStorage.setItem('scanCount', JSON.stringify({ number: Number(this.scancount) }));
          this.scancountstring = this.scancount.toString().padStart(6, '0');
        }
      }

      this.spinnerService.hide();
    }
  }

  checkPrimaryGuardMode(iact: IActivityMonitoring) {
    this.setActivityInLogControls('', '');

    if (this.isThreatFlag) {
      $('#dv_recentActivity').hide();
    } else {
      $('#dv_recentActivity').show();
    }

    console.log('this.isThreatFlag: ' + this.isThreatFlag);
  }

  checkBetaTestMode(iact: IActivityMonitoring) {
    if (iact.objectDetected) {
      $('#dv_log').show();
      $('.btn_logactual').attr('style', 'background: #143345;');
      $('.btn_logactual').prop('disabled', false);
      $('#dv_recentActivityThreat').hide();
    }
    this.setActivityInLogControls('', '');
  }

  // Use this methods to send message back to server
  sendAction() {
    console.log('Sending message');
    // this.messagingService.send('/server-receiver', {
    //   text: 'Threat activity',
    //   text2: 'Threat activity acknolodgement'
    // });
  }

  filterDeployments(filter: string) {
    setTimeout(() => {
      // this.dataSource = new MatTableDataSource<IActivity>((this.iactivity.length >= 5 ? this.iactivity.slice(0, 5) : this.iactivity));
      this.dataSource = new MatTableDataSource<IActivity>(this.iactivity);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.receivedFilterSubscription) {
      this.receivedFilterSubscription.unsubscribe();
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  ngOnInit() {
    this.isScanStoppedSubscription = this.shareDataService.getisScanningStopped().subscribe(val => {
      this.isScanStopped = val;
      if (this.isScanStopped) {
        console.log('Scanning is stopped.');
        // Perform any other actions you want when scanning is stopped.
      }
      else {
        clearInterval(this.startCallTimer);
        clearInterval(this.stopCallTimer);

        this.intervalId = setInterval(() => {
          this.livetime = new Date();
        }, 1000);

      }
    });

    this.systemInformationForm = this.fb.group({
      ALGORITHMS_IMAGE_TAG: ['']
    });

    this.getdata('hexwave.cfg');

    this.frontimage.src = '../../assets/images/Frontbodyfinal_' + this.shareDataService.getAvtarImage() + '.png';
    this.backimage.src = '../../assets/images/Backbodyfinal_' + this.shareDataService.getAvtarImage() + '.png';
    this.threatLocationsCoordinates = (this.shareDataService.getAvtarImage() === 'hexwave' ?
      this.threatLocationsCoordinates_hexwave : this.threatLocationsCoordinates);

    this.scanCountBasis = this.shareDataService.getScanCountBasis();



    this.userSettingService.getUserSetting('global_setting').subscribe(res => {
      const iUserSetting: IUserSetting = res['data'].filter(a => a.locationId = '1')[0];

      // this.isStopThreat = iUserSetting.stopThreatUpdate;
      this.betaTestMode = this.shareDataService.getBetaTestMode();
      this.primaryGuardMode = iUserSetting.primaryGuardMode;
      this.primaryDevice = iUserSetting.primaryDevice;
      this.noThreatIndication = (iUserSetting.noThreatIndication === 'minimal' ? true : false);
      this.playSoundAlert = iUserSetting.playSoundAlert;
      this.getPrimaryTabletFlag();
      console.log('betaTestMode: ' + this.betaTestMode);
      console.log('primaryGuardMode: ' + this.primaryGuardMode);

      this.timerFlag = true;

      this.defaultSettings();
      setTimeout(() => {
        this.showObjects({}, false);

      }, 1000);
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });
    /////////
    // $(".activityRightPanel").css("height",window.innerHeight);alert(window.innerHeight)

    this.deviceService.getDevices().subscribe(res => {
      if (res['status'] === 200) {
        this.devices = res['data'];
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });
  }


  getdata(fileName: string) {
    this.systeminformationService.getSystemInformation(fileName).subscribe(res => {
      if (res) {
        this.iKeySystemInfo = res;
        for (const element of this.iKeySystemInfo) {
          if (element.key === 'ALGORITHMS_IMAGE_TAG') {
            this.algorithmsTag = element.value;
            // console.log('algorithmsTag:', this.algorithmsTag);
          }
        }
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });
  }

  selectActivity(id) {
    const iactivityMonitoring: IActivityMonitoring[] = this.acms.filter(a => a.id === id);

    this.showObjects(iactivityMonitoring[0], true);
    this.timerFlag = true;

    this.highlightActivity(id);
  }

  addThreats(contextFront, context, acm: IActivityMonitoring, showThreat: boolean) {
    const threatIconI = ActivityConstants.noImageIcon;

    const dateI = this.format(parseInt(acm.creationTimestamp, 10), 'MM/dd/yyyy');
    const timeI = this.format(parseInt(acm.creationTimestamp, 10), 'HH:mm:ss');

    this.statusI = '--';
    this.threatTypeI = '--';
    this.gate = '';
    this.lane = '';
    this.totalalarmsI = 0;

    // fulldisplay
    if (acm.noThreatConfig !== undefined) {
      if (acm.objectDetected !== undefined && acm.objectDetected === false) {
        this.statusI = ActivityConstants.statusOk;
        this.threatTypeI = ActivityConstants.threatNoObject;
        this.threatIconI = ActivityConstants.smallNoThreatIcon;
        this.selectedThreatStatusImageI = ActivityConstants.largeNoThreatIcon;
        this.scanresultI = 'CLEAR';
        if (!this.isThreatFlag) {
          $('.btn_clear').attr('style', 'background: #f5f5f5;');
          $('.btn_clear').prop('disabled', true);
        }

        if (showThreat) {
          this.drawBorder(context, ActivityConstants.noThreat);
          if (this.betaTestMode && !acm.personIn) {
            $('#dv_log').show();
            $('.btn_logactual').attr('style', 'background: #143345;');
            $('.btn_logactual').prop('disabled', false);
            $('#dv_recentActivityThreat').hide();
          }
        }
      } else {
        const { anomalies, threats } = acm;

        const allThreats = [];
        for (const value of Object.values({ ...anomalies, ...threats })) {
          if (Array.isArray(value) && value.length) {
            allThreats.push(...value);
          }
        }
        this.scanresultI = 'ALARM PRESENT';
        this.totalalarmsI = allThreats.length;
        // this.totalalarmsI = acm.numberOfObjectDetected;

        this.statusI = ActivityConstants.statusAnomalies;
        this.threatTypeI = ActivityConstants.threatAnomaly;
        this.threatIconI = ActivityConstants.smallAnomalyIcon;
        this.selectedThreatStatusImageI = ActivityConstants.largeAnomalyIcon;
        this.showThreats(showThreat, contextFront, context, acm, allThreats, ActivityConstants.anomaly,
          ActivityConstants.statusOk, ActivityConstants.smallAnomalyIcon, ActivityConstants.largeAnomalyIcon,
          ActivityConstants.threatCellphone);
      }
    }

    if (!this.isThreatFlag) {
      this.date = dateI;
      this.time = timeI;

      this.threatIcon = this.threatIconI;

      this.totalalarms = this.totalalarmsI;
      this.scanresult = this.scanresultI;

      this.status = this.statusI;
      this.threatType = this.threatTypeI;
      this.selectedThreatStatusImage = this.selectedThreatStatusImageI;
    }

    const iact: Activity = new Activity(acm.id, this.statusI, timeI, this.threatIconI, acm.creationTimestamp, this.threatTypeI);
    return iact;
  }

  showThreats(showThreat: boolean, contextFront, context, acm: IActivityMonitoring, threatLocationarray: string[],
    threat: string, statusThreat: string, smallThreatIcon: string, largeThreatIcon: string, threatType: string) {
    if (!this.isThreatFlag) {
      this.statusI = statusThreat;
      this.threatTypeI = threatType;
      this.threatIconI = smallThreatIcon;
      this.selectedThreatStatusImageI = largeThreatIcon;
    }

    this.gate = 'North Entrance';
    this.lane = 'One';

    if (showThreat) {
      this.drawBorder(context, threat);
    }

    if (!this.noThreatIndication) {
      const configLowerCase = this.acm.noThreatConfig.toLowerCase();
      const fullDisplay = ActivityConstants.fullDisplay;

      const threatLocations = threatLocationarray.filter(location => location !== '');
      const locationsToDraw = threatLocations
        .map(location => location.split(','))
        .filter(([name]) => name in this.threatLocationsCoordinates)
        .map(([name, side]) => {
          const location = this.threatLocationsCoordinates[name];
          if (side) {
            side = side.trim();
            const contextStr = side === 'Front' ? contextFront : context;
            return { context: contextStr, x: location[side + '-x'], y: location[side + '-y'], r: location[side] };
          } else {
            const position = name.split(' ')[1];
            const contextStr = position === 'Front' ? contextFront : context;
            return { context: contextStr, x: location[position + '-x'], y: location[position + '-y'], r: location[position] };
          }
        });

      if (showThreat && configLowerCase === fullDisplay) {
        this.drawArc(locationsToDraw);
      }
    }
  }

  playSound() {
    if (this.audio && this.playSoundAlert && this.router.url === '/admin/activitymonitoring') {
      this.audio.currentTime = 0;
      this.audio.play();
    }
  }

  highlightActivity(id) {
    $('.threat-act').each(function () {
      $(this).parent().attr('style', 'background: #f8f8f8; cursor: pointer');
    });

    // $("#img-"+id).attr("style", "background: #e0e0e0; cursor: pointer");
    $('#' + id).parent().attr('style', 'background: #e0e0e0; cursor: pointer');
  }

  setContext(acm: IActivityMonitoring, canvas, context, bodyImage: string, showThreat: boolean, contextFront) {
    const source = new Image();
    source.crossOrigin = 'Anonymous';

    source.onload = () => {
      canvas.height = source.height;
      canvas.width = source.width;
      context.drawImage(source, 0, 0);

      if (showThreat) {
        this.addThreats(contextFront, context, acm, true);
      }

      this.spinnerService.hide();
    };

    source.src = bodyImage;
    this.scheduleExecution();
  }

  showObjects(acm: IActivityMonitoring, showThreat: boolean) {
    const cx = document.createElement('CANVAS'); // Unit test purpose

    const canvasFront = (this.canvasRefFront === undefined ? cx : this.canvasRefFront.nativeElement);
    const contextFront = canvasFront.getContext('2d');

    const canvasBack = (this.canvasRefBack === undefined ? cx : this.canvasRefBack.nativeElement);
    const contextBack = canvasBack.getContext('2d');

    this.setContext(acm, canvasFront, contextFront, this.frontimage.src, false, null);
    this.setContext(acm, canvasBack, contextBack, this.backimage.src, showThreat, contextFront);
  }

  drawArc(locationsToDraw) {
    for (let i = 0; i < locationsToDraw.length; i++) {
      const context = locationsToDraw[i].context;
      const x = locationsToDraw[i].x;
      const y = locationsToDraw[i].y;
      const r = locationsToDraw[i].r;

      const borderImage = ActivityConstants.getThreatActivityCircle(r);
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        context.drawImage(img, x, y);
      };
      img.src = borderImage;
    }
  }

  drawBorder(context, threatType) {
    const canvasWrapper = document.querySelector('.canvas_wrapper') as HTMLElement;
    if (threatType === ActivityConstants.noThreat) {
      canvasWrapper.style.borderColor = '#6ce017';
    } else {
      canvasWrapper.style.borderColor = '#E01717';
    }
  }

  defaultSettings() {
    this.threatIcon = ActivityConstants.noImageIcon;
    this.selectedThreatStatusImage = ActivityConstants.noImageIcon;
    this.date = '--';
    this.time = '--';

    this.status = '--';
    this.threatType = '--';
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

  continueActivity(type) {
    const wrapper = $('.canvas_wrapper');
    const threatActs = $('.threat-act');

    this.isThreatFlag = false;
    // clear the interval if the conditions are no longer met
    clearInterval(this.startCallTimer);
    this.startCallTimer = null;
    clearInterval(this.stopCallTimer);
    this.stopCallTimer = null;

    localStorage.setItem('isthreatflag', JSON.stringify({ boolean: this.isThreatFlag }));
    this.audio.pause();

    if (type === 1) {
      const status = {
        left_mac_address: this.acm.devices[0],
        right_mac_address: this.acm.devices[1],
        status: 'THREAT_DISPLAY_END'
      };

      this.sendstatustobothdevice(status);
      this.defaultSettings();
      this.showObjects({}, false);

      wrapper.css('border-color', '#939594');
      threatActs.parent().css('background', '#f8f8f8').css('cursor', 'pointer');

      $('#dv_log').hide();
      $('.btn_clear').css('background', '#f5f5f5').prop('disabled', true);
      $('#dv_recentActivityThreat').show();
      this.totalalarms = 0;
      this.scanresult = '--';
      this.startCall();
      this.updateSeenandClearStatus(this.currentShownToUserThreatId, true);
    } else {
      if (!(this.acm.anomalies.genericAnomaly || this.acm.anomalies.cellphone || this.acm.anomalies.keys) && this.acm.objectDetected) {
        this.isThreatFlag = true;
        localStorage.setItem('isthreatflag', JSON.stringify({ boolean: this.isThreatFlag }));
      }

      $('#dv_confirm, #dv_actual_logs').hide();
      $('#dv_rcact, #dv_recentActivityThreatOverlay').css('background-color', '#f8f8f8');

      this.enableSave(false);
      // this.startCall();
    }
  }

  sendstatustobothdevice(status) {
    let deviceMacAddress = '';
    if (this.acm.personIn != null && this.acm.devices[0]) {
      deviceMacAddress = this.acm.devices[0];
    } else if (this.acm.personIn != null && this.acm.devices[1]) {
      deviceMacAddress = this.acm.devices[1];
    }

    if (deviceMacAddress !== '' && this.devices.filter(x => x.macAddress === deviceMacAddress).length > 0) {
      const laneid = this.devices.filter(x => x.macAddress === deviceMacAddress)[0].laneId;
      let devices: IDevice[] = [];

      if (laneid === 0 || !laneid) {
        devices = this.devices.filter(x => x.macAddress === deviceMacAddress);
      } else {
        devices = this.devices.filter(x => x.laneId === laneid);
      }

      devices.forEach(device => {
        this.deviceDetectService.sendStatus(device.ipAddress, status).subscribe(res => {
          console.log(res);
        },
          err => {
            console.log('Error occurred: ' + err.message);
          });
      });
    }
  }

  showLogSection() {
    this.enableSaveFlag = true;
    this.rowwisedata = [];
    this.logactualresultdata = [];
    this.islogdataEnabled = [];
    this.noteThreatId = this.currentThreatId;
    $('#dv_rcact').css('background-color', 'cyan');
    $('#dv_confirm').show();
    $('#dv_actual_logs').show();
    $('#dv_recentActivityThreatOverlay').show();

    const logthreat = this.acms.filter(a => a.id === this.currentThreatId)[0];
    this.logactualthreat = [];

    if (logthreat.objectDetected !== undefined && logthreat.objectDetected === false) {
      const threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      threat.location = [];
      threat.weapon = '';
      threat.threattype = 'No Alarm';
      this.logactualthreat.push(threat);
    }

    if (logthreat.anomalies.cellphone !== null && logthreat.anomalies.cellphone.length > 0) {
      const threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      threat.location = logthreat.anomalies.cellphone;
      threat.weapon = 'Cellphone';
      threat.threattype = 'Alarm';
      this.logactualthreat.push(threat);
    }

    // keys
    if (logthreat.anomalies.keys !== null && logthreat.anomalies.keys.length > 0) {
      const threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      threat.location = logthreat.anomalies.keys;
      threat.weapon = 'Keys';
      threat.threattype = 'Alarm';
      this.logactualthreat.push(threat);
    }

    // anomalies
    if (logthreat.anomalies.genericAnomaly !== null && logthreat.anomalies.genericAnomaly.length > 0) {
      const threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      threat.location = logthreat.anomalies.genericAnomaly;
      threat.weapon = 'Anomaly';
      threat.threattype = 'Alarm';
      this.logactualthreat.push(threat);
    }

    // Handgun
    if (logthreat.threats.handgun !== null && logthreat.threats.handgun.length > 0) {
      const threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      threat.location = logthreat.threats.handgun;
      threat.weapon = 'Handgun';
      threat.threattype = 'Alarm';
      this.logactualthreat.push(threat);
    }

    // Rifle
    if (logthreat.threats.rifle !== null && logthreat.threats.rifle.length > 0) {
      const threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      threat.location = logthreat.threats.rifle;
      threat.weapon = 'Rifle';
      threat.threattype = 'Alarm';
      this.logactualthreat.push(threat);
    }

    // pipes
    if (logthreat.threats.pipeBomb !== null && logthreat.threats.pipeBomb.length > 0) {
      const threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      threat.location = logthreat.threats.pipeBomb;
      threat.weapon = 'Pipebomb';
      threat.threattype = 'Alarm';
      this.logactualthreat.push(threat);
    }

    // knife
    if (logthreat.threats.knife !== null && logthreat.threats.knife.length > 0) {
      const threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      threat.location = logthreat.threats.knife;
      threat.weapon = 'Knife';
      threat.threattype = 'Threat';
      this.logactualthreat.push(threat);
    }

    // Threat
    if (logthreat.threats.genericThreat !== null && logthreat.threats.genericThreat.length > 0) {
      const threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      threat.location = logthreat.threats.genericThreat;
      threat.weapon = 'Generic Threat';
      threat.threattype = 'Threat';
      this.logactualthreat.push(threat);
    }

    for (let i = 0; i < this.logactualthreat.length; i++) {
      const threat: Logactualthreat = { isactual: false, threattype: '', weapon: '', location: [] };
      this.logactualresultdata.push(threat);
      this.islogdataEnabled.push(true);
    }

    // this.setActivityInLogControls("","");
    if (!this.acm.anomalies.genericAnomaly && !this.acm.anomalies.cellphone && !this.acm.anomalies.keys && this.acm.objectDetected) {
      this.isThreatFlag = true;
    }
    // this.stopCall();
  }

  addNote() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = this.note;
    const dialogRef = this.dialog.open(AddnoteComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.note = result;
      if (result !== '') {
        $('#btnContinue').css('background', 'cyan');
      } else {
        $('#btnContinue').css('background', '#ffffff');
      }
    });
  }

  setActivityInLogControls(weaponType, location) {
    // if (weaponType != "") {
    this.form.patchValue({
      r_result: 1,
      threatType: '',
      weaponType: weaponType,
      threatLocation: location // ,
      // note: "test"
    });
    // }
  }

  setDefaultActivityInLogControls(weaponType, location) {
    // if (weaponType != "") {
    this.form.patchValue({
      // r_result: 1,
      threatType: '',
      weaponType: weaponType,
      threatLocation: location // ,
      // note: "test"
    });
    // }
  }

  saveLog() {
    const logthreattype: string[] = [];
    const logweapon: string[] = [];
    const loglocation: string[] = [];
    const logisactual = this.logactualresultdata.filter(x => x.isactual === true).length > 0 ? false : true;

    this.logactualresultdata.forEach(({ threattype, location, weapon }) => {
      if (threattype) { logthreattype.push(threattype); }
      if (location) { loglocation.push(location.toString()); }
      if (weapon) { logweapon.push(weapon); }
    });

    if (this.enableSaveFlag) {
      const gatelogObject = {
        actualResult: logisactual,
        deviceMacAddress: '12345678',
        gateName: this.acm.gateName,
        laneName: this.acm.laneName,
        note: this.note,
        threatLocation: loglocation.join(', '),
        threatType: logthreattype.join(', '),
        userName: this.shareDataService.email,
        typeOfWeapon: logweapon.join(', '),
        threatConfigId: this.noteThreatId
      };

      this.threatLogService.saveThreatLog(gatelogObject).subscribe(res => {
        this.spinnerService.show();

        this.iactivity[this.iactivity.length - 1].actualResult = logisactual;
        this.filterDeployments('');
        this.spinnerService.hide();

        this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
          this.notificationService.showNotification('Logs saved successfully', 'top', 'center', '', 'info-circle');
        });
      },
        err => {
          console.log('Error occurred: ' + err.message);
          this.spinnerService.hide();

          if (err['status'] === 500) {
            this.translate.get('msgInternalError').subscribe((text: string) => {
              this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
            });
          } else {
            this.notificationService.showNotification('Error occurred: ' + err.message, 'top', 'center', 'danger', 'info-circle');
          }
        });

      this.enableSave(false);
      $('.btn_logactual').attr('style', 'background: #f5f5f5;');
      $('.btn_logactual').prop('disabled', true);
      $('#dv_confirm, #dv_actual_logs').hide();
      $('#dv_rcact, #dv_recentActivityThreatOverlay').css('background-color', '#f8f8f8');
    }
  }

  onselectthreattype(value, row, type) {
    if (type === 'threattype') {
      this.logactualresultdata[row].threattype = value.toString();
    }
    if (type === 'weapon') {
      this.logactualresultdata[row].weapon = value.toString();
    }
    if (type === 'location') {
      this.logactualresultdata[row].location = value.toString();
    }
    if (type === 'actualresult') {
      this.logactualresultdata[row].isactual = value;
      this.islogdataEnabled[row] = !value;
    }
  }
  enableSave(enable: boolean) {
    this.enableSaveFlag = enable;
    this.note = '';
    $('#btnContinue').css('background', '#ffffff');

    if (enable) {
      $('#btnConfirm').css('background-color', '#143345');
      $('#btnConfirm').css('color', '#ffffff');
      $('#weaponType').css('background-color', '#b7b7b7');
      $('#threatLocation').css('background-color', '#b7b7b7');
      $('#threatType').css('background-color', '#b7b7b7');
    } else {
      $('#btnConfirm').css('background-color', '#8292A0');
      $('#btnConfirm').css('color', '#707070');
      $('#weaponType').css('background-color', '#ffffff');
      $('#threatLocation').css('background-color', '#ffffff');
      $('#threatType').css('background-color', '#ffffff');
    }
  }

  onResultSelectionChange(result): void {
    this.r_resultSelected = result;
    // console.log(result);
  }

  setConfirm() {
    if (this.form.controls['threatLocation'].value !== '' && this.form.controls['weaponType'].value !== '') {
      $('#btnConfirm').css('background-color', '#143345');
      $('#btnConfirm').css('color', '#ffffff');
      this.enableSaveFlag = true;
    } else {
      $('#btnConfirm').css('background-color', '#8292A0');
      $('#btnConfirm').css('color', '#707070');
      this.enableSaveFlag = false;
    }
  }

  startCall() {
    console.log('Start call');
    console.log(this.isThreatFlag);
    this.startService();
  }

  startService() {
    let deviceMacAddress = '';
    if (this.acm.devices[0]) {
      deviceMacAddress = this.acm.devices[0];
    } else if (this.acm.devices[1]) {
      deviceMacAddress = this.acm.devices[1];
    }

    if (deviceMacAddress !== '' && this.devices.filter(x => x.macAddress === deviceMacAddress).length > 0) {
      const laneid = this.devices.filter(x => x.macAddress === deviceMacAddress)[0].laneId;
      let devices: IDevice[] = [];

      if (laneid === 0 || !laneid) {
        devices = this.devices.filter(x => x.macAddress === deviceMacAddress);
      } else {
        devices = this.devices.filter(x => x.laneId === laneid);
      }

      devices.forEach(device => {
        this.threatLogService.startThreatMessage(device.ipAddress).subscribe(response => {
          console.log('Start call sent successfully');
        }, error => {
          console.log('Error occurred in Start call: ' + error.message);
        });
      });
    }
  }

  stopService() {
    let deviceMacAddress = '';
    if (this.acm.personIn != null && this.acm.devices[0]) {
      deviceMacAddress = this.acm.devices[0];
    } else if (this.acm.personIn != null && this.acm.devices[1]) {
      deviceMacAddress = this.acm.devices[1];
    }

    if (deviceMacAddress !== '' && this.devices.filter(x => x.macAddress === deviceMacAddress).length > 0) {
      const laneid = this.devices.filter(x => x.macAddress === deviceMacAddress)[0].laneId;
      let devices: IDevice[] = [];

      if (laneid === 0 || !laneid) {
        devices = this.devices.filter(x => x.macAddress === deviceMacAddress);
      } else {
        devices = this.devices.filter(x => x.laneId === laneid);
      }

      devices.forEach(device => {
        this.threatLogService.stopThreatMessage(device.ipAddress).subscribe(res => {
          console.log('Stop call sent successfully');
        }, error => {
          console.log('Error occurred in Stop call: ' + error.message);
        });
      });
    }
  }

  getPrimaryTabletFlag() {
    this.leftPairedDevice = localStorage.getItem("leftPairedDevice");
    this.rightPairedDevice = localStorage.getItem("rightPairedDevice");

    this.tabletService.getTablets().subscribe(res => {//alert(JSON.stringify(res["data"]))
      if (res["data"] != undefined) {
        res["data"].forEach(t => {
          if (t.devices.filter(d => d.ipAddress == this.leftPairedDevice || d.ipAddress == this.rightPairedDevice)) {
            this.tabletDeviceAssociated = true;
          }
        });
      }

      const prTab = res['data'].filter(a => a.tabletMacAddress === this.shareDataService.email);
      if (prTab !== undefined && JSON.stringify(prTab) !== '[]') {
        this.primaryTablet = prTab[0]['primaryTablet'];
        this.isTabletAssociatedWithDevices = (prTab[0].devices.filter(t => t.ipAddress == this.leftPairedDevice || t.ipAddress == this.rightPairedDevice).length > 0 ? true : false);
      }
      console.log('primaryTablet: ' + this.primaryTablet);

      if (this.primaryDevice === true
        && (this.leftPairedDevice !== null && this.rightPairedDevice !== null) && this.isTabletAssociatedWithDevices === true) {
        this.isShowScreenerMessage = true;
      }
      else if (this.primaryDevice === false) {
        this.isShowScreenerMessage = true;
      }
      else {
        this.isShowScreenerMessage = false;
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });
  }

  showlogdetail(threatid) {
    this.spinnerService.show();
    const threatdetail = this.acms.filter(a => a.id === threatid)[0];

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = threatdetail;
    const dialogRef = this.dialog.open(LogdetailsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigateByUrl('/admin/activitymonitoring');
    });
  }

  sendDisplayStart(iact: IActivityMonitoring, threaFlag: boolean) {
    // Send status updates
    console.log(threaFlag + ' THREAT_DISPLAY_START');
    if (iact.devices && threaFlag && this.router.url === '/admin/activitymonitoring') {
      const status: IDeviceDetect = {
        left_mac_address: iact.devices[0] || '',
        right_mac_address: iact.devices[1] || '',
        status: 'THREAT_DISPLAY_START'
      };

      // Send status update immediately
      this.sendstatustobothdevice(status);

      // Set the timer to run again after the specified interval
      this.startCallTimer = setTimeout(() => this.sendDisplayStart(iact, JSON.parse(localStorage.getItem('isthreatflag'))['boolean']),
        environment.stopCallInterval);
    } else {
      clearInterval(this.startCallTimer);
    }
    console.log(threaFlag);
  }

  stopCall(threaFlag: boolean) {
    if (threaFlag && this.router.url === '/admin/activitymonitoring') {
      // Stop Call
      console.log(threaFlag + ' Stop call');

      // Send status update immediately
      this.stopService();

      // Assign the setInterval function to myVar
      this.stopCallTimer = setTimeout(() => this.stopCall(JSON.parse(localStorage.getItem('isthreatflag'))['boolean']),
        environment.stopCallInterval);

    } else {
      clearInterval(this.stopCallTimer);
    }
    console.log(threaFlag);
  }

  resetscancount() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'custom-dialog-container';
    const dialogRef = this.dialog.open(ResetcountalertComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.scancount = JSON.parse(localStorage.getItem('scanCount'))['number'];
      this.scancountstring = this.leftPad(this.scancount, 6);
    });
  }

  leftPad(number, targetLength) {
    let output = number + '';
    while (output.length < targetLength) {
      output = '0' + output;
    }
    return output;
  }

  updateSeenandClearStatus(threatId: string, clear: boolean) {
    if (this.router.url === '/admin/activitymonitoring') {
      this.currentShownToUserThreatId = threatId;

      this.threatActivityService.setThreatGuardInfo(threatId, this.shareDataService.id, clear, new Date().getTime()).subscribe(res => {
      },
        err => {
          console.log('Error occurred: ' + err.message);
        });
    }
  }

  devicesIP() {
    this.connectedDevices = [];
    this.connectedDevicesMap = new Map();
    // this.threatActivityService.getThreatActivities(sessionStorage.getItem('LOCAL_IP')).subscribe(res => {
    this.threatActivityService.getThreatActivities(this.shareDataService.email).subscribe(res => {
      try {
        if (res['data']['#result-set-3'].length !== 0) {
          this.connectedDevices = res['data']['#result-set-3'];

          this.connectedDevices.forEach(device => {
            this.connectedDevicesMap.set(device['mac_address'], device.side);
          });
        }
      } catch {
        this.spinnerService.hide();
      }
    },
    );
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength);
    }
    return text;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    // $event.returnValue = true; // This will show a browser confirmation dialog
    // console.log($event);
    localStorage.setItem('rkaStop', 'false');
  }

  screenerMessageSettings() {
    this.defaultSettings();
    this.showObjects({}, false);
    this.totalalarms = 0;
    this.scanresult = '--';
    this.selectedThreatStatusImage = '';
    $('.canvas_wrapper').attr('style', 'border-color: #939594;');
    $('.btn_clear').attr('style', 'background: #f5f5f5;');
    $('.btn_clear').prop('disabled', true);

    $('.threat-act').each(function () {
      $(this).parent().attr('style', 'background: #f8f8f8; cursor: pointer');
    });

    $('#dv_log').hide();
  }
}
