import { HttpClientModule } from "@angular/common/http";
import { Injector, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, getTestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialog, MatDialogRef, MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatInputModule, MatDialogModule, MatListModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatTableModule, MatSortModule, MAT_DIALOG_DATA } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router, Routes, RouterModule } from "@angular/router";
import { TranslateLoader, TranslateService, TranslateModule } from "@ngx-translate/core";
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Observable, of } from "rxjs";
import { IDashboardDetails } from "../../../../assets/interfaces/idashboarddetails";
import { DevicemanagementService } from "../../../../assets/services/devicemanagement.service";
import { NotificationService } from "../../../../assets/services/notification.service";
import { ShareDataService } from "../../../../assets/services/share-data.service";
import { DevicedetailsComponent } from "./devicedetails.component";

export class MocDeviceDtailsServices {
  Idashboard: IDashboardDetails = {
    entranceID: 0,
    entranceName: '',
    laneID: 0,
    laneName: '',
    leftDeviceID: 0,
    leftDeviceName: '',
    leftDeviceMacAddress: '',
    leftDeviceSide: '',
    leftTabletID: '',
    leftDeviceStatus: true,
    rightDeviceID: 0,
    rightDeviceName: '',
    rightDeviceMacAddress: '',
    rightDeviceSide: '',
    rightTabletID: '',
    rightDeviceStatus: true,
    tabletId: 0,
    tabletName: '',
    userName: '',
    threatIcon: '',
    threatType: '',
    status: '',
    id: '',
    timestamp: 0,
    time: '',
    guardName: ''
  }
  IdashboardList: IDashboardDetails[] = [];
}
let translations: any = { "CARDS_TITLE": "This is a test" };
class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}
describe("DevicedetailsComponent", () => {
  let component: DevicedetailsComponent;
  let fixture: ComponentFixture<DevicedetailsComponent>;
  let injector: Injector;
  let dialog: MatDialog;
  //let matDialog: MatDialog;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DevicedetailsComponent>>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let spinnerServiceSpy: jasmine.SpyObj<Ng4LoadingSpinnerService>;
  let deviceServiceSpy: jasmine.SpyObj<DevicemanagementService>;
  let translate: TranslateService;
  let router: Router;
  const routes: Routes = [
    {
      path: 'Devicedetails',
      component: DevicedetailsComponent,
      data: {
        title: 'Device Details'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue({ afterClosed: () => of({}) });
    deviceServiceSpy = jasmine.createSpyObj('DevicemanagementService', ['getDeviceById', 'pingDevice']);
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const mockShareDataService = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'getLabels', 'setGlobalObject']);
    spinnerServiceSpy = jasmine.createSpyObj('Ng4LoadingSpinnerService', ['show', 'hide']);
    TestBed.configureTestingModule({
      declarations: [DevicedetailsComponent],
      imports: [
        MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
        MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
        MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule,
        MatButtonModule,
        MatInputModule,
        //MatDialog,
        MatDialogModule,
        MatListModule,
        MatMenuModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTableModule,
        MatSortModule,
        // MAT_DIALOG_DATA,
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
        { provide: NotificationService, notificationService },
        { provide: ShareDataService, useValue: mockShareDataService },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: Ng4LoadingSpinnerService, useValue: spinnerServiceSpy },
        DevicemanagementService,
        MocDeviceDtailsServices,

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
    router = TestBed.get(Router);
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(DevicedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('component should be defined', () => {
    expect(component).toBeDefined();
  });
  it(`should call onScreenClose`, () => {
    const dialogRef = TestBed.get(MatDialogRef) as jasmine.SpyObj<MatDialogRef<any, any>>;
    component.onScreenClose();
    expect(dialogRef.close).toHaveBeenCalled();
  });
  it(`should call pingLane`, async () => {
    component.pingLane();
    expect(component.pingLane).toBeTruthy();
  });
  it(`it should call pingDevice`, async () => {
    component.pingDevice();
    expect(component.pingDevice).toBeTruthy();
  });
  // it(`it should call getDeviceById`, async () => {
  //   component.getDeviceById(0);
  //   expect(component.getDeviceById).toBeTruthy();
  // });
  it(`should call showPingAlert`, async () => {
    component.showPingAlert('');
    expect(component.showPingAlert).toBeTruthy();
  });

  it('should call pingDevice and close the dialog', () => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'deviceSide') {
        return 'left';
      } else if (key === 'deviceRowConfigureIdLeft') {
        return '1';
      }
      return null;
    });
    deviceServiceSpy.getDeviceById.and.returnValue(of({ status: 201, data: { side: 'left', name: 'Device 1', ipAddress: '192.168.1.1' } }));
    deviceServiceSpy.pingDevice.and.returnValue(of({ status: 200 }));

    component.pingDevice();
    expect(deviceServiceSpy.getDeviceById).toBeTruthy();
    expect(deviceServiceSpy.pingDevice).toBeTruthy();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
})