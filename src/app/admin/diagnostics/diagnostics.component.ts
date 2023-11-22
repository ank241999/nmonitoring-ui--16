import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { NotificationService } from '../../../assets/services/notification.service';
import { environment } from '../../../environments/environment';
import { RebootComponent } from './reboot/reboot.component';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-diagnostics',
  templateUrl: './diagnostics.component.html',
  styleUrls: ['./diagnostics.component.scss']
})
export class DiagnosticsComponent implements OnInit {
  url: string = environment.websocket_url.replace('9001/hello', '8234');
  urlMap: SafeResourceUrl;
  showcapture = false;

  constructor(
    private router: Router,
    private shareDataService: ShareDataService,
    private translate: TranslateService,
    public sanitizer: DomSanitizer,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private spinnerService: NgxSpinnerService,
    private http: HttpClient) {
    translate.setDefaultLang(shareDataService.getLabels());
    document.body.style.background = '#EBEBEB';
  }

  ngOnInit() {
    this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl('/assets/images/Liberty-Defense-Logo-.png');
  }

  startcapture() {
    this.spinnerService.show();
    this.http.get<any>('/start-capture').subscribe(res => {
      this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl(this.url.replace('ws', 'http'));
      this.showcapture = true;
      this.spinnerService.hide();
    },
      err => {
        this.spinnerService.hide();
        this.notificationService.showNotification('Error occurred: ' + err['error']['reason'], 'top', 'center', 'danger', 'info-circle');
      });
  }

  stopcapture() {
    this.spinnerService.show();
    this.http.get<any>('/stop-capture').subscribe(res => {
      this.showcapture = false;
      this.spinnerService.hide();
    },
      err => {
        this.spinnerService.hide();
        this.notificationService.showNotification('Error occurred: ' + err['error']['reason'], 'top', 'center', 'danger', 'info-circle');
      });
  }

  rebootDevice() {
    this.dialog.open(RebootComponent, {
      data: {
        text: 'REBOOT'
      },
      panelClass: 'custom-dialog-container'
    });
  }

  shutdownDevice() {
    this.dialog.open(RebootComponent, {
      data: {
        text: 'SHUTDOWN'
      },
      panelClass: 'custom-dialog-container'
    });
  }

  onClose() {
    this.router.navigate(['/admin/dashboard']);
  }
}
