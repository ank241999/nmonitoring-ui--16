import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
// import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { IScanCount } from '../../../../assets/interfaces/ireports';
import { ReportService } from '../../../../assets/services/report.service';
import * as _moment from 'moment';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf'
const $ = require('jquery');
const moment = _moment;

@Component({
  selector: 'app-scancount',
  templateUrl: './scancount.component.html',
  styleUrls: ['./scancount.component.scss'],
  providers: [DatePipe, { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})
export class ScancountComponent implements OnInit {

  users: IScanCount[] = [];

  displayedColumns: string[] = ['guardName', 'email', 'totalPersonScanned', 'totalSuspectedPerson', 'totalAlarmsCount'];
  // displayedColumns: string[] = ['guardName', 'email', 'totalSuspectedPerson', 'totalAlarmsCount'];
  dataSource: MatTableDataSource<IScanCount>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  selection = new SelectionModel<IScanCount>(true, []);


  filtersVisible = true;
  isBrowser: boolean;

  filtersForm: FormGroup;

  currentDate = new Date();
  currMonth = this.currentDate.getMonth();
  currYear = this.currentDate.getFullYear();
  subscribed: string;
  dateTo: string;
  fromDate: number;
  toDate: number;
  isEnabled = false;
  totalpersons: number;
  total: number;
  minFromDate: Date;
  maxFromDate: Date | null;
  minToDate: Date | null;
  maxToDate: Date;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private reportService: ReportService,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private translate: TranslateService,
    private fb: FormBuilder,
    private shareDataService: ShareDataService,
    private datePipe: DatePipe,
    private spinnerService: NgxSpinnerService
  ) {
    translate.setDefaultLang(shareDataService.getLabels());
    document.body.style.background = '#EBEBEB';

    this.isBrowser = isPlatformBrowser(platformId);
    this.filtersForm = fb.group({
      search: '',
      subscribed: new FormControl(new Date(new Date().getTime() - (0 * 24 * 60 * 60 * 1000))),
      dateTo: new FormControl(new Date()),
      subscribedTime: new FormControl('00:00'),
      dateToTime: new FormControl('23:59')
    });

    this.filtersForm.valueChanges.subscribe(form => { this.table1Filter(form); });
    this.minFromDate = new Date(1900, 0, 1);
    this.maxFromDate = new Date();

    this.minToDate = new Date(1900, 0, 1);
    this.maxToDate = new Date();
  }



  ngOnInit() {
    $('#showdata').prev().hide();
    this.showReport();


  }

  showReport() {
    this.spinnerService.show();
    this.fromDate = new Date(this.datePipe.transform(this.filtersForm.value.subscribed, 'yyyy-MM-dd '
      + this.filtersForm.value.subscribedTime)).getTime();
    this.toDate = new Date(this.datePipe.transform(this.filtersForm.value.dateTo, 'yyyy-MM-dd '
      + this.filtersForm.value.dateToTime)).getTime();
    this.reportService.getScanCount(this.fromDate, this.toDate).subscribe(res => {
      this.users = res;

      if (this.users.length === 0) {
        $('#showdata').show();
        $('#showdata').prev().hide();
      } else {
        $('#showdata').hide();
        $('#showdata').prev().show();
      }
      this.filterDeployments();

      this.spinnerService.hide();
      this.isEnabled = true;
    }, err => {
      console.log('Error occurred: ' + err.message);
      this.spinnerService.hide();
    });
  }



  transform(value: number): number {
    const d = new Date(value);
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    return new Date(new Date(new Date(utc) + 'UTC').toLocaleString()).getTime();
  }

  filterDeployments() {
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.sortingDataAccessor = (item, property) => {
      return item[property];
    };
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 0);
  }

  table1Filter(form): void {
    const ageRange = form.ageRange;
    this.subscribed = form.subscribed;
    this.dateTo = form.dateTo;
    const daySeconds: number = ((60 * 60 * 24) - 1) * 1000;

    this.fromDate = new Date(this.datePipe.transform(this.subscribed, 'yyyy-MM-dd 00:00:00')).getTime() - 1;
    this.toDate = new Date(this.datePipe.transform(this.dateTo, 'yyyy-MM-dd 23:59:59')).getTime() + daySeconds;

    this.dateValid();
  }

  dateValid() {
    if (this.subscribed !== '' && this.dateTo !== '' && this.subscribed > this.dateTo) {
      alert('Please ensure that the End Date is greater than or equal to the Start Date.');
      this.filtersForm.controls.dateTo.reset(this.dateTo = this.subscribed);
      return false;
    }
  }

  downloadEXCEL() {
    const excelData = [];

    this.users.forEach(e => {
      const Data = {
        'GUARD NAME': (e.guardName == null ? '' : e.guardName),
        'GUARD ID': (e.email == null ? '' : e.email),
        'TOTAL PERSON SCANNED': (e.totalPersonScanned == null ? '' : e.totalPersonScanned),
        'TOTAL ALARMED PERSON': (e.totalSuspectedPerson == null ? '' : e.totalSuspectedPerson),
        'ALARMS COUNT': (e.totalAlarmsCount == null ? '' : e.totalAlarmsCount)
      };
      excelData.push(Data);
    });

    const ws = XLSX.utils.aoa_to_sheet([]);
    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.sheet_add_json(ws, excelData, { skipHeader: false, origin: 4 });

    XLSX.utils.sheet_add_aoa(ws, [['Scan Count Report']], { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(ws, [['Start Date ' + this.datePipe.transform(this.fromDate, 'MM/dd/yyyy HH:mm')]], { origin: 'A2' });
    XLSX.utils.sheet_add_aoa(ws, [['End Date ' + this.datePipe.transform(this.toDate, 'MM/dd/yyyy HH:mm')]], { origin: 'A3' });

    ws['!cols'] = [];
    Object.keys(excelData[0]).forEach((cell: any) => {
      const colWidth =
        cell === 'GUARD NAME'
          ? 100
          : cell === 'GUARD ID'
            ? 120
            : cell === 'TOTAL PERSON SCANNED'
              ? 140
              : cell === 'TOTAL ALARMED PERSON'
                ? 140
                : cell === 'ALARMS COUNT'
                  ? 90
                  : 100;
      ws['!cols'].push({
        wpx: colWidth
      });
    });


    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Scan Count Report.xlsx');
  }

  downloadPDF() {
    const doc = new jsPDF('p', 'pt');

    doc.text('Scan Count Report', 32, 20);
    doc.text('Start Date  : ' + this.datePipe.transform(this.fromDate, 'MM/dd/yyyy HH:mm'), 32, 45);
    doc.text('End Date    : ' + this.datePipe.transform(this.toDate, 'MM/dd/yyyy HH:mm'), 32, 65);
    const rows = [];

    this.users.forEach(e => {
      const tmpRow = [
        (e.guardName == null ? '' : e.guardName),
        (e.email == null ? '' : e.email),
        (e.totalPersonScanned == null ? '' : e.totalPersonScanned),
        (e.totalSuspectedPerson == null ? '' : e.totalSuspectedPerson),
        (e.totalAlarmsCount == null ? '' : e.totalAlarmsCount)
      ];
      rows.push(tmpRow);
    });

    autoTable(doc, {
      columns: [
        { header: 'GUARD NAME', },
        { header: 'GUARD ID' },
        { header: 'TOTAL PERSON SCANNED' },
        { header: 'TOTAL ALARMED PERSON' },
        { header: 'ALARMS COUNT' }
      ],
      body: rows,
      startY: 80,
      margin: { left: 32 },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 120 },
        2: { cellWidth: 120 },
        3: { cellWidth: 100 },
        4: { cellWidth: 90 }
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

    doc.setPage(1); doc.setPage(1);
    doc.save('Scan Count Report.pdf');
  }
}
