import { HttpClientModule } from "@angular/common/http";
import { Injector, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, getTestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatIconModule, MatButtonModule, MatInputModule, MatSortModule, MatTableModule, MatPaginatorModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Routes, RouterModule } from "@angular/router";
import { TranslateLoader, TranslateService, TranslateModule } from "@ngx-translate/core";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Observable, of } from "rxjs";
import { IOperatorInfo } from "../../../../assets/interfaces/ireports";
import { IOperatorInfoResponse } from "../../../../assets/interfaces/iresponse";
import { ReportService } from "../../../../assets/services/report.service";
import { ShareDataService } from "../../../../assets/services/share-data.service";
import { UserService } from "../../../../assets/services/user.service";
import { OperatorinforeportComponent } from "./operatorinforeport.component";

export class OperatorInfoReportService {
  ioperatorinfo: IOperatorInfo = {
    guardName: "hexwave z",
    id: "hexwave.z@email.com",
    loginTime: 0,
    logoutTime: 0,
  }
  iOperatorInfoList: IOperatorInfo[] = [];
  iOperatorInfoListData: IOperatorInfo;
  startDate: string = " ";
  endDate: string = " ";
  public getGuardInfo(startDate, endDate): Observable<IOperatorInfoResponse> {
    //this.iOperatorInfoList.push(this.ioperatorinfo);
   this.iOperatorInfoList.push(this.iOperatorInfoListData);
    let mockResponse: IOperatorInfoResponse = {
      "status": 200,
      "data": this.iOperatorInfoList
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
describe("OperatorinforeportComponent", () => {
  let component: OperatorinforeportComponent;
  let fixture: ComponentFixture<OperatorinforeportComponent>;
  let translate: TranslateService;
  let injector: Injector;
  let reportServiceSpy: jasmine.SpyObj<ReportService>;
  //let routerSpy: jasmine.SpyObj<Router>;
  const routes: Routes = [
    {
      path: 'operatorinfo',
      component: OperatorinforeportComponent,
      data: {
        title: 'Operator Info'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async () => {
    const reportServiceSpy = jasmine.createSpyObj('ReportService', ['getGuardInfo']);
    reportServiceSpy.getGuardInfo.and.returnValue(of());
    const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData',
      'setSharedData', 'clearSessionVariables', 'getLabels']);
    shareDataServicespy.getSharedData.and.returnValue(true);

    TestBed.configureTestingModule({
      declarations: [OperatorinforeportComponent],
      imports: [
        MatAutocompleteModule, MatDatepickerModule,
        MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatIconModule,
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
        //{ provide: ReportService, useClass: OperatorInfoReportService },
        Ng4LoadingSpinnerService,
        UserService,

      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    })
      .compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorinforeportComponent);
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
  it(`should handle the case when subscribed date is greater than dateTo`, async () => {
    component.subscribed = '2023-08-27';
    component.dateTo = '2023-08-25';
    const result = component.dateValid();
    expect(result).toBeFalsy();
  });
  it(`should handle the case when subscribed date is equal to dateTo`, async () => {
    component.subscribed = '2023-08-25';
    component.dateTo = '2023-08-25';
    component.dateValid();
    expect(component.dateValid).toBeTruthy();
  });
});