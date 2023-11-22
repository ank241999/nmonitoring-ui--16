import { HttpClientModule } from "@angular/common/http";
import { Injector, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, getTestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialog, MatDialogRef, MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatInputModule, MatDialogModule, MatListModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatTableModule, MatSortModule, MAT_DIALOG_DATA, MatSnackBarModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router, Routes, RouterModule } from "@angular/router";
import { TranslateLoader, TranslateService, TranslateModule } from "@ngx-translate/core";
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Observable, of, throwError } from "rxjs";
import { IActivity } from "../../../../assets/interfaces/iactivity";
import { DevicemanagementService } from "../../../../assets/services/devicemanagement.service";
import { NotificationService } from "../../../../assets/services/notification.service";
import { ShareDataService } from "../../../../assets/services/share-data.service";
import { ThreatActivityService } from "../../../../assets/services/threat-activity.service";
import { NotificationsMenuService } from "../../../core";
import { NotificationsComponent } from "./notifications.component";

export class MocnotificationsService {
  iactivity: IActivity = {
    id: '',
    status: '',
    time: '',
    threatIcon: '',
    timestamp: '',
    threatType: '',
    threatConfigId: 0,
    deviceId: 0,
    actualResult: true,
    deviceName: '',
    laneName: '',
    gateName: '',
    timeIn: 0,
    timeOut: 0,
    tabletName: '',
    userName: '',
    tid: 0
  }
  iactivityList: IActivity[] = [];
}
let translations: any = { "CARDS_TITLE": "This is a test" };
class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}
describe("NotificationsComponent", () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let injector: Injector;
  let dialog: MatDialog;
  let translate: TranslateService;
  let router: Router;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<any>>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  const routes: Routes = [
    {
      path: 'notifications',
      component: NotificationsComponent,
      data: {
        title: 'Notifications'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue({ afterClosed: () => of({}) });
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const mockShareDataService = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'getLabels']);
    TestBed.configureTestingModule({
      declarations: [NotificationsComponent],
      imports: [
        MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
        MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
        MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatDialogModule,
        MatSnackBarModule,
        MatListModule,
        MatMenuModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTableModule,
        MatSortModule,
        RouterModule.forChild(routes),
        RouterModule.forRoot(routes, { useHash: true }),
        Ng4LoadingSpinnerModule.forRoot(),
        FormsModule, ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      providers: [
        // { provide: NotificationService, useValue: notificationService },
        { provide: NotificationService, useClass: NotificationService },
        { provide: ShareDataService, useValue: mockShareDataService },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        Ng4LoadingSpinnerService,
        DevicemanagementService,
        Location,
        ThreatActivityService,
        MatDialog,
        MocnotificationsService,
        NotificationsMenuService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
    router = TestBed.get(Router);
    dialog = TestBed.get(MatDialog);
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('component should be defined', () => {
    expect(component).toBeDefined();
  });
  it(`should call filterDeployments`, async () => {
    component.filterDeployments('');
    expect(component.filterDeployments).toBeTruthy();
  });
  // it(`should call addThreats`, async () => {
  //   component.addThreats('', '', null, true);
  //   expect(component.addThreats).toBeTruthy();
  // });
  it(`should call showThreats`, async () => {
    component.showThreats(true, '', '', null, [], '', '', '', '', '');
    expect(component.showThreats).toBeTruthy();
  });
  it(`should call viewThreat`, async () => {
    component.viewThreat('');
    expect(component.viewThreat).toBeTruthy();
  });
  it(`should call format`, async () => {
    component.format('', '');
    expect(component.format).toBeTruthy();
  });
  it(`should call onScreenClose`, async () => {
    component.onScreenClose();
    expect(component.onScreenClose).toBeTruthy();
  });
  it(`should call setThreatIsViewedStatus`, async () => {
    component.setThreatIsViewedStatus();
    expect(component.setThreatIsViewedStatus).toBeTruthy();
  });

  it('should add a threat', () => {
    const acm = {
      id: '1',
      noThreatConfig: 'config',
      creationTime: '2023-09-29T12:00:00Z',
      creationTimestamp: '1632902400000',
      leftDeviceMacAddress: 'device1',
      rightDeviceMacAddress: 'device2',
      logId: 1,
      actualResult: true,
      timeIn: 1632902400000,
      timeOut: 1632906000000,
      noObjects: false,
      nonThreatCellphone: 'cellphone1-cellphone2',
      nonThreatKeys: 'keys1-keys2',
      anomaly: 'anomaly1-anomaly2',
      threatHandgun: 'handgun1-handgun2',
      threatRifle: 'rifle1-rifle2',
      threatPipeBomb: 'pipeBomb1-pipeBomb2',
      threatKnife: 'knife1-knife2',
      threatThreat: 'threat1-threat2',
      deviceName: 'deviceName1',
      laneName: 'laneName1',
      gateName: 'gateName1',
      tabletName: 'tabletName1',
      userName: 'userName1',
      tid: 1,
    };
    const result = component.addThreats('', '', acm, true);
    expect(result.id).toBe('1');
    expect(result.status).toBe(component.status);
    expect(result.time).toBe(component.time);
    expect(component.status).not.toBe('--');
    expect(component.threatType).not.toBe('--');
  });


  it('should handle an error response (status code 500)', () => {
    component.threatIds = [];
    const shareDataService = TestBed.get(ShareDataService);
    shareDataService.id = 123;
    const setThreatViewedSpy = spyOn(ThreatActivityService.prototype, 'setThreatViewed').and.returnValue(
      throwError({ status: 500, error: 'Internal Server Error' })
    );
    const notificationService = TestBed.get(NotificationService);
    const showNotificationSpy = spyOn(notificationService, 'showNotification');
    expect(setThreatViewedSpy).toBeTruthy();
    component.setThreatIsViewedStatus();
    expect(showNotificationSpy).toHaveBeenCalled();
    expect(ThreatActivityService.prototype.setThreatViewed).toHaveBeenCalledWith({
      ids: component.threatIds,
      viewedById: shareDataService.id,
    });
  });

  it('should handle a successful response (status code 201)', () => {
    component.threatIds = [];
    const shareDataService = TestBed.get(ShareDataService);
    shareDataService.id = 123;

    const threatActivityService = TestBed.get(ThreatActivityService);
    spyOn(threatActivityService, 'setThreatViewed').and.returnValue(of({ status: 201 }));

    const notificationService = TestBed.get(NotificationService);
    const showNotificationSpy = spyOn(notificationService, 'showNotification');

    component.setThreatIsViewedStatus();

    expect(showNotificationSpy).toHaveBeenCalledWith(
      'Threat view status updated',
      'top',
      'center',
      '',
      'info-circle'
    );

    expect(component.threatIds).toEqual([]);
  });
})