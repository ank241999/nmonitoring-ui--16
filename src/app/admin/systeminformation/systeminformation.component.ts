import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { IKeySystemInfo, ISystemInfo } from '../../../assets/interfaces/isystemInfo';
import { NotificationService } from '../../../assets/services/notification.service';
import { SysteminformationService } from '../../../assets/services/systeminformation.service';
import { NgModule } from '@angular/core';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { environment } from '../../../environments/environment';
import { RebootComponent } from './reboot/reboot.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-systeminformation',
  templateUrl: './systeminformation.component.html',
  styleUrls: ['./systeminformation.component.scss']
})
export class SysteminformationComponent implements OnInit {

  constructor(
    private router: Router,
    private translate: TranslateService,
    private fb: FormBuilder,
    private systeminformationService: SysteminformationService,
    private notificationService: NotificationService,
    private shareDataService: ShareDataService,
    public dialog: MatDialog) {
    translate.setDefaultLang(shareDataService.getLabels());
  }
  public showInputField = true;
  leftdeviceName: string;
  rightdeviceName: string;
  leftdeviceIP: string;
  rightdeviceIP: string;
  viewMode = 'Tab1';
  id: any;
  iKeySystemInfo: IKeySystemInfo[];
  systemInformationForm: FormGroup;
  optSelected: string;
  ipPrimary: string;
  ipPrimaryName: string;
  iSystemInfo: ISystemInfo[];

  selectedDevices: string[] = [];

  ngOnInit() {
    this.systemInformationForm = this.fb.group({
      HEXWAVE_HOST_ID: [''],
      HEXWAVE_EXTERNAL_IP: [''],
      HEXWAVE_REPO: [''],
      PIPELINE_IMAGE_TAG: [''],
      BACKEND_IMAGE_TAG: [''],
      SIMULATOR_IMAGE_TAG: [''],
      LOGGING_IMAGE_TAG: [''],
      AI_IMAGE_TAG: [''],
      IMAGE_TAG: [''],
      HEXWAVE_HEALTHCHECK_DIAGNOSTIC_TAG: [''],
      ALGORITHMS_IMAGE_TAG: [''],
      DOWNLOAD_IMAGES: [''],
      CLIENT_INSTANCE_NAME: [''],
      HEXWAVE_HOST_ID_PAIRED: [''],
      HEXWAVE_EXTERNAL_IP_PAIRED: ['']
    });
    this.optSelected = '';
    this.getdata('hexwave.cfg');
    this.showInputField = !this.showInputField;
  }

