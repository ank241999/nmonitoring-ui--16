import { Component, OnInit, Inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { CommunicationService } from '../../../../assets/services/communication-service';
import { UserService } from '../../../../assets/services/user.service';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MessagingService } from 'src/assets/services/messaging.service';

@Component({
  selector: 'app-addnote',
  templateUrl: './addnote.component.html',
  styleUrls: ['./addnote.component.scss']
})
export class AddnoteComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<string>,
    @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog,
    // private spinnerService: NgxSpinnerService,
    private router: Router, private userService: UserService,
    private translate: TranslateService,
    private shareDataService: ShareDataService,
    private communicationService: CommunicationService,
    private messagingService: MessagingService
  ) {
    translate.setDefaultLang(shareDataService.getLabels());
  }

  ngOnInit() {
  }

  logout() {
    this.messagingService.disconnect();
    this.communicationService = null;
    localStorage.setItem('notificationCount', '0');
    localStorage.setItem('deviceNotificaions', '');
    localStorage.setItem('rkaStop', 'false');

    this.userService.logOutUser().subscribe(res => {
      if (res['status'] === 200) {
        // ActivityConstants.retainRequiredValues();
        this.userService.logoutLog();
        this.shareDataService.clearSessionVariables();
        this.onScreenClose();

        this.router.navigate(['/login']);
      } else if (res['status'] === 500) {
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });
  }

  onclick() {
    // this.spinnerService.show();

    // this.spinnerService.hide();
    this.dialogRef.close();
  }

  onScreenClose() {
    // this.dialogRef.close();
    this.onclick();
  }
}
