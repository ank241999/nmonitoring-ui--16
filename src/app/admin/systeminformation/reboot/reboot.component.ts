import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../../assets/services/notification.service';
import { SysteminformationService } from '../../../../assets/services/systeminformation.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessagingService } from 'src/assets/services/messaging.service';
import { StompState } from '@stomp/ng2-stompjs';

@Component({
  selector: 'app-reboot',
  templateUrl: './reboot.component.html',
  styleUrls: ['./reboot.component.scss']
})
export class RebootComponent implements OnInit {
  title = '';
  titlePrimary = '';
  ipPrimary: string;
  ipPrimaryName: string;
  ipPaired: string;
  ipPairedName: string;
  text: undefined;
  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA)
  public data: { ipPrimary: string, ipPrimaryName: string, ipPaired: string, ipPairedName: string },
    private messagingService: MessagingService,
    private spinnerService: NgxSpinnerService,
    private dialogRef: MatDialogRef<any>,
    private notificationService: NotificationService,
    public formBuilder: FormBuilder,
    private systeminformationService: SysteminformationService) {
    this.form = formBuilder.group({
      password: new FormControl('', Validators.required),
      passwordPrimary: new FormControl('', Validators.required)
    });
    this.ipPrimary = data.ipPrimary;
    this.ipPrimaryName = data.ipPrimaryName;
    this.ipPaired = data.ipPaired;
    this.ipPairedName = data.ipPairedName;
  }

  ngOnInit(): void {
    this.title = this.ipPairedName;
    this.titlePrimary = this.ipPrimaryName;
  }

  connectionState() {
    const subscription = this.messagingService.state().subscribe((state: StompState) => {
      if (StompState[state] === 'CLOSED') {
        this.notificationService.showNotification('Device will actually be rebooted', 'top', 'center', 'warning', 'info-circle');
        subscription.unsubscribe();
      } else if (StompState[state] === 'CONNECTED') {
        this.notificationService.showNotification('Invalid password', 'top', 'center', 'danger', 'info-circle');
        subscription.unsubscribe();
      }
    });

    this.spinnerService.hide();
  }

  onSubmit() {
    this.spinnerService.show();
    this.systeminformationService.rebootServiceIP(this.form.controls['password'].value, this.ipPaired).subscribe(res => {
      setTimeout(() => {
        this.connectionState();
      }, 3000);
    },
      err => {
        setTimeout(() => {
          this.connectionState();
        }, 3000);
      });

    this.systeminformationService.rebootServiceIP(this.form.controls['password'].value, this.ipPrimary).subscribe(res => {
      setTimeout(() => {
        this.connectionState();
      }, 3000);
    },
      err => {
        setTimeout(() => {
          this.connectionState();
        }, 3000);
      });

    this.onScreenClose();
  }

  onScreenClose() {
    this.dialogRef.close();
  }
}
