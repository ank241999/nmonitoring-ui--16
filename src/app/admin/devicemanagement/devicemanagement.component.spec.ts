import { TestBed, ComponentFixture, getTestBed } from '@angular/core/testing';
import { MatTableModule, MatPaginatorModule, MatSortModule, MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatToolbarModule, MatDialog, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { DevicemanagementComponent } from './devicemanagement.component';
import { DevicemanagementService } from '../../../assets/services/devicemanagement.service';
import { Observable, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, Routes } from '@angular/router';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NotificationService } from '../../../assets/services/notification.service';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { IDevice } from '../../../assets/interfaces/idevice';
import { ICustomer } from '../../../assets/interfaces/icustomer';
import { IDeviceResponse } from '../../../assets/interfaces/iresponse';
import { Injector } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AlertComponent } from '../../shared';

export class MocDeviceService {
  device: IDevice = {
    id: 1,
    creationTimestamp: "",
    updateTimestamp: "",
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
describe('DevicemanagementComponent', () => {
  let component: DevicemanagementComponent;
  let fixture: ComponentFixture<DevicemanagementComponent>;
  let injector: Injector;
  let dialog: MatDialog;
  let matDialog: MatDialog;
  let dialogRef: jasmine.SpyObj<MatDialogRef<any>>;
  let translate: TranslateService;
  let router: Router;

  const mockDeviceService = {
    deleteDevice: (deviceIds: string) => {
      // Simulate a successful deletion
      return of({ status: 200 });
    },
  };

  const routes: Routes = [
    {
      path: 'Devicemanagement',
      component: DevicemanagementComponent,
      data: {
        title: 'Devicemanagement'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async () => {
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'close', 'open']);
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const mockShareDataService = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'getLabels']);
    TestBed.configureTestingModule({
      declarations: [DevicemanagementComponent],
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
        { provide: DevicemanagementService, useClass: MocDeviceService },
        { provide: NotificationService, notificationService },
        { provide: ShareDataService, useValue: mockShareDataService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MatDialog, useValue: {} },

      ],
    }).compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
    router = TestBed.get(Router);
    dialog = TestBed.get(MatDialog);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterCopenosed']);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('component should be defined', () => {
    expect(component).toBeDefined();
  });
  it('should call onScreenClose', async () => {
    component.onScreenClose();
    expect(component.onScreenClose).toBeTruthy;
  });
  it('should display a list of devices', () => {

    fixture.detectChanges();
  });

  it(`should call the selectAll method`, () => {
    component.selectAll();
    expect(component.selectAll).toBeTruthy();
  });

  it('should toggle selection when masterToggle is called', () => {
    expect(component.selection.isEmpty()).toBe(true);
    component.masterToggle();
    expect(component.isAllSelected()).toBe(true);
    component.masterToggle();
  });

  it(`should call the applyFilter method`, () => {
    component.applyFilter("1");
    expect(component.applyFilter).toBeTruthy();
  });

  it(`should call the editDevice method`, () => {
    component.editDevice();
    expect(component.editDevice).toBeTruthy();
  });

  it('should return true when all items are selected', () => {
    component = fixture.componentInstance;
    component.selection.select(...component.dataSource.filteredData);
    const result = component.isAllSelected();
    expect(result).toBeTruthy(true);
  });

  it(`should call addDevices`, () => {
    const selectedItem: IDevice = {
    };
    component.selection.select(selectedItem)
    component.editDevice();
    expect(component.editDevice).toBeTruthy();
    expect(router.navigate).toBeTruthy(['./admin/devicemanagement/editdevice']);
  });

  it('should call createLane', () => {
    component.createDevice();
    expect(component.createDevice).toBeTruthy();
    expect(router.navigate).toBeTruthy(['./admin/devicemanagement/createDevice']);
  });

  it(`should call deleteDevice`, () => {
    const selectedItem: IDevice = {
    };
    component = fixture.componentInstance;
    component.selection.select(...component.dataSource.filteredData);
    const result = component.isAllSelected();
    component.selection.select(selectedItem);
    component.deleteDevice();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
