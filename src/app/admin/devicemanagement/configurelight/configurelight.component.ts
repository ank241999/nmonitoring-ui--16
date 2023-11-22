import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Router } from '@angular/router';
import { NotificationService } from '../../../../assets/services/notification.service';
import { IEntrance } from '../../../../assets/interfaces/ientrance';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { LaneDeviceService } from '../../../../assets/services/lanedevice.service';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { DevicemanagementService } from '../../../../assets/services/devicemanagement.service';
import {
  AssignSerialNo, DeviceLightConfigrationReq, IAssignSerialNo,
  IDevice, IDeviceLightConfigration, IDeviceLightConfigrationReq
} from '../../../../assets/interfaces/idevice';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../shared/customalert/customalert.component';

@Component({
  selector: 'app-configurelight',
  templateUrl: './configurelight.component.html',
  styleUrls: ['./configurelight.component.scss']
})
export class ConfigureLightComponent implements OnInit {
  progress = '0';
  form: FormGroup;
  formcontrol: FormControl;
  serialNos: string[] = [''];
  serialNosRight: string[] = [''];
  serialNosLeft: string[] = [''];
  serialNosTop: string[] = [''];
  stepSerial = 0;
  serialLocations: string[] = ['RIGHT', 'LEFT', 'FRONT', 'BACK'];
  enableButtonSerial: number[] = [0, 0, 0, 0];
  nextButtonEnable = true;
  // disableTestButton: boolean = false;
  disableTestButtonRight = true;
  disableTestButtonLeft = true;
  disableTestButtonTop = true;
  deviceId = 0;
  deviceName = '';
  data: IDevice = {};

  validationMessages = {
    serialNo: [
      { type: 'required', message: 'This field is required.' }
    ]
  };
  translateValidationMessages() {
    this.translate.get('requiredserialNo').subscribe((text: string) => {
      this.validationMessages.serialNo[0].message = text;
    });
  }

  constructor(// private dialogRef: MatDialogRef<IEntrance>,
    public dialog: MatDialog,
    public formBuilder: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    public deviceService: DevicemanagementService,
    private shareDataService: ShareDataService,
    private translate: TranslateService,
    private spinnerService: NgxSpinnerService,
    // @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    translate.setDefaultLang(shareDataService.getLabels());
    this.translateValidationMessages();
    this.translate.get('requiredserialNo').subscribe((text: string) => {
      this.validationMessages.serialNo[0].message = text;
    });
    document.body.style.background = '#EBEBEB';
    // alert(JSON.stringify(data))
    // this.deviceId = data.id;
    this.form = formBuilder.group({
      serialNoRight: new FormControl('', Validators.required),
      serialNoLeft: new FormControl('', Validators.required),
      serialNoTop: new FormControl('', Validators.required)
    });

    if (localStorage.getItem('deviceRowConfigureId') !== null && localStorage.getItem('deviceRowConfigureId') !== '') {
      this.getDeviceById(parseInt(localStorage.getItem('deviceRowConfigureId'), 10));
    } else {
      this.data = JSON.parse(localStorage.getItem('deviceRowConfigure'));
      this.deviceId = this.data.id;
      this.deviceName = this.data.name;
      this.getLightSerialNos();
    }
  }

  ngOnInit() {

  }

  validateFields(): void {
    if (!this.form.valid) {
      // Mark the form and inputs as touched so the errors messages are shown
      this.form.markAsTouched();
      for (const control in this.form.controls) {
        if (this.form.controls.hasOwnProperty(control)) {
          this.form.controls[control].markAsTouched();
          this.form.controls[control].markAsDirty();
        }
      }
    }

    // this.stepSerial = this.stepSerial + 1;
    // this.nextButtonEnable = true;
    // if (this.stepSerial == 3) {
    //   this.disableTestButton = true;
    // }
  }

