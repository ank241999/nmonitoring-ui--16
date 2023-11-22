import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportService } from '../../../../assets/services/report.service';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { IScreenerMessage } from '../../../../assets/interfaces/ireports';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf'
const $ = require('jquery');

@Component({
  selector: 'app-screenermessage',
  templateUrl: './screenermessage.component.html',
  styleUrls: ['./screenermessage.component.scss'],
  providers: [DatePipe, { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})
export class ScreenermessageComponent implements OnInit {

  users: IScreenerMessage[] = [];

  displayedColumns: string[] = ['date', 'gate', 'lane', 'devices', 'screenerMessage'];
  dataSource: MatTableDataSource<IScreenerMessage>;

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  selection = new SelectionModel<IScreenerMessage>(true, []);
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
    private translate: TranslateService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private shareDataService: ShareDataService,
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
    this.reportService.getScreenerMessage(this.fromDate, this.toDate).subscribe(res => {
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
        'DATE & TIME': (this.datePipe.transform(e.date, 'MM/dd/yyyy HH:mm:ss')),
        [this.translate.instant('accmaggate')]: e.gate,
        'LANE': e.lane,
        'DEVICE': e.devices,
        'SCREENER MESSAGE': e.screenerMessage
      };
      excelData.push(Data);
    });

    const ws = XLSX.utils.aoa_to_sheet([]);
    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.sheet_add_json(ws, excelData, { skipHeader: false, origin: 4 });

    XLSX.utils.sheet_add_aoa(ws, [['Screener Message Report']], { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(ws, [['Start Date : ' + this.datePipe.transform(this.fromDate, 'MM/dd/yyyy HH:mm')]], { origin: 'A2' });
    XLSX.utils.sheet_add_aoa(ws, [['End Date   : ' + this.datePipe.transform(this.toDate, 'MM/dd/yyyy HH:mm')]], { origin: 'A3' });

    ws['!cols'] = [];
    Object.keys(excelData[0]).forEach((cell: any) => {
      const colWidth =
        cell === 'DATE & TIME'
          ? 120
          : cell === this.translate.instant('accmaggate')
            ? 70
            : cell === 'LANE'
              ? 60
              : cell === 'DEVICE'
                ? 100
                : cell === 'SCREENER MESSAGE'
                  ? 140
                  : 100;
      ws['!cols'].push({
        wpx: colWidth
      });
    });
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Screener Message Report.xlsx');
  }

  downloadPDF() {
    const doc = new jsPDF('p', 'pt');

    doc.text('Screener Message Report', 30, 20);
    doc.text('Start Date  : ' + this.datePipe.transform(this.fromDate, 'MM/dd/yyyy  HH:mm'), 30, 45);
    doc.text('End Date    : ' + this.datePipe.transform(this.toDate, 'MM/dd/yyyy HH:mm'), 30, 65);
    const rows = [];

    this.users.forEach(e => {
      const tmpRow = [
        (this.datePipe.transform(e.date, 'MM/dd/yyyy HH:mm:ss')),
        (e.gate == null ? '' : e.gate),
        (e.lane == null ? '' : e.lane),
        (e.devices == null ? '' : e.devices),
        (e.screenerMessage == null ? '' : e.screenerMessage),
      ];
      rows.push(tmpRow);
    });

    autoTable(doc, {
      columns: [
        { header: 'DATE & TIME', },
        { header: this.translate.instant('accmaggate') },
        { header: 'LANE' },
        { header: 'DEVICE' },
        { header: 'SCREENER MESSAGE' }
      ],
      body: rows,
      startY: 80,
      margin: { left: 30 },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 50 },
        2: { cellWidth: 60 },
        3: { cellWidth: 70 },
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
    doc.setPage(1);
    doc.setFont('helvetica', 'bold');
    doc.save('Screener Message Report');
  }
}
