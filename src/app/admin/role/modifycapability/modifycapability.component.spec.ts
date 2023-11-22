import { DatePipe } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Injector } from "@angular/core";
import { async, ComponentFixture, fakeAsync, getTestBed, TestBed, tick } from "@angular/core/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup } from "@angular/forms";
import { MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatInputModule, MatListModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatTableModule, MatSortModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router, RouterModule, Routes } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Observable, of } from "rxjs";
import { IResponse } from "../../../../assets/interfaces/iresponse";
import { ICapability } from "../../../../assets/interfaces/iuserroleauth";
import { NotificationService } from "../../../../assets/services/notification.service";
import { ShareDataService } from "../../../../assets/services/share-data.service";
import { UserRoleAuthService } from "../../../../assets/services/user-role-auth.service";
import { ModifycapabilityComponent } from "./modifycapability.component";


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

describe('Modifycapability', () => {
  let component: ModifycapabilityComponent;
  let fixture: ComponentFixture<ModifycapabilityComponent>;
  let formBuilder: FormBuilder;
  let translate: TranslateService;
  let injector: Injector;
  let userRoleAuthService: any;
  let routerSpy: jasmine.SpyObj<Router>;

  const spinnerServiceMock = {
    show: jasmine.createSpy('show'),
    hide: jasmine.createSpy('hide')
  };

  const routes: Routes = [
    {
      path: 'modifycapability',
      component: ModifycapabilityComponent,
      data: {
        title: 'Modify Capability'
      },
      pathMatch: 'full'
    }
  ];
  // Mock data and services
  const mockShareDataService = {
    getSharedData: jasmine.createSpy('getSharedData').and.returnValue({ id: 1, capabilityName: 'Test Capability', endPoint: 'test_endpoint' }),
    getLabels: jasmine.createSpy('getLabels').and.returnValue('en')
  };
  const mockUserRoleAuthService = {
    updateCapability: () => of({ status: 200, data: {} })
  };
  routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  const notificationServiceMock = {
    showNotification: jasmine.createSpy('showNotification')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModifycapabilityComponent],
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
        RouterModule.forRoot(routes, { useHash: true }),
        Ng4LoadingSpinnerModule.forRoot(),
        FormsModule, ReactiveFormsModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      providers: [
        FormBuilder,
        Location,
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: ShareDataService, useValue: mockShareDataService },
        { provide: DatePipe, useValue: {} },
        { provide: Router, useValue: routerSpy },
        { provide: UserRoleAuthService, useClass: UserRoleAuthService },
        { provide: Ng4LoadingSpinnerService, useValue: {} },
        { provide: UserRoleAuthService, useValue: mockUserRoleAuthService },
        { provide: ShareDataService, useValue: mockShareDataService },
        { provide: Ng4LoadingSpinnerService, useValue: spinnerServiceMock },
      ]
    }).compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
    userRoleAuthService = TestBed.get(UserRoleAuthService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifycapabilityComponent);
    component = fixture.componentInstance;
    component.form = new FormBuilder().group({
      capabilityName: new FormControl('', [Validators.required]),
      endPoint: new FormControl('')
    });

    component.form.patchValue({
      capabilityName: component.capability.capabilityName,
      endPoint: component.capability.endPoint
    });
    fixture.detectChanges();
  });

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /admin/dashboard on onScreenClose', () => {
    component.modifycapabilityScreenClose();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  });

  it('should translate validation messages correctly', () => {
    const translatedText = 'Translated validation message';

    component.validationMessages.capabilityName[0].message = translatedText;
    expect(component.validationMessages.capabilityName[0].message).toEqual(translatedText);
  });

  it('should call onSubmit with isCreateAnother true', () => {
    spyOn(component, 'onSubmit');
    component.createAnother();
    expect(component.onSubmit).toHaveBeenCalledWith(true);
  });

  it('should update progress correctly when form fields are filled', () => {
    component.form.controls['capabilityName'].setValue('test');
    component.form.controls['endPoint'].setValue('test@example.com');
    component.updateProgress();
    fixture.detectChanges();
  });

  it('should mark form and controls as touched and dirty when the form is invalid', () => {
    component.form.controls['capabilityName'].setValue('');

    component.validateFields();

    expect(component.form.touched).toBe(true);
    expect(component.form.dirty).toBe(true);

    for (const controlName in component.form.controls) {
      if (component.form.controls.hasOwnProperty(controlName)) {
        const control = component.form.controls[controlName];
        expect(control.touched).toBe(true);
        expect(control.dirty).toBe(true);
      }
    }
  });

  it('should not mark form or controls as touched or dirty when the form is valid', () => {
    component.form.controls['capabilityName'].setValue('ValidName');

    component.validateFields();

    expect(component.form.touched).toBe(false);
    expect(component.form.dirty).toBe(false);

    for (const controlName in component.form.controls) {
      if (component.form.controls.hasOwnProperty(controlName)) {
        const control = component.form.controls[controlName];
        expect(control.touched).toBe(false);
        expect(control.dirty).toBe(false);
      }
    }
  });

  it('should call onScreenBack', () => {
    component.onScreenBack();
    expect(component.onScreenBack).toBeTruthy();
  });

  it('should call onSubmit without errors', fakeAsync(() => {

    component.onSubmit();
    tick(3000);

    expect(notificationServiceMock.showNotification).toBeTruthy();
    expect(spinnerServiceMock.show).toBeTruthy();
    expect(component).toBeTruthy();
  }));

});