  updateProgress(): void {
    const controls = this.form.controls;
    let size = 0;
    let completed = 0;
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        size++;
        const control = controls[key];
        if ((control.value) && (control.dirty) && (control.valid)) {
          completed++;
        }
      }
    }

    // Size - 4 to not consider the optional fields
    this.progress = (Math.floor((completed / (size - 4)) * 100)).toString();
  }

  getLightSerialNos() {
    try {
      this.deviceService.getDevicesLightSerialNos(this.data.ipAddress).subscribe(res => {
        if (res['status'] === 200) {
          this.serialNos = res['data'];
          this.getLightSerialNosHex();
        }
      },
        err => {
          console.log('Error occurred: ' + err.message);
        });
    } catch (e) {
      console.log(e.message);
    }
  }

  getLightSerialNosHex() {
    try {
      this.deviceService.getDevicesLightSerialNosHex(this.deviceId).subscribe(res => {
        if (res['status'] === 200) {
          // this.serialNos = res["data"]; //alert(JSON.stringify(this.serialNos))
          const deviceLightConfig: IDeviceLightConfigration[] = res['data']; // alert(JSON.stringify(deviceLightConfig))

          const serialNosTemp: string[] = [];
          // for (var ser in this.serialNos) {alert(ser)
          for (let i = 0; i < this.serialNos.length; i++) {
            const dlc = deviceLightConfig.filter(a => a.serialNo === this.serialNos[i]);
            if (dlc.length > 0) {
              if (dlc.filter(a => a.isActive === false).length > 0) {
                if (this.serialNos[i].trim() !== '') {
                  serialNosTemp.push(this.serialNos[i]);
                }
              }
            } else {
              if (this.serialNos[i].trim() !== '') {
                serialNosTemp.push(this.serialNos[i]);
              }
            }
            // if (deviceLightConfig.filter(a => a.serialNo == ser && a.isActive == false).length > 0) {
            //   serialNosTemp.push(ser);
            // }
          } // alert(JSON.stringify(serialNosTemp))
          if (serialNosTemp.length > 0) {
            this.serialNos = serialNosTemp;
            this.serialNosRight = serialNosTemp;
            this.serialNosLeft = serialNosTemp;
            this.serialNosTop = serialNosTemp;

            this.disableTestButtonRight = false;
            this.disableTestButtonLeft = false;
            this.disableTestButtonTop = false;
          }

          const rightSr: IDeviceLightConfigration[] = deviceLightConfig.filter(a => a.location === 'RIGHT' && a.isActive === true);
          const leftSr: IDeviceLightConfigration[] = deviceLightConfig.filter(a => a.location === 'LEFT' && a.isActive === true);
          const topSr: IDeviceLightConfigration[] = deviceLightConfig.filter(a => a.location === 'TOP' && a.isActive === true);

          let rightSeril: String = '';
          let leftSeril: String = '';
          let topSeril: String = '';

          if (leftSr.length > 0) {
            this.serialNosLeft = [leftSr[0].serialNo];
            leftSeril = leftSr[0].serialNo;
            this.disableTestButtonLeft = true;
          }
          if (topSr.length > 0) {
            this.serialNosTop = [topSr[0].serialNo];
            topSeril = topSr[0].serialNo;
            this.disableTestButtonTop = true;
          }

          if (rightSr.length > 0) {
            this.serialNosRight = [rightSr[0].serialNo];
            rightSeril = rightSr[0].serialNo;
            this.disableTestButtonRight = true;
          }

          this.form.patchValue({
            serialNoRight: rightSeril,
            serialNoLeft: leftSeril,
            serialNoTop: topSeril
          });
        }
      },
        err => {
          console.log('Error occurred: ' + err.message);
        });
    } catch (e) {
      console.log(e.message);
    }
  }

  validateSerialNo(type, id) {
    this.spinnerService.show();
    const assignSerialNo: IAssignSerialNo = new AssignSerialNo(type, this.form.controls[id].value);

    if (assignSerialNo.serialNumber === '') {
      this.spinnerService.hide();
      this.notificationService.showNotification('Please select any option.', 'top', 'center', 'warning', 'info-circle');
      return;
    }

    this.deviceService.validateSerialNo(this.data.ipAddress, assignSerialNo).subscribe(res => {
      if (res['status'] === 200 || res['status'] === 400) {
        this.spinnerService.hide();
        const response: string = res['data'];
        // this.enableButtonSerial[this.stepSerial] = 1;
        const dialogRef = this.dialog.open(CustomAlertComponent, {
          data: {
            // icon: 'exclamation-circle',
            // iconColor: 'success',
            title: 'Confirmation',
            text: 'Is the ' + type.toLowerCase() + ' light blinked?',
            options: true,
            input: true
          },
          panelClass: 'custom-dialog-container'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            if (result === true) {
              this.stepSerial = this.stepSerial + 1;

              if (type === 'RIGHT') {
                this.serialNosRight = [this.form.controls[id].value];
                this.disableTestButtonRight = true;
              }
              if (type === 'LEFT') {
                this.serialNosLeft = [this.form.controls[id].value];
                this.disableTestButtonLeft = true;
              }
              if (type === 'TOP') {
                this.serialNosTop = [this.form.controls[id].value];
                this.disableTestButtonTop = true;
              }

              this.saveSerialNo(type, id);
            }
          } else {
            this.setDefaultValueOfSerialNos(type);
          }
        });

        // if (this.stepSerial == 2) {
        //   this.disableTestButton = true;
        //   this.nextButtonEnable = true;
        // }
        // else {
        //   this.nextButtonEnable = false;
        // }

        // this.notificationService.showNotification(response, 'top', 'center', '', 'info-circle');
      } else if (res['status'] === 500) {
        this.spinnerService.hide();
        // this.notificationService.showNotification(res["data"], 'top', 'center', 'warning', 'info-circle');
        this.notificationService.showNotification('N/A', 'top', 'center', 'warning', 'info-circle');

        this.setDefaultValueOfSerialNos(type);
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
        this.spinnerService.hide();

        // if (err["status"] == 500) {
        //   this.translate.get('msgInternalError').subscribe((text: string) => {
        //     this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
        //   });
        // }
        // else {
        //   this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
        // }
        this.notificationService.showNotification('N/A', 'top', 'center', 'warning', 'info-circle');

        this.setDefaultValueOfSerialNos(type);
      });
  }

  setDefaultValueOfSerialNos(type: string) {
    {
      if (type === 'RIGHT') {
        this.form.patchValue({
          serialNoRight: ''
        });
      }
      if (type === 'LEFT') {
        this.form.patchValue({
          serialNoLeft: ''
        });
      }
      if (type === 'TOP') {
        this.form.patchValue({
          serialNoTop: ''
        });
      }
    }
  }

  saveSerialNo(type, id) {
    const assignSerialNo: IDeviceLightConfigrationReq = new DeviceLightConfigrationReq(
      this.deviceId, type, this.form.controls[id].value, true);

    this.deviceService.saveSerialNo(assignSerialNo).subscribe(res => {
      if (res['status'] === 201) {
        this.spinnerService.hide();
        const response: string = res['data'];
        this.getLightSerialNosHex();
        // this.stepSerial = this.stepSerial + 1;
        // this.notificationService.showNotification("Serialno reset successfull", 'top', 'center', '', 'info-circle');
      } else if (res['status'] === 500) {
        this.spinnerService.hide();
        this.notificationService.showNotification(res['data'], 'top', 'center', 'warning', 'info-circle');
      }
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

    if (this.stepSerial === 1) {
      this.disableTestButtonLeft = false;
    }
    if (this.stepSerial === 2) {
      this.disableTestButtonTop = false;
    }
  }

  resetSerialNo() {
    this.deviceService.resetSerialNo(this.deviceId).subscribe(res => {
      if (res['status'] === 201) {
        this.spinnerService.hide();
        const response: string = res['data'];
        this.getLightSerialNos();

        this.notificationService.showNotification('Serial no reset successfully', 'top', 'center', '', 'info-circle');
      } else if (res['status'] === 500) {
        this.spinnerService.hide();
        this.notificationService.showNotification(res['data'], 'top', 'center', 'warning', 'info-circle');
      }
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
  }

  onSubmit() {
    // this.onScreenClose(this.form.controls["name"].value);
  }

  onScreenClose() {
    // this.dialogRef.close(laneId);
    if (localStorage.getItem('deviceRowConfigureId') !== null && localStorage.getItem('deviceRowConfigureId') !== '') {
      localStorage.setItem('deviceRowConfigureId', '');
      this.router.navigate(['/admin/dashboard']);
    } else {
      localStorage.setItem('deviceRowConfigure', '');
      localStorage.setItem('deviceRowConfigureId', '');
      this.router.navigate(['/admin/devicemanagement']);
    }
  }

  getDeviceById(deviceId: number) {
    try {
      this.deviceService.getDeviceById(deviceId).subscribe(res => {
        if (res['status'] === 201) {
          this.data = res['data']; // alert(JSON.stringify(this.data))
          this.deviceId = this.data.id;
          this.deviceName = this.data.name;
          this.getLightSerialNos();
        }
      },
        err => {
          console.log('Error occurred: ' + err.message);
        });
    } catch (e) {
      console.log(e.message);
    }
  }
}
