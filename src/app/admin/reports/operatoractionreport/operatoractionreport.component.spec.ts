import { HttpClientModule } from "@angular/common/http";
import { Injector, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, getTestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Routes, RouterModule } from "@angular/router";
import { TranslateLoader, TranslateService, TranslateModule } from "@ngx-translate/core";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Observable, of } from "rxjs";
import { IOperatorAction } from "../../../../assets/interfaces/ireports";
import { IOperatorActionResponse } from "../../../../assets/interfaces/iresponse";
import { ReportService } from "../../../../assets/services/report.service";
import { ShareDataService } from "../../../../assets/services/share-data.service";
import { UserService } from "../../../../assets/services/user.service";
import { OperatoractionreportComponent } from "./operatoractionreport.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatRadioModule } from "@angular/material/radio";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";

export class operatoractionreportService {
  Ioperatoraction: IOperatorAction = {
    objectids: "",
    dateTime: 0,
    guardName: "",
    email: "",
    devices: "",
    lane: "Lane 1",
    gate: "Gate 1",
    clearTime: 0,
  }
  iOperatorActionList: IOperatorAction[] = [];
  iOperatorActionListData: IOperatorAction;
  startDate: string = "";
  endDate: string = "";
  public getOperatorAction(startDate, endDate): Observable<IOperatorActionResponse> {
    this.iOperatorActionList.push(this.iOperatorActionListData);
    let mockResponse: IOperatorActionResponse = {
      "status": 200,
      "data": this.iOperatorActionList
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
describe("OperatoractionreportComponent", () => {
  let component: OperatoractionreportComponent;
  let fixture: ComponentFixture<OperatoractionreportComponent>;
  let translate: TranslateService;
  let injector: Injector;
  let reportServiceSpy: jasmine.SpyObj<ReportService>;
  const routes: Routes = [
    {
      path: 'Operatoraction',
      component: OperatoractionreportComponent,
      data: {
        title: 'Operator Action'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async () => {
    const reportServiceSpy = jasmine.createSpyObj('ReportService', ['getOperatorAction']);
    reportServiceSpy.getOperatorAction.and.returnValue(of());
    const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData',
      'setSharedData', 'clearSessionVariables', 'getLabels']);
    shareDataServicespy.getSharedData.and.returnValue(true);
    TestBed.configureTestingModule({
      declarations: [OperatoractionreportComponent],
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
        Ng4LoadingSpinnerService,
        UserService
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    }).compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(OperatoractionreportComponent);
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
    expect(component.filtersForm.get('search')).toBeDefined();
    expect(component.filtersForm.get('subscribed')).toBeDefined();
    expect(component.filtersForm.get('fromDate')).toBeDefined();
    expect(component.filtersForm.get('dateTo')).toBeDefined();
    expect(component.filtersForm.get('toDate')).toBeDefined();
    expect(component).toBeTruthy();
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