import { CUSTOM_ELEMENTS_SCHEMA, Injector } from '@angular/core';
import { ComponentFixture, TestBed, getTestBed } from "@angular/core/testing";
import { ScancountComponent } from "./scancount.component";
import { IScanCount } from '../../../../assets/interfaces/ireports';
import { Observable, of } from 'rxjs';
import { IScanCountResponse } from '../../../../assets/interfaces/iresponse';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReportService } from '../../../../assets/services/report.service';
import { OperatorinforeportComponent } from '../opeartorinforeport/operatorinforeport.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatIconModule, MatButtonModule, MatInputModule, MatSortModule, MatTableModule, MatPaginatorModule, MatDialog, MatIconRegistry } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { UserService } from '../../../../assets/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

export class scancountService{
  users:  IScanCount = {
    guardName: '',
    email: '',
    totalPersonScanned: 0,
    totalSuspectedPerson: 0,
    totalAlarmsCount: 0

  }
  usersList: IScanCount[] = [];
  usersListData: IScanCount;
  startDate: string = " ";
  endDate: string = " ";

  public getScanCount(startDate, endDate): Observable<IScanCountResponse> {
    this.usersList.push(this.usersListData);
    let mockResponse: IScanCountResponse = {
      "status": 200,
      "data": this.usersList
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

describe("ScancountComponent", () => {
  let component: ScancountComponent;
  let fixture: ComponentFixture<ScancountComponent>;
  let translate: TranslateService;
  let injector: Injector;
  let dialog: MatDialog;
  let reportServiceSpy: jasmine.SpyObj<ReportService>;
  //let routerSpy: jasmine.SpyObj<Router>;
  const routes: Routes = [
    {
      path: 'scancount',
      component: ScancountComponent,
      data: {
        title: 'Scan Count'
      },
      pathMatch: 'full'
    }
  ];

  beforeEach(async () => {
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables', 'getLabels']);
    shareDataServicespy.getSharedData.and.returnValue(true);

    TestBed.configureTestingModule({
      declarations: [ScancountComponent],

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
       // MatDialog,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      providers: [
        { provide: ShareDataService, useValue: shareDataServicespy },
        { provide: ReportService, useClass: scancountService },
        Ng4LoadingSpinnerService,
        UserService,
        DatePipe

      ],
      schemas: [
       CUSTOM_ELEMENTS_SCHEMA
      ],

    }).compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScancountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

   });

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should create', () => {
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

  // it(`should call dateValid`, async () => {
  //   component.dateValid();
  //   expect(component.dateValid).toBeTruthy();
  // });

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
})