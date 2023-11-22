import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-component',
  templateUrl: 'customalert.component.html',
  styleUrls: ['./styles/customalert.scss']
})
export class CustomAlertComponent {
  icon: undefined;
  iconColor: undefined;
  title: 'Confirmation';
  text: undefined;
  options: false;
  input: false;
  button: undefined;
  inputData: '';

  constructor(
    public dialogRef: MatDialogRef<CustomAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.icon = data.icon;
    this.iconColor = data.iconColor;
    this.title = data.title;
    this.text = data.text;
    this.options = data.options;
    this.input = data.input;
    this.button = data.button;

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
