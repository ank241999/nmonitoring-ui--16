import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-resetcountalert',
  templateUrl: './resetcountalert.component.html',
  styleUrls: ['./resetcountalert.component.scss']
})
export class ResetcountalertComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<MatDialog>) { }

  ngOnInit() {
  }

  resetscan() {
    localStorage.setItem('scanCount', JSON.stringify({ number: Number(0) }));
    this.dialogRef.close();
  }

  onScreenClose() {
    this.dialogRef.close();
  }

}
