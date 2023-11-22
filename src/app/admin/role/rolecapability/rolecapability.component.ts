import { Component, ViewChild, ViewEncapsulation, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { UserService } from '../../../../assets/services/user.service';
import { IUser } from '../../../../assets/interfaces/iuser';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertComponent } from '../../../shared';
import { NotificationService } from '../../../../assets/services/notification.service';
import { Router } from '@angular/router';
import { ShareDataService } from '../../../../assets/services/share-data.service';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { IAccesslevel, ICapability, IRole, IRoleCapability, RoleCapability } from '../../../../assets/interfaces/iuserroleauth';
import { UserRoleAuthService } from '../../../../assets/services/user-role-auth.service';

import * as _moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

const moment = _moment;

const $ = require('jquery');

@Component({
  selector: 'app-rolecapaility',
  templateUrl: './rolecapability.component.html',
  styleUrls: ['./styles/rolecapaility.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class RoleCapabilityComponent implements OnInit {
  capabilities: ICapability[] = [];
  accesslevel: IAccesslevel;
  roleCapabilities: IRoleCapability[] = [];

  displayedColumns: string[] = ['select', 'capabilityName', 'description'];
  dataSource: MatTableDataSource<ICapability>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  selection = new SelectionModel<ICapability>(true, []);

  filtersVisible = true;
  isBrowser: boolean;
  rowId = 0;
  // creationTimestam: string;
  loggedInUserId: string;
  accessLevelName = '';

  constructor(public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private notificationService: NotificationService,
    private router: Router,
    private shareDataService: ShareDataService,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private spinnerService: NgxSpinnerService,
    private userRoleAuthService: UserRoleAuthService) {
    translate.setDefaultLang(shareDataService.getLabels());
    document.body.style.background = '#EBEBEB';
    this.isBrowser = isPlatformBrowser(platformId);
    this.loggedInUserId = shareDataService.email;

    this.accesslevel = shareDataService.getSharedData();
    this.accessLevelName = this.accesslevel.accessLevels + ' (' + this.accesslevel.label + ')';
  }

  ngOnInit() {
    try {
      this.spinnerService.show();
      this.userRoleAuthService.getCapability().subscribe(res => {
        if (res['status'] === 200) {
          this.capabilities = res['data'];

          this.filterDeployments();
          this.getRoleCapability();
          this.spinnerService.hide();
        }
      },
        err => {
          console.log('Error occurred: ' + err.message);
          this.spinnerService.hide();

          if (err['status'] === 401) {
            this.notificationService.showNotification(err['error'], 'top', 'center', 'danger', 'info-circle');
          }
        });
    } catch (e) {
      console.log(e.message);
    }
  }

  getRoleCapability() {
    try {
      this.spinnerService.show();
      this.userRoleAuthService.getRoleCapabilityByAccesslevelId(this.accesslevel.id).subscribe(res => {
        if (res['status'] === 200) {
          this.roleCapabilities = res['data'];

          if (this.dataSource != null) {
            this.roleCapabilities.filter(a => a.isActive === true).forEach(x => {
              if (this.dataSource.data.filter(a => a.id === x.capabilityID).length > 0) {
                this.dataSource.data.filter(a => a.id === x.capabilityID).forEach(row => this.selection.select(row));
              }
            });
          }

          this.spinnerService.hide();
        }
      },
        err => {
          console.log('Error occurred: ' + err.message);
          this.spinnerService.hide();

          if (err['status'] === 401) {
            this.notificationService.showNotification(err['error'], 'top', 'center', 'danger', 'info-circle');
          }
        });
    } catch (e) {
      console.log(e.message);
    }
  }

  filterDeployments() {
    this.dataSource = new MatTableDataSource(this.capabilities);
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        // case 'expiryDate': return new Date(item.expiryTimestamp);
        default: return item[property];
      }
    };
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 0);
  }

  applyFilter(filterValue: string) {
    this.selection.clear();
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAllSelected() {
    // this.deleteAccounts();
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === 0 ? false : numSelected === numRows;
  }

  selectAll() {
    this.selection.clear();
    this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.selectAll();
  }

  onScreenClose() {
    this.router.navigate(['/admin/roles']);
  }

  deleteAccount() {

  }

  openDialog() {

  }

  saveRoleCapability() {
    let deleteConfirmMessage = '';
    let selectedUsers = '';
    if (this.selection.selected.length > 1) {
      this.selection.selected.forEach(element => {
        selectedUsers = selectedUsers + ', ' + element.id;
      });

      selectedUsers = selectedUsers.substring(1, selectedUsers.length);
      deleteConfirmMessage = 'Save Access level Capabilities?';
    } else if (this.selection.selected.length === 1) {
      selectedUsers = this.selection.selected[0].id.toString();
      deleteConfirmMessage = 'Save Access level Capability?';
    }

    // if (this.selection.selected.length > 0) {
    const dialogRef = this.dialog.open(AlertComponent, {
      data: {
        // icon: 'exclamation-circle',
        // iconColor: 'success',
        title: deleteConfirmMessage, // 'Are you sure you want to delete this user?',
        text: selectedUsers, // 'Think it twice',
        options: true
      },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerService.show();
        const selectedUserIds: IRoleCapability[] = [];

        if (this.capabilities.length > 0) {
          this.capabilities.forEach(d => {
            let isActive = false;
            if (this.selection.selected.filter(s => s.capabilityName === d.capabilityName).length > 0) {
              isActive = true;
            }

            const roleCapb: IRoleCapability[] = this.roleCapabilities.filter(r => r.accessLevelID === this.accesslevel.id
              && r.capabilityID === d.id);

            if (roleCapb.length === 0) {
              const rc: IRoleCapability = new RoleCapability(0, d.id, 0, isActive, this.accesslevel.id);
              selectedUserIds.push(rc);
            } else if (roleCapb[0].isActive !== isActive) {
              const rc: IRoleCapability = new RoleCapability(0, d.id, 0, isActive, this.accesslevel.id);
              selectedUserIds.push(rc);
            }
          });
        }
        // this.selection.selected.forEach(element => {alert(JSON.stringify(element))
        //   let rc: IRoleCapability = new RoleCapability(0,element.id,this.role.id);
        //   selectedUserIds.push(rc);
        // });
        // alert(JSON.stringify(selectedUserIds))
        this.userRoleAuthService.saveRoleCapability(selectedUserIds).subscribe(res => {
          if (res['status'] === 200) {
            this.spinnerService.hide();
            this.selection.clear();
            this.ngOnInit();
          }
        },
          err => {
            this.spinnerService.hide();
            console.log('Error occurred: ' + err.message);

            if (err['status'] === 500) {
              this.notificationService.showNotification(err['error']['error'], 'top', 'center', 'danger', 'info-circle');
            } else {
              this.notificationService.showNotification('Error occurred: ' + err.message, 'top', 'center', 'danger', 'info-circle');
            }
          });
      } else {
        // this.selection.clear();
      }
    });
    // }
  }
}
