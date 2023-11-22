import { DatePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, Injector } from "@angular/core";
import { ComponentFixture, getTestBed, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule, MatSortModule, MatTableDataSource, MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatToolbarModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { ChartsModule } from "ng2-charts";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Observable, of } from "rxjs";
import { IThreatLogsResponse } from "../../../../assets/interfaces/iresponse";
import { IThreatLog } from "../../../../assets/interfaces/ithreatlog";
import { ReportService } from "../../../../assets/services/report.service";
import { ShareDataService } from "../../../../assets/services/share-data.service";
import { ThreatlogsreportComponent } from "./threatlogsreport.component";


export class ThreatLogsReportService {

    threatlogsdata: IThreatLog = {
        actualResult: true,
        creationTimestamp: 0,
        deviceMacAddress: "",
        gateName: "",
        id: 0,
        laneName: "",
        note: "",
        threatLocation: "",
        threatType: "",
        updateTimestamp: 0,
        userName: "",
        typeOfWeapon: "",
        threatConfigId: "",
    }

    threatlogsdataList: IThreatLog[] = [];

    startDate: string = "";
    endDate: string = "";


    public getThreatLogsReport(startDate, endDate): Observable<IThreatLogsResponse> {
        this.threatlogsdataList.push(this.threatlogsdata);

        let mockResponse: IThreatLogsResponse = {
            "status": 200,
            "data": this.threatlogsdataList
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
describe('betatestmodereport', () => {
    let component: ThreatlogsreportComponent;
    let fixture: ComponentFixture<ThreatlogsreportComponent>;
    let mockReportService: jasmine.SpyObj<ReportService>;
    let injector: Injector;
    let translate: TranslateService;

    const routes: Routes = [
        {
            path: 'betatestmodereport',
            component: ThreatlogsreportComponent,
            data: {
                title: 'Beta Test Mode Report'
            },
            pathMatch: 'full'
        }
    ];

    beforeEach(async () => {
        const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables', 'getLabels']);
        shareDataServicespy.getSharedData.and.returnValue(true);
        const ng4LoadingSpinnerServiceSpy = jasmine.createSpyObj('Ng4LoadingSpinnerService', ['show', 'hide']);

        await TestBed.configureTestingModule({
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
                RouterModule.forRoot(routes, { useHash: true }),
                HttpClientModule,
                ChartsModule,
                RouterTestingModule.withRoutes([
                    { path: 'betatestmodereport', component: ThreatlogsreportComponent }
                ]),

                FormsModule, ReactiveFormsModule,
                BrowserAnimationsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: FakeLoader
                    }
                })
            ], declarations: [ThreatlogsreportComponent],
            providers: [
                ThreatlogsreportComponent,
                DatePipe,
                { provide: ShareDataService, useValue: shareDataServicespy },
                { provide: Ng4LoadingSpinnerService, useValue: ng4LoadingSpinnerServiceSpy },
                { provide: ReportService, useClass: ThreatLogsReportService },

            ],
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ]
        }).compileComponents();;
        injector = getTestBed();
        translate = injector.get(TranslateService);
        fixture = TestBed.createComponent(ThreatlogsreportComponent);
        component = fixture.componentInstance;
    });


    it('component should be defined', () => {
        expect(component).toBeDefined();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`should call the filterDeployments method`, () => {
        component.filterDeployments();
        expect(component.filterDeployments).toBeTruthy();
    });

    it(`should call the table1Filter method`, () => {
        component.table1Filter('');
        expect(component.table1Filter).toBeTruthy();
    });

    // it(`should call the resetDatePicker method`, () => {
    //     component.resetDatePicker();
    //     expect(component.resetDatePicker).toBeTruthy();
    // });

    it(`should call the resetDatePickerTo method`, () => {
        component.resetDatePickerTo();
        expect(component.resetDatePickerTo).toBeTruthy();
    });

    it(`should call the dateValid method`, () => {
        component.dateValid();
        expect(component.dateValid).toBeTruthy();
    });

    // Line commenent

    // it(`should call the downloadEXCEL method`, () => {
    //     component.downloadEXCEL();
    //     expect(component.downloadEXCEL).toBeTruthy();
    // });

    it(`should call the onScreenBack method`, () => {
        component.onScreenBack();
        expect(component.onScreenBack).toBeTruthy();
    });

    it(`should call the onScreenClose method`, () => {
        component.onScreenClose();
        expect(component.onScreenClose).toBeTruthy();
    });
    // it(`should call the onPaginateChange method`, () => {
    //     component.onPaginateChange('');
    //     expect(component.onPaginateChange).toBeTruthy();
    // });
});
