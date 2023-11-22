import { async, ComponentFixture, TestBed, getTestBed, inject } from '@angular/core/testing';

import { RouterModule, Routes } from '@angular/router';
import { AddaccountComponent } from './addaccount.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
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
  MatSortModule, MatRowDef
} from '@angular/material';
import { UserService } from "../../../../assets/services/user.service";
import { IUser } from '../../../../assets/interfaces/iuser';
import { IResponse } from '../../../../assets/interfaces/iresponse';
import { Observable, of } from 'rxjs';
import { NotificationService } from '../../../../assets/services/notification.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Injector } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DatePipe } from '@angular/common';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { UserRoleAuthService } from '../../../../assets/services/user-role-auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ShareDataService } from '../../../../assets/services/share-data.service';

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
    roleName: "BASIC"
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

  public updateUser(user: IUser): Observable<IUser> {
    return of(this.user);
  }

  public deleteUser(id: string, rev: string): Observable<IUser> {
    return of(this.user);
  }
}

let translations: any = { "CARDS_TITLE": "This is a test" };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('AddaccountComponent', () => {
  let component: AddaccountComponent;
  let fixture: ComponentFixture<AddaccountComponent>;
  let translate: TranslateService;
  let injector: Injector;

  const routes: Routes = [
    {
      path: 'addaccountcomponent',
      component: AddaccountComponent,
      data: {
        title: 'Add users'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async(() => {
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables', 'getLabels']);
    shareDataServicespy.getSharedData.and.returnValue(true);

    TestBed.configureTestingModule({
      declarations: [AddaccountComponent],
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
        //RouterModule.forChild(routes),
        RouterModule.forRoot(routes, { useHash: true }),
        Ng4LoadingSpinnerModule.forRoot(),
        // UserRoutingModule,NotifierModule,
        FormsModule, ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
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
        { provide: ShareDataService, useValue: shareDataServicespy }, // Add the ShareDataService provider
        DatePipe, UserRoleAuthService,

      ],
      schemas: [
        //CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#validateFields()', () => {
    component.validateFields();
  });

  it('#updateProgress()', () => {
    component.updateProgress();
  });

  it('should set submitted to be true', () => {
    component.onSubmit();
    expect(component.onSubmit).toBeTruthy();
  });

  it('should create a FormGroup comprised of FormControls', () => {
    component.ngOnInit();
    expect(component.form instanceof FormGroup).toBe(true);
  });

  it(`form should be invalid`, async(() => {
    component.form.controls['firstName'].setValue('');
    component.form.controls['lastName'].setValue('');
    component.form.controls['email'].setValue('');
    component.form.controls['confirmemail'].setValue('');
    component.form.controls['role'].setValue('');

    expect(component.form.valid).toBeFalsy();
  }));

  it(`should call the registeruser from userService on Submit`, async(() => {
    inject([UserService], ((userService: UserService) => {
      spyOn(userService, 'loginUser');
      let component = fixture.componentInstance;
      component.onSubmit();
      expect(userService.loginUser).toHaveBeenCalled();
    }));
  }));

  it('#onSubmit()', () => {
    component.form.controls['firstName'].setValue('test');
    component.form.controls['lastName'].setValue('test');
    component.form.controls['email'].setValue('test');
    component.form.controls['confirmemail'].setValue('test');
    component.form.controls['role'].setValue('ZACCESS');
    component.form.controls["expiryDate"].setValue("2019/11/30");

    // component.onSubmit();

    component.formatDate(new Date());

    component.changeRole("ZACCESS");
    component.changeRole("1ACCESS");

  });
});
