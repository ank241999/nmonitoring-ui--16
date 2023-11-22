import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  IPersonScannedDetails, IRegionWise,
  IThroughput, IThroughputFilter,
  IWeaponDetected
} from '../../../../assets/interfaces/ireports';
import { ReportService } from '../../../../assets/services/report.service';
import { ReportConstants } from '../../../../assets/constants/report-constants';
// import * as pluginLabels from 'chartjs-plugin-labels';
import ChartDataLabels  from 'chartjs-plugin-datalabels';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../assets/services/user.service';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ChartOptions, ChartType, ChartTypeRegistry, TooltipItem, TooltipModel } from 'chart.js';
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';
import { BaseChartDirective } from 'ng2-charts';
const $ = require('jquery');


@Component({
  selector: 'app-personscannedreportgraph',
  templateUrl: './personscannedreportgraph.component.html',
  styleUrls: ['./personscannedreportgraph.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe, { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})
export class PersonscannedreportgraphComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  viewMode = 'Tab1';

  isBrowser: boolean;
  data: any = {};
  throughputFilter: IThroughputFilter[] = [];
  throughput: IWeaponDetected = {};
  reportpersonspecificthreatlabels = [];
  reportpersonspecificthreatPercentagelabels = [];
  ChartPlugins = [ChartDataLabels ];

  throughputLabels = [];
  users: IThroughput[] = [];
  personusers: IPersonScannedDetails[] = [];
  filtersVisible = true;
  filtersForm: FormGroup;
  currentDate = new Date();
  currMonth = this.currentDate.getMonth();
  currYear = this.currentDate.getFullYear();
  subscribed: string;
  dateTo: string;
  fromDate: number;
  toDate: number;
  isEnabled = false;
  totalthreatofperiod: number;
  totalpersons: string;
  total_noobject: number;
  total_threat?: number;
  total_anomaly?: number;
  total_region?: number;
  selectedTimeFilter: string;

  displayNumberGraph = true;
  displayPercentageGraph = false;

  minFromDate: Date;
  maxFromDate: Date | null;
  minToDate: Date | null;
  maxToDate: Date;
  barChartOptionspercent: ChartOptions;
  barChartFrontRegionPercent: ChartOptions;
  reportpersonspecificthreatoptions: ChartOptions;
  barChartOptionsFrontRegions: ChartOptions;
  barChartOptionsBackRegions: ChartOptions;

  activeButton: any = 'day';
  currentButton: any = 'day';

  tab1DisplayNumberGraph = true;
  tab1DisplayPercentageGraph = false;
  tab2DisplayNumberGraph = true;
  tab2DisplayPercentageGraph = false;

  constructor(
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) platformId: Object,
    private reportService: ReportService,
    translate: TranslateService,
    fb: FormBuilder,
    private router: Router,
    route: ActivatedRoute,
    private datePipe: DatePipe,
    shareDataService: ShareDataService,
    private userService: UserService,
    private spinnerService: NgxSpinnerService
  ) {
    translate.setDefaultLang(shareDataService.getLabels());
    document.body.style.background = '#EBEBEB';

    this.data = route.snapshot.data['data'];
    this.isBrowser = isPlatformBrowser(platformId);

    this.filtersForm = fb.group({
      search: '',
      subscribed: new FormControl(new Date(new Date().getTime() - (5 * 24 * 60 * 60 * 1000))),
      dateTo: new FormControl(new Date()),
      subscribedTime: new FormControl('00:00:01'),
      dateToTime: new FormControl('23:59:59')
    });

    this.filtersForm.valueChanges.subscribe(form => { this.table1Filter(form); });
    this.minFromDate = new Date(1900, 0, 1);
    this.maxFromDate = new Date();

    this.minToDate = new Date(1900, 0, 1);
    this.maxToDate = new Date();
  }

  onShowReport() {
    this.fromDate = new Date(this.datePipe.transform(this.filtersForm.value.subscribed, 'yyyy-MM-dd '
      + this.filtersForm.value.subscribedTime)).getTime();
    this.toDate = new Date(this.datePipe.transform(this.filtersForm.value.dateTo, 'yyyy-MM-dd '
      + this.filtersForm.value.dateToTime)).getTime();
    localStorage.setItem('fromDate', this.fromDate.toString());
    localStorage.setItem('toDate', this.toDate.toString());
    this.router.navigate(['./admin/reports/alarminformationreport']);
  }

  // options: ChartOptions = {
  //   responsive: true,
  //   maintainAspectRatio: true,
  //   plugins: {
  //     labels: {
  //       render: 'percentage',
  //       precision: 2
  //     }
  //   },
  // };

  reportThroughput = ReportConstants.reportThroughput;
  reportlinechartThroughput = ReportConstants.reportThroughput;
  reportpersonspecificthreat = ReportConstants.reportThroughput;
  reportpersonspecificthreatPercentage = ReportConstants.reportThroughput;
  reportpersonspecificthreatLabels = [];
  public PersonscannedbarChartLegend = true;

  // public pieChartData: SingleDataSet = [];

  public pieChartData = [{
    data: [],
    backgroundColor: ['#FE6265', '#7A9BBC']
  }];

  reportpersonspecificthreatnumber(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          align: 'center',
          onClick: function () { },
          labels: {
            boxWidth: 20,
          }
        },
        datalabels: {
          anchor: 'end',
          align: 'center',
          color: 'black',
          padding: {
            top: 0
          }
        },
      }

      //     legend: {
      //       fullWidth: true,
      //       labels: {
      //         boxWidth: 15
      //       },
      //       onClick: function () { }
      //     },
      //     scales: {
      //       xAxes: [{

      //       }],
      //       yAxes: [{
      //         ticks: {
      //           min: 0
      //         }
      //       }]
      //     },

      //     plugins: {
      //       labels: {
      //         render: function (args) {
      //           if (args.value !== 0) {
      //             return args.value;
      //           }
      //         },
      //         precision: 2
      //       }
      //     },
    };
  }

  reportpersonspecificthreatpercent(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {},
        y: {
          beginAtZero: true,
          min: 0,
          max: 100,
          ticks: {
            callback: (value) => {
              return `${value} %`;
            }
          },
        },
      },
      plugins: {
        legend: {
          onClick: function () { },
          labels: {
            boxWidth: 20,
          }
        },
        datalabels: {
          anchor: 'end',
          align: 'center',
          color: 'black',
          padding: {
            top: 0
          }
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label(this: TooltipModel<keyof ChartTypeRegistry>, tooltipItem: TooltipItem<keyof ChartTypeRegistry>): string | string[] | void {
              const dataset = tooltipItem.chart.data.datasets[tooltipItem.datasetIndex];
              const value = dataset.data[tooltipItem.dataIndex]; // Use dataIndex instead of index
              if (typeof value === 'number') {
                const formattedValue = value.toFixed(2) + ' %';
                return (tooltipItem['datasetIndex'] === 0 ? 'Alarms' : 'No Alarm') + ' : ' + formattedValue;
              }
              return 'label';
            },
          }
        }
      },
    };
  }

  pieChartOptionsNumber: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        onClick: function () { },
        labels: {
          boxWidth: 20,
        }
      },
    }
    //   plugins: {
    //     labels: {
    //       render: 'value',
    //       precision: 2
    //     }
    //   },
    //   tooltips: {
    //     enabled: true,
    //     callbacks: {
    //       label: function (tooltipItem, data) {
    //         const dataset = data.datasets[tooltipItem.datasetIndex];
    //         const value = dataset.data[tooltipItem.index];
    //         let label = dataset.label || '';
    //         label += value;

    //         // Add custom label name based on tooltip index
    //         if (tooltipItem.index === 0) {
    //           label = 'Total Persons with alarms : ' + label;
    //         } else {
    //           label = 'Total Persons with no alarms : ' + label;
    //         }
    //         return label;
    //       }
    //     }
    //   }
  };

  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        onClick: function () { },
        labels: {
          boxWidth: 20
        }

      }
    }

    //   tooltips: {
    //     enabled: true,
    //     callbacks: {
    //       label: function (tooltipItem, data) {
    //         const dataset = data.datasets[tooltipItem.datasetIndex];
    //         const value = dataset.data[tooltipItem.index];
    //         let label = dataset.label || '';
    //         label += value;

    //         // Add custom label name based on tooltip index
    //         if (tooltipItem.index === 0) {
    //           label = 'Total Persons with alarms : ' + label;
    //         } else {
    //           label = 'Total Persons with no alarms : ' + label;
    //         }
    //         return label;
    //       }
    //     }
    //   }

  };

  public pieChartType: ChartType = 'pie';
  public pieChartLabels = ['Total Persons with alarms :', ' Total Persons with no alarms :'];

  public pieChartLegend = true;

  public pieChartPlugins = [{
    afterLayout: function (chart) {
      chart.legend.legendItems.forEach(
        (label) => {
          const value = chart.data.datasets[0].data[label.index];
          label.text += ' ' + value;
          return label;
        }
      );
    }
  }];

  onTab1Click() {
    this.onFilter('DAY', 5);
  }

  onTab2Click() {
    this.onregionFilter('DAY', 1);
  }

  ngOnInit() {
    this.onDone();
    this.throughPut('DAY');
    this.regionLocationsonDone();
    this.barChartOptionspercent = this.reportpersonspecificthreatpercent();
    this.reportpersonspecificthreatoptions = this.reportpersonspecificthreatnumber();
    this.barChartOptionsFrontRegions = this.frontregionbarchart();
    this.barChartOptionsBackRegions = this.backregionbarchart();
    this.barChartFrontRegionPercent = this.frontregionbarchartpercent();
    // this.ChartPlugins = [{
    //   beforeInit: function (chart) {
    //     chart.legend.afterFit = function () {
    //       this.height = this.height + 15;
    //     };
    //   },
    // }];
  }

  dropdownGraph(selectedOption: string) {
    if (selectedOption === 'number') {
      this.displayNumberGraph = true;
      this.displayPercentageGraph = false;
    } else if (selectedOption === 'percentage') {
      this.displayNumberGraph = false;
      this.displayPercentageGraph = true;
    }

    // Set the value of displayNumberGraph and displayPercentageGraph
    // in both tabs to match the selected option.
    this.tab1DisplayNumberGraph = this.displayNumberGraph;
    this.tab1DisplayPercentageGraph = this.displayPercentageGraph;
    this.tab2DisplayNumberGraph = this.displayNumberGraph;
    this.tab2DisplayPercentageGraph = this.displayPercentageGraph;
  }

  getSixConsecutiveDates_Y(startingDate: Date): Date[] {
    const dates: Date[] = [];

    const currentYear = new Date(startingDate).getFullYear();

    for (let i = 0; i < 6; i++) {
      const year = currentYear - i;
      const yearStartDate = new Date(year, 0, 1);
      dates.push(yearStartDate);
    }
    return dates;
  }

  getSixConsecutiveTimeUnits_Y(startingDate: Date): any[] {
    const unitsArray: any[] = [];

    const currentYear = new Date(startingDate).getFullYear();
    for (let i = 0; i < 6; i++) {
      const year = currentYear - i;
      const yearStartDate = new Date(year, 0, 1);
      unitsArray[i] = yearStartDate.getFullYear();
    }
    return unitsArray;
  }

  getSixConsecutiveDates_Mon(startingDate: Date): Date[] {
    const dates: Date[] = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date(startingDate.getFullYear(), startingDate.getMonth() - i, 1);
      date.setDate(date.getMonth() + 1);
      dates.push(date);
    }
    return dates;
  }

  getSixConsecutiveTimeUnits_Mon(startingDate: Date): any[] {
    const currentDate = new Date();
    const monthNumbers = [];
    for (let i = 0; i < 6; i++) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthNumber = month.getMonth() + 1;
      monthNumbers.push(monthNumber);
    }

    const unitsArray: any[] = [];
    let date;
    for (let i = 0; i < 6; i++) {
      date = new Date(startingDate.getFullYear(), startingDate.getMonth() - i, 1);
      const monthNumber = date.getMonth() + 1;
      unitsArray.push(monthNumber);
    }
    return unitsArray;
  }

  getSixConsecutiveDates_W(startingDate: Date): Date[] {
    const dates: Date[] = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date(startingDate.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
      // date.setDate(date.getDate());
      dates.push(date);
    }
    return dates;
  }

  getSixConsecutiveTimeUnits_W(startingDate: Date): any[] {
    const unitsArray: any[] = [];

    let date;
    for (let i = 0; i < 6; i++) {
      date = new Date(startingDate.getTime() - (((i - 1) * 7 * 24 * 60 * 60 * 1000)));
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
      const week1 = new Date(date.getFullYear(), 0, 4);

      unitsArray[i] = Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    }
    return unitsArray;
  }


  getSixConsecutiveDates(startingDate: Date): Date[] {
    const dates: Date[] = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date(startingDate);
      date.setDate(startingDate.getDate() - i);
      dates.push(date);
    }
    return dates;
  }

  getSixConsecutiveTimeUnits(startingDate: Date): any[] {
    const unitsArray: any[] = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date(startingDate);
      date.setDate(date.getDate() - i);
      unitsArray[i] = date.getDate();
    }
    return unitsArray;
  }

  getSixConsecutiveDates_H(startingDate: Date): Date[] {

    const dates: Date[] = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date(new Date(startingDate.getTime() - ((i) * 60 * 60 * 1000)));
      date.setDate(date.getDate());
      dates.push(date);
    }
    return dates;
  }

  getSixConsecutiveTimeUnits_H(startingDate: Date): any[] {
    const sixHoursAgo = new Date(startingDate.getTime() - (6 * 60 * 60 * 1000));

    const hours = [];
    for (let i = 6; i > 0; i--) {
      const hour = (sixHoursAgo.getHours() + i);
      hours.push(hour % 24);
    }
    return hours;
  }

  getSixConsecutiveDates_M(startingDate: Date): Date[] {
    const dates: Date[] = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date(new Date(startingDate.getTime() - ((i - 1) * 60 * 1000)));
      date.setDate(date.getDate());
      dates.push(date);
    }

    return dates;
  }

  getSixConsecutiveTimeUnits_M(startingDate: Date): any[] {
    const sixHoursAgo = new Date(startingDate.getTime() - (6 * 60 * 1000));

    const hours = [];
    for (let i = 6; i > 0; i--) {
      const hour = sixHoursAgo.getMinutes() + i;
      hours.push(hour % 60);
    }
    return hours;
  }

  throughPut(filterValue) {
    this.userService.getScancountTimezone().subscribe(res => {
      this.totalpersons = res['total_threat'];
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });

    this.spinnerService.show();
    const throughputScanned = [];
    const timeFormat = (filterValue === 'MINUTE' ? 'MM/dd/yyyy HH:mm' : filterValue === 'HOUR' ? 'MM/dd/yyyy HH' :
      filterValue === 'DAY' ? 'MM/dd/yyyy' : filterValue === 'WEEK' ? 'w' : filterValue === 'MONTH' ? 'MM/yyyy' : 'yyyy');

    this.fromDate = new Date(this.datePipe.transform(this.filtersForm.value.subscribed, 'yyyy-MM-dd '
      + this.filtersForm.value.subscribedTime)).getTime();
    this.toDate = new Date(this.datePipe.transform(this.filtersForm.value.dateTo, 'yyyy-MM-dd '
      + this.filtersForm.value.dateToTime)).getTime();

    this.reportService.getThroughputFilter(this.fromDate, this.toDate, filterValue).subscribe(res => {
      this.reportpersonspecificthreat = [];
      this.reportpersonspecificthreatLabels = [];
      this.reportpersonspecificthreatPercentage = [];
      this.reportpersonspecificthreatPercentagelabels = [];
      this.throughputFilter = res;
      const totalNoobject = [];
      const totalscanned = [];
      const totalNoobjectPercentage = [];
      const totalscannedPercentage = [];

      const currentDate = new Date(this.toDate);
      let dates: Date[] = [];
      let unitsArray: number[] = [];

      if (filterValue === 'YEAR') {
        dates = this.getSixConsecutiveDates_Y(currentDate);
        unitsArray = this.getSixConsecutiveTimeUnits_Y(new Date(currentDate));
      }

      if (filterValue === 'MONTH') {
        dates = this.getSixConsecutiveDates_Mon(currentDate);
        unitsArray = this.getSixConsecutiveTimeUnits_Mon(new Date(currentDate));
      }

      if (filterValue === 'WEEK') {

        dates = this.getSixConsecutiveDates_W(currentDate);
        unitsArray = this.getSixConsecutiveTimeUnits_W(currentDate);
      }

      if (filterValue === 'DAY') {
        dates = this.getSixConsecutiveDates(new Date(currentDate));
        unitsArray = this.getSixConsecutiveTimeUnits(new Date(currentDate));
      }

      if (filterValue === 'HOUR') {
        dates = this.getSixConsecutiveDates_H(currentDate);
        unitsArray = this.getSixConsecutiveTimeUnits_H(currentDate);
      }

      if (filterValue === 'MINUTE') {
        dates = this.getSixConsecutiveDates_M(currentDate);
        unitsArray = this.getSixConsecutiveTimeUnits_M(new Date(currentDate));
      }

      let new_DATE;

      let newval = 0;
      let i = 0, j = 0;
      const n = this.throughputFilter.length;
      if (n >= 1) {
        newval = this.throughputFilter[0].timeInterval;
      }
      for (i = 0, j = 0; i < 6 && j < n; i++) {

        new_DATE = this.datePipe.transform(new Date(dates[i]), timeFormat);
        this.reportpersonspecificthreatLabels.push(new_DATE); // +' ( '+unitsArray[i]+' ) ');

        if (unitsArray[i] !== newval) {
          totalscanned.push(0);
          totalNoobject.push(0);
          totalscannedPercentage.push(0);
          totalNoobjectPercentage.push(0);

          throughputScanned.push(0);
          this.throughputLabels.push(0);
        } else {
          totalscanned.push(this.throughputFilter[j].totalThreats);
          totalNoobject.push(this.throughputFilter[j].totalNoObject);

          totalscannedPercentage.push(Math.round((this.throughputFilter[j].totalThreats / (this.throughputFilter[j].totalNoObject
            + this.throughputFilter[j].totalThreats)) * 100));
          totalNoobjectPercentage.push(Math.round((this.throughputFilter[j].totalNoObject / (this.throughputFilter[j].totalNoObject
            + this.throughputFilter[j].totalThreats)) * 100));

          throughputScanned.push(this.throughputFilter[j].total);
          this.throughputLabels.push(this.datePipe.transform(this.throughputFilter[j].date, timeFormat));
          j++;
          if (j < n) {
            newval = this.throughputFilter[j].timeInterval;
          }
        }
      }

      for (let k = i; k < 6; k++) {
        new_DATE = this.datePipe.transform(new Date(dates[k]), timeFormat);
        this.reportpersonspecificthreatLabels.push(new_DATE); // +' ( '+unitsArray[i]+' ) ');
        totalscanned.push();
        totalNoobject.push();
      }

      this.reportpersonspecificthreat.push({ 'data': totalscanned, 'label': 'Total Persons with alarms', backgroundColor: '#FE6265' });
      this.reportpersonspecificthreat.push({ 'data': totalNoobject, 'label': ' Total Persons with no alarms', backgroundColor: '#7A9BBC' });

      this.reportpersonspecificthreatPercentage.push({ 'data': totalscannedPercentage, 'label': 'Total Persons with alarms', backgroundColor: '#FE6265' });
      this.reportpersonspecificthreatPercentage.push({ 'data': totalNoobjectPercentage, 'label': ' Total Persons with no alarms', backgroundColor: '#7A9BBC' });

      this.spinnerService.hide();
      this.isEnabled = true;
      $('#showdata').show();
    },
      err => {
        console.log('Error occurred: ' + err.message);
        this.spinnerService.hide();

      });
    this.onDone();
  }

  filterWise(filterValue) {
    if (filterValue === 6 || filterValue === 360) {
      this.filtersForm.controls['subscribed'].setValue(new Date(new Date().getTime() - (filterValue * 60 * 1000)));
      this.filtersForm.controls['dateToTime'].setValue(this.datePipe.transform(new Date(new Date().getTime()), 'HH:mm:ss'));
      this.filtersForm.controls['subscribedTime'].setValue(this.datePipe.transform(new Date(new Date().getTime() -
        (filterValue * 60 * 1000)), 'HH:mm:ss'));
    } else {
      this.filtersForm.controls['subscribed'].setValue(new Date(new Date().getTime() - (filterValue * 24 * 60 * 60 * 1000)));
      this.filtersForm.controls['dateToTime'].setValue('23:59:59');
      this.filtersForm.controls['subscribedTime'].setValue(this.datePipe.transform(new Date(new Date().getTime() -
        (filterValue * 24 * 60 * 60 * 1000)), 'HH:mm:ss'));
    }
    this.onDone();
  }

  onFilter(filterType: any, filterValue: number) {
    if (filterValue === 6 || filterValue === 360) {
      this.filtersForm.controls['subscribed'].setValue(new Date(new Date().getTime() - (filterValue * 60 * 1000)));
      this.filtersForm.controls['dateToTime'].setValue(this.datePipe.transform(new Date(new Date().getTime()), 'HH:mm:ss'));
      this.filtersForm.controls['subscribedTime'].setValue(this.datePipe.transform(new Date(new Date().getTime() -
        (filterValue * 60 * 1000)), 'HH:mm:ss'));
    } else if (filterType === 'YEAR' && filterValue === 365 * 6) {
      const today = new Date();
      const yearAgo = new Date(today.getFullYear() - 6, today.getMonth(), today.getDate());
      this.filtersForm.controls['subscribed'].setValue(yearAgo);
      this.filtersForm.controls['dateToTime'].setValue('23:59:59');
      this.filtersForm.controls['subscribedTime'].setValue(this.datePipe.transform(new Date(), 'HH:mm:ss'));
    } else {
      this.filtersForm.controls['subscribed'].setValue(new Date(new Date().getTime() - (filterValue * 24 * 60 * 60 * 1000)));
      this.filtersForm.controls['dateToTime'].setValue('23:59:59');
      this.filtersForm.controls['subscribedTime'].setValue(this.datePipe.transform(new Date(new Date().getTime() -
        (filterValue * 24 * 60 * 60 * 1000)), 'HH:mm:ss'));
    }
    this.throughPut(filterType);
  }

  changeColor(button: any) {
    this.currentButton = button;
    this.activeButton = button;
  }

  isActiveButton(button: any) {
    return this.activeButton === button;
  }

  onDone() {
    this.userService.getScancountTimezone().subscribe(res => {
      this.totalpersons = res['total_threat'];
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });

    this.fromDate = new Date(this.datePipe.transform(this.filtersForm.value.subscribed, 'yyyy-MM-dd '
      + this.filtersForm.value.subscribedTime)).getTime();
    this.toDate = new Date(this.datePipe.transform(this.filtersForm.value.dateTo, 'yyyy-MM-dd '
      + this.filtersForm.value.dateToTime)).getTime();

    this.reportService.getThroughputFilter(this.fromDate, this.toDate, 'YEAR').subscribe(res => {
      const throughputFilterDateWise = res;
      this.total_noobject = 0;
      this.total_threat = 0;
      this.totalthreatofperiod = 0;

      throughputFilterDateWise.forEach(e => {
        this.total_noobject += e.totalNoObject;
        this.total_threat += e.totalThreats;
        this.totalthreatofperiod += e.total;
      });

      this.pieChartData = [{
        data: [this.total_threat, this.total_noobject],
        backgroundColor: ['#FE6265', '#7A9BBC']
      }];
    },
      err => {
        console.log('Error occurred: ' + err.message);
        this.spinnerService.hide();
      });
  }

  table1Filter(form): void {
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

  transform(value: number): number {
    const d = new Date(value);
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    return new Date(new Date(utc)).getTime();
  }

  // events
  chartClicked(): void {
    // console.log(e);
  }

  chartHovered(): void {
    // console.log(e);
  }

  // Regions Wise Alarms Code------------------------------------------------

  threatLocations = [
    { item: 'Upper Front', value: 0 },
    { item: 'Lower Front', value: 0 },
    { item: 'Right Lower Leg Front, Front', value: 0 },
    { item: 'Left Lower Leg Front, Front', value: 0 },
    { item: 'Right Hip Front, Front', value: 0 },
    { item: 'Left Hip Front, Front', value: 0 },
    { item: 'Right Arm Front, Front', value: 0 },
    { item: 'Left Arm Front, Front', value: 0 },
    { item: 'Right Upper Leg Front, Front', value: 0 },
    { item: 'Left Upper Leg Front, Front', value: 0 },

    { item: 'Upper Back', value: 0 },
    { item: 'Lower Back', value: 0 },
    { item: 'Right Hip Front, Back', value: 0 },
    { item: 'Left Hip Front, Back', value: 0 },
    { item: 'Right Arm Front, Back', value: 0 },
    { item: 'Left Arm Front, Back', value: 0 },
    { item: 'Right Upper Leg Front, Back', value: 0 },
    { item: 'Left Upper Leg Front, Back', value: 0 },
    { item: 'Right Lower Leg Front, Back', value: 0 },
    { item: 'Left Lower Leg Front, Back', value: 0 }
  ];

  // front Regions Chart---------------------------

  public Front_Region_barChart: ChartType = 'bar';

  public barChartLegend = false;

  public frontregionsBarchart: any[] = [];
  public frontregionsBarchart_percent: any[] = [];

  public Front_pieChartData = [{
    data: [],
    backgroundColor: []
  }];

  public Front_region_Percent_pieChartData = [{
    data: [],
    backgroundColor: []
  }];

  // public Front_region_pieChartColors: Color[] = [
  //   {
  //     backgroundColor: ['#FF819D', '#65B5EF', '#FFD878', '#ECEDF1', '#6DC8C8', '#ADC9D7', '#E3E3E3', '#FA696E', '#cdcccc', '#f2d8c4'],
  //   },
  // ];
  public Front_region_pieChartLabels: string[] = [
    'Upper Front',
    'Lower Front',
    'Right Lower Leg Front, Front',
    'Left Lower Leg Front, Front',
    'Right Hip Front, Front',
    'Left Hip Front, Front',
    'Right Arm Front, Front',
    'Left Arm Front, Front',
    'Right Upper Leg Front, Front',
    'Left Upper Leg Front, Front'
  ];
  public RegionPieChartLegend = true;

  public front_region_pieChartPlugins = [
    {
      afterLayout: function (chart) {
        chart.legend.legendItems.forEach((label) => {
          return label;
        });
      },
    },
  ];

  Front_Region_pieChartOptionsnumber: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'left',
        onClick: function () { }
      },
    }
    //   plugins: {
    //     labels: {
    //       render: 'value',
    //       precision: 2
    //     }
    //   },
    //   tooltips: {
    //     enabled: true,
    //     callbacks: {
    //       label: function (tooltipItem, data) {
    //         const dataset = data.datasets[tooltipItem.datasetIndex];
    //         const value = dataset.data[tooltipItem.index];
    //         let label = dataset.label || '';
    //         label += value;
    //         return label;
    //       },
    //       title: function (tooltipItem, data) {
    //         const index = tooltipItem[0].index;
    //         return data.labels[index];
    //       }
    //     }
    //   }
  };

  public Front_Region_pieChartOptionsPercent: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'left',
        onClick: function () { }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label(this: TooltipModel<keyof ChartTypeRegistry>, tooltipItem: TooltipItem<keyof ChartTypeRegistry>): string | string[] | void {
            const dataset = tooltipItem.chart.data.datasets[tooltipItem.datasetIndex];
            const value = dataset.data[tooltipItem.dataIndex];
            if (typeof value === 'number') {
              const formattedValue = value.toFixed(2);
              return `${formattedValue} %`;
            }
            return 'label';
          },
        }
      }
    }
    //   tooltips: {
    //     callbacks: {
    //       label: (tooltipItem, data) => {
    //         const dataset = data.datasets[tooltipItem.datasetIndex];
    //         const value = Number(dataset.data[tooltipItem.index]);
    //         const formattedValue = value.toFixed(2);
    //         return `${formattedValue} %`;
    //       },
    //       title: (tooltipItem, data) => {
    //         const index = tooltipItem[0].index;
    //         return data.labels[index];
    //       }
    //     }
    //   },

    //   plugins: {
    //     labels: {
    //       render: (args) => {
    //         const value = Number(args.value.toFixed(2));
    //         return `${value} %`;
    //       },
    //       precision: 2
    //     }
    //   }

  };

  frontregionbarchart(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'center',
          color: 'black',
          padding: {
            top: 0
          }
        },
        tooltip: {
          callbacks: {
            label(this: TooltipModel<keyof ChartTypeRegistry>, tooltipItem: TooltipItem<keyof ChartTypeRegistry>): string | string[] | void {
              const dataset = tooltipItem.chart.data.datasets[tooltipItem.datasetIndex];
              const value = dataset.data[tooltipItem.dataIndex]; // Use dataIndex instead of index
              if (typeof value === 'number') {
                const formattedValue = value;
                return dataset.label + ' : ' + formattedValue;
              }
              return 'label';
            },
          }
        }
      }

      //     tooltips: {
      //       enabled: true,
      //       callbacks: {
      //         label: function (tooltipItem, data) {
      //           const dataset = data.datasets[tooltipItem.datasetIndex];
      //           const value = dataset.data[tooltipItem.index];
      //           let label = dataset.label || '';
      //           label += ' : ' + value;
      //           return label;
      //         },
      //         title: function (tooltipItem, data) {
      //           const index = tooltipItem[0].index;
      //           return data.labels[index];
      //         }
      //       }
      //     },
      //     plugins: {
      //       labels: {
      //         render: function (args) {
      //           if (args.value !== 0) {
      //             return args.value;
      //           }
      //         },
      //         precision: 2
      //       }
      //     },
    };
  }

  frontregionbarchartpercent(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {},
        y: {
          beginAtZero: true,
          min: 0,
          max: 100,
          ticks: {
            callback: (value) => {
              return `${value} %`;
            }
          },
        },
      },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'center',
          color: 'black',
          padding: {
            top: 0
          }
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label(this: TooltipModel<keyof ChartTypeRegistry>, tooltipItem: TooltipItem<keyof ChartTypeRegistry>): string | string[] | void {
              const dataset = tooltipItem.chart.data.datasets[tooltipItem.datasetIndex];
              const value = dataset.data[tooltipItem.dataIndex]; // Use dataIndex instead of index
              if (typeof value === 'number') {
                const formattedValue = value.toFixed(2) + ' %';
                return dataset.label + ' : ' + formattedValue;
              }
              return 'label';

            },
            // title(this: TooltipModel<keyof ChartTypeRegistry>, tooltipItems: TooltipItem<keyof ChartTypeRegistry>[]): string | string[] | void {
            //   const index = tooltipItems[0].dataIndex; // Use dataIndex instead of index
            //   return tooltipItems.length > 0 ? tooltipItems[0].label : '';
            // }
          }
        }
      },

    };
  }

  // Back Region Chart----------------------------

  public backRegionbarChartType: ChartType = 'bar';
  public BackRegionbarChartLegend = false;

  public BackregionsBarchart: any[] = [];

  public BackregionsBarchartPercentage: any[] = [];

  public Back_region_pieChartData = [{
    data: [],
    backgroundColor: []
  }];

  public Back_region_Percent_pieChartData = [{
    data: [],
    backgroundColor: []
  }];

  public Back_region_pieChartLabels: string[] = [
    'Upper Back',
    'Lower Back',
    'Right Hip Front, Back',
    'Left Hip Front, Back',
    'Right Arm Front, Back',
    'Left Arm Front, Back',
    'Right Upper Leg Front, Back',
    'Left Upper Leg Front, Back',
    'Right Lower Leg Front, Back',
    'Left Lower Leg Front, Back',
  ];

  // public Back_region_pieChartColors: Color[] = [
  //   {
  //     backgroundColor: ['#A89FD2', '#7498E1', '#B7E8FD', '#EEE3DE', '#F5F5BD', '#D0D0A4', '#D6E4D1', '#89B7AE', '#CAD8D6', '#C7E1FC'],
  //   },
  // ];

  public Back_region_pieChartPlugins = [
    {
      afterLayout: function (chart) {
        chart.legend.legendItems.forEach((label) => {
          return label;
        });
      },
    },
  ];

  Back_Region_pieChartOptionsnumber: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'left',
        onClick: function () { }
      }
    }
    //   tooltips: {
    //     enabled: true,
    //     callbacks: {
    //       label: function (tooltipItem, data) {
    //         const dataset = data.datasets[tooltipItem.datasetIndex];
    //         const value = dataset.data[tooltipItem.index];
    //         let label = dataset.label || '';
    //         label += value;
    //         return label;
    //       },
    //       title: function (tooltipItem, data) {
    //         const index = tooltipItem[0].index;
    //         return data.labels[index];
    //       }
    //     }
    //   }
  };

  public Back_Region_pieChartOptionsPercent: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'left',
        onClick: function () { }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label(this: TooltipModel<keyof ChartTypeRegistry>, tooltipItem: TooltipItem<keyof ChartTypeRegistry>): string | string[] | void {
            const dataset = tooltipItem.chart.data.datasets[tooltipItem.datasetIndex];
            const value = dataset.data[tooltipItem.dataIndex];
            if (typeof value === 'number') {
              const formattedValue = value.toFixed(2);
              return `${formattedValue} %`;
            }
            return 'label';
          }
        }
      }
    }
  };

  backregionbarchart(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'center',
          color: 'black',
          padding: {
            top: 0
          }
        },
        tooltip: {
          callbacks: {
            label(this: TooltipModel<keyof ChartTypeRegistry>, tooltipItem: TooltipItem<keyof ChartTypeRegistry>): string | string[] | void {
              const dataset = tooltipItem.chart.data.datasets[tooltipItem.datasetIndex];
              const value = dataset.data[tooltipItem.dataIndex]; // Use dataIndex instead of index
              if (typeof value === 'number') {
                const formattedValue = value;
                return dataset.label + ' : ' + formattedValue;
              }
              return 'label';
            },
          }
        }
      }
    };
  }

  onregionFilter(filterType: any, filterValue: number) {
    if (filterType === 'YEAR' && filterValue === 365 * 1) {
      const today = new Date();
      const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      this.filtersForm.controls['subscribed'].setValue(yearAgo);
      this.filtersForm.controls['dateToTime'].setValue('23:59:59');
      this.filtersForm.controls['subscribedTime'].setValue(this.datePipe.transform(new Date(), 'HH:mm:ss'));
    } else {
      let convertedValue = filterValue; // Initialize the converted value with the original filter value
      if (filterType === 'HOUR') {
        convertedValue = filterValue / 24; // Convert hours to days
        this.filtersForm.controls['dateToTime'].setValue(this.datePipe.transform(new Date(), 'HH:mm:ss'));
      } else {
        this.filtersForm.controls['dateToTime'].setValue('23:59:59'); // Set the end time to 23:59:59 for other filter types
      }
      this.filtersForm.controls['subscribed'].setValue(new Date(new Date().getTime() - (convertedValue * 24 * 60 * 60 * 1000)));
      this.filtersForm.controls['subscribedTime'].setValue(this.datePipe.transform(new Date(new Date().getTime() -
        (convertedValue * 24 * 60 * 60 * 1000)), 'HH:mm:ss'));
    }
    this.buttonfillter(filterType);
  }


  buttonfillter(filterRegion: string) {
    this.selectedTimeFilter = filterRegion;

    // Get the current date and time
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentHour = currentDate.getHours();

    // Set the 'Start Date' value based on the selected time filter
    switch (filterRegion) {
      case 'year':
        this.filtersForm.controls.subscribed.setValue(new Date(currentYear, 0, 1));
        break;
      case 'month':
        this.filtersForm.controls.subscribed.setValue(new Date(currentYear, currentMonth, 1));
        break;
      case 'week':
        const firstDayOfWeek = currentDay - currentDate.getDay() + 1; // Calculate the first day of the week
        this.filtersForm.controls.subscribed.setValue(new Date(currentYear, currentMonth, firstDayOfWeek));
        break;
      case 'day':
        this.filtersForm.controls.subscribed.setValue(new Date(currentYear, currentMonth, currentDay));
        break;
      case 'hour':
        this.filtersForm.controls.subscribed.setValue(new Date(currentYear, currentMonth, currentDay));
        this.filtersForm.controls.subscribedTime.setValue(`${currentHour}:00`);
        break;
      case 'MINUTE':
        // Calculate the start and end dates for the 'minute' filter
        const startDate = new Date(currentDate.getTime() - (15 * 60 * 1000));
        const endDate = currentDate;

        this.filtersForm.controls.subscribed.setValue(startDate);
        this.filtersForm.controls.subscribedTime.setValue(this.datePipe.transform(startDate, 'HH:mm:ss'));

        this.filtersForm.controls.dateTo.setValue(endDate);
        this.filtersForm.controls.dateToTime.setValue(this.datePipe.transform(endDate, 'HH:mm:ss'));
        break;
    }
    this.regionLocationsonDone();
  }

  regionLocationsonDone() {
    this.spinnerService.show();
    this.fromDate = new Date(this.datePipe.transform(this.filtersForm.value.subscribed, 'yyyy-MM-dd '
      + this.filtersForm.value.subscribedTime)).getTime();
    this.toDate = new Date(this.datePipe.transform(this.filtersForm.value.dateTo, 'yyyy-MM-dd '
      + this.filtersForm.value.dateToTime)).getTime();

    const timeFilter = this.selectedTimeFilter;

    this.reportService.getThroughputFilterRegion(this.fromDate, this.toDate, timeFilter).subscribe(
      res => {
        // console.log(res);
        const throughputFilterRegion: IRegionWise = res;

        this.total_region = 0;

        this.threatLocations.forEach(element => {
          element.value = (throughputFilterRegion[0]['countMap'][element.item] ? throughputFilterRegion[0]['countMap'][element.item] : 0);
          this.total_region = this.total_region + element.value;
        });

        const frontlabels = [
          'Upper Front',
          'Lower Front',
          'Right Lower Leg Front, Front',
          'Left Lower Leg Front, Front',
          'Right Hip Front, Front',
          'Left Hip Front, Front',
          'Right Arm Front, Front',
          'Left Arm Front, Front',
          'Right Upper Leg Front, Front',
          'Left Upper Leg Front, Front'
        ];

        const backlabels = [
          'Upper Back',
          'Lower Back',
          'Right Hip Front, Back',
          'Left Hip Front, Back',
          'Right Arm Front, Back',
          'Left Arm Front, Back',
          'Right Upper Leg Front, Back',
          'Left Upper Leg Front, Back',
          'Right Lower Leg Front, Back',
          'Left Lower Leg Front, Back'
        ];

        this.Front_pieChartData = [];
        this.Front_region_Percent_pieChartData = [];

        this.frontregionsBarchart = frontlabels.map(label => ({
          data: [],
          label,
          FrontbackgroundColor: '',
        }));

        this.frontregionsBarchart_percent = frontlabels.map(label => ({
          data: [],
          label,
          FrontbackgroundColor: '',
        }));

        this.Back_region_pieChartData = [];
        this.Back_region_Percent_pieChartData = [];

        this.BackregionsBarchart = backlabels.map(label => ({
          data: [],
          label,
          backgroundColor: '',
        }));

        this.BackregionsBarchartPercentage = backlabels.map(label => ({
          data: [],
          label,
          backgroundColor: '',
        }));

        const FrontbackgroundColor = [
          '#FF819D', '#65B5EF', '#FFD878', '#ECEDF1', '#6DC8C8', '#ADC9D7', '#E3E3E3', '#FA696E', '#cdcccc', '#f2d8c4'
        ];
        const front_hoverColor = [
          '#ef4d7f', '#68a3ff', '#f3d357', '#d2d1e2 ', '#6edcda ', '#93b9d7 ', '#cccccc ', '#ed2e49 ', '#b9b6b6 ', '#f1be8c '
        ];
        const backgroundColor = [
          '#A89FD2', '#7498E1', '#B7E8FD', '#EEE3DE', '#F5F5BD', '#D0D0A4', '#D6E4D1', '#89B7AE', '#CAD8D6', '#C7E1FC'
        ];
        const back_hoverColor = [
          '#8e69d6 ', '#116AE4 ', '#73E4FF', '#e0c6b7', '#f9ff8a', '#ced67f ', '#bcdfad ', '#7abba9 ', '#b3cec7 ', '#a4c3fe'
        ];

        frontlabels.forEach((label, index) => {
          const dataValue = throughputFilterRegion[0]['countMap'][label] || 0; // Use 0 if the label is not present in countMap
          this.frontregionsBarchart[index].data = [dataValue];
          this.Front_pieChartData = [{
            data: frontlabels.map(label => throughputFilterRegion[0]['countMap'][label] || 0),
            backgroundColor: FrontbackgroundColor
          }];
          this.frontregionsBarchart[index].backgroundColor =
            this.frontregionsBarchart_percent[index].backgroundColor = FrontbackgroundColor[index];
          this.frontregionsBarchart[index].hoverBackgroundColor =
            this.frontregionsBarchart_percent[index].hoverBackgroundColor = front_hoverColor[index];
          const percentage = (dataValue / this.total_region) * 100;
          this.frontregionsBarchart_percent[index].data = [percentage];
          // this.Front_region_Percent_pieChartData.push(percentage);
          this.Front_region_Percent_pieChartData = [{
            data: frontlabels.map(label => throughputFilterRegion[0]['countMap'][label] || 0),
            backgroundColor: FrontbackgroundColor
          }];
          this.Front_region_Percent_pieChartData[0].data = frontlabels.map(label => {
            const count = throughputFilterRegion[0]['countMap'][label] || 0;
            const percentage = (count / this.total_region) * 100;
            return percentage;
          });
        });

        backlabels.forEach((label, index) => {
          const dataValue = throughputFilterRegion[0]['countMap'][label] || 0;
          this.BackregionsBarchart[index].data = [dataValue];
          this.Back_region_pieChartData = [{
            data: backlabels.map(label => throughputFilterRegion[0]['countMap'][label] || 0),
            backgroundColor: backgroundColor
          }];
          this.BackregionsBarchart[index].backgroundColor =
            this.BackregionsBarchartPercentage[index].backgroundColor = backgroundColor[index];
          this.BackregionsBarchart[index].hoverBackgroundColor =
            this.BackregionsBarchartPercentage[index].hoverBackgroundColor = back_hoverColor[index];
          const percentage = (dataValue / this.total_region) * 100;
          this.BackregionsBarchartPercentage[index].data = [percentage];
          this.Back_region_Percent_pieChartData = [{
            data: backlabels.map(label => throughputFilterRegion[0]['countMap'][label] || 0),
            backgroundColor: backgroundColor
          }];
          this.Back_region_Percent_pieChartData[0].data = backlabels.map(label => {
            const count = throughputFilterRegion[0]['countMap'][label] || 0;
            const percentage = (count / this.total_region) * 100;
            return percentage;
          });
        });

        this.spinnerService.hide();
      },
      err => {
        console.log('Error occurred: ' + err.message);
        this.spinnerService.hide();
      }
    );
  }

  totalPersonsScannedReportPDF() {
    const div = document.getElementById('totalPersonsScannedReport');
    const options = {
      background: 'white',
      scale: 2
    };
    html2canvas(div, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      const doc = new jsPDF('l', 'mm', 'a4');
      // Add image Canvas to PDF
      const bufferX = 5;
      const bufferY = 5;
      const pdfWidth = 290;
      const pdfHeight = 150;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const scaleFactor = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
      const imgWidth = canvasWidth * scaleFactor;
      const imgHeight = canvasHeight * scaleFactor;

      doc.text('Total Persons Scanned Report', 40, 20,);
      doc.text('Start Date : '
        + this.datePipe.transform(this.filtersForm.value.subscribed, 'yyyy-MM-dd ' + this.filtersForm.value.subscribedTime), 40, 45);
      doc.text('End Date   : '
        + this.datePipe.transform(this.filtersForm.value.dateTo, 'yyyy-MM-dd ' + this.filtersForm.value.dateToTime), 40, 65);
      doc.addPage();
      doc.addImage(img, 'JPEG', bufferX, bufferY, imgWidth, imgHeight, undefined, 'FAST');
      return doc;
    }).then((doc) => {
      doc.save('TotalPersonsScannedReport.pdf');
    });
  }

  regionWiseAlarmsReportPDF() {
    const div = document.getElementById('regionWiseAlarmsReport');
    const options = {
      background: 'white',
      scale: 2
    };
    html2canvas(div, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      const doc = new jsPDF('l', 'mm', 'a4');
      // Add image Canvas to PDF
      const bufferX = 5;
      const bufferY = 5;
      const pdfWidth = 290;
      const pdfHeight = 150;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const scaleFactor = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
      const imgWidth = canvasWidth * scaleFactor;
      const imgHeight = canvasHeight * scaleFactor;

      doc.text('Region Wise Alarms Report', 40, 20);
      doc.text('Start Date : '
        + this.datePipe.transform(this.filtersForm.value.subscribed, 'yyyy-MM-dd ' + this.filtersForm.value.subscribedTime), 40, 45);
      doc.text('End Date   : '
        + this.datePipe.transform(this.filtersForm.value.dateTo, 'yyyy-MM-dd ' + this.filtersForm.value.dateToTime), 40, 65);
      doc.addPage();
      doc.addImage(img, 'JPEG', bufferX, bufferY, imgWidth, imgHeight, undefined, 'FAST');
      return doc;
    }).then((doc) => {
      doc.save('RegionWiseAlarmsReport.pdf');
    });
  }
}
