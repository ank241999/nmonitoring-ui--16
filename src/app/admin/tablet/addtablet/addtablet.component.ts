import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ITablet } from '../../../../assets/interfaces/itablet';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TabletService } from '../../../../assets/services/tablet.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../../../../assets/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { IUser } from '../../../../assets/interfaces/iuser';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserService } from '../../../../assets/services/user.service';
import { ShareDataService } from '../../../../assets/services/share-data.service';

const $ = require('jquery');

@Component({
  selector: 'app-addtablet',
  templateUrl: './addtablet.component.html',
  styleUrls: ['./addtablet.component.scss', '../../../user/styles.css']
})
export class AddtabletComponent implements OnInit {

  tablet: ITablet = {};
  form: FormGroup;
  primaryTab = false;
  isPaste = false;
  users: IUser[] = [];
  filteredOptions: Observable<IUser[]>;
  selectedUser: IUser[] = [];

  // Form validation messages
  validationMessages = {
    tabletName: [
      { type: 'required', message: 'Tablet Name is required.' }
    ],
    tabletMacAddress: [
      { type: 'required', message: 'Email Address is required.' }
    ],
    tabletStatus: [
      { type: 'required', message: 'Status is required.' }
    ]
  };

  tabletStatus = [{ 'id': '', 'status': 'Select Tablet Status' },
  { 'id': false, 'status': 'OFF' },
  { 'id': true, 'status': 'ON' }];

  constructor(public formBuilder: FormBuilder,
    private tabletService: TabletService,
    private router: Router,
    private location: Location,
    private userService: UserService,
    private shareDataService: ShareDataService,
    private spinnerService: NgxSpinnerService,
    private notificationService: NotificationService,
    private translate: TranslateService) {
    translate.setDefaultLang(shareDataService.getLabels());
    this.form = formBuilder.group({
      tabletName: new FormControl('', Validators.required),
      tabletMacAddress: new FormControl('', Validators.required),
      tabletStatus: new FormControl(''),
      // primaryTablet: new FormControl(false, Validators.required)
    });
  }

  ngOnInit() {
    this.form.controls['tabletMacAddress'].valueChanges
      .subscribe(
        email => {
          if (this.isPaste === false) {
            $('.autocomplete_container').show();
          }
        });

    this.filteredOptions = this.form.controls['tabletMacAddress'].valueChanges
      .pipe(
        startWith(''),
        // map(value => this.emailFilter(value))
        map(val => val.length >= 1 && val !== '' ? this.emailFilter(val) : [])
      );
  }

  emailFilter(value: string): IUser[] {
    const filterValue = (value === undefined ? '' : value.toLowerCase());
    this.userService.getUsers(filterValue).subscribe(res => {
      this.users = res['data'];
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });

    return (filterValue === '' ? [] : (this.users.length > 0 ? this.users.filter(a => a.email.toLowerCase().includes(filterValue) &&
      a.role.replace('[', '').replace(']', '') === 'BASIC') : [])); // .slice(0,4);
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

  onSubmit() {
    const tabletObject = {
      tabletName: this.form.controls['tabletName'].value,
      tabletMacAddress: this.form.controls['tabletMacAddress'].value,
      tabletStatus: this.form.controls['tabletStatus'].value,
      primaryTablet: true
    };
    this.tabletService.addTablet(tabletObject).subscribe(res => {
      if (res['status'] === 201) {
        this.spinnerService.hide();
        const response: ITablet = res['data'];

        this.translate.get('msgSuccessfulRegister').subscribe((text: string) => {
          this.notificationService.showNotification('Tablet created successfully', 'top', 'center', '', 'info-circle');
        });
        setTimeout(() => {
          this.addtabletScreenClose();
        }, 3000);
      } else if (res['status'] === 400 && res['error'].includes('ConstraintViolationException')) {
        this.spinnerService.hide();
        this.notificationService.showNotification('Tablet Mac Address is already aquired.', 'top', 'center', 'danger', 'info-circle');
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

  // fillIP() {
  //   this.form.controls['tabletMacAddress'].setValue(sessionStorage.getItem('LOCAL_IP'));
  // }

  primaryTablet($event) {
    this.primaryTab = $event.checked;
  }
  addtabletScreenClose() {
    this.router.navigate(['/admin/tablet']);
  }

  onPaste(event: ClipboardEvent) {
    this.isPaste = true;
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    let maxTry = 1;
    const root = this;
    const delay = 600;

    setTimeout(function request() {
      maxTry = maxTry + 1;
      if (root.users.length === 0 && maxTry < 4) {
        setTimeout(request, delay);
      } else {
        root.isPaste = false;
        root.form.controls['tabletMacAddress'].setValue(pastedText);
      }
    }, delay);
  }

  autofill(val: any) {
    this.form.controls['tabletMacAddress'].setValue(val);
    $('.autocomplete_container').hide();
  }

}
