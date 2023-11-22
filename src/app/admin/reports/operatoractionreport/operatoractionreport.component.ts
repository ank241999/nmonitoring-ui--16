import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
// import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { IOperatorAction } from '../../../../assets/interfaces/ireports';
import { UserService } from '../../../../assets/services/user.service';
import { ReportService } from '../../../../assets/services/report.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import 'jspdf-autotable';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
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
  selector: 'app-operatoractionreport',
  templateUrl: './operatoractionreport.component.html',
  styleUrls: ['./operatoractionreport.component.scss'],
  providers: [DatePipe, { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})
export class OperatoractionreportComponent implements OnInit {

  users: IOperatorAction[] = [];

  displayedColumns: string[] = ['gate', 'lane', 'devices', 'guardName', 'email', 'alarmPosition', 'dateTime', 'clearTime'];
  dataSource: MatTableDataSource<IOperatorAction>;

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  selection = new SelectionModel<IOperatorAction>(true, []);
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
    private userService: UserService,
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
    this.reportService.getOperatorAction(this.fromDate, this.toDate).subscribe(res => {
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
        [this.translate.instant('accmaggate')]: e.gate,
        'LANE': e.lane,
        'DEVICE': e.devices,
        'GUARD NAME': e.guardName,
        'GUARD ID': e.email,
        // 'PERSON SCANNED ID': e.objectids,
        'ALARM LOCATION': e.alarmPosition,
        'ALARM DATE & TIME': (this.datePipe.transform(e.dateTime, 'MM/dd/yyyy HH:mm:ss')),
        'CLEAR TIME': (this.datePipe.transform(e.clearTime, 'MM/dd/yyyy HH:mm:ss')),
      };
      excelData.push(Data);
    });
    const ws = XLSX.utils.aoa_to_sheet([]);
    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.sheet_add_json(ws, excelData, { skipHeader: false, origin: 4 });

    XLSX.utils.sheet_add_aoa(ws, [['Operator Action Report']], { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(ws, [['Start Date : ' + this.datePipe.transform(this.fromDate, 'MM/dd/yyyy HH:mm')]], { origin: 'A2' });
    XLSX.utils.sheet_add_aoa(ws, [['End Date   : ' + this.datePipe.transform(this.toDate, 'MM/dd/yyyy HH:mm')]], { origin: 'A3' });

    ws['!cols'] = [];
    Object.keys(excelData[0]).forEach((cell: any) => {
      const colWidth =
        cell === this.translate.instant('accmaggate')
          ? 70
          : cell === 'LANE'
            ? 50
            : cell === 'DEVICE'
              ? 90
              : cell === 'GUARD NAME'
                ? 90
                : cell === 'GUARD ID'
                  ? 130
                  : cell === 'ALARM LOCATION'
                    ? 110
                    : cell === 'ALARM DATE & TIME'
                      ? 130.
                      : cell === 'CLEAR TIME'
                        ? 130
                        : 100;
      ws['!cols'].push({
        wpx: colWidth
      });
    });
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'OPERATOR ACTION REPORT.xlsx');
  }

  downloadPDF() {
    const doc = new jsPDF('p', 'pt');

    doc.text('OPERATOR ACTION REPORT', 20, 20);
    doc.text('Start Date  : ' + this.datePipe.transform(this.fromDate, 'MM/dd/yyyy  HH:mm'), 20, 45);
    doc.text('End Date    : ' + this.datePipe.transform(this.toDate, 'MM/dd/yyyy HH:mm'), 20, 65);
    const rows = [];

    this.users.forEach(e => {
      const tmpRow = [
        (e.gate == null ? '' : e.gate), (e.lane == null ? '' : e.lane),
        (e.devices == null ? '' : e.devices),
        (e.guardName == null ? '' : e.guardName),
        (e.email == null ? '' : e.email),
        (e.alarmPosition == null ? '' : e.alarmPosition),
        (this.datePipe.transform(e.dateTime, 'MM/dd/yyyy HH:mm:ss')),
        (this.datePipe.transform(e.clearTime, 'MM/dd/yyyy HH:mm:ss')),
      ];
      rows.push(tmpRow);
    });

    autoTable(doc, {
      columns: [
        { header: this.translate.instant('accmaggate') },
        { header: 'LANE', },
        { header: 'DEVICE' },
        { header: 'GUARD NAME' },
        { header: 'GUARD ID' },
        { header: 'ALARM LOCATION' },
        { header: 'ALARM DATE & TIME', },
        { header: 'CLEAR TIME' }
      ],
      body: rows,
      startY: 80,
      margin: { left: 20 },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 50 },
        2: { cellWidth: 60 },
        3: { cellWidth: 65 },
        4: { cellWidth: 100 },
        5: { cellWidth: 70 },
        6: { cellWidth: 70 },
        7: { cellWidth: 70 }
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
    doc.setFont('helvetica', 'bold');
    doc.save('OPERATOR ACTION REPORT');
  }
}
