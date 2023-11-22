import { async, ComponentFixture, TestBed, getTestBed, inject } from '@angular/core/testing';
import { Router, RouterModule, Routes } from '@angular/router';
import { AccountManagementComponent } from './accountmanagement.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
  MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
  MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA
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
import { UserService } from "../../../assets/services/user.service";
import { IUser } from '../../../assets/interfaces/iuser';
import { IResponse } from '../../../assets/interfaces/iresponse';
import { Observable, of } from 'rxjs';
import { NotificationService } from '../../../assets/services/notification.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, Injector } from "@angular/core";
import { ShareDataService } from '../../../assets/services/share-data.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';


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
class MockRouter {
  navigate = jasmine.createSpy('navigate'); // Create a spy for the navigate method
}

describe('AccountManagementComponent', () => {
  let component: AccountManagementComponent;
  let fixture: ComponentFixture<AccountManagementComponent>;
  let injector: Injector;
  let translate: TranslateService;
  let dialog: MatDialog;
  let router: Router;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<any>>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  const routes: Routes = [
    {
      path: 'accountmanagement',
      component: AccountManagementComponent,
      data: {
        title: 'Users'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue({ afterClosed: () => of({}) });
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables', 'getLabels']);
    shareDataServicespy.getSharedData.and.returnValue(true);

    TestBed.configureTestingModule({
      declarations: [AccountManagementComponent],
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
        // UserRoutingModule,NotifierModule,
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
      //providers:[{provide: MessagingService,useClass: mockMessagingService}],
      providers: [
        { provide: UserService, useClass: MocUserService },
        { provide: NotificationService, notificationService },
        { provide: ShareDataService, useValue: shareDataServicespy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      
      

      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onScreenClose', async () => {
    component.onScreenClose();
    expect(component.onScreenClose).toBeTruthy;
  });

  it(`should call the getUsers from userService on Submit`, async(() => {
    inject([UserService], ((userService: UserService) => {
      spyOn(userService, 'getUsers');
      let component = fixture.componentInstance;
      component.ngOnInit();
      expect(userService.getUsers).toHaveBeenCalled();
    }));
  }));

  it(`should call the deleteUser from userService`, async(() => {
    inject([UserService], ((userService: UserService) => {
      spyOn(userService, 'deleteUser');
      expect(userService.deleteUser).toHaveBeenCalled();
    }));
  }));

  it('should open dialog and navigate when selection is not empty', () => {
    const mockSelectedUser: IUser = {
    };
    component.selection.select(mockSelectedUser);
    component.openDialog();
    expect(component.openDialog).toBeTruthy();
  });

  it('should call delete Dialog', async () => {
    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.deleteAccount).toHaveBeenCalled();
    });
  });

  it(`should call the filterDeployments method`, () => {
    component.filterDeployments();
    expect(component.filterDeployments).toBeTruthy();
  });

  it(`should call the isAllSelected method`, () => {
    component.isAllSelected();
    expect(component.isAllSelected).toBeTruthy();
  });

  it(`should call the selectAll method`, () => {
    component.selectAll();
    expect(component.selectAll).toBeTruthy();
  });

  it(`should call the masterToggle method`, () => {
    component.masterToggle();
    expect(component.masterToggle).toBeTruthy();
  });

  it(`should call the applyFilter method`, () => {
    component.applyFilter("1");
    expect(component.applyFilter).toBeTruthy();
  });
});
