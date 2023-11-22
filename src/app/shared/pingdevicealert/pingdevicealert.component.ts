import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pingdevice-alert-component',
  templateUrl: 'pingdevicealert.component.html',
  styleUrls: ['./styles/pingdevicealert.scss']
})
export class PingDeviceAlertComponent {
  icon: undefined;
  iconColor: undefined;
  // title: 'Confirmation';
  device1Name: string;
  device1Address: string;
  device1Status: string;

  device2Name: string;
  device2Address: string;
  device2Status: string;

  text: undefined;
  options: false;
  input: false;
  button: undefined;
  inputData: '';

  constructor(
    public dialogRef: MatDialogRef<PingDeviceAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.icon = data.icon;
    this.iconColor = data.iconColor;
    // this.title = data.title;
    // this.text = data.text;
    this.options = data.options;
    this.input = data.input;
    this.button = data.button;

    this.device1Name = data.device1Name;
    this.device1Address = data.device1Address;
    this.device1Status = data.device1Status;

    this.device2Name = data.device2Name;
    this.device2Address = data.device2Address;
    this.device2Status = data.device2Status;

    if (data.time) {
      setTimeout(() => {
        this.dialogRef.close();
      }, data.time);
    }
  }
  onScreenClose() {
    this.dialogRef.close();
  }
}
