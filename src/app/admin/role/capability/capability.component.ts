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
import { ICapability, IRole } from '../../../../assets/interfaces/iuserroleauth';
import { UserRoleAuthService } from '../../../../assets/services/user-role-auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

const $ = require('jquery');

@Component({
  selector: 'app-capability',
  templateUrl: './capability.component.html',
  styleUrls: ['./styles/capability.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class CapabilityComponent implements OnInit {
  capabilities: ICapability[] = [];

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
  }

  ngOnInit() {
    try {
      this.spinnerService.show();
      this.userRoleAuthService.getCapability().subscribe(res => {
        // alert(JSON.stringify(res))
        if (res['status'] === 200) {
          this.capabilities = res['data'];
          // alert(JSON.stringify(this.capabilities))
          this.filterDeployments();
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
    this.router.navigate(['/admin/dashboard']);
  }

  deleteAccount() {
    let deleteConfirmMessage = '';
    let selectedCapabilities = '';
    if (this.selection.selected.length > 1) {
      this.selection.selected.forEach(element => {
        selectedCapabilities = selectedCapabilities + ', ' + element.capabilityName;
      });

      selectedCapabilities = selectedCapabilities.substring(1, selectedCapabilities.length);
      deleteConfirmMessage = 'Delete Capabilities';
    } else if (this.selection.selected.length === 1) {
      selectedCapabilities = this.selection.selected[0].capabilityName;
      deleteConfirmMessage = 'Delete Capability ' + selectedCapabilities + '?';
    }

    if (this.selection.selected.length > 0) {
      const dialogRef = this.dialog.open(AlertComponent, {
        data: {
          icon: 'exclamation-circle',
          iconColor: 'success',
          title: deleteConfirmMessage, // 'Are you sure you want to delete this Location?',
          text: selectedCapabilities, // 'Think it twice',
          options: true
        },
        panelClass: 'custom-dialog-container'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const selectedCapabilitiesIds: number[] = [];
          this.selection.selected.forEach(element => {
            selectedCapabilitiesIds.push(element.id);
          });

          this.userRoleAuthService.deleteCapability(selectedCapabilitiesIds).subscribe(res => {
            if (res['status'] === 200) {
              this.dialog.open(AlertComponent, {
                data: {
                  icon: 'check-circle',
                  iconColor: 'success',
                  title: 'Congrats!',
                  text: 'Successfully deleted.',
                  button: 'OK'
                },
                panelClass: 'custom-dialog-container'
              });

              this.selection.clear();
              this.ngOnInit();
            }
            this.selection.clear();
            this.ngOnInit();
          },
            err => {
              console.log('Error occurred: ' + err.message);
              this.spinnerService.hide();

              if (err['status'] === 401) {
                this.notificationService.showNotification(err['error'], 'top', 'center', 'danger', 'info-circle');
              }
            });
        } else {
          // this.selection.clear();
        }
      });
    }
  }

  openDialog() {
    if (this.selection.selected.length > 0) {
      this.shareDataService.setSharedData(this.selection.selected[0]);
      this.router.navigate(['/admin/roles/modifycapability']);
    }
  }
}
