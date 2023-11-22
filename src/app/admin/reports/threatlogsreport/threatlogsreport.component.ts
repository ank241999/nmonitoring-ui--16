import { Component, ViewChild, ViewEncapsulation, Inject, PLATFORM_ID, OnInit, ViewChildren } from '@angular/core';
import { Location } from '@angular/common';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ReportService } from '../../../../assets/services/report.service';
import { IThreatLogReport, IThroughput } from '../../../../assets/interfaces/ireports';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import * as _moment from 'moment';

import 'jspdf-autotable';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf'
const $ = require('jquery');

const moment = _moment;

@Component({
  selector: 'app-threatlogsreport',
  templateUrl: './threatlogsreport.component.html',
  styleUrls: [
    '../styles/_forms-wizard.1.scss',
    '../styles/smart-tables.scss',
    '../styles/ng2-charts.scss',
    './threatlogsreport.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe, { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})
export class ThreatlogsreportComponent implements OnInit {
  logs: IThreatLogReport[] = [];

  displayedColumns: string[] = [
    'guardName',
    'gateName',
    'laneName',
    'deviceName',
    'creationDate',
    'actualResult',
    'configWeaponType',
    'configThreatType',
    'configThreatLocation',
    'logWeaponType',
    'logThreatType',
    'logThreatLocation',
    'notes'];
  dataSource: MatTableDataSource<IThreatLogReport>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  selection = new SelectionModel<IThreatLogReport>(true, []);

  filtersVisible = true;
  isBrowser: boolean;

  filtersForm: FormGroup;

  threatLocations = [
    { id: '1', value: 'Upper Front' },
    { id: '2', value: 'Upper Back' },
    { id: '3', value: 'Lower Front' },
    { id: '4', value: 'Lower Back' },
    { id: '5', value: 'Right Hip Front, Back' },
    { id: '6', value: 'Left Hip Front, Back' },
    { id: '7', value: 'Right Arm Front, Back' },
    { id: '8', value: 'Left Arm Front, Back' },
    { id: '9', value: 'Right Upper Leg Front, Back' },
    { id: '10', value: 'Right Lower Leg Front, Back' },
    { id: '11', value: 'Left Upper Leg Front, Back' },
    { id: '12', value: 'Left Lower Leg Front, Back' },
    { id: '13', value: 'Right Hip Front, Front' },
    { id: '14', value: 'Left Hip Front, Front' },
    { id: '15', value: 'Right Arm Front, Front' },
    { id: '16', value: 'Left Arm Front, Front' },
    { id: '17', value: 'Right Upper Leg Front, Front' },
    { id: '18', value: 'Right Lower Leg Front, Front' },
    { id: '19', value: 'Left Upper Leg Front, Front' },
    { id: '20', value: 'Left Lower Leg Front, Front' }
  ];

  currentDate = new Date();
  currMonth = this.currentDate.getMonth();
  currYear = this.currentDate.getFullYear();
  subscribed: string;
  dateFrom: string;
  dateTo: string;
  showBackButton = false;

  reportContent: any;
  fromDate: number;
  toDate: number;
  isEnabled = false;

  totalRecords: number;
  pageSizeOptions: number[] = [100, 200, 1000];
  pageSize = 100;
  // MtPaginator Output
  pageEvent: PageEvent;

  pageFrom = 0;
  pageTo = 100;
  minFromDate: Date;
  maxFromDate: Date | null;
  minToDate: Date | null;
  maxToDate: Date;

  constructor(
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object,
    private reportService: ReportService,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private shareDataService: ShareDataService,
    private location: Location,
    private translate: TranslateService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private spinnerService: NgxSpinnerService
  ) {
    translate.setDefaultLang(shareDataService.getLabels());
    document.body.style.background = '#EBEBEB';

    this.isBrowser = isPlatformBrowser(platformId);
    this.filtersForm = fb.group({
      search: '',
      dateFrom: new FormControl(new Date(new Date().getTime() - (0 * 24 * 60 * 60 * 1000))),
      dateTo: new FormControl(new Date()),
      subscribedTime: new FormControl('00:00'),
      dateToTime: new FormControl('23:59'),
      threatType: new FormControl(''),
      weapon: new FormControl(''),
      location: new FormControl(''),
      isCorrectResult: new FormControl('all'),
      incorrectRecordsBy: new FormControl('all')
    });

    this.fromDate = new Date(this.currYear, this.currMonth - 1, this.currentDate.getDate()).getTime();
    this.toDate = new Date(this.currYear, this.currMonth, this.currentDate.getDate()).getTime();
    this.filtersForm.valueChanges.subscribe(form => { this.table1Filter(form); });
    this.minFromDate = new Date(1900, 0, 1);
    this.maxFromDate = new Date();

    this.minToDate = new Date(1900, 0, 1);
    this.maxToDate = new Date();

    const correctResult = this.route.snapshot.queryParamMap.get('correctResult');
    if (correctResult) {
      const routeData = this.shareDataService.getSharedData();
      console.log(routeData);
      this.filtersForm.controls['dateFrom'].patchValue(routeData['dateFrom']);
      this.filtersForm.controls['dateTo'].patchValue(routeData['dateTo']);
      this.filtersForm.controls['threatType'].patchValue(routeData['threatType']);
      this.filtersForm.controls['weapon'].patchValue(routeData['weapon']);
      this.filtersForm.controls['location'].patchValue(routeData['location']);
      this.filtersForm.controls['isCorrectResult'].patchValue(routeData['isCorrect']);
      this.filtersForm.controls['incorrectRecordsBy'].patchValue(routeData['incorrectRecordsBy']);
      this.filtersForm.controls['subscribedTime'].patchValue(routeData['dateFromTime']);
      this.filtersForm.controls['dateToTime'].patchValue(routeData['dateToTime']);

      this.showReport('initial');
      this.showBackButton = true;
    }
  }

  ngOnInit() {
    $('#showdata').prev().hide();
    this.showReport('initial');
  }

  showReport(value: any) {
    this.spinnerService.show();
    const daySeconds: number = ((60 * 60 * 24) - 1) * 1000;
    let fromDate = '';
    let toDate = '';

    if (this.filtersForm.controls['dateFrom'].value) {
      this.subscribed = this.filtersForm.value.dateFrom;
      fromDate = new Date(this.datePipe.transform(
        this.subscribed, 'yyyy-MM-dd ' + this.filtersForm.value.subscribedTime)).toISOString().slice(0, 19).replace('T', ' ');
    }

    if (this.filtersForm.controls['dateTo'].value) {
      this.dateTo = this.filtersForm.value.dateTo;
      toDate = new Date(this.datePipe.transform(
        this.dateTo, 'yyyy-MM-dd ' + this.filtersForm.value.dateToTime)).toISOString().slice(0, 19).replace('T', ' ');
    }

    this.reportService.getThreatLogsReport(fromDate.toString(), toDate.toString(), this.pageFrom,
      this.pageTo,
      this.filtersForm.controls['weapon'].value,
      this.filtersForm.controls['location'].value,
      this.filtersForm.controls['threatType'].value,
      this.filtersForm.controls['isCorrectResult'].value,
      this.filtersForm.controls['incorrectRecordsBy'].value).subscribe(res => {
        console.log(res);
        if (res == null) {
          $('#showdata').show();
          $('#showdata').prev().hide();
        } else {
          this.logs = res;

          this.logs.forEach(x => {
            x.creationDate = x.creationDate + 'Z';
          });

          if (this.logs.length === 0) {
            $('#showdata').show();
            $('#showdata').prev().hide();
          } else {
            this.totalRecords = +this.logs[0].maxTotalRecord;
            $('#showdata').hide();
            $('#showdata').prev().show();
            this.isEnabled = true;
          }

          if (value === 'initial') {
            this.filterDeployments();
          } else {
            this.dataSource = new MatTableDataSource(this.logs);
            this.dataSource.sortingDataAccessor = (item, property) => {
              return item[property];
            };
            this.dataSource.sort = this.sort;
          }

          this.spinnerService.hide();
        }
      });
  }

  filterDeployments() {
    this.dataSource = new MatTableDataSource(this.logs);
    this.dataSource.sortingDataAccessor = (item, property) => {
      return item[property];
    };
    // setTimeout(() => {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // }, 0);
  }

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  // clearFilters(): void {
  //   this.filtersForm.reset({
  //     search: '',
  //     subscribed: '',
  //     dateTo: ''
  //   });

  //   this.applyFilterTable1('');
  //   this.table1Filter(this.filtersForm.value);
  // }

  resetDatePicker(): void {
    this.filtersForm.controls.subscribed.reset('');
  }

  resetDatePickerTo(): void {
    this.filtersForm.controls.dateTo.reset('');
  }

  // applyFilterTable1(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }
  table1Filter(form): void {
    const ageRange = form.ageRange;
    this.dateFrom = form.dateFrom;
    this.dateTo = form.dateTo;
    const daySeconds: number = ((60 * 60 * 24) - 1) * 1000;

    this.fromDate = new Date(this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd 00:00:00')).getTime() - 1;
    this.toDate = new Date(this.datePipe.transform(this.dateTo, 'yyyy-MM-dd 23:59:59')).getTime() + daySeconds;

    this.dateValid();
  }

  dateValid() {
    if (this.dateFrom !== '' && this.dateTo !== '' && this.dateFrom > this.dateTo) {
      alert('Please ensure that the End Date is greater than or equal to the Start Date.');
      this.filtersForm.controls.dateTo.reset(this.dateTo = this.dateFrom);
      return false;
    }
  }

  downloadEXCEL() {
    const excelData = [];

    this.logs.forEach(e => {
      const Data = {
        'GUARD ID': e.guardName,
        [this.translate.instant('accmaggate')]: e.gateName,
        'LANE': e.laneName,
        'DEVICE': e.deviceName,
        'ALARM DATE & TIME': (this.datePipe.transform(e.creationDate, 'MM/dd/yyyy HH:mm:ss')),
        'CORRECT RESULT': (e.actualResult === true ? 'Yes' : 'No'),
        'CONFIG WEAPON': e.configWeaponType,
        'ALARM TYPE': e.configThreatType,
        'ALARM LOCATION': e.configThreatLocation,
        'LOGGED WEAPON': e.logWeaponType,
        'LOGGED ALARM TYPE': e.logThreatType,
        'LOGGED LOCATION': e.logThreatLocation,
        'NOTES': e.note
      };
      excelData.push(Data);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

    const wscols = [
      { wch: 20 },
      { wch: 10 },
      { wch: 8 },
      { wch: 12 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 10 }
    ];

    ws['!cols'] = wscols;
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'BetaTestModeReport.xlsx');
  }

  downloadPDF() {
    this.logs = ActivityConstants.arraySortByKey(this.logs, 'creationTimestamp');
    const doc = new jsPDF('l', 'pt'); // Set landscape mode

    doc.text('Beta Test Mode Report', 10, 20,);
    doc.text('Start Date : ' + this.datePipe.transform(this.subscribed, 'yyyy-MM-dd ' + this.filtersForm.value.subscribedTime), 10, 45,);
    doc.text('End Date   : ' + this.datePipe.transform(this.dateTo, 'yyyy-MM-dd ' + this.filtersForm.value.dateToTime), 10, 65,);
    const rows = [];

    this.logs.forEach(e => {
      const tmpRow = [e.guardName,
      e.gateName,
      e.laneName,
      e.deviceName,
      (this.datePipe.transform(e.creationDate, 'MM/dd/yyyy HH:mm:ss')),
      (e.actualResult === true ? 'Yes' : 'No'),
      e.configWeaponType,
      e.configThreatType,
      e.configThreatLocation,
      e.logWeaponType,
      e.logThreatType,
      e.logThreatLocation,
      e.note];
      rows.push(tmpRow);
    });

    autoTable(doc, {
      columns: [
        { header: 'GUARD ID', },
        { header: this.translate.instant('accmaggate') },
        { header: 'LANE' },
        { header: 'DEVICE' },
        { header: 'ALARM DATE & TIME' },
        { header: 'CORRECT RESULT' },
        { header: 'CONFIG WEAPON' },
        { header: 'ALARM TYPE' },
        { header: 'ALARM LOCATION' },
        { header: 'LOGGED WEAPON' },
        { header: 'LOGGED ALARM TYPE' },
        { header: 'LOGGED LOCATION' },
        { header: 'NOTES' },
      ],
      body: rows,
      startY: 80,
      margin: { left: 30 },
      columnStyles: {
        0: { cellWidth: 115 },
        1: { cellWidth: 60 },
        2: { cellWidth: 45 },
        3: { cellWidth: 55 },
        4: { cellWidth: 70 },
        5: { cellWidth: 60 },
        6: { cellWidth: 60 },
        7: { cellWidth: 45 },
        8: { cellWidth: 70 },
        9: { cellWidth: 65 },
        10: { cellWidth: 60 },
        12: { cellWidth: 60 },
        13: { cellWidth: 45 }
      },

      alternateRowStyles: {
        fillColor: [239, 239, 239],
      },
      styles: {
        lineColor: [0, 0, 0],
        // textColor: [0, 0, 0],
        lineWidth: 0.5,
        fontSize: 11,
      },
    });

    doc.setPage(1);
    doc.save('BetaTestModeReport.pdf');
  }

  onScreenBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  onScreenClose() {
    this.router.navigate(['/admin/reports/analyticdatareport']);
  }

  onPaginateChange(event) {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    this.pageFrom = (pageIndex === 0 ? 0 : pageIndex * pageSize);
    this.pageTo = this.pageFrom + pageSize;

    this.showReport('paginator');
    // this.applyFilters();
  }
}
