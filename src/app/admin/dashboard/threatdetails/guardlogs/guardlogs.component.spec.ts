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
import { IUser } from "../../../../../assets/interfaces/iuser";
import { DevicemanagementService } from "../../../../../assets/services/devicemanagement.service";
import { NotificationService } from "../../../../../assets/services/notification.service";
import { ShareDataService } from "../../../../../assets/services/share-data.service";
import { DevicedetailsComponent } from "../../devicedetails/devicedetails.component";
import { GuardlogsComponent } from "./guardlogs.component";

export class MocguardlogsService{
  iuser: IUser = {
    id: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    loggedIn: true,
    enabled: 0,
    loggedInDevice: '',
    expiryTimestamp: 0,
    creationTimestamp: '',
    expirydate: '',
    incorrectAttempt: 0,
    blockTimestamp: '',
    _rev: '',
    device: '',
    role: '',
    expiryDays: 0,
    roleName: '',
    expiryDate: 0,
    isAgree: true,
    languageCode: ''
  }
  iuserList: IUser [] = [];
}
let translations: any = { "CARDS_TITLE": "This is a test" };
class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}
describe("GuardlogsComponent", () => {
  let component: GuardlogsComponent;
  let fixture: ComponentFixture<GuardlogsComponent>;
  let injector: Injector;
  let dialog: MatDialog;
  let matDialog: MatDialog;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DevicedetailsComponent>>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  // let spinnerServiceSpy: jasmine.SpyObj<Ng4LoadingSpinnerService>;
  // let deviceServiceSpy: jasmine.SpyObj<DevicemanagementService>;
  let translate: TranslateService;
  let router: Router;
  const routes: Routes = [
    {
      path: 'guardlogs',
      component: GuardlogsComponent,
      data: {
        title: 'Guard Logs'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue({ afterClosed: () => of({}) });
    //deviceServiceSpy = jasmine.createSpyObj('DevicemanagementService', ['getDeviceById', 'pingDevice']);
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const mockShareDataService = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'getLabels', 'setGlobalObject']);
    //spinnerServiceSpy = jasmine.createSpyObj('Ng4LoadingSpinnerService', ['show', 'hide']);
    TestBed.configureTestingModule({
      declarations: [GuardlogsComponent],
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
        // { provide: MatDialog, useValue: dialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
       // { provide: Ng4LoadingSpinnerService, useValue: spinnerServiceSpy },
        DevicemanagementService,
        MocguardlogsService,
       // MatDialogRef
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    }).compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
    router = TestBed.get(Router);
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(GuardlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('component should be defined', () => {
    expect(component).toBeDefined();
  });
  it(`should call filterDeployments`,async () => {
    component.filterDeployments('');
    expect(component.filterDeployments).toBeTruthy();
  });
  it(`should call close`,async () => {
    component.close();
    expect(component.close).toBeTruthy();
  });
})