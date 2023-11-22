import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../../../../assets/services/notification.service';
import { timeout } from 'rxjs/operators';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-aircalibration',
  templateUrl: './aircalibration.component.html',
  styleUrls: ['./aircalibration.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class AircalibrationComponent implements OnInit {
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  completed = false;
  clicked = false;
  state: string;
  timeLeft = 10;
  interval;
  imgsrc = '/assets/images/Liberty-Defense-Logo-.png';

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private spinnerService: NgxSpinnerService,
    private http: HttpClient,
    private shareDataService: ShareDataService) { }

  ngOnInit() {
    if (localStorage.getItem('calibration')) {
      if (localStorage.getItem('calibration') === 'true') {
        localStorage.removeItem('calibration');
      }
    } else {
      localStorage.setItem('calibration', 'true');
      window.location.reload();
    }

    this.firstFormGroup = this._formBuilder.group({
      firstframe: ['1', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      targetdistance: ['35', Validators.required]
    });
  }

  checkValue(event) {
    if (event.target.value < 0) {
      event.target.value = 0;
    }
  }

  captureAir() {
    this.spinnerService.show();
    this.imgsrc = '/assets/images/Liberty-Defense-Logo-.png';
    if (this.firstFormGroup.valid) {
      this.http.get<any>('/calibrate-air?num='
        + this.firstFormGroup.controls['firstframe'].value).pipe(timeout(3600000)).subscribe(data => {
          console.log(data);
          this.spinnerService.hide();
        },
          err => {
            this.spinnerService.hide();
            this.notificationService.showNotification('Error occurred: ' + err.message, 'top', 'center', 'danger', 'info-circle');
            setTimeout(() => {
              this.onScreenClose();
            }, 3200);
          });
    }
  }

  stopfpga() {
    this.http.get<any>('/stop-fpga-interface').subscribe(res => {
      console.log(res);
    },
      err => {
        this.http.get<any>('/start-fpga-interface').subscribe(data => {
          this.http.get<any>('/stop-fpga-interface').subscribe(res => {
          });
        });
      });
  }

  startfpga() {
    this.http.get<any>('/start-fpga-interface').subscribe(data => {
      console.log(data);
      this.spinnerService.hide();
    });
  }

  saveair() {
    this.spinnerService.show();
    this.http.get<any>('/save-air').subscribe(res => {
      this.notificationService.showNotification('Air Calibration Saved Successfully', 'top', 'center', '', 'info-circle');
      this.spinnerService.hide();
    },
      err => {
        this.spinnerService.hide();
        this.notificationService.showNotification('Error occurred: ' + err.message, 'top', 'center', 'danger', 'info-circle');
        setTimeout(() => {
          this.onScreenClose();
        }, 3200);
      });
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.showspinner();
      }
    }, 1000);
  }

  showspinner() {
    this.spinnerService.show();
    if (this.secondFormGroup.controls['targetdistance'].value) {
      this.imgsrc = '/process-image?zin=' + this.secondFormGroup.controls['targetdistance'].value;
      this.stepper.next();
    } else {
      this.notificationService.showNotification('Target Distance not be null', 'top', 'center', 'warning', 'info-circle');
      this.clicked = false;
      this.timeLeft = 10;
    }
    this.hidespinner();
  }

  hidespinner() {
    this.spinnerService.hide();
  }

  onImageError(): void {
    this.notificationService.showNotification('Error occurred in image processing', 'top', 'center', 'danger', 'info-circle');
    setTimeout(() => {
      this.onScreenClose();
    }, 3200);
  }

  onScreenClose() {
    const currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }


  refresh(): void {
    // window.location.reload();
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
  //   (value === 0 ? value : value--);
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

  // secondFormHandleMinus() {
  //   let value = this.secondFormGroup.controls['targetdistance'].value;
  //   (value === 0 ? value : value--);
  //   this.secondFormGroup.controls['targetdistance'].setValue(value);
  // }

  secondFormHandleMinus() {
    let value = this.secondFormGroup.controls['targetdistance'].value;
    this.secondFormGroup.controls['targetdistance'].setValue(value === 0 ? value : --value);
  }

  secondFormHandlePlus() {
    let value = this.secondFormGroup.controls['targetdistance'].value;
    value++;
    this.secondFormGroup.controls['targetdistance'].setValue(value);
  }
}