  getPairedIp(ipAddress: string) {
    this.systeminformationService.getPairedIp(ipAddress).subscribe(res => {
      this.selectedDevices[0] = this.ipPrimaryName;
      this.selectedDevices[1] = this.ipPrimary;
      if (res['status'] === 200) {
        this.iSystemInfo = res['data'];
        let i = 2;
        this.iSystemInfo.forEach(element => {
          this.selectedDevices[i] = element.deviceIpName;
          this.selectedDevices[i + 1] = element.deviceIpAddress;
          i++;
        });
        this.leftdeviceName = this.selectedDevices[0];
        this.leftdeviceIP = this.selectedDevices[1];
        this.rightdeviceName = this.selectedDevices[2];
        this.rightdeviceIP = this.selectedDevices[3];

        if (this.iSystemInfo.length === 0) {
          this.rightdeviceName = 'NO DEVICE';
        }
        this.systemInformationForm.controls['HEXWAVE_HOST_ID_PAIRED'].setValue(this.rightdeviceName);
        this.systemInformationForm.controls['HEXWAVE_EXTERNAL_IP_PAIRED'].setValue(this.rightdeviceIP);
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
        this.iKeySystemInfo.forEach(element => {
          this.systemInformationForm.controls[element.key].setValue(element.value);
        });
        this.optSelected = this.systemInformationForm.controls['HEXWAVE_EXTERNAL_IP'].value;
        this.ipPrimary = this.systemInformationForm.controls['HEXWAVE_EXTERNAL_IP'].value;
        this.ipPrimaryName = this.systemInformationForm.controls['HEXWAVE_HOST_ID'].value;
        this.getPairedIp(this.optSelected);

        this.systeminformationService.getSystemInformationIp(fileName, this.rightdeviceIP).subscribe(response => {
          if (response) {
            this.iKeySystemInfo = response;
            this.iKeySystemInfo.forEach(element => {
              // Skip updating HEXWAVE_HOST_ID and HEXWAVE_EXTERNAL_IP
              if (element.key !== 'HEXWAVE_HOST_ID' && element.key !== 'HEXWAVE_EXTERNAL_IP') {
                // Check if the control already has a value
                if (this.systemInformationForm.controls[element.key].value) {
                  // Append the value from the right device to the existing value
                  const existingValue = this.systemInformationForm.controls[element.key].value;
                  const newValue = existingValue + ',' + element.value;

                  if (existingValue !== element.value) {
                    this.systemInformationForm.controls[element.key].setValue(newValue);
                    // Add a CSS class to make the input box red
                    this.systemInformationForm.controls[element.key].setErrors({ 'differentValues': true });
                    this.addRedInputClass(element.key); // Add CSS class to the input box
                  }
                } else {
                  // Set the value from the right device
                  this.systemInformationForm.controls[element.key].setValue(element.value);
                }
              }
            });
          }
        },
          err => {
            console.log('Error occurred: ' + err.message);
          });
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });
  }

  addRedInputClass(controlKey: string) {
    const inputElement = document.querySelector(`[formControlName="${controlKey}"]`);
    if (inputElement) {
      inputElement.classList.add('red-input');
    }
  }

  saveConfigDataIp(fileName: string) {
    const leftkeysysteminfo: IKeySystemInfo[] = []; // Initialize as an empty array
    const rightkeysysteminfo: IKeySystemInfo[] = []; // Initialize as an empty array
    this.iKeySystemInfo['HEXWAVE_HOST_ID'] = this.systemInformationForm.controls['HEXWAVE_HOST_ID_PAIRED'].value;
    this.iKeySystemInfo['HEXWAVE_EXTERNAL_IP'] = this.systemInformationForm.controls['HEXWAVE_EXTERNAL_IP_PAIRED'].value;

    this.iKeySystemInfo.forEach(element => {
      if (element.key === 'HEXWAVE_HOST_ID') {
        element.value = this.systemInformationForm.controls['HEXWAVE_HOST_ID_PAIRED'].value;
      } else if (element.key === 'HEXWAVE_EXTERNAL_IP') {
        element.value = this.systemInformationForm.controls['HEXWAVE_EXTERNAL_IP_PAIRED'].value;
      } else {
        element.value = this.systemInformationForm.controls[element.key].value;
      }
    });

    this.iKeySystemInfo.forEach(element => {
      element.value = this.systemInformationForm.controls[element.key].value;
      const splitValues = this.systemInformationForm.controls[element.key].value.split(',');
      // Assign the split values to the corresponding arrays
      leftkeysysteminfo.push({ key: element.key, value: splitValues[0] });
      if (element.key === 'HEXWAVE_HOST_ID' || element.key === 'HEXWAVE_EXTERNAL_IP') {
        rightkeysysteminfo.push({ key: element.key, value: this.iKeySystemInfo[element.key] });
      } else {
        if (splitValues[1] === null || splitValues[1] === undefined) {
          splitValues[1] = splitValues[0];
        }
        rightkeysysteminfo.push({ key: element.key, value: splitValues[1] });
      }
    });

    this.systeminformationService.updateSystemInformationIp(fileName, this.leftdeviceIP, leftkeysysteminfo).subscribe(res => {
      if (res) {
        this.notificationService.showNotification('Software information updated successfully', 'top', 'center', '', 'info-circle');
      }
      setTimeout(() => {
      }, 3000);
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });

    this.systeminformationService.updateSystemInformationIp(fileName, this.rightdeviceIP, rightkeysysteminfo).subscribe(res => {
      if (res) {
        this.notificationService.showNotification('Software information updated successfully', 'top', 'center', '', 'info-circle');
      }
      setTimeout(() => {
      }, 3000);
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });
  }

  onScreenClose() {
    this.router.navigate(['/admin/dashboard']);
  }

  rebootDevice() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'no-padding-dialog';
    this.dialog.open(RebootComponent, {
      data: {
        ipPrimary: this.leftdeviceIP,
        ipPrimaryName: this.ipPrimaryName,
        ipPaired: this.rightdeviceIP,
        ipPairedName: this.rightdeviceName
      },
      panelClass: 'custom-dialog-container',
    });
  }
}
