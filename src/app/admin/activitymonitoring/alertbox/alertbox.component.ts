import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-alertbox',
  templateUrl: './alertbox.component.html',
  styleUrls: ['./alertbox.component.scss']
})
export class AlertboxComponent implements OnInit {
  text = 'User must clear the scan before logging off !';

  constructor(private dialogRef: MatDialogRef<string>,
    @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog,
    // private spinnerService: NgxSpinnerService
  ) {
    if (data) {
      this.text = data.text;
    }
  }

  ngOnInit() {
  }

  onclick() {
    // this.spinnerService.show();

    // this.spinnerService.hide();
    this.dialogRef.close();
  }

  onScreenClose() {
    // this.dialogRef.close();
    this.onclick();
  }

}
