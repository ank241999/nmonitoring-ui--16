import { Component, ViewEncapsulation, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ThreatActivityService } from '../../../assets/services/threat-activity.service';
import { IActivityMonitoring } from '../../../assets/interfaces/iactivity-monitoring';
import { Activity } from '../../../assets/interfaces/iactivity';
import { ActivityConstants } from '../../../assets/constants/activity-constants';
import { TranslateService } from '@ngx-translate/core';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

const $ = require('jquery');

@Component({
  selector: 'app-activitythreats-page',
  templateUrl: './activitythreats.component.html',
  styleUrls: ['./styles/_forms-wizard.scss', './styles/activitythreats.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})

export class ActivityThreatsComponent implements OnInit, AfterViewInit {
  acm: IActivityMonitoring = {};
  state = 'NOT CONNECTED';

  status = 'Ok';
  threatType = 'No';
  date = '';
  time = '';

  threatDisplayImg = '';
  tmpthreatDisplayImg = '';

  threatIcon = '';
  selectedThreatStatusImage = '';
  timerFlag = false;

  @ViewChild('canvasfront', { static: false }) canvasRefFront: ElementRef;
  @ViewChild('canvasback', { static: false }) canvasRefBack: ElementRef;

  frontimage: string;
  backimage: string;

  gate = '';
  lane = '';

  threatLocationsCoordinates_hexwave = {
    'Upper Front': { 'Front-x': 85, 'Front-y': 145, 'Back-x': 0, 'Back-y': 0, 'Front': 'R1', 'Back': '' },
    'Lower Front': { 'Front-x': 166, 'Front-y': 387, 'Back-x': 0, 'Back-y': 0, 'Front': 'R2', 'Back': '' },
    'Upper Back': { 'Front-x': 0, 'Front-y': 0, 'Back-x': 85, 'Back-y': 145, 'Front': '', 'Back': 'R11' },
    'Lower Back': { 'Front-x': 0, 'Front-y': 0, 'Back-x': 164, 'Back-y': 392, 'Front': '', 'Back': 'R12' },
    'Right Hip Front': { 'Front-x': 108, 'Front-y': 380, 'Back-x': 222, 'Back-y': 390, 'Front': 'R3', 'Back': 'R4' },
    'Left Hip Front': { 'Front-x': 221, 'Front-y': 380, 'Back-x': 108, 'Back-y': 390, 'Front': 'R4', 'Back': 'R3' },
    'Left Arm Front': { 'Front-x': 270, 'Front-y': 188, 'Back-x': 0, 'Back-y': 188, 'Front': 'R6', 'Back': 'R5' },
    'Right Arm Front': { 'Front-x': 0, 'Front-y': 188, 'Back-x': 270, 'Back-y': 188, 'Front': 'R5', 'Back': 'R6' },
    'Left Upper Leg Front': { 'Front-x': 207, 'Front-y': 500, 'Back-x': 100, 'Back-y': 510, 'Front': 'R9', 'Back': 'R7' },
    'Left Lower Leg Front': { 'Front-x': 255, 'Front-y': 670, 'Back-x': 56, 'Back-y': 670, 'Front': 'R10', 'Back': 'R8' },
    'Right Upper Leg Front': { 'Front-x': 103, 'Front-y': 500, 'Back-x': 207, 'Back-y': 510, 'Front': 'R7', 'Back': 'R9' },
    'Right Lower Leg Front': { 'Front-x': 56, 'Front-y': 670, 'Back-x': 255, 'Back-y': 670, 'Front': 'R8', 'Back': 'R10' },
  };

  threatLocationsCoordinates = {
    'Upper Front': { 'Front-x': 122, 'Front-y': 140, 'Back-x': 0, 'Back-y': 0, 'Front': 'R1', 'Back': '' },
    'Lower Front': { 'Front-x': 166, 'Front-y': 379, 'Back-x': 0, 'Back-y': 0, 'Front': 'R2', 'Back': '' },
    'Upper Back': { 'Front-x': 0, 'Front-y': 0, 'Back-x': 123, 'Back-y': 140, 'Front': '', 'Back': 'R14' },
    'Lower Back': { 'Front-x': 0, 'Front-y': 0, 'Back-x': 168, 'Back-y': 372, 'Front': '', 'Back': 'R13' },
    'Right Hip Front': { 'Front-x': 109, 'Front-y': 380, 'Back-x': 224, 'Back-y': 370, 'Front': 'R3', 'Back': 'R4' },
    'Left Hip Front': { 'Front-x': 225, 'Front-y': 380, 'Back-x': 109, 'Back-y': 370, 'Front': 'R4', 'Back': 'R3' },
    'Left Arm Front': { 'Front-x': 270, 'Front-y': 203, 'Back-x': 30, 'Back-y': 203, 'Front': 'R6', 'Back': 'R5' },
    'Right Arm Front': { 'Front-x': 30, 'Front-y': 203, 'Back-x': 269, 'Back-y': 203, 'Front': 'R5', 'Back': 'R6' },
    'Left Upper Leg Front': { 'Front-x': 210, 'Front-y': 500, 'Back-x': 110, 'Back-y': 490, 'Front': 'R9', 'Back': 'R7' },
    'Left Lower Leg Front': { 'Front-x': 245, 'Front-y': 670, 'Back-x': 75, 'Back-y': 670, 'Front': 'R10', 'Back': 'R8' },
    'Right Upper Leg Front': { 'Front-x': 109, 'Front-y': 500, 'Back-x': 208, 'Back-y': 490, 'Front': 'R7', 'Back': 'R9' },
    'Right Lower Leg Front': { 'Front-x': 74, 'Front-y': 670, 'Back-x': 243, 'Back-y': 670, 'Front': 'R8', 'Back': 'R10' },
  };

  constructor(
    private threatActivityService: ThreatActivityService,
    private translate: TranslateService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private shareDataService: ShareDataService,
    private location: Location,
    // private spinnerService: NgxSpinnerService
  ) {
    translate.setDefaultLang(shareDataService.getLabels());

    document.body.style.background = '#EBEBEB';
  }

  ngOnInit() {
    this.frontimage = '../../assets/images/Frontbodyfinal_' + this.shareDataService.getAvtarImage() + '.png';
    this.backimage = '../../assets/images/Frontbodyfinal_' + this.shareDataService.getAvtarImage() + '.png';
    this.threatLocationsCoordinates = (this.shareDataService.getAvtarImage() === 'hexwave' ?
      this.threatLocationsCoordinates_hexwave : this.threatLocationsCoordinates);

    // this.spinnerService.show();
    this.defaultSettings();
  }

  ngAfterViewInit() {
    this.acm = this.shareDataService.getSharedData();
    this.showObjects(this.acm, true);
    // this.spinnerService.hide();

    console.log(this.acm);
  }

  addThreats(contextFront, context, acm: IActivityMonitoring, showThreat: boolean) {
    this.threatIcon = ActivityConstants.noImageIcon;
    this.date = this.format(parseInt(acm.creationTimestamp, 10), 'MM/dd/yyyy');

    const utcSeconds = parseInt(acm.creationTimestamp, 10) / 1000;
    const date = new Date(0); // The 0 there is the key, which sets the date to the epoch
    date.setUTCSeconds(utcSeconds);

    let hours: string = date.getHours().toString();
    const minutes: string = date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes().toString();
    const seconds: string = date.getSeconds() < 10 ? '0' + date.getSeconds().toString() : date.getSeconds().toString();
    hours = hours.length === 1 ? '0' + hours : hours; // add a leading zero for hours < 10
    this.time = hours + ':' + minutes + ':' + seconds;

    this.status = '--';
    this.threatType = '--';
    this.gate = '';
    this.lane = '';

    // fulldisplay
    if (acm.noThreatConfig !== undefined) {
      if (acm.objectDetected !== undefined && acm.objectDetected === false) {
        this.status = 'CLEAR';
        this.threatType = ActivityConstants.threatNoObject;
        this.threatIcon = ActivityConstants.smallNoThreatIcon;
        this.selectedThreatStatusImage = ActivityConstants.largeNoThreatIcon;

        this.gate = 'North Entrance';
        this.lane = 'One';

        if (showThreat) {
          this.drawBorder(context, ActivityConstants.noThreat);
        }
      } else {
        const { anomalies, threats } = acm;

        const allThreats = [];
        for (const value of Object.values({ ...anomalies, ...threats })) {
          if (Array.isArray(value) && value.length) {
            allThreats.push(...value);
          }
        }
        this.status = 'ALARM PRESENT';

        this.showThreats(showThreat, contextFront, context, acm, allThreats,
          ActivityConstants.anomaly,
          ActivityConstants.statusOk,
          ActivityConstants.smallAnomalyIcon,
          ActivityConstants.largeAnomalyIcon,
          ActivityConstants.threatCellphone);
      }
    }

    const iact: Activity = new Activity(acm.id, this.status, this.time, this.threatIcon, acm.creationTimestamp, this.threatType);
    return iact;
  }

  showThreats(showThreat: boolean, contextFront, context, acm: IActivityMonitoring, threatLocationarray: string[],
    threat: string, statusThreat: string, smallThreatIcon: string, largeThreatIcon: string, threatType: string) {
    // this.status = statusThreat;
    this.threatType = threatType;
    this.threatIcon = smallThreatIcon;
    this.selectedThreatStatusImage = largeThreatIcon;

    this.gate = 'North Entrance';
    this.lane = 'One';

    if (showThreat) {
      this.drawBorder(context, threat);
    }

    const configLowerCase = this.acm.noThreatConfig.toLowerCase();
    const fullDisplay = ActivityConstants.fullDisplay;

    const threatLocations = threatLocationarray.filter(location => location !== '');
    const locationsToDraw = threatLocations
      .map(location => location.split(','))
      .filter(([name]) => name in this.threatLocationsCoordinates)
      .map(([name, side]) => {
        const location = this.threatLocationsCoordinates[name];
        if (side) {
          side = side.trim();
          const contextStr = side === 'Front' ? contextFront : context;
          return { context: contextStr, x: location[side + '-x'], y: location[side + '-y'], r: location[side] };
        } else {
          const position = name.split(' ')[1];
          const contextStr = position === 'Front' ? contextFront : context;
          return { context: contextStr, x: location[position + '-x'], y: location[position + '-y'], r: location[position] };
        }
      });

    if (showThreat && configLowerCase === fullDisplay) {
      this.drawArc(locationsToDraw);
    }
  }

  highlightActivity(id) {
    $('.threat-act').each(function () {
      $(this).parent().attr('style', 'background: #fff; cursor: pointer');
    });

    // $("#img-"+id).attr("style", "background: #e0e0e0; cursor: pointer");
    $('#' + id).parent().attr('style', 'background: #e0e0e0; cursor: pointer');
  }

  setContext(acm: IActivityMonitoring, canvas, context, bodyImage: string, showThreat: boolean, contextFront) {
    const source = new Image();
    source.crossOrigin = 'Anonymous';
    source.onload = () => {
      canvas.height = source.height;
      canvas.width = source.width;

      context.drawImage(source, 0, 0);
      if (showThreat) {
        this.addThreats(contextFront, context, acm, true);
      }

      // document.getElementById("linkImage").setAttribute("href", canvas.toDataURL());
    };
    source.src = bodyImage;
  }

  showObjects(acm: IActivityMonitoring, showThreat: boolean) {
    const cx = document.createElement('CANVAS'); // Unit test purpose

    const canvasFront = (this.canvasRefFront === undefined ? cx : this.canvasRefFront.nativeElement);
    const contextFront = canvasFront.getContext('2d');

    const canvasBack = (this.canvasRefBack === undefined ? cx : this.canvasRefBack.nativeElement);
    const contextBack = canvasBack.getContext('2d');

    this.setContext(acm, canvasFront, contextFront, this.frontimage, false, null);
    this.setContext(acm, canvasBack, contextBack, this.backimage, showThreat, contextFront);
  }

  drawArc(locationsToDraw) {
    for (let i = 0; i < locationsToDraw.length; i++) {
      const context = locationsToDraw[i].context;
      const x = locationsToDraw[i].x;
      const y = locationsToDraw[i].y;
      const r = locationsToDraw[i].r;

      const borderImage = ActivityConstants.getThreatActivityCircle(r + '-' + this.shareDataService.getAvtarImage());
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        context.drawImage(img, x, y);
      };
      img.src = borderImage;
    }
  }

  drawBorder(context, threatType) {
    if (threatType === ActivityConstants.noThreat) {
      $('.canvas_wrapper_advance').attr('style', 'border-color: #6ce017;');
    } else {
      $('.canvas_wrapper_advance').attr('style', 'border-color: #E01717;');
    }
  }


  defaultSettings() {
    this.threatIcon = ActivityConstants.noImageIcon;
    this.selectedThreatStatusImage = ActivityConstants.noImageIcon;
    this.date = '--';
    this.time = '--';
    this.status = '--';
    this.threatType = '--';
  }

  format(time, format) {
    const t = new Date(time);
    const tf = function (i) { return (i < 10 ? '0' : '') + i; };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
      switch (a) {
        case 'yyyy':
          return tf(t.getFullYear());
          break;
        case 'MM':
          return tf(t.getMonth() + 1);
          break;
        case 'mm':
          return tf(t.getMinutes());
          break;
        case 'dd':
          return tf(t.getDate());
          break;
        case 'HH':
          return tf(t.getHours());
          break;
        case 'ss':
          return tf(t.getSeconds());
          break;
      }
    });
  }
  gotoDashboard() {
    this.location.back();
  }
}
