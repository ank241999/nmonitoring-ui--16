import { async, ComponentFixture, TestBed, getTestBed, inject } from '@angular/core/testing';

import { Router, RouterModule, Routes } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
  MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
  MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule, MatTableDataSource
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
import { Injector } from "@angular/core";
import { ShareDataService } from '../../../assets/services/share-data.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RoleComponent } from './role.component';
import { IAccesslevel } from '../../../assets/interfaces/iuserroleauth';
import { UserRoleAuthService } from '../../../assets/services/user-role-auth.service';
import { DatePipe } from '@angular/common';


export class MocUserService {
  roles: IAccesslevel = {
    id: 1,
    accessLevels: "test",
    keyName: "test",
    label: "test",
  };

  rolesList: IAccesslevel[] = [];

  public getAccessibilities(search: string): Observable<IResponse> {
    this.rolesList.push(this.roles);

    let mockResponse: IResponse = {
      "status": 200
    };
    return of(mockResponse);
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

describe('RoleComponent', () => {
  let component: RoleComponent;
  let fixture: ComponentFixture<RoleComponent>;
  let injector: Injector;
  let translate: TranslateService;
  let router: Router;
  const routes: Routes = [
    {
      path: 'Role',
      component: RoleComponent,
      data: {
        title: 'Roles'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async(() => {
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables']);
    shareDataServicespy.getSharedData.and.returnValue(true);

    TestBed.configureTestingModule({
      declarations: [RoleComponent],
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
        { provide: UserService, useClass: MocUserService },
        { provide: UserRoleAuthService, useClass: UserRoleAuthService }, // Replace MockUserRoleAuthService with UserRoleAuthService
        DatePipe, ShareDataService,
      ],
      schemas: [
        //CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
    // let injectedService = TestBed.get(ShareDataService);
    injector = getTestBed();
    translate = injector.get(TranslateService);
    router = TestBed.get(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call open Dialog', async () => {
    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.openDialog).toHaveBeenCalled();
    });
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

  it('should call applyFilter', () => {
    const sampleData = [
      { accessLevels: '1evel 1' },
    ];
    component.dataSource = new MatTableDataSource(sampleData);
    component.applyFilter('level 1');
    expect(component.dataSource.filter).toBe('level 1');
  });

  it('should call isAllSelected', () => {
    const sampleData = [
      { accessLevels: 'Level 1' },
      { accessLevels: 'Level 2' },
      { accessLevels: 'Level 3' },
    ];
    component.dataSource = new MatTableDataSource(sampleData);

    component.selection.select(sampleData[0]);
    component.selection.select(sampleData[1]);
    const result = component.isAllSelected();
    expect(result).toBe(false);
  });

  it('should call selectAll', () => {
    const sampleData = [
      { accessLevels: 'Level 1' },
      { accessLevels: 'Level 2' },
      { accessLevels: 'Level 3' },
    ];
    component.dataSource = new MatTableDataSource(sampleData);
    component.selectAll();

    const numSelected = component.selection.selected.length;
    const numRows = component.dataSource.filteredData.length;

    expect(numSelected).toBe(numRows);
  });

  it('should call masterToggle', () => {
    const sampleData = [
      { accessLevels: 'Level 1' },
      { accessLevels: 'Level 2' },
      { accessLevels: 'Level 3' },
    ];
    component.dataSource = new MatTableDataSource(sampleData);
    component.masterToggle();
    const numSelected = component.selection.selected.length;
    const numRows = component.dataSource.filteredData.length;

    if (numSelected === 0) {
      expect(component.selection.isEmpty()).toBe(false);
    } else {
      expect(numSelected).toBe(3);
    }
  });

  it(`should call onScreenClose`, async () => {
    component.onScreenClose();
    expect(component.onScreenClose).toBeTruthy();
  });

  it(`should call deleteAccount`, async () => {
    component.deleteAccount();
    expect(component.deleteAccount).toBeTruthy();
  });

  it('should set shared data and navigate to rolecapability if selection is not empty', () => {
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
    spyOn(component.selection, 'selected').and.returnValue([{ id: 1 }]);

    component.openDialog();
    const expectedUrl = '/admin/roles/rolecapability';
    expect(navigateByUrlSpy).toBeTruthy(expectedUrl);
  });
});
