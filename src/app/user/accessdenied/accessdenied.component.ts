import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-accessdenied',
  templateUrl: './accessdenied.component.html',
  styleUrls: ['./accessdenied.component.scss']
})
export class AccessdeniedComponent implements OnInit {
  title: '';
  text: undefined;
  longtext = false;

  constructor(private dialogRef: MatDialogRef<string>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.text = data.text;
    this.longtext = data.longtext;
  }

  ngOnInit() {
  }
  onScreenClose() {
    this.dialogRef.close();
  }
}
