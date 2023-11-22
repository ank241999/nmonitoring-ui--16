import { HttpClientModule } from "@angular/common/http";
import { Injector } from "@angular/core";
import { ComponentFixture, async, TestBed, getTestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatIconModule, MatButtonModule, MatInputModule, MatListModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatSortModule, MatTableModule, MatPaginatorModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Routes, RouterModule } from "@angular/router";
import { TranslateLoader, TranslateService, TranslateModule } from "@ngx-translate/core";
import { ChartsModule } from "ng2-charts";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Observable, of } from "rxjs";
import { IScanCountDetails } from "../../../../assets/interfaces/ireports";
import { IScanCountDetailsResponse } from "../../../../assets/interfaces/iresponse";
import { ReportService } from "../../../../assets/services/report.service";
import { ShareDataService } from "../../../../assets/services/share-data.service";
import { UserService } from "../../../../assets/services/user.service";
import { ScancountdetailsreportComponent } from "./scancountdetailsreport.component";

export class ScanCountDetailsservice {

  iScanCountDetails: IScanCountDetails = {
    dateTime: 1,
    guardName: "abc",
    email: "test@example.com",
    objectids: "1",
    devices: "Device A",
    lane: "Front",
    gate: "Gate 1",
    totalAlarmsCount: 1
  };


  iScanCountDetailsList: IScanCountDetails[] = [];

  startDate: string = "";
  endDate: string = "";


  public getScanCountDetails(startDate, endDate): Observable<IScanCountDetailsResponse> {
    this.iScanCountDetailsList.push(this.iScanCountDetails);

    let mockResponse: IScanCountDetailsResponse = {
      "status": 200,
      "data": this.iScanCountDetailsList
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

describe('ScancountdetailsreportComponent', () => {
  let component: ScancountdetailsreportComponent;
  let fixture: ComponentFixture<ScancountdetailsreportComponent>;
  let translate: TranslateService;
  let injector: Injector;

  const routes: Routes = [
    {
      path: 'scancountdetailsreport',
      component: ScancountdetailsreportComponent,
      data: {
        title: 'Scancount Details'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async(() => {
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables', 'getLabels']);
    shareDataServicespy.getSharedData.and.returnValue(true);

    TestBed.configureTestingModule({
      declarations: [ScancountdetailsreportComponent],
      imports: [
        MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
        MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
        MatSliderModule, MatSlideToggleModule, MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatSidenavModule,
        MatToolbarModule,
        MatSortModule,
        MatTableModule,
        MatPaginatorModule,
        HttpClientModule,
        ChartsModule,
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
        { provide: ReportService, useClass: ScanCountDetailsservice },
        Ng4LoadingSpinnerService, UserService
      ],
      schemas: [
        //CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScancountdetailsreportComponent);
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
});
