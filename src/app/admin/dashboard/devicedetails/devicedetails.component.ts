import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssignSerialNo, IAssignSerialNo } from '../../../../assets/interfaces/idevice';
import { IEntrance } from '../../../../assets/interfaces/ientrance';
import { DevicemanagementService } from '../../../../assets/services/devicemanagement.service';
import { NotificationService } from '../../../../assets/services/notification.service';
import { ShareDataService } from '../../../../assets/services/share-data.service';
// import { PingDeviceAlertComponent } from '../../../shared/pingdevicealert/pingdevicealert.component';

@Component({
  selector: 'app-devicedetails',
  templateUrl: './devicedetails.component.html',
  styleUrls: ['./devicedetails.component.scss']
})
export class DevicedetailsComponent implements OnInit {
  entrance: IEntrance = { 'id': 0, 'name': 'Test' };
  deviceName = '';
  form: FormGroup;

  device1Name = '';
  device1Address = '';
  device1Status = 'NA';

  device2Name = '';
  device2Address = '';
  device2Status = 'NA';

  returnType = 0;

  constructor(private dialogRef: MatDialogRef<MatDialog>, private router: Router, private shareDataService: ShareDataService,
    @Inject(MAT_DIALOG_DATA) data,
    public deviceService: DevicemanagementService,
    // private spinnerService: NgxSpinnerService,
    public dialog: MatDialog,
    private notificationService: NotificationService
    ) {
    this.entrance.id = data['entranceID'];
    this.entrance.name = data['entranceName'];
    this.deviceName = data['side'];
  }

  ngOnInit() {

  }

  onScreenClose() {
    this.dialogRef.close();
  }

  pingLane() {
    this.shareDataService.setGlobalObject(this.entrance);
    // this.router.navigate(['./admin/tablettohexwave/hexwavepairdetails']);
    let returnType = 0;
    const deviceIdleft: string = localStorage.getItem('deviceRowConfigureIdLeft');
    const deviceIdright: string = localStorage.getItem('deviceRowConfigureIdRight');

    returnType = this.getDeviceById(parseInt(deviceIdleft, 10), 'lane');
    returnType = this.getDeviceById(parseInt(deviceIdright, 10), 'lane');
    this.dialogRef.close();
  }

  pingDevice() {
    // this.router.navigate(['./admin/devicemanagement/configurelight']);
    let deviceId = '';

    if (localStorage.getItem('deviceSide') === 'left') {
      deviceId = localStorage.getItem('deviceRowConfigureIdLeft');
    } else {
      deviceId = localStorage.getItem('deviceRowConfigureIdRight');
    }


    const returnType: number = this.getDeviceById(parseInt(deviceId, 10), 'device');

    this.dialogRef.close();
  }

  getDeviceById(deviceId: number, type: string = 'device') {
    // this.spinnerService.show();
    // let returnType: number = 0;
    try {
      this.deviceService.getDeviceById(deviceId).subscribe(res => {
        if (res['status'] === 201) {
          const data = res['data']; // alert(JSON.stringify(data))

          // this.getLightSerialNos();
          // returnType = this.getLightSerialNos(data.ipAddress);
          if (data.side === 'left') {
            this.device1Name = data.name;
            this.device1Address = data.ipAddress;
          } else if (data.side === 'right') {
            this.device2Name = data.name;
            this.device2Address = data.ipAddress;
          }

          this.deviceService.pingDevice(data.ipAddress).subscribe(r => {
            if (r['status'] === 200) {
              // this.spinnerService.hide();

              if (data.side === 'left') {
                this.device1Status = 'OK';
              } else if (data.side === 'right') {
                this.device2Status = 'OK';
              }

              this.returnType = this.returnType + 1;

              // if ((this.returnType == 1 && type == "device") || (this.returnType == 2 && type == "lane")) {
              //   const dialogRef = this.dialog.open(PingDeviceAlertComponent, {
              //     data: {
              //       title: "Confirmation",
              //       //text: confMessage,//"Is the device light blinked?",
              //       options: true,
              //       input: true,
              //       device1Name: this.device1Name,
              //       device1Address: this.device1Address,
              //       device1Status: this.device1Status,

              //       device2Name: this.device2Name,
              //       device2Address: this.device2Address,
              //       device2Status: this.device2Status
              //     },
              //     panelClass: 'custom-dialog-container'
              //   });
              // }
              this.showPingAlert(type);
            } else if (r['status'] === 500) {
              if (data.side === 'left') {
                this.device1Status = 'FAILED';
              } else if (data.side === 'right') {
                this.device2Status = 'FAILED';
              }
              this.returnType = 3;
              this.returnType = this.returnType + 1;
              // this.spinnerService.hide();
              this.notificationService.showNotification("N/A", 'top', 'center', 'warning', 'info-circle');
              this.showPingAlert(type);
            }
          },
            err => {
              if (data.side === 'left') {
                this.device1Status = 'FAILED';
              } else if (data.side === 'right') {
                this.device2Status = 'FAILED';
              }
              console.log('Error occurred: ' + err.message);
              // this.spinnerService.hide();
              this.notificationService.showNotification("N/A", 'top', 'center', 'warning', 'info-circle');
              this.returnType = this.returnType + 1;
              this.showPingAlert(type);
            });
        }
      },
        err => {
          console.log('Error occurred: ' + err.message);
          // this.spinnerService.hide();
          this.notificationService.showNotification("N/A", 'top', 'center', 'warning', 'info-circle');
          this.returnType = this.returnType + 1;
          this.showPingAlert(type);
        });
    } catch (e) {
      console.log(e.message);
    }

    return this.returnType;
  }

  showPingAlert(type: string) {
    // if ((this.returnType === 1 && type === 'device') || (this.returnType === 2 && type === 'lane')) {
    //   const dialogRef = this.dialog.open(PingDeviceAlertComponent, {
    //     data: {
    //       title: 'Confirmation',
    //       // text: confMessage,//"Is the device light blinked?",
    //       options: true,
    //       input: true,
    //       device1Name: this.device1Name,
    //       device1Address: this.device1Address,
    //       device1Status: this.device1Status,

    //       device2Name: this.device2Name,
    //       device2Address: this.device2Address,
    //       device2Status: this.device2Status
    //     },
    //     panelClass: 'custom-dialog-container'
    //   });
    // }
  }
}
