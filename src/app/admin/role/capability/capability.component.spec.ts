import { SelectionModel } from "@angular/cdk/collections";
import { DatePipe } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Injector } from "@angular/core";
import { ComponentFixture, async, TestBed, getTestBed, tick, fakeAsync } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialog, MatDialogRef, MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatInputModule, MatListModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatTableModule, MatSortModule, MatTableDataSource } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Routes, RouterModule, Router } from "@angular/router";
import { TranslateLoader, TranslateService, TranslateModule } from "@ngx-translate/core";
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Observable, of, throwError } from "rxjs";
import { IResponse } from "../../../../assets/interfaces/iresponse";
import { ICapability } from "../../../../assets/interfaces/iuserroleauth";
import { NotificationService } from "../../../../assets/services/notification.service";
import { ShareDataService } from "../../../../assets/services/share-data.service";
import { UserRoleAuthService } from "../../../../assets/services/user-role-auth.service";
import { UserService } from "../../../../assets/services/user.service";
import { AlertComponent } from "../../../shared";
import { CapabilityComponent } from "./capability.component";


export class MocUserService {
  capability: ICapability = {
    id: 1,
    capabilityName: "test",
    endPoint: "test",
    description: "test",
  };

  capabilityList: ICapability[] = [];

  public getUsers(search: string): Observable<IResponse> {
    this.capabilityList.push(this.capability);

    let mockResponse: IResponse = {
      "status": 200,

    };
    return of(mockResponse);
  }

  public getCapability(user: ICapability): Observable<IResponse> {
    // return of(this.user);
    this.capabilityList.push(this.capability);

    let mockResponse: IResponse = {
      "status": 200,

    };

    return of(mockResponse);
  }

  public saveRoleCapability(user: ICapability): Observable<ICapability> {
    return of(this.capability);
  }

  public updateCapability(user: ICapability): Observable<ICapability> {
    return of(this.capability);
  }

  public deleteCapability(id: string, rev: string): Observable<ICapability> {
    return of(this.capability);
  }
}

let translations: any = { "CARDS_TITLE": "This is a test" };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('CapabilityComponent', () => {
  let component: CapabilityComponent;
  let fixture: ComponentFixture<CapabilityComponent>;
  let translate: TranslateService;
  let injector: Injector;
  let userRoleAuthService: any;
  let selectionModel: SelectionModel<any>;
  let dialog: MatDialog;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AlertComponent>>;
  let spinnerServiceStub: Partial<Ng4LoadingSpinnerService>;


  const routes: Routes = [
    {
      path: 'capability',
      component: CapabilityComponent,
      data: {
        title: 'Capability'
      },
      pathMatch: 'full'
    }
  ];

  const mockCapabilities = [
    // Define mock capabilities here
  ];

  const authServiceStub = {
    getCapability: () => of({ status: 200, data: mockCapabilities }),
    deleteCapability: () => of({ status: 200 }),
  };

  routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  spinnerServiceStub = {
    show: jasmine.createSpy('show'),
    hide: jasmine.createSpy('hide'),
  };

  beforeEach(async(() => {
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const ng4LoadingSpinnerServiceSpy = jasmine.createSpyObj('Ng4LoadingSpinnerService', ['show', 'hide']);

    TestBed.configureTestingModule({
      declarations: [CapabilityComponent],
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
        HttpClientTestingModule,
        //RouterModule.forChild(routes),
        RouterModule.forRoot(routes, { useHash: true }),
        Ng4LoadingSpinnerModule.forRoot(),
        // UserRoutingModule,NotifierModule,
        FormsModule, ReactiveFormsModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      //providers:[{provide: MessagingService,useClass: mockMessagingService}],
      providers: [
        { provide: UserService, useClass: MocUserService },
        { provide: NotificationService, notificationService },
        { provide: UserService, useClass: MocUserService },
        { provide: UserRoleAuthService, useClass: UserRoleAuthService },
        { provide: Router, useValue: routerSpy },
        { provide: Ng4LoadingSpinnerService, useValue: spinnerServiceStub },
        DatePipe, ShareDataService
      ],
      schemas: [
        //CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
    userRoleAuthService = TestBed.get(UserRoleAuthService);
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(CapabilityComponent);
    component = fixture.componentInstance;
    userRoleAuthService = TestBed.get(UserRoleAuthService);
    selectionModel = new SelectionModel<ICapability>(true, []);
    dialog = TestBed.get(MatDialog);
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<AlertComponent>>('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(true));
    spyOn(dialog, 'open').and.returnValue(dialogRefSpy);
    component.selection = new SelectionModel<ICapability>(true, []);
    component.dataSource = new MatTableDataSource(mockCapabilities);
    fixture.detectChanges();
    component['spinnerService'] = spinnerServiceStub as Ng4LoadingSpinnerService;
  });

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should navigate to /admin/dashboard on onScreenClose', () => {
    component.onScreenClose();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  });

  it('should set up data source and paginator on filterDeployments', () => {
    component.capabilities = mockCapabilities;
    component.filterDeployments();
    expect(component.dataSource.data).toEqual(mockCapabilities);
    expect(component.dataSource.sortingDataAccessor).toBeTruthy();
  });

  it('should populate capabilities on init', () => {
    const mockCapability: ICapability = {
      id: 1,
      capabilityName: 'test',
      endPoint: 'test',
      description: 'test',
    };
    spyOn(userRoleAuthService, 'getCapability').and.returnValue(of({ status: 200, data: [mockCapability] }));

    component.ngOnInit();

    expect(userRoleAuthService.getCapability).toHaveBeenCalled();
    expect(component.capabilities).toEqual([mockCapability]);
  });

  it('should clear selection when calling masterToggle() if all rows are selected', () => {
    const mockCapabilities = [
      { id: 1, capabilityName: 'Capability 1', description: 'Description 1' },
      { id: 2, capabilityName: 'Capability 2', description: 'Description 2' },
    ];
    component.dataSource = new MatTableDataSource(mockCapabilities);
    component.selection.select(...mockCapabilities);

    component.masterToggle();

    expect(component.selection.selected).toEqual([]);
  });

  it('should open modifycapability dialog', () => {
    const mockSelectedCapability = {
      id: 1,
      capabilityName: 'Capability 1',
      description: 'Description 1'
    };
    component.selection.select(mockSelectedCapability);
    component.openDialog();
  });

  it('should filter data source based on applyFilter', () => {
    component.capabilities = mockCapabilities;
    component.filterDeployments();

    const filterValue = 'exampleFilter'.toLowerCase();
    component.applyFilter('exampleFilter');

    expect(component.dataSource.filter).toBe(filterValue);
    expect(component.selection.isEmpty()).toBeTruthy();
  });

  it('should clear selection and select all rows', () => {
    const initiallySelected: ICapability[] = mockCapabilities.slice(0, 1);
    component.selection = new SelectionModel<ICapability>(true, initiallySelected);
    component.selectAll();

    expect(component.selection.isEmpty()).toBeTruthy();
    expect(component.selection.selected).toEqual(mockCapabilities);
  });

  it('should delete selected capabilities', () => {
    spyOn(userRoleAuthService, 'deleteCapability').and.returnValue(of({ status: 200 }));
    component.selection.select({ id: 1 });
    component.deleteAccount();
    expect(userRoleAuthService.deleteCapability).toHaveBeenCalledWith([1]);
  });
});
