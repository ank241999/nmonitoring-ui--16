import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
const $ = require('jquery');

@Component({
  selector: 'app-guarddetails',
  templateUrl: './guarddetails.component.html',
  styleUrls: ['./guarddetails.component.scss']
})
export class GuarddetailsComponent implements OnInit {

  constructor(private router: Router,
    private dialogRef: MatDialogRef<MatDialog>) { }

  ngOnInit() {
  }

  viewActivity() {
    this.router.navigate(['./admin/activitymonitoring/activitythreats']);
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

  togglePlusMinus() {
    const img1 = '../../../../assets/images/minus_icon.png',
        img2 = '../../../../assets/images/plus_icon.png';
    const imgElement = $('#test');
    const imageSrc = (imgElement.attr('src') === img1) ? img2 : img1;
    imgElement.attr('src', imageSrc);
  }
}
