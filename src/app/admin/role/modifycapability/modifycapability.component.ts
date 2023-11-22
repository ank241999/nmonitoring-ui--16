import { Component, Inject, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../assets/services/user.service';
import { IUser } from '../../../../assets/interfaces/iuser';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../assets/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { environment } from '../../../../environments/environment';
import { Location } from '@angular/common';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
import { TextValidator } from '../../../../assets/common/text.validator';
import { IRoles } from '../../../../assets/interfaces/iroles';
import { ICapability } from '../../../../assets/interfaces/iuserroleauth';
import { UserRoleAuthService } from '../../../../assets/services/user-role-auth.service';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { NgxSpinnerService } from 'ngx-spinner';

const moment = _moment;

const $ = require('jquery');

@Component({
  selector: 'app-modifycapability',
  templateUrl: './modifycapability.component.html',
  styleUrls: ['./styles/modifycapability.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe, { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})
export class ModifycapabilityComponent implements OnInit {
  capability: ICapability = {};
  isPasswordValid = true;
  isEmailValid = true;
  public showPasswordOnPress: boolean;
  public showConfirmPasswordOnPress: boolean;

  // Form validation messages
  validationMessages = {
    capabilityName: [
      { type: 'required', message: 'This field is required.' },
      { type: 'cannotContainSpace', message: 'This field can not contain space.' }
    ],
    endPoint: [
      { type: 'required', message: 'Email is required.' },
      { type: 'email', message: 'Email must be valid.' }
    ],
    textNumber: [
      { type: 'pattern', message: 'Number must be an integer.' }
    ],
    minLength: [
      { type: 'minlength', message: 'Min length is 11.' }
    ],
    maxLength: [
      { type: 'maxlength', message: 'Max length is 8.' }
    ],
    range: [
      { type: 'range', message: 'Range should be a number between 5 and 10.' }
    ],
    minValue: [
      { type: 'min', message: 'Min value is 4.' }
    ],
    maxValue: [
      { type: 'max', message: 'Max value is 5.' }
    ]
  };

  // Full form
  form: FormGroup;
  progress = '0';

  constructor(
    public formBuilder: FormBuilder,
    // private http: HttpClient,
    private location: Location,
    private router: Router,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private shareDataService: ShareDataService,
    public datepipe: DatePipe,
    private spinnerService: NgxSpinnerService,
    private userRoleAuthService: UserRoleAuthService
  ) {
    translate.setDefaultLang(shareDataService.getLabels());
    this.translateValidationMessages();

    this.form = formBuilder.group({
      capabilityName: new FormControl('', [Validators.required, Validators.minLength(3), TextValidator.cannotContainSpace]),
      endPoint: new FormControl('')
    });

    this.capability = shareDataService.getSharedData();

    this.form.patchValue({
      capabilityName: this.capability.capabilityName,
      endPoint: this.capability.endPoint
    });
  }

  ngOnInit() {

  }

  updateProgress(): void {
    const controls = this.form.controls;
    let size = 0;
    let completed = 0;
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        size++;
        const control = controls[key];
        if ((control.value) && (control.dirty) && (control.valid)) {
          completed++;
        }
      }
    }

    // Size - 4 to not consider the optional fields
    this.progress = (Math.floor((completed / (size - 4)) * 100)).toString();
  }

  onSubmit(isCreateANother: boolean = false) {
    this.spinnerService.show();
    const capabilityObject = {
      id: this.capability.id,
      capabilityName: this.form.controls['capabilityName'].value,
      endPoint: this.form.controls['endPoint'].value
    };

    this.userRoleAuthService.updateCapability(capabilityObject).subscribe(res => {
      if (res['status'] === 200) {
        this.spinnerService.hide();
        const response: ICapability = res['data'];

        this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
          this.notificationService.showNotification('Capability updated successfully', 'top', 'center', '', 'info-circle');
        });

        if (!isCreateANother) {
          setTimeout(() => {
            this.router.navigate(['/admin/roles/capability']);
          }, 3000);
        } else {
          this.form.reset();
          this.form.patchValue({
            role: '',
            expiryDate: ''
          });
        }
      } else if (res['status'] === 500) {
        this.spinnerService.hide();
        // let response: IUser = res["data"];
        // localStorage.setItem("id", response.id);
        // already exists
        // this.notificationService.showNotification(res['error'], 'top', 'center', 'warning', 'info-circle');
        this.translate.get('lblAlreadyAcc').subscribe((text: string) => {
          this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
        });
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
        this.spinnerService.hide();

        if (err['status'] === 500) {
          this.translate.get('msgInternalError').subscribe((text: string) => {
            this.notificationService.showNotification(text, 'top', 'center', 'warning', 'info-circle');
          });
        } else {
          this.notificationService.showNotification('Error occurred: ' + err.message, 'top', 'center', 'danger', 'info-circle');
        }
      });
  }

  onScreenBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  modifycapabilityScreenClose() {
    this.router.navigate(['/admin/dashboard']);
  }


  createAnother() {
    this.onSubmit(true);
  }

  translateValidationMessages() {
    this.translate.get('requiredfield').subscribe((text: string) => {
      this.validationMessages.capabilityName[0].message = text;
    });

    this.translate.get('requiredemail').subscribe((text: string) => {
      this.validationMessages.endPoint[0].message = text;
    });


  }

  validateFields(): void {
    if (!this.form.valid) {
      // Mark the form and inputs as touched so the errors messages are shown
      this.form.markAsTouched();
      for (const control in this.form.controls) {
        if (this.form.controls.hasOwnProperty(control)) {
          this.form.controls[control].markAsTouched();
          this.form.controls[control].markAsDirty();
        }
      }
    }
  }
}
