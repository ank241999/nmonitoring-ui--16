import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IUser } from '../../../assets/interfaces/iuser';
import { IAccesslevel } from '../../../assets/interfaces/iuserroleauth';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { UserRoleAuthService } from '../../../assets/services/user-role-auth.service';
import { UserService } from '../../../assets/services/user.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
const $ = require('jquery');

@Component({
  selector: 'app-profiledetails',
  templateUrl: './profiledetails.component.html',
  styleUrls: ['./profiledetails.component.scss', '../accountmanagement/modifyaccount/styles/modifyaccount.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe, { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})
export class ProfiledetailsComponent implements OnInit {
  user: IUser = {};
  userRoles = [];
  expiryDays = [1, 2, 7, 30];

  form: FormGroup;
  progress = '0';
  disableSelect = new FormControl(false);
  currentDate = new Date();
  currMonth = this.currentDate.getMonth();
  currYear = this.currentDate.getFullYear();
  expiryDateU = 0;
  isValidExpiryDate = 0;
  userRole = 'BASIC';
  constructor(
    public formBuilder: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private shareDataService: ShareDataService,
    private datePipe: DatePipe,
    private spinnerService: NgxSpinnerService,
    private userRoleAuthService: UserRoleAuthService
  ) {
    this.getRoleModule();
    translate.setDefaultLang(shareDataService.getLabels());

    const LastDay = new Date(this.currYear, this.currMonth + 1, 0);
    this.form = formBuilder.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      role: new FormControl(''),
      expiryDate: new FormControl('')
    });
    this.form.valueChanges.subscribe(form => { this.dateFilter(form); });
    this.user = shareDataService.getSharedData();
    this.userRole = this.user.role.replace('[', '').replace(']', '');
    this.form.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      role: this.userRole,
      expiryDate: new Date(this.user.expiryTimestamp)
    });
  }

  ngOnInit() {
    this.changeRole(this.userRole);
  }

  onScreenClose() {
    this.router.navigate(['/admin/activitymonitoring']);
  }

  changeRole(val) {
    if (val === 'ZACCESS') {
      $('.basic-user').each(function () {
        $(this).hide();
      });
    } else {
      $('.basic-user').each(function () {
        $(this).show();
      });
    }
  }

  dateFilter(form): void {
    this.expiryDateU = new Date(this.datePipe.transform(this.form.value.expiryDate, 'yyyy-MM-dd')).getTime();
    this.isValidExpiryDate = 0;

    if (['3ACCESS', '1ACCESS', '2ACCESS'].includes(this.form.controls['role'].value) === true) {
      if (this.expiryDateU === 0) {
        this.isValidExpiryDate = 2;
      } else {
        this.expiryDateU = this.expiryDateU + (new Date().getTimezoneOffset() * 60000);

        const currDate: any = new Date(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
        const expDate: any = new Date(this.datePipe.transform(this.form.value.expiryDate, 'yyyy-MM-dd'));

        if (expDate < currDate) {
          this.isValidExpiryDate = 1;
        }
      }
    }
  }
  getRoleModule() {
    try {
      this.userRoleAuthService.getAccessibilities().subscribe(res => {
        if (res['status'] === 200) {
          let roles: IAccesslevel[] = res['data'];
          if (roles.length > 0) {
            if (this.shareDataService.role === 'ZACCESS') {
              roles = roles.filter(x => ['ZACCESS', '1ACCESS', '2ACCESS', '3ACCESS'].includes(x.keyName));
            } else if (this.shareDataService.role === '1ACCESS') {
              roles = roles.filter(x => ['1ACCESS', '2ACCESS', '3ACCESS'].includes(x.keyName));
            } else if (this.shareDataService.role === '2ACCESS') {
              roles = roles.filter(x => ['2ACCESS', '3ACCESS'].includes(x.keyName));
            } else if (this.shareDataService.role === '3ACCESS') {
              roles = roles.filter(x => ['3ACCESS'].includes(x.keyName));
            }

            roles.forEach(e => {
              this.userRoles.push({ 'id': e.keyName, 'role': e.accessLevels.toUpperCase(), 'label': e.label });
            });
          }
        }
      },
        err => {
          console.log('Error occurred: ' + err.message);
        });
    } catch (e) {
      console.log(e.message);
    }
  }

  ondone() {
    this.router.navigate(['/admin/activitymonitoring']);
  }
}
