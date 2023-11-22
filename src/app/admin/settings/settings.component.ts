import { Component, EventEmitter, Output, ViewEncapsulation, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { MessagesMenuService, NotificationsMenuService, SideMenuService } from '../../core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { MatChipInputEvent } from '@angular/material/chips';
import { isPlatformBrowser } from '@angular/common';

import { UserSettingService } from '../../../assets/services/userSettingService';
import { IUserSetting } from '../../../assets/interfaces/iuser-setting';
import { NotificationService } from '../../../assets/services/notification.service';
import { ShareDataService } from '../../../assets/services/share-data.service';

import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const COMMA = 188;
const ENTER = 13;

const $ = require('jquery');

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings.component.html',
  styleUrls: ['./styles/settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SettingsPageComponent {
  notifications = [];
  messages = [];
  open_menu = false;
  selectedFile: File;

  iUserSetting: IUserSetting = {};
  noThreatConfig = [{ id: 'minimal', value: 'Minimal display' },
  { id: 'full', value: 'Full display' }];

  languages = [{ id: 'en-US', value: 'English' },
  { id: 'fr-FR', value: 'French' }];

  colors = [
    { id: 'green', value: 'Green' },
    { id: 'orange', value: 'Orange' },
    { id: 'blue', value: 'Blue' },
    { id: 'red', value: 'Red' }
  ];

  ctaColorNonThreatDrp = 'red';
  ctaColorAnomalyDrp = 'blue';
  ctaColorMetalThreatDrp = 'orange';
  ctaColorNonMetalThreatDrp = 'yellow';
  betaTestMode = false;
  primaryGuardMode = false;
  playSoundAlert = false;
  primaryDevice = false;
  sendThreats = false;
  alertFileAvailable = false;

  activeThreatForm = new FormGroup({
    noThreatIndicationDrp: new FormControl('minimal'),
    languageDrp: new FormControl('en-US'),
    ssidTxt: new FormControl(''),
    passwordTxt: new FormControl(''),
    userIdleTimeout: new FormControl(),
    timeUnit: new FormControl('minutes')
  });

  constructor(
    private http: HttpClient,
    private sideMenuService: SideMenuService,
    private notificationsMenuService: NotificationsMenuService,
    private messagesMenuService: MessagesMenuService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userSettingService: UserSettingService,
    private notificationService: NotificationService,
    private shareDataService: ShareDataService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang(shareDataService.getLabels());
    document.body.style.background = '#EBEBEB';

    notificationsMenuService.getNotifications().then((notifications: any) => {
      this.notifications = notifications;
    });
    messagesMenuService.getMessages().then((messages: any) => {
      this.messages = messages;
    });

    setTimeout(() => {
      // this.showObjects({}, false);

      // User settings
      this.getUserSettings();
      console.log('declare', this.betaTestMode);
    }, 1000);
  }



  getUserSettings() {
    this.userSettingService.getUserSetting('global_setting').subscribe(res => {
      this.iUserSetting = res['data']['0'];
      console.log(this.iUserSetting);
      this.setUserSettingVaules();
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });

    this.http.get(environment.apiGatewayUrl + '/api/setting/audio/alertSound', { responseType: 'blob' }).subscribe(
      (data: Blob) => {
        this.alertFileAvailable = true;
      },
      (error) => {
        this.alertFileAvailable = false;
        console.error('Error loading audio file:', error);
      }
    );
  }

  setUserSettingVaules() {
    this.ctaColorNonThreatDrp = this.iUserSetting.ctaColorNonThreat;
    this.ctaColorAnomalyDrp = this.iUserSetting.ctaColorAnomaly;
    this.ctaColorMetalThreatDrp = this.iUserSetting.ctaColorMetalThreat;
    this.ctaColorNonMetalThreatDrp = this.iUserSetting.ctaColorNonMetalThreat;
    this.betaTestMode = this.iUserSetting.betaTestMode;
    this.primaryGuardMode = this.iUserSetting.primaryGuardMode;
    this.sendThreats = this.iUserSetting.sendThreatsToHexwave;
    this.primaryDevice = this.iUserSetting.primaryDevice;
    this.playSoundAlert = this.iUserSetting.playSoundAlert;
    this.setCTAValues();

    this.activeThreatForm.patchValue({
      noThreatIndicationDrp: this.iUserSetting.noThreatIndication,
      // ctaColorNonMetalThreatDrp: this.iUserSetting.ctaColorNonMetalThreat,
      // ctaColorMetalThreatDrp: this.iUserSetting.ctaColorMetalThreat,
      // ctaColorNonThreatDrp: this.iUserSetting.ctaColorNonThreat,
      // ctaColorAnomalyDrp: this.iUserSetting.ctaColorAnomaly,
      ssidTxt: this.iUserSetting.apSSID,
      passwordTxt: this.iUserSetting.apPassword,
      languageDrp: this.iUserSetting.language,
      userIdleTimeout: this.iUserSetting.idleTimeout
    });

    if (this.iUserSetting.idleTimeout % 60 === 0) {
      this.activeThreatForm.patchValue({
        userIdleTimeout: this.iUserSetting.idleTimeout / 60
      });
      this.activeThreatForm.get('timeUnit').setValue('hours');
    }
  }

  onSubmit() {
    if (this.activeThreatForm.get('timeUnit').value === 'hours') {
      const userIdleTimeoutValue = this.activeThreatForm.get('userIdleTimeout').value;
      const convertedValue = userIdleTimeoutValue * 60;
      this.activeThreatForm.get('userIdleTimeout').setValue(convertedValue);
    }

    const userSettingObject = {
      id: this.shareDataService.email,
      locationId: '1',
      noThreatIndication: this.activeThreatForm.controls['noThreatIndicationDrp'].value,

      ctaColorNonMetalThreat: this.ctaColorNonMetalThreatDrp,
      ctaColorMetalThreat: this.ctaColorMetalThreatDrp,
      ctaColorNonThreat: this.ctaColorNonThreatDrp,
      ctaColorAnomaly: this.ctaColorAnomalyDrp,

      apSSID: this.activeThreatForm.controls['ssidTxt'].value,
      apPassword: this.activeThreatForm.controls['passwordTxt'].value,

      automaticEscalationTimeout: '', // Beta release

      language: this.activeThreatForm.controls['languageDrp'].value,
      activeMonitoringDisplayTimeout: '',
      deviceName: 'Tablet PC',
      calibrationData: '',
      presets: '',

      peopleCount: '',
      screenBrightness: '',
      expirationDate: '',
      betaTestMode: this.betaTestMode,
      primaryGuardMode: this.primaryGuardMode,
      sendThreatsToHexwave: this.sendThreats,
      primaryDevice: this.primaryDevice,
      playSoundAlert: this.playSoundAlert,
      idleTimeout: Math.max(this.activeThreatForm.controls['userIdleTimeout'].value, 10)
    };

    this.userSettingService.putUserSetting(userSettingObject).subscribe(res => {
      console.log(JSON.stringify(res));
      if (res['status'] === 201) {
        this.notificationService.showNotification('User settings updated successfully', 'top', 'center', '', 'info-circle');
        this.getUserSettings();
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
        this.notificationService.showNotification('Error occurred: ' + err.message, 'top', 'center', 'danger', 'info-circle');
      });
  }

  colorSelect(obj, id) {
    this.colors.forEach((dvId) => {
      $('#' + obj + dvId.id).removeClass('selected-color-dv');
    });

    $('#' + obj + id).addClass('selected-color-dv');

    switch (obj) {
      case 'ctaColorNonThreatDrp_':
        this.ctaColorNonThreatDrp = id;
        $('.ctaColorNonThreatDrp_popup').hide();
        break;
      case 'ctaColorAnomalyDrp_':
        this.ctaColorAnomalyDrp = id;
        $('.ctaColorAnomalyDrp_popup').hide();
        break;
      case 'ctaColorMetalThreatDrp_':
        this.ctaColorMetalThreatDrp = id;
        $('.ctaColorMetalThreatDrp_popup').hide();
        break;
      case 'ctaColorNonMetalThreatDrp_':
        this.ctaColorNonMetalThreatDrp = id;
        $('.ctaColorNonMetalThreatDrp_popup').hide();
        break;
    }
  }

  setCTAValues() {
    $('#ctaColorNonThreatDrp_' + this.ctaColorNonThreatDrp).addClass('selected-color-dv');
    $('#ctaColorAnomalyDrp_' + this.ctaColorAnomalyDrp).addClass('selected-color-dv');
    $('#ctaColorMetalThreatDrp_' + this.ctaColorMetalThreatDrp).addClass('selected-color-dv');
    $('#ctaColorNonMetalThreatDrp_' + this.ctaColorNonMetalThreatDrp).addClass('selected-color-dv');
  }

  showColorPopup(id) {
    $('.ctaColorNonThreatDrp_popup').hide();
    $('.ctaColorAnomalyDrp_popup').hide();
    $('.ctaColorMetalThreatDrp_popup').hide();
    $('.ctaColorNonMetalThreatDrp_popup').hide();
    $('.' + id).show();
    // $("."+id).animate({width: 200, marginLeft: 0}, {duration: 1000});
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile.type === 'audio/mpeg') {
      if (this.selectedFile.size > 200000) {
        alert('File size exceeds 200KB limit. Please select a smaller file.');
      } else {
        const audio = new Audio();
        audio.src = URL.createObjectURL(this.selectedFile);
        audio.onloadedmetadata = () => {
          if (audio.duration > 5) {
            alert('File duration exceeds 5 seconds. Please select a shorter file.');
          } else {
            // File is an MP3, within size and time limit, proceed with upload
            const formData = new FormData();
            formData.append('file', this.selectedFile);

            this.userSettingService.uploadAlertSound(formData).subscribe(res => {
              this.notificationService.showNotification('Alert Sound updated successfully', 'top', 'center', '', 'info-circle');
            },
              err => {
                console.log('Error occurred: ' + err.message);
                this.notificationService.showNotification('Error occurred: ' + err.message, 'top', 'center', 'danger', 'info-circle');
              });
          }
        };
      }
    } else {
      alert('Please select an MP3 file.');
    }
  }

  onKeyPress(event) {
    const keyCode = event.which || event.keyCode;
    if (keyCode === 46 || keyCode === 45) {
      // prevent input of "." and "-"
      event.preventDefault();
    }
    const inputValue = event.target.value;
    const nonDigitRegExp = new RegExp('[^\\d]', 'g');
    if (nonDigitRegExp.test(inputValue)) {
      // prevent input of non-digit characters
      event.preventDefault();
    }
    if (inputValue.length >= 2) {
      // prevent input of more than two digits
      event.preventDefault();
    }
  }

  betaMode($event) {
    console.log('.............event', $event, this.betaTestMode);
    this.betaTestMode = $event.checked;
    // environment.stopThreatUpdate = this.betaTestMode;
    // console.log('.............user setting', $event, this.stopThreatUpdate)
  }

  changePlaySoundAlert($event) {
    this.playSoundAlert = $event.checked;
  }

  primaryMode($event) {
    this.primaryGuardMode = $event.checked;
  }

  sendThreatsToHexawave($event) {
    this.sendThreats = $event.checked;
  }

  primaryDeviceMode($event) {
    this.primaryDevice = $event.checked;
  }
}
