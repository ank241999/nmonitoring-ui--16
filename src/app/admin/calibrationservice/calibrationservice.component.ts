import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../../../assets/services/notification.service';
import { timeout } from 'rxjs/operators';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-calibrationservice',
  templateUrl: './calibrationservice.component.html',
  styleUrls: ['./calibrationservice.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class CalibrationserviceComponent implements OnInit {
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
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
      secondframe: ['1', Validators.required],
      platedistance: ['18', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
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

  capturePlate() {
    this.spinnerService.show();

    if (this.secondFormGroup.valid) {
      const url = '/calibrate-phase?num=' + this.secondFormGroup.controls['secondframe'].value + '&zin='
        + this.secondFormGroup.controls['platedistance'].value;

      const subscription = this.http.get<any>(url).pipe(timeout(3600000));

      subscription.subscribe(
        data => {
          console.log(data);
          this.spinnerService.hide();
        },
        err => {
          this.spinnerService.hide();
          this.notificationService.showNotification('Error occurred: ' + err.message, 'top', 'center', 'danger', 'info-circle');
          setTimeout(() => {
            this.onScreenClose();
          }, 3200);
        }
      );
    }
  }

  stopfpga() {
    this.spinnerService.show();
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

  savephase() {
    this.spinnerService.show();
    this.http.get<any>('/save-phase').subscribe(res => {
      console.log(res);
      this.notificationService.showNotification('Plate Calibration Saved Successfully', 'top', 'center', '', 'info-circle');
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
    if (this.thirdFormGroup.controls['targetdistance'].value) {
      this.imgsrc = '/process-image?zin=' + this.thirdFormGroup.controls['targetdistance'].value;
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

  // refresh(): void {
  //   this.router.navigate(['/admin/dashboard'])
  // }


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
  // secondFormHandleMinus(control) {
  //   let value = this.secondFormGroup.controls[control].value;
  //   (value == 0 ? value : value--);
  //   this.secondFormGroup.controls[control].setValue(value);
  // }

  secondFormHandleMinus(control) {
    let value = this.secondFormGroup.controls[control].value;
    this.secondFormGroup.controls[control].setValue(value === 0 ? value : --value);
  }

  secondFormHandlePlus(control) {
    let value = this.secondFormGroup.controls[control].value;
    value++;
    this.secondFormGroup.controls[control].setValue(value);
  }
  // thirdFormHandleMinus() {
  //   let value = this.thirdFormGroup.controls['targetdistance'].value;
  //   (value == 0 ? value : value--);
  //   this.thirdFormGroup.controls['targetdistance'].setValue(value);
  // }

  thirdFormHandleMinus() {
    let value = this.thirdFormGroup.controls['targetdistance'].value;
    this.thirdFormGroup.controls['targetdistance'].setValue(value === 0 ? value : --value);
  }


  thirdFormHandlePlus() {
    let value = this.thirdFormGroup.controls['targetdistance'].value;
    value++;
    this.thirdFormGroup.controls['targetdistance'].setValue(value);
  }
}
