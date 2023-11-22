import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StompState } from '@stomp/ng2-stompjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessagingService } from 'src/assets/services/messaging.service';
import { NotificationService } from '../../../../assets/services/notification.service';
import { StatemonitoringService } from '../../../../assets/services/statemonitoring.service';

@Component({
  selector: 'app-reboot',
  templateUrl: './reboot.component.html',
  styleUrls: ['./reboot.component.scss']
})
export class RebootComponent implements OnInit {
  form: FormGroup;
  text: undefined;
  isconnection = true;

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private messagingService: MessagingService,
    private spinnerService: NgxSpinnerService,
    private notificationService: NotificationService,
    public formBuilder: FormBuilder,
    private statemonitoringservice: StatemonitoringService) {
    this.text = data.text;
    this.form = formBuilder.group({
      password: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
  }

  connectionState() {
    const subscription = this.messagingService.state().subscribe((state: StompState) => {
      if (StompState[state] === 'CLOSED') {
        if (this.text === 'REBOOT') {
          this.notificationService.showNotification('Device will actually be rebooted', 'top', 'center', 'warning', 'info-circle');
        } else {
          this.notificationService.showNotification('Device will actually be shutdown', 'top', 'center', 'warning', 'info-circle');
        }
        subscription.unsubscribe();
      } else if (StompState[state] === 'CONNECTED') {
        this.notificationService.showNotification('Invalid password.', 'top', 'center', 'danger', 'info-circle');
        subscription.unsubscribe();
      }
    });

    this.spinnerService.hide();
  }

  onSubmit() {
    this.spinnerService.show();

    if (this.text === 'REBOOT') {
      this.statemonitoringservice.rebootService(this.form.controls['password'].value).subscribe(res => {
        setTimeout(() => {
          this.connectionState();
        }, 3000);
      },
        err => {
          setTimeout(() => {
            this.connectionState();
          }, 3000);
        });
    } else if (this.text === 'SHUTDOWN') {
      this.statemonitoringservice.shutdownService(this.form.controls['password'].value).subscribe(res => {
        setTimeout(() => {
          this.connectionState();
        }, 3000);
      },
        err => {
          setTimeout(() => {
            this.connectionState();
          }, 3000);
        });
    }

    this.onScreenClose();
  }

  onScreenClose() {
    this.dialogRef.close();
  }

}
