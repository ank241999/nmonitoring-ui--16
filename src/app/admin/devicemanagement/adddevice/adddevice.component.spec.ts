import { HttpClientModule } from "@angular/common/http";
import { inject, Injector } from "@angular/core";
import { ComponentFixture, TestBed, getTestBed, async, fakeAsync, tick } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialog, MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatInputModule, MatListModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatTableModule, MatSortModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Routes, RouterModule } from "@angular/router";
import { TranslateLoader, TranslateService, TranslateModule } from "@ngx-translate/core";
import { Ng4LoadingSpinnerModule } from "ng4-loading-spinner";
import { Observable, of } from "rxjs";
import { ICustomer } from "../../../../assets/interfaces/icustomer";
import { IDevice } from "../../../../assets/interfaces/idevice";
import { IDeviceResponse } from "../../../../assets/interfaces/iresponse";
import { DevicemanagementService } from "../../../../assets/services/devicemanagement.service";
import { NotificationService } from "../../../../assets/services/notification.service";
import { ShareDataService } from "../../../../assets/services/share-data.service";
import { AdddeviceComponent } from "./adddevice.component";

export class MocDeviceService {
  device: IDevice = {
    id: 1,
    creationTimestamp: null,
    updateTimestamp: null,
    name: "abc",
    macAddress: "1.1.1.1",
    soundAddress: "1.1.1.1",
    lightingAddress: "1.1.1.1",
    leftProximitySensorAddress: "1.1.1.1",
    rightProximitySensorAddress: "1.1.1.1",
    physicalMark: "abc",
    side: "Left",
    status: true,
    spathFlag: true,
    tabletId: "1.2.2.2",
    laneId: 1,
    laneName: "Lane1",
    entranceId: 2,
    entranceName: "Front",
    ipAddress: "111.222.333.30"
  };

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

  public editDevice(Device: ICustomer): Observable<IDeviceResponse> {
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


let translations: any = { "CARDS_TITLE": "This is a test" };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}
describe('AdddeviceComponent', () => {
  let component: AdddeviceComponent;
  let fixture: ComponentFixture<AdddeviceComponent>;
  let injector: Injector;
  let dialog: MatDialog;
  let translate: TranslateService;
  const routes: Routes = [
    {
      path: 'createdevice',
      component: AdddeviceComponent,
      data: {
        title: 'Add Device'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async () => {
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const mockShareDataService = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'getLabels']);
    TestBed.configureTestingModule({
      declarations: [AdddeviceComponent],
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
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      providers: [
        { provide: AdddeviceComponent, useClass: MocDeviceService },
        { provide: NotificationService, notificationService },
        { provide: ShareDataService, useValue: mockShareDataService },
        DevicemanagementService
      ],
    }).compileComponents();
    injector = getTestBed();
    dialog = TestBed.get(MatDialog);
    translate = injector.get(TranslateService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdddeviceComponent);
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
    component.adddeviceScreenClose();
    expect(component.adddeviceScreenClose).toBeTruthy;
  });

  it('should create a new device', () => {
    component.alldevices = []; // Initialize alldevices as an empty array
    component.form.controls['macAddress'].setValue('new-mac');
    component.device.id = 2;
    component.onSubmit();
    expect(component.adddeviceScreenClose).toBeTruthy;
  });


});
