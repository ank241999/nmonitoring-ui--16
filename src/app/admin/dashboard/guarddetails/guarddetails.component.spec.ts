import { HttpClientModule } from "@angular/common/http";
import { Injector, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, getTestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialog, MatDialogRef, MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatInputModule, MatDialogModule, MatListModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatTableModule, MatSortModule, MAT_DIALOG_DATA } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router, Routes, RouterModule } from "@angular/router";
import { TranslateLoader, TranslateService, TranslateModule } from "@ngx-translate/core";
import { Ng4LoadingSpinnerModule } from "ng4-loading-spinner";
import { Observable, of } from "rxjs";
import { IDashboardDetails } from "../../../../assets/interfaces/idashboarddetails";
import { DevicemanagementService } from "../../../../assets/services/devicemanagement.service";
import { NotificationService } from "../../../../assets/services/notification.service";
import { ShareDataService } from "../../../../assets/services/share-data.service";
import { GuarddetailsComponent } from "./guarddetails.component";

export class GuarddetailsService {
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
describe("GuarddetailsComponent", () => {
  let component: GuarddetailsComponent;
  let fixture: ComponentFixture<GuarddetailsComponent>;
  let injector: Injector;
  let dialog: MatDialog;
  let translate: TranslateService;
  let router: Router;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<any>>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  const routes: Routes = [
    {
      path: 'Guarddetails',
      component: GuarddetailsComponent,
      data: {
        title: 'Guard Details'
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
      declarations: [GuarddetailsComponent],
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
        //Ng4LoadingSpinnerService,
        DevicemanagementService,
        //MocDeviceDtailsServices,
        MatDialog,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
    router = TestBed.get(Router);
    dialog = TestBed.get(MatDialog);
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(GuarddetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('component should be defined', () => {
    expect(component).toBeDefined();
  });
  it(`should call viewActivity`, async () => {
    component.viewActivity();
    expect(component.viewActivity).toBeTruthy();
  });
  it(`should call close`, async () => {
    component.close();
    expect(component.close).toBeTruthy();
  });
  it(`should call togglePlusMinus`, async () => {
    component.togglePlusMinus();
    expect(component.togglePlusMinus).toBeTruthy();
  });
})