import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, Injector } from "@angular/core";
import { ComponentFixture, async, TestBed, getTestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatIconModule, MatButtonModule, MatInputModule, MatListModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatSortModule, MatTableModule, MatPaginatorModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Routes, RouterModule } from "@angular/router";
import { TranslateLoader, TranslateService, TranslateModule } from "@ngx-translate/core";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Observable, of } from "rxjs";
import { IDeviceDetails } from "../../../../assets/interfaces/idashboarddetails";
import { IdeviceInfo } from "../../../../assets/interfaces/ireports";
import { IDeviceDetailsReportResponse } from "../../../../assets/interfaces/iresponse";
import { DevicemanagementService } from "../../../../assets/services/devicemanagement.service";
import { EntranceService } from "../../../../assets/services/entrance.service";
import { LaneDeviceService } from "../../../../assets/services/lanedevice.service";
import { ReportService } from "../../../../assets/services/report.service";
import { ShareDataService } from "../../../../assets/services/share-data.service";
import { UserService } from "../../../../assets/services/user.service";
import { DevicedetailsreportComponent } from "./devicedetailsreport.component";

export class DeviceDetailsReportService {
  IdeviceInfo: IdeviceInfo = {
    gateName: "Gate 1",
    laneName: 0,
    deviceName: "beta1, beta2",
    totalPersonScanned: 0,
    totalSuspectedPerson: 0,
    totalAlarmsCount: 0,
  }
  iDeviceDetailsList: IDeviceDetails[] = [];
  iDeviceDetailsReportData: IDeviceDetails;
  startDate: string = "";
  endDate: string = "";

  public getDeviceDetails(startDate, endDate): Observable<IDeviceDetailsReportResponse> {
    this.iDeviceDetailsList.push(this.iDeviceDetailsReportData);
    let mockResponse: IDeviceDetailsReportResponse = {
      "status": 200,
      "data": this.iDeviceDetailsList
    };
    return of(mockResponse);
  }
}
let translations: any = { "CARDS_TITLE": "This is a test" };
class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('DevicedetailsreportComponent', () => {
  let component: DevicedetailsreportComponent;
  let fixture: ComponentFixture<DevicedetailsreportComponent>;
  let translate: TranslateService;
  let injector: Injector;

  const routes: Routes = [
    {
      path: 'devicedetailsreport',
      component: DevicedetailsreportComponent,
      data: {
        title: 'Device Details Report'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async(() => {
    const reportServiceSpy = jasmine.createSpyObj('ReportService', ['getDeviceInfo']);
    reportServiceSpy.getDeviceInfo.and.returnValue(of());
    const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables', 'getLabels']);
    shareDataServicespy.getSharedData.and.returnValue(true);

    TestBed.configureTestingModule({
      declarations: [DevicedetailsreportComponent],
      imports: [
        MatAutocompleteModule, MatCheckboxModule, MatDatepickerModule,
        MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatSortModule,
        MatTableModule,
        MatPaginatorModule,
        HttpClientModule,
        RouterModule.forRoot(routes, { useHash: true }),
        FormsModule, ReactiveFormsModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      providers: [
        { provide: ShareDataService, useValue: shareDataServicespy },
        { provide: ReportService, useValue: reportServiceSpy },
        Ng4LoadingSpinnerService,
        UserService,
        LaneDeviceService,
        EntranceService,
        DevicemanagementService
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicedetailsreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set up the form correctly', () => {
    expect(component.filtersForm.get('subscribed')).toBeDefined();
    expect(component.filtersForm.get('dateTo')).toBeDefined();
  });

  it('should call getDevice method', async () => {
    component.getDevice();
    expect(component.getDevice).toBeTruthy();
  });

  it('should call getLane method', async () => {
    component.getLane();
    expect(component.getLane).toBeTruthy();
  });

  it('should call getEntrance method', async () => {
    component.getEntrance();
    expect(component.getEntrance).toBeTruthy();
  });

  it(`should call showReport method`, async () => {
    component.showReport();
    expect(component.showReport).toBeTruthy();
  });

  it(`should call transform`, async () => {
    component.transform(0);
    expect(component.transform).toBeTruthy();
  });

  it(`should call filterDeployments`, async () => {
    component.filterDeployments();
    expect(component.filterDeployments).toBeTruthy();
  });

  it(`should call table1Filter`, async () => {
    component.table1Filter('');
    expect(component.table1Filter).toBeTruthy();
  });

  it(`should call dateValid`, async () => {
    component.dateValid();
    expect(component.dateValid).toBeTruthy();
  });

}); 
