import { HttpClient, HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, inject, Injector } from "@angular/core";
import { async, ComponentFixture, fakeAsync, getTestBed, TestBed, tick } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatInputModule, MatListModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatTableModule, MatSortModule, MatSnackBar, MatSnackBarModule } from "@angular/material";
import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router, RouterModule } from "@angular/router";
import { TranslateLoader, TranslateModule, TranslatePipe, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Ng4LoadingSpinnerModule } from "ng4-loading-spinner";
import { Observable, of } from "rxjs";
import { IResponse } from "../../../assets/interfaces/iresponse";
import { IUser } from "../../../assets/interfaces/iuser";
import { NotificationService } from "../../../assets/services/notification.service";
import { ShareDataService } from "../../../assets/services/share-data.service";
import { UserRoleAuthService } from "../../../assets/services/user-role-auth.service";
import { UserService } from "../../../assets/services/user.service";
import { UserSettingService } from "../../../assets/services/userSettingService";
import { AlreadyloginalertComponent } from "../alreadyloginalert/alreadyloginalert.component";
import { RegisterComponent } from "../register/register.component";
import { LoginComponent } from "./login.component";

export class MocUserService {
  user: IUser = {
    id: "1",
    email: "test.abc@example.com",
    password: "abc",
    firstName: "abc",
    lastName: "xyz",
    loggedIn: true,
    loggedInDevice: "pc",
    expiryTimestamp: null,
    creationTimestamp: null,
    _rev: "1",
    device: "pc",
    role: "[BASIC]",
    expiryDays: 1,
    roleName: "Basic"
  };

  userList: IUser[] = [];

  public getUsers(search: string): Observable<IResponse> {
    this.userList.push(this.user);

    let mockResponse: IResponse = {
      "status": 200,
      "data": this.userList
    };
    return of(mockResponse);
  }

  public loginUser(user: IUser): Observable<IResponse> {
    // return of(this.user);
    this.userList.push(this.user);

    let mockResponse: IResponse = {
      "status": 200,
      "data": this.userList
    };

    return of(mockResponse);
  }

  public registerUser(user: IUser): Observable<IUser> {
    return of(this.user);
  }

  public deleteUser(id: string, rev: string): Observable<IUser> {
    return of(this.user);
  }

  public logOutAll(username: string, password: string, device: string): Observable<IUser> {
    return of(this.user);
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

let translations: any = { "CARDS_TITLE": "This is a test" };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}
describe('LoginComponent', () => {
  let component: LoginComponent;
  let loginComponent: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let shareDataService: jasmine.SpyObj<ShareDataService>;
  let userSettingService: jasmine.SpyObj<UserSettingService>;
  let injector: Injector;
  let translate: TranslateService;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers', 'loginUser']);
    const shareDataServiceSpy = jasmine.createSpyObj('ShareDataService', ['getUser', 'setScanCountBasis', 'getScanCountBasis', 'getLabels', 'setLabels', 'setUser', 'setApplicationVariables', 'setAvtarImage']);
    const userSettingServiceSpy = jasmine.createSpyObj('UserSettingService', ['getUserSetting']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent, AlreadyloginalertComponent, RegisterComponent],
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
        MatSnackBarModule,
        MatSortModule,
        FormsModule, ReactiveFormsModule, HttpClientModule,
        RouterModule.forRoot([]),
        BrowserAnimationsModule,
        Ng4LoadingSpinnerModule.forRoot(),
        // NotifierModule.withConfig({}),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      providers: [
        LoginComponent,
        { provide: UserService, useValue: userServiceSpy },
        { provide: ShareDataService, useValue: shareDataServiceSpy },
        { provide: UserSettingService, useValue: userSettingServiceSpy },
        { provide: TranslatePipe, useClass: TranslatePipe },
        { provide: NotificationService, useClass: NotificationService },
        UserRoleAuthService,
        UserService
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();

    injector = getTestBed();
    translate = injector.get(TranslateService);

    component = TestBed.get(LoginComponent);
    userService = TestBed.get(UserService);
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    loginComponent = fixture.componentInstance;
    const router = injector.get(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('component should be defined', () => {
    expect(loginComponent).toBeDefined();
  });

  it('should #filteredOptions defined after Angular calls ngOnInit', () => {
    component.ngOnInit();
    expect(component.filteredOptions).toBeDefined();
  });

  it(`button should disable when form is invalid`, fakeAsync(() => {
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const submitButton: HTMLButtonElement = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement;
      expect(submitButton.disabled).toBeTruthy();
    });

    tick(10000);
  }));

  it('#onSubmit()', () => {
    loginComponent.selectedUser = [{
      email: 'test.abc@example.com',
      password: 'test.abc@example.com',
      role: '[BASIC]',
    }];

    loginComponent.emailFilter("test.abc@example.com");
    loginComponent.loginForm.controls["email"].setValue("test.abc@example.com");
    loginComponent.loginForm.controls["password"].setValue("test.abc@example.com");
    expect(loginComponent.selectedUser[0].email).toEqual("test.abc@example.com");
    expect(loginComponent.selectedUser[0].password).toEqual("test.abc@example.com");
    expect(loginComponent.selectedUser[0].role).toEqual("[BASIC]");
    fixture.detectChanges();
  });

  it(`should call the getLocation method`, () => {
    component.getLocation();
    expect(component.getLocation).toBeTruthy();
  });

  it(`should call the navigateRegister method`, () => {
    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    loginComponent.isForgotPassword = false;
    loginComponent.cancel();
  });

  it('#formatDate()', () => {
    loginComponent.navigateRegister();
    loginComponent.cancel();
    loginComponent.setAlreadyLoginControls();
    loginComponent.defaultControls();
    loginComponent.clearPasscodes();
  });

  it('#autofill()', () => {
    loginComponent.loginForm.controls["email"].setValue("test.abc@example.com");
    loginComponent.loginForm.controls["password"].setValue("test.abc@example.com");
    loginComponent.autofill("test.abc@example.com");
  });
  it(`should call emailFilter`, async () => {
    component.emailFilter('');
    expect(component.emailFilter).toBeTruthy();
  });
  it(`should call setAlreadyLoginControls`, async () => {
    component.setAlreadyLoginControls();
    expect(component.setAlreadyLoginControls).toBeTruthy();
  });
  it(`should call defaultControls`, async () => {
    component.defaultControls();
    expect(component.defaultControls).toBeTruthy();
  });
  it(`should call clearPasscodes`, async () => {
    component.clearPasscodes();
    expect(component.defaultControls).toBeTruthy();
  });

  it('should call getLocation() and set appropriate properties', () => {
    const getLocationSpy = spyOn(loginComponent, 'getLocation').and.callThrough();

    loginComponent.getLocation();
    expect(getLocationSpy).toHaveBeenCalled();
  });
});
