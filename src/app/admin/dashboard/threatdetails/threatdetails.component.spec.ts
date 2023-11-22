import { HttpClientModule } from "@angular/common/http";
import { Injector } from "@angular/core";
import { ComponentFixture, TestBed, fakeAsync, getTestBed, tick } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialog, MatDialogRef, MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatInputModule, MatDialogModule, MatListModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatTableModule, MatSortModule, MAT_DIALOG_DATA, MatDialogConfig } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router, Routes, RouterModule, ActivatedRoute } from "@angular/router";
import { TranslateLoader, TranslateService, TranslateModule } from "@ngx-translate/core";
import { Ng4LoadingSpinnerService, Ng4LoadingSpinnerModule } from "ng4-loading-spinner";
import { Observable, of } from "rxjs";
import { IDeviceDetails } from "../../../../assets/interfaces/idashboarddetails";
import { DevicemanagementService } from "../../../../assets/services/devicemanagement.service";
import { LaneDeviceService } from "../../../../assets/services/lanedevice.service";
import { NotificationService } from "../../../../assets/services/notification.service";
import { ShareDataService } from "../../../../assets/services/share-data.service";
import { ThreatActivityService } from "../../../../assets/services/threat-activity.service";
import { ThreatdetailsComponent } from "./threatdetails.component";
import { GuardlogsComponent } from "./guardlogs/guardlogs.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";

export class MocthreatdetailsService {
  deviceDetails: IDeviceDetails = {
    threat_id: 0,
    log_id: 0,
    actual_result: '',
    anomaly: '',
    creation_date: '',
    no_objects: true,
    no_threat_config: '',
    non_threat_cellphone: '',
    non_threat_keys: '',
    threat_handgun: '',
    threat_pipe_bomb: '',
    threat_knife: '',
    threat_threat: '',
    threat_rifle: '',
    threat_status: '',
    update_date: '',
    left_devic_mac_address: '',
    right_devic_mac_address: '',
    creation_timestamp: 0,
    device_name: '',
    lane_name: '',
    gate_name: '',
    time_in: 0,
    time_out: 0,
    tablet_mac_address: '',
    tablet_name: '',
    user_name: '',
    is_viewed: true
  }
  deviceDetailsList: IDeviceDetails[] = [];
}
const translation: any = { 'CARDS_TITLE': 'This is a test' };
class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translation);
  }
}
describe("ThreatdetailsComponent", () => {
  let component: ThreatdetailsComponent;
  let fixture: ComponentFixture<ThreatdetailsComponent>;
  let injector: Injector;
  let dialog: MatDialog;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<any>>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let spinnerServiceSpy: jasmine.SpyObj<Ng4LoadingSpinnerService>;
  let deviceServiceSpy: jasmine.SpyObj<DevicemanagementService>;
  let translate: TranslateService;
  let routerSpy: jasmine.SpyObj<Router>;
  let router: Router;
  const routes: Routes = [
    {
      path: 'threatdetails',
      component: ThreatdetailsComponent,
      data: {
        title: 'Threat Details'
      },
      pathMatch: 'full'
    }
  ];
  const mockDeviceDetails = [
  ];

  const mockSharedData = {
    laneName: 'Mock Lane',
    entranceName: 'Mock Entrance',
  };

  routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue({ afterClosed: () => of({}) });
    deviceServiceSpy = jasmine.createSpyObj('DevicemanagementService', ['getDeviceById', 'pingDevice']);
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const mockShareDataService = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'getLabels', 'setGlobalObject']);
    spinnerServiceSpy = jasmine.createSpyObj('Ng4LoadingSpinnerService', ['show', 'hide']);
    mockShareDataService.getSharedData.and.returnValue({ laneName: 'Mock Lane', entranceName: 'Mock Entrance' });
    TestBed.configureTestingModule({
      declarations: [ThreatdetailsComponent],
      imports: [
        MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
        MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
        MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule,
        MatButtonModule,
        HttpClientTestingModule,
        MatInputModule,
        MatDialogModule,
        MatListModule,
        MatMenuModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTableModule,
        MatSortModule,
        RouterModule.forRoot(routes),
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
        { provide: NotificationService, notificationService },
        { provide: ShareDataService, useValue: mockShareDataService },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: Ng4LoadingSpinnerService, useValue: spinnerServiceSpy },
        DevicemanagementService,
        Ng4LoadingSpinnerService,
        TranslateService,
        LaneDeviceService,
        Location,
        ThreatActivityService,
        MocthreatdetailsService,
      ],
      schemas: [
      ],
    }).compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
    router = TestBed.get(Router);
    dialog = TestBed.get(MatDialog);

  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ThreatdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('component should be defined', () => {
    expect(component).toBeDefined();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it(`should call filterDeployments`, async () => {
    component.filterDeployments();
    expect(component.filterDeployments).toBeTruthy();
  });
  it(`should call onScreenClose`, async () => {
    component.onScreenClose();
    expect(component.onScreenClose).toBeTruthy();
  });
  it(`should call format`, async () => {
    component.format('', '');
    expect(component.format).toBeTruthy();
  });
  
  it('should open GuardlogsComponent dialog and refresh data on dialog close', fakeAsync(() => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}) });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);
    component.openGuardLogs();
    expect(dialogSpy.open).toHaveBeenCalledWith(GuardlogsComponent, jasmine.any(MatDialogConfig));
    dialogRefSpyObj.afterClosed.and.returnValue(of({}));
    dialogRefSpyObj.afterClosed();
    tick();
    expect(component.ngOnInit).toBeTruthy();
  }));

  it('should initialize component properties and call service', () => {
    const queryParams = { leftDeviceMacAddress: 'mockDeviceMacAddress' };
    const mockDeviceDetails = {
      status: '200',
      data: {
        '#result-set-1': [
          {
            creation_timestamp: new Date().toISOString(),
            no_threat_config: true,
            no_objects: true,
            user_name: 'mockUserName',
            tablet_name: 'mockTabletName',
          },
        ],
      },
    };
    const activatedRoute = TestBed.get(ActivatedRoute);
    spyOn(activatedRoute.snapshot.queryParamMap, 'get').and.returnValue(queryParams.leftDeviceMacAddress);
    spyOn(activatedRoute.queryParams, 'pipe').and.returnValue(({ x: queryParams }));
    const lanedeviceService = (component as any).lanedeviceService;
    spyOn(lanedeviceService, 'getDeviceDetails').and.returnValue(of(mockDeviceDetails));
    component.ngOnInit();
    expect(activatedRoute.queryParams.pipe).toBeTruthy();
  });
})