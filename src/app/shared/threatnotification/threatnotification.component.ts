import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ThreatNotificationService } from './threatnotification.service';
import { IActivityMonitoring } from '../../../assets/interfaces/iactivity-monitoring';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { NotificationsMenuService } from '../../core';
import { environment } from '../../../environments/environment';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-threatnotification',
  templateUrl: 'threatnotification.component.html'
})
export class ThreatNotificationComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() id = 'default-alert';
  @Input() message: IActivityMonitoring = {};
  @ViewChild('th_alert_dv', { static: true }) ThAlertDv: ElementRef;

  time = '';
  alertSubscription: Subscription;
  routeSubscription: Subscription;
  isFirstClick = true;
  notificationLabel: string;

  constructor(private router: Router, private threatNotificationService: ThreatNotificationService,
    private shareDataService: ShareDataService, private notificationsMenuService: NotificationsMenuService) {
  }

  ngOnInit(): void {
    // cache frequently used DOM element
    const alertDv = this.ThAlertDv.nativeElement;

    // subscribe to new alert notifications
    this.alertSubscription = this.threatNotificationService.onAlert(this.id)
      .pipe(
        filter(alert => !!alert.message && this.router.url !== '/admin/activitymonitoring' && this.router.url !== '/terms'),
        tap(alert => {
          this.notificationLabel = this.shareDataService.getLabels() === 'en-US-hexwave' ? 'CHECKPOINT:' : 'TERMINAL:';
          this.message = JSON.parse(alert.message);
          if (!this.message.screenerMessage) {
            this.time = this.msToTime(this.message.creationTimestamp);
            alertDv.style.display = 'block';
            if (alert.autoClose) {
              setTimeout(() => this.removeAlert(), environment.threatNotificationPopupInterval);
            }
          }
        })
      )
      .subscribe();

    // clear alerts on location change
    this.routeSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart)
      )
      .subscribe(() => this.removeAlert());
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  removeAlert() {
    localStorage.setItem('isNotify', 'false');
    this.ThAlertDv.nativeElement.style.display = 'none';
  }

  showThreat() {
    this.notificationsMenuService.removeNotification(this.message.id);
    this.shareDataService.setSharedData(this.message);

    if (this.isFirstClick) {
      this.isFirstClick = false;
      this.router.navigate(['./admin/activitymonitoring/activitythreats']);
    } else {
      this.router.navigateByUrl('/?isskip=1', { skipLocationChange: true }).then(() => {
        this.router.navigate(['./admin/activitymonitoring/activitythreats']);
      });
    }
  }

  showAllNotifications() {
    if (this.isFirstClick) {
      this.isFirstClick = false;
      this.router.navigate(['./admin/dashboard/notifications']);
    } else {
      this.router.navigateByUrl('/?isskip=1', { skipLocationChange: true }).then(() => {
        this.router.navigate(['./admin/dashboard/notifications']);
      });
    }
  }
  msToTime(s) {
    const utcSeconds = s / 1000;
    const date = new Date(0); // The 0 there is the key, which sets the date to the epoch
    date.setUTCSeconds(utcSeconds);

    let hours: string = date.getHours().toString();
    const minutes: string = date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes().toString();
    const seconds: string = date.getSeconds() < 10 ? '0' + date.getSeconds().toString() : date.getSeconds().toString();
    hours = hours.length === 1 ? '0' + hours : hours; // add a leading zero for hours < 10
    const strTime = hours + ':' + minutes + ':' + seconds;
    return strTime;
  }
}
