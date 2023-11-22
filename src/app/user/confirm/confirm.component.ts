import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<string>) { }

  ngOnInit() {
  }

  onScreenClose() {
    this.dialogRef.close();
  }

}
