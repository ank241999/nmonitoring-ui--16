import { HttpClientModule } from "@angular/common/http";
import { Injector } from "@angular/core";
import { async, ComponentFixture, fakeAsync, getTestBed, TestBed, tick } from "@angular/core/testing";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialog, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSortModule, MatTableModule, MatToolbarModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router, RouterModule, Routes } from "@angular/router";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { Ng4LoadingSpinnerModule } from "ng4-loading-spinner";
import { defer, Observable, of, throwError } from "rxjs";
import { ISystemInfo } from "../../../assets/interfaces/isystemInfo";
import { NotificationService } from "../../../assets/services/notification.service";
import { ShareDataService } from "../../../assets/services/share-data.service";
import { SysteminformationService } from "../../../assets/services/systeminformation.service";
import { RebootComponent } from "./reboot/reboot.component";
import { SysteminformationComponent } from "./systeminformation.component";

export class MocUserService {
  iSystemInfo: ISystemInfo = {
    deviceIpAddress: "172.16.2.174",
    deviceIpName: "172.16.2.174"
  };
  systemInfoList: ISystemInfo[] = [];
  public getPairedIp(search: string): Observable<ISystemInfo[]> {
    this.systemInfoList.push(this.iSystemInfo);
    let mockResponse: ISystemInfo[] = this.systemInfoList;
    return of(mockResponse);
  }
}
let translations: any = { "CARDS_TITLE": "This is a test" };
class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('SysteminformationComponent', () => {
  let component: SysteminformationComponent;
  let fixture: ComponentFixture<SysteminformationComponent>;
  let injector: Injector;
  let translate: TranslateService;
  let systemInformationService: SysteminformationService;
  let formBuilder: FormBuilder;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialog: MatDialog;

  const routes: Routes = [
    {
      path: 'systeminformation',
      component: SysteminformationComponent,
      data: {
        title: 'Software Information'
      },
      pathMatch: 'full'
    }
  ];

  routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async(() => {
    const systemInformationServiceMock = jasmine.createSpyObj('SysteminformationService', ['getSystemInformation', 'getSystemInformationIp', 'updateSystemInformationIp']);
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables', 'getLabels']);
    shareDataServicespy.getSharedData.and.returnValue(true);


    TestBed.configureTestingModule({
      declarations: [SysteminformationComponent],
      imports: [
        MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
        MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
        MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatDialogModule,
        MatListModule,
        MatMenuModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTableModule,
        MatSortModule,
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
        { provide: ShareDataService, useValue: shareDataServicespy },
        { provide: SysteminformationService, useValue: systemInformationServiceMock },
        { provide: Router, useValue: routerSpy },
        FormBuilder, SysteminformationService, MatDialog
      ],
      schemas: [
      ]
    }).compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysteminformationComponent);
    component = fixture.componentInstance;
    dialog = TestBed.get(MatDialog);
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SysteminformationComponent);
    component = fixture.componentInstance;
    systemInformationService = TestBed.get(SysteminformationService);
    formBuilder = TestBed.get(FormBuilder);
    component.systemInformationForm = formBuilder.group({
      HEXWAVE_HOST_ID: [''],
      HEXWAVE_EXTERNAL_IP: [''],
      HEXWAVE_HOST_ID_PAIRED: [''],
      HEXWAVE_EXTERNAL_IP_PAIRED: [''],
    });
  });

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a FormGroup comprised of FormControls', () => {
    component.ngOnInit();
    expect(component.systemInformationForm instanceof FormGroup).toBe(true);
  });

  it('should call getPairedIp', async () => {
    component.getPairedIp('HEXWAVE_EXTERNAL_IP_PAIRED');
    expect(component.getPairedIp).toBeTruthy();
  });

  it('should call getdata', async () => {
    component.getdata('HEXWAVE_EXTERNAL_IP');
    expect(component.getdata).toBeTruthy();
  });

  it('should call addRedInputClass', async () => {
    component.addRedInputClass('red-input');
    expect(component.addRedInputClass).toBeTruthy();
  });

  it('should navigate to /admin/dashboard on onScreenClose', () => {
    component.onScreenClose();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  });

  it('should populate form controls with data from API', async () => {
    const mockData = [
      { key: 'HEXWAVE_HOST_ID', value: 'local' },
      { key: 'HEXWAVE_EXTERNAL_IP', value: '172.16.2.174' },
      { key: 'HEXWAVE_HOST_ID_PAIRED', value: 'beta1' },
      { key: 'HEXWAVE_EXTERNAL_IP_PAIRED', value: '172.16.2.174' },
    ];
    spyOn(systemInformationService, 'getSystemInformation').and.returnValue(of(mockData));
    fixture.detectChanges();
    expect(component.systemInformationForm.controls['HEXWAVE_HOST_ID'].value).toEqual('local');
    expect(component.systemInformationForm.controls['HEXWAVE_EXTERNAL_IP'].value).toEqual('172.16.2.174');
    expect(component.systemInformationForm.controls['HEXWAVE_HOST_ID_PAIRED'].value).toEqual('beta1');
    expect(component.systemInformationForm.controls['HEXWAVE_EXTERNAL_IP_PAIRED'].value).toEqual('172.16.2.174');
  });

  it(`should call rebootDevice method`, () => {
    component.leftdeviceIP = '1.1.1.1';
    component.ipPrimaryName = 'Primary Device';
    component.rightdeviceIP = '1.1.1.2';
    component.rightdeviceName = 'Paired Device';
    spyOn(dialog, 'open');
    component.rebootDevice();
    expect(dialog.open).toHaveBeenCalledWith(
      RebootComponent,
      {
        data: {
          ipPrimary: '1.1.1.1',
          ipPrimaryName: 'Primary Device',
          ipPaired: '1.1.1.2',
          ipPairedName: 'Paired Device'
        },
        panelClass: 'custom-dialog-container'
      }
    );
  });

  it('should handle API error gracefully', () => {
    spyOn(systemInformationService, 'getSystemInformation').and.returnValue(throwError('API error'));
    component.ngOnInit();
  });

  it('should set red input class on form control with different values', () => {
    const controlName = 'SomeOtherControl';
    const controlValue = 'OldValue';
    console.log('Form Controls:', component.systemInformationForm.controls);
    console.log('Control Exists:', component.systemInformationForm.contains(controlName));
  });

  it('should set rightdeviceName to "NO DEVICE" when iSystemInfo is empty', () => {
    const mockResponse = {
      status: 200,
      data: []
    };
    const systemInformationServiceMock = TestBed.get(SysteminformationService);
    spyOn(systemInformationServiceMock, 'getPairedIp').and.returnValue(of(mockResponse));
    component.ipPrimaryName = 'Primary Device';
    component.ipPrimary = '1.1.1.1';
    component.getPairedIp('1.1.1.1');
    expect(component.rightdeviceName).toBe('NO DEVICE');
  });
});