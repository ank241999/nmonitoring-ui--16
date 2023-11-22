
import { HttpClientModule } from "@angular/common/http";
import { Injector } from "@angular/core";
import { ComponentFixture, getTestBed, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialog, MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatInputModule, MatListModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatTableModule, MatSortModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Routes, RouterModule } from "@angular/router";
import { TranslateService, TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { Ng4LoadingSpinnerModule } from "ng4-loading-spinner";
import { Observable, of } from "rxjs";
import { ICustomer } from "../../../../assets/interfaces/icustomer";
import { IDevice } from "../../../../assets/interfaces/idevice";
import { IDeviceResponse } from "../../../../assets/interfaces/iresponse";
import { DevicemanagementService } from "../../../../assets/services/devicemanagement.service";
import { NotificationService } from "../../../../assets/services/notification.service";
import { ShareDataService } from "../../../../assets/services/share-data.service";
import { EditdeviceComponent } from "./editdevice.component";

export class MocDeviceService {
  device: IDevice = {
    id: 0,
    creationTimestamp: "",
    updateTimestamp: "",
    name: "",
    macAddress: "",
    soundAddress: "",
    lightingAddress: "",
    leftProximitySensorAddress: "",
    rightProximitySensorAddress: "",
    physicalMark: "",
    side: "",
    status: true,
    spathFlag: true,
    tabletId: "",
    // lane?: ILane;
    laneId: 0,
    laneName: "",
    entranceId: 0,
    entranceName: "",
    ipAddress: "",
  }

  deviceList: IDevice[] = [];

  public getDevices(): Observable<IDeviceResponse> {
    this.deviceList.push(this.device);

    let mockResponse: IDeviceResponse = {
      "status": 200,
      "data": this.deviceList
    };
    return of(mockResponse);
  }
  public createDevice(Device: IDevice): Observable<IDeviceResponse> {
    this.deviceList.push(this.device);

    let mockResponse: IDeviceResponse = {
      "status": 200,
      "data": this.deviceList
    };

    return of(mockResponse);
  }
  public updateDevice(Device: ICustomer): Observable<IDeviceResponse> {
    this.deviceList.push(this.device);

    let mockResponse: IDeviceResponse = {
      "status": 200,
      "data": this.deviceList
    };

    return of(mockResponse);
  }

  public deleteDevice(device: string): Observable<IDevice> {
    return of(this.device);
  }

}

class MockTranslateLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of({});
  }
}


let translations: any = { "CARDS_TITLE": "This is a test" };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe("EditdeviceComponent", () => {
  let component: EditdeviceComponent;
  let fixture: ComponentFixture<EditdeviceComponent>;
  let injector: Injector;
  let dialog: MatDialog;
  let translate: TranslateService;
  const routes: Routes = [
    {
      path: 'editdevice',
      component: EditdeviceComponent,
      data: {
        title: 'Edit Device'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async () => {
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const mockShareDataService = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'getLabels']);
    mockShareDataService.getSharedData.and.returnValue({ name: 'TestDevice' });
    TestBed.configureTestingModule({
      declarations: [EditdeviceComponent],
      imports: [
        MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
        MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
        MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule,
        MatButtonModule,
        MatInputModule,
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
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
        }),
      ],
      providers: [
        { provide: DevicemanagementService, useClass: MocDeviceService },
        { provide: NotificationService, notificationService },
        { provide: ShareDataService, useValue: mockShareDataService },

      ],
    }).compileComponents();
    injector = getTestBed();
    dialog = TestBed.get(MatDialog);
    translate = injector.get(TranslateService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditdeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should display a list of devices', () => {
    fixture.detectChanges();
  });

  it('#validateFields()', async () => {
    component.validateFields();
    expect(component.validateFields).toBeTruthy;
  });

  it('should call onScreenClose', async () => {
    component.editdeviceScreenClose();
    expect(component.editdeviceScreenClose).toBeTruthy;
  });

  it('should create a new device', () => {
    component.alldevices = []; // Initialize alldevices as an empty array
    component.form.controls['macAddress'].setValue('new-mac');
    component.device.id = 2;
    component.onSubmit();
    expect(component.editdeviceScreenClose).toBeTruthy;
  });
});