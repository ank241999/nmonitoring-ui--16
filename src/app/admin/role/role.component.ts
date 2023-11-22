import { Component, ViewChild, ViewEncapsulation, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { UserService } from '../../../assets/services/user.service';
import { IUser } from '../../../assets/interfaces/iuser';
import { RoleCapabilityComponent } from './rolecapability/rolecapability.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertComponent } from '../../shared';
import { NotificationService } from '../../../assets/services/notification.service';
import { Router } from '@angular/router';
import { ShareDataService } from '../../../assets/services/share-data.service';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

import { TranslateService } from '@ngx-translate/core';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { IAccesslevel, IRole } from '../../../assets/interfaces/iuserroleauth';
import { UserRoleAuthService } from '../../../assets/services/user-role-auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

const $ = require('jquery');

@Component({
  selector: 'app-role-page',
  templateUrl: './role.component.html',
  styleUrls: ['./styles/role.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})

export class RoleComponent implements OnInit {
  roles: IAccesslevel[] = [];

  displayedColumns: string[] = ['select', 'accessLevels'];
  dataSource: MatTableDataSource<IAccesslevel>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  selection = new SelectionModel<IAccesslevel>(true, []);

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
      this.userRoleAuthService.getAccessibilities().subscribe(res => {
        if (res['status'] === 200) {
          this.roles = res['data'];

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
    this.dataSource = new MatTableDataSource(this.roles);
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

  }

  openDialog() {
    if (this.selection.selected.length > 0) {
      this.shareDataService.setSharedData(this.selection.selected[0]);
      this.router.navigate(['./admin/roles/rolecapability']);
    }
  }
}
