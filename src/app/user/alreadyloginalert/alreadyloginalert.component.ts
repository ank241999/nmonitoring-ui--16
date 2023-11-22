import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IUser } from '../../../assets/interfaces/iuser';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { ShareDataService } from '../../../assets/services/share-data.service';
const $ = require('jquery');

@Component({
  selector: 'app-alreadyloginalert',
  templateUrl: './alreadyloginalert.component.html',
  styleUrls: ['./alreadyloginalert.component.scss', '../styles.css']
})
export class AlreadyloginalertComponent implements OnInit {
  filteredOptions?: Observable<IUser[]>;
  selectedUser: IUser[] = [];
  users: IUser[] = [];
  alreadyLoggedInButtonText = 'LOGOUT AT DEVICE ';
  id = '';
  device = '';
  roleId = 0;
  isAgree = false;

  loginForm = new FormGroup({
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ]))
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private shareDataService: ShareDataService) {
    translate.setDefaultLang(shareDataService.getLabels());
    document.body.style.background = '#EBEBEB';
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      this.device = params['device'];
      this.id = params['id'];
      this.roleId = params['roleId'];
      this.isAgree = params['isAgree'];

      if (email) {
        this.loginForm.controls['email'].setValue(email);
      }
      if (this.device) {
        this.translate.get('msgalreadyloggedin').subscribe((text: string) => {
          $('#loggout-alert-sp').text(text + this.device);
        });

        this.translate.get('lblbuttonlogout').subscribe((text: string) => {
          this.alreadyLoggedInButtonText = text + this.device;
        });
      }
    });
  }

  onSubmit() {
    this.router.navigate(['alreadylogin'],
      {
        queryParams:
          { email: this.loginForm.controls['email'].value, id: this.id, device: this.device, roleId: this.roleId, isAgree: this.isAgree }
      });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
