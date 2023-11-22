import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../../../../assets/services/notification.service';
import { ShareDataService } from '../../../../assets/services/share-data.service';

@Component({
  selector: 'app-offsetcalculation',
  templateUrl: './offsetcalculation.component.html',
  styleUrls: ['./offsetcalculation.component.scss']
})
export class OffsetcalculationComponent implements OnInit {
  firstFormGroup: FormGroup;
  offsetvalue: number;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private spinnerService: NgxSpinnerService,
    private http: HttpClient,
    private shareDataService: ShareDataService) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstframe: ['1', Validators.required]
    });
  }

  getoffset() {
    this.spinnerService.show();
    this.http.get<any>('/timing-offset').subscribe(data => {
      this.offsetvalue = data['validated_offset'];
      this.spinnerService.hide();
    },
      err => {
        this.spinnerService.hide();
        this.notificationService.showNotification('Error occurred: ' + err.message, 'top', 'center', 'danger', 'info-circle');
        this.onScreenClose();
      });
  }

  // saveoffset() {
  //   this.spinnerService.show();
  //   this.http.get<any>("/save-timing-offset").subscribe(data => {
  //     this.spinnerService.hide();
  //     this.notificationService.showNotification("Offset Value Saved Successfully", 'top', 'center', '', 'info-circle');
  //   },
  //     err => {
  //       this.spinnerService.hide();
  //       this.notificationService.showNotification("Error occurred: " + err.message, 'top', 'center', 'danger', 'info-circle');
  //       this.onScreenClose();
  //     })
  // }

  checkValue(event) {
    if (event.target.value < 0) {
      event.target.value = 0;
    }
  }

  onScreenClose() {
    const currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  refresh(): void {
    if (this.shareDataService.userRoleAuth != null
      && this.shareDataService.userRoleAuth.filter(a => a.endPoint.includes('/admin/activitymonitoring')).length > 0
      && (this.shareDataService.role !== 'ZACCESS' && this.shareDataService.role !== '1ACCESS')) {
      this.router.navigate(['./admin/activitymonitoring']);
    } else {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  // firstFormHandleMinus() {
  //   let value = this.firstFormGroup.controls['firstframe'].value;
  //   (value == 0 ? value : value--);
  //   this.firstFormGroup.controls['firstframe'].setValue(value);
  // }

  firstFormHandleMinus() {
    let value = this.firstFormGroup.controls['firstframe'].value;
    this.firstFormGroup.controls['firstframe'].setValue(value === 0 ? value : --value);
  }

  firstFormHandlePlus() {
    let value = this.firstFormGroup.controls['firstframe'].value;
    value++;
    this.firstFormGroup.controls['firstframe'].setValue(value);
  }

}
