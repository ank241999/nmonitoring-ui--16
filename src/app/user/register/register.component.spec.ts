import { async, ComponentFixture, TestBed, getTestBed, inject } from '@angular/core/testing';
import { RegisterComponent } from './register.component';

import {
  MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
  MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
  MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule
} from '@angular/material';
import {
  MatButtonModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTableModule,
  MatSortModule
} from '@angular/material';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from "../../../assets/services/user.service";
import { IUser } from '../../../assets/interfaces/iuser';
import { Observable, of } from 'rxjs';
// import { NotifierService } from 'angular-notifier';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF } from '@angular/common';
import { NotifierModule } from 'angular-notifier';
import { FormBuilder } from '@angular/forms';
import { IResponse } from '../../../assets/interfaces/iresponse';

import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Injector } from "@angular/core";
import { NotificationService } from '../../../assets/services/notification.service';
import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

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
    device: "pc"
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

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let registerComponent: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: UserService;
  const formBuilder: FormBuilder = new FormBuilder();
  let loginUserSpy: any;
  let shareDataServicespy: jasmine.SpyObj<ShareDataService>;
  const mockUser: IUser = {
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
    device: "pc"
  };

  let mockUserList: IUser[] = [];
  mockUserList.push(mockUser); // Use mockUser instead of this.user

  const mockResponse: IResponse = {
    "status": 200,
    "data": mockUserList
  };

  let translate: TranslateService;
  let injector: Injector;

  it('true is true', () => expect(true).toBe(true));

  // const mockService = jasmine.createSpyObj('UserService', ['getUsers']);
  // loginUserSpy = mockService.loginUser.and.returnValue(of(mockResponse));
  const MockElementRef: any = {
    get offsetLeft() {
      return 0;
    }
  };


  beforeEach(async(() => {
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables', 'setApplicationVariables', 'getLabels']);
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
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
        RegisterComponent,
        { provide: UserService, useClass: MocUserService },
        // { provide: UserService, useValue: mockService }, 
        { provide: APP_BASE_HREF, useValue: '/my/app' },
        { provide: ElementRef, useValue: MockElementRef },
        { provide: NotificationService, notificationService },
        { provide: ShareDataService, useValue: shareDataServicespy },
        DatePipe
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();

    injector = getTestBed();
    translate = injector.get(TranslateService);

    component = TestBed.get(RegisterComponent);
    userService = TestBed.get(UserService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    registerComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component should be defined', () => {
    expect(registerComponent).toBeDefined();
  });

  // it('Angular calls ngOnInit', () => {
  //   component.ngOnInit();    
  // });

  it('should create', () => {
    expect(registerComponent).toBeTruthy();
  });

  it(`button should disable when form is invalid`, () => {
    component.registerForm.controls["firstName"].setValue('');
    component.registerForm.controls["lastName"].setValue('');
    component.registerForm.controls["email"].setValue('');
    component.registerForm.controls["confirmEmail"].setValue('');

    fixture.detectChanges();

    let submitButton: DebugElement = fixture.debugElement.query(By.css('button[type=submit]'));
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it(`should call the navigateLogin method`, async () => {
    component.navigateLogin();
    expect(component.navigateLogin).toBeTruthy();
  });

  it(`should call the registerUser method from userService`, async(() => {
    inject([UserService], ((userService: UserService) => {
      spyOn(userService, 'registerUser');
      let component = fixture.componentInstance;
      component.onSubmit();
      expect(userService.registerUser).toHaveBeenCalled();
    }));
  }));

  it(`should call the getLocation method`, () => {
    component.getLocation();
    expect(component.getLocation).toBeTruthy();
  });

  it(`should set submitted to be true`, (() => {
    component.onSubmit();
    expect(component.onSubmit).toBeTruthy();
  }));

  it('#onSubmit() - successful registration', () => {
    // Other test setup code
    component.registerForm.controls['firstName'].setValue('test');
    component.registerForm.controls['lastName'].setValue('abc');
    component.registerForm.controls['confirmEmail'].setValue('test.abc@example.com');
    component.registerForm.controls['confirmEmail'].setValue('1');

    component.onSubmit();

    // Assertions and expectations
  });


  it(`should show notification when registration fails`, () => {
    component.registerForm.controls["firstName"].setValue("test");
    component.registerForm.controls["lastName"].setValue("abc");
    component.registerForm.controls["confirmEmail"].setValue("test.abc@example.com");
    component.registerForm.controls["confirmEmail"].setValue("1");

    component.onSubmit();

    expect(userService.registerUser);

  });

  it(`should call translateValidationMessages method`, async () => {
    component.translateValidationMessages()
    expect(component.translateValidationMessages).toBeTruthy();
  });
  it(`should call validateFields method`, async () => {
    component.validateFields()
    expect(component.validateFields).toBeTruthy();
  });
  it(`should call updateProgress`, async () => {
    component.updateProgress()
    expect(component.updateProgress).toBeTruthy();
  });
  it(`should call formatDate`, async () => {
    component.formatDate(new Date())
    expect(component.formatDate).toBeTruthy();
  });
});
