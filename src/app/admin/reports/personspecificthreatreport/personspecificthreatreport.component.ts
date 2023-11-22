import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { IPersonSpecific } from '../../../../assets/interfaces/ireports';
import { ReportService } from '../../../../assets/services/report.service';
import * as _moment from 'moment';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { MatPaginator } from '@angular/material/paginator';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf'

const $ = require('jquery');
const moment = _moment;

@Component({
  selector: 'app-personspecificthreatreport',
  templateUrl: './personspecificthreatreport.component.html',
  styleUrls: ['../styles/_forms-wizard.1.scss', '../styles/smart-tables.scss', '../styles/ng2-charts.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe, { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})
export class PersonspecificthreatreportComponent implements OnInit {
  users: IPersonSpecific[] = [];
  uniqueData: IPersonSpecific[] = [];
  // displayedColumns: string[] = ['date', 'hour', 'objectids', 'totalAlarmCount'];
  displayedColumns: string[] = ['date', 'gate', 'lane', 'totalAlarmCount', 'alarmPosition', 'guardName', 'email'];
  dataSource: MatTableDataSource<IPersonSpecific>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  selection = new SelectionModel<IPersonSpecific>(true, []);

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
  totalScanned: number;
  totalSuspected: number;
  noAlarms: number;
  totalAlarms: number;
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
    if (localStorage.getItem('fromDate')) {
      this.filtersForm.controls['subscribed'].setValue(new Date(this.datePipe.transform(localStorage.getItem('fromDate'), 'yyyy-MM-dd')));
      this.filtersForm.controls['subscribedTime'].setValue(this.datePipe.transform(localStorage.getItem('fromDate'), 'HH:mm:ss'));
      this.filtersForm.controls['dateTo'].setValue(new Date(this.datePipe.transform(localStorage.getItem('toDate'),
        'yyyy-MM-dd HH:mm:ss')));
      this.filtersForm.controls['dateToTime'].setValue(this.datePipe.transform(localStorage.getItem('toDate'), 'HH:mm:ss'));
      localStorage.removeItem('fromDate');
      localStorage.removeItem('toDate');
    }

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
    this.reportService.getPersonSpecific(this.fromDate, this.toDate).subscribe(res => {
      this.users = res;

      const duplicateEntrySet = new Set();
      this.uniqueData = [];

      // Check for duplicate entries and mark them in the Set
      this.users.forEach((entry) => {
        const key = `${entry.devices}-${entry.date}`;
        if (!duplicateEntrySet.has(key)) {
          // Unique entry found, add it to uniqueUsers
          this.uniqueData.push(entry);
          duplicateEntrySet.add(key);
        }
      });

      this.totalScanned = this.uniqueData.length;
      this.totalSuspected = 0;
      this.totalAlarms = 0;
      this.noAlarms = 0;

      this.uniqueData.forEach((element, index) => {
        this.uniqueData[index].date = element.date;
        this.totalSuspected += (element.totalAlarmCount === 0 ? 0 : 1);
        this.noAlarms += (element.totalAlarmCount === 0 ? 1 : 0);
        this.totalAlarms += element.totalAlarmCount;
      });

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
        //'DEVICE': e.devices,
        // 'PERSON SCANNED ID': e.objectids,
        'ALARMS COUNT': e.totalAlarmCount,
        'ALARM LOCATION': e.alarmPosition,
        'GUARD NAME': e.guardName,
        'GUARD ID': e.email
      };
      excelData.push(Data);
    });

    const ws = XLSX.utils.aoa_to_sheet([]);
    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.sheet_add_json(ws, excelData, { skipHeader: false, origin: 9 });

    XLSX.utils.sheet_add_aoa(ws, [['Scan Count Details Report']], { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(ws, [['Start Date ' + this.datePipe.transform(this.fromDate, 'MM/dd/yyyy HH:mm')]], { origin: 'A2' });
    XLSX.utils.sheet_add_aoa(ws, [['End Date ' + this.datePipe.transform(this.toDate, 'MM/dd/yyyy HH:mm')]], { origin: 'A3' });
    XLSX.utils.sheet_add_aoa(ws, [['TOTAL SCANNED' + ' : ' + this.totalScanned]], { origin: 'A5' });
    XLSX.utils.sheet_add_aoa(ws, [['PERSONS ALARMED' + ' : ' + this.totalSuspected]], { origin: 'A6' });
    XLSX.utils.sheet_add_aoa(ws, [['PERSONS CLEARED' + ' : ' + this.noAlarms]], { origin: 'A7' });
    XLSX.utils.sheet_add_aoa(ws, [['TOTAL ALARMS' + ' : ' + this.totalAlarms]], { origin: 'A8' });

    ws['!cols'] = [];

    Object.keys(excelData[0]).forEach((cell: any) => {
      const colWidth =
        cell === 'DATE & TIME'
          ? 120
          : cell === this.translate.instant('accmaggate')
            ? 70
            : cell === 'LANE'
              ? 55
              // : cell === 'DEVICE'
              //   ? 110
              : cell === 'PERSON SCANNED ID'
                ? 110
                : cell === 'ALARMS COUNT'
                  ? 95
                  : cell === 'ALARM LOCATION'
                    ? 120
                    : cell === 'GUARD NAME'
                      ? 120
                      : cell === 'GUARD ID'
                        ? 120
                        : 100;
      ws['!cols'].push({
        wpx: colWidth
      });
    });

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'ScanCountDetailsReport.xlsx', { cellStyles: true },);
  }

  // downloadPDF() {
  //   const doc = new jsPDF('p', 'pt');

  //   doc.text(30, 20, 'Scan Count Details Report');
  //   doc.text(30, 45, 'Start Date  : ' + this.datePipe.transform(this.fromDate, 'MM/dd/yyyy  HH:mm'));
  //   doc.text(30, 65, 'End Date    : ' + this.datePipe.transform(this.toDate, 'MM/dd/yyyy HH:mm'));
  //   const col = [
  //     'DATE & TIME',
  //     this.translate.instant('accmaggate'),
  //     'LANE',
  //     //'DEVICE',
  //     // 'PERSON SCANNED ID',
  //     'ALARMS COUNT',
  //     'ALARM LOCATION',
  //     'GUARD NAME',
  //     'GUARD ID'];
  //   const rows = [];

  //   this.users.forEach(e => {
  //     const tmpRow = [
  //       (this.datePipe.transform(e.date, 'MM/dd/yyyy HH:mm:ss')),
  //       (e.gate == null ? '' : e.gate),
  //       (e.lane == null ? '' : e.lane),
  //       //(e.devices == null ? '' : e.devices),
  //       // e.objectids,
  //       e.totalAlarmCount,
  //       e.alarmPosition,
  //       e.guardName,
  //       e.email];
  //     rows.push(tmpRow);
  //   });

  //   doc.autoTable(col, rows, {
  //     startY: 180,
  //     margin: { left: 30 },
  //     columnStyles: {
  //       0: { columnWidth: 60 },
  //       1: { columnWidth: 60 },
  //       2: { columnWidth: 50 },
  //       // 3: { columnWidth: 60 },
  //       //3: { columnWidth: 70 },
  //       3: { columnWidth: 60 },
  //       4: { columnWidth: 70 },
  //       5: { columnWidth: 70 },
  //       6: { columnWidth: 70 }
  //     },
  //     styles: {
  //       lineColor: [0, 0, 0],
  //       lineWidth: 0.5
  //     },
  //   });


  //   doc.setPage(1);
  //   doc.setFontSize(11);
  //   doc.setFont('helvetica', 'bold');
  //   doc.text(30, 100, 'TOTAL SCANNED ' + ' = ' + this.totalScanned);
  //   doc.text(30, 120, 'PERSONS ALARMED' + ' = ' + this.totalSuspected);
  //   doc.text(30, 140, 'PERSONS CLEARED ' + ' = ' + this.noAlarms);
  //   doc.text(30, 160, 'TOTAL ALARMS' + ' = ' + this.totalAlarms);

  //   doc.save('ScanCountDetailsReport.pdf');
  // }


  downloadPDF() {
    const doc = new jsPDF('p', 'pt');

    doc.text('Scan Count Details Report', 20, 20);
    doc.text('Start Date  : ' + this.datePipe.transform(this.fromDate, 'MM/dd/yyyy  HH:mm'), 20, 45);
    doc.text('End Date    : ' + this.datePipe.transform(this.toDate, 'MM/dd/yyyy HH:mm'), 20, 65);
    const rows = [];

    this.users.forEach(e => {
      const tmpRow = [
        (this.datePipe.transform(e.date, 'MM/dd/yyyy HH:mm:ss')),
        (e.gate == null ? '' : e.gate),
        (e.lane == null ? '' : e.lane),
        e.totalAlarmCount,
        e.alarmPosition,
        e.guardName,
        e.email];
      rows.push(tmpRow);
    });

    autoTable(doc, {
      columns: [
        { header: 'DATE & TIME' },
        { header: this.translate.instant('accmaggate') },
        { header: 'LANE' },
        { header: 'ALARMS COUNT' },
        { header: 'ALARM LOCATION' },
        { header: 'GUARD NAME' },
        { header: 'GUARD ID' }
      ],
      body: rows,
      startY: 180,
      margin: { left: 20 },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 75 },
        2: { cellWidth: 50 },
        3: { cellWidth: 65 },
        4: { cellWidth: 90 },
        5: { cellWidth: 70 },
        6: { cellWidth: 130 }
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
    doc.text('TOTAL SCANNED ' + ' = ' + this.totalScanned, 20, 100);
    doc.text('PERSONS ALARMED' + ' = ' + this.totalSuspected, 20, 120);
    doc.text('PERSONS CLEARED ' + ' = ' + this.noAlarms, 20, 140);
    doc.text('TOTAL ALARMS' + ' = ' + this.totalAlarms, 20, 160);
    doc.save('Scan Count Details Report');
  }

}
