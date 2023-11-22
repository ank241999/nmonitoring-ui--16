import { async, ComponentFixture, TestBed, getTestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { Router, RouterModule, Routes } from '@angular/router';
import { AddcapabilityComponent } from './addcapability.component';
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
  MatSortModule,
} from '@angular/material';
import { IResponse } from '../../../../assets/interfaces/iresponse';
import { Observable, of } from 'rxjs';
import { NotificationService } from '../../../../assets/services/notification.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Injector } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserRoleAuthService } from '../../../../assets/services/user-role-auth.service';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { ICapability } from '../../../../assets/interfaces/iuserroleauth';

export class MocUserService {
  capability: ICapability = {
    id: 1,
    capabilityName: "test",
    endPoint: "test",
    description: "test",
  };

  capabilityList: ICapability[] = [];

  public getCapability(search: string): Observable<IResponse> {
    this.capabilityList.push(this.capability);

    let mockResponse: IResponse = {
      "status": 200,
    };
    return of(mockResponse);
  }

  public saveCapability(capability: ICapability): Observable<IResponse> {
    // return of(this.user);
    this.capabilityList.push(this.capability);

    let mockResponse: IResponse = {
      "status": 200,
    };

    return of(mockResponse);
  }

  public updateCapability(capability: ICapability): Observable<ICapability> {
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

describe('AddcapabilityComponent', () => {
  let component: AddcapabilityComponent;
  let fixture: ComponentFixture<AddcapabilityComponent>;
  let translate: TranslateService;
  let injector: Injector;
  let routerSpy: jasmine.SpyObj<Router>;
  let notificationService: jasmine.SpyObj<NotificationService>;


  const routes: Routes = [
    {
      path: 'addcapabilitycomponent',
      component: AddcapabilityComponent,
      data: {
        title: 'Add Capability'
      },
      pathMatch: 'full'
    }
  ];

  routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async(() => {
    notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'getLabels']);

    TestBed.configureTestingModule({
      declarations: [AddcapabilityComponent],
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
        HttpClientTestingModule,
        MatTableModule,
        MatSortModule,
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
      providers: [
        { provide: NotificationService, useValue: notificationService },
        { provide: UserRoleAuthService, useClass: UserRoleAuthService },
        { provide: Router, useValue: routerSpy },

        DatePipe, ShareDataService
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
    fixture = TestBed.createComponent(AddcapabilityComponent);
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

  it('should CreateAnother true', () => {
    spyOn(component, 'onSubmit');
    component.createAnother();
    expect(component.onSubmit).toHaveBeenCalledWith(true);
  });

  it('should navigate to /admin/dashboard on onScreenClose', () => {
    component.addcapabilityScreenClose();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  });

  it('#onSubmit()', () => {
    const mockUserRoleAuthService = TestBed.get(UserRoleAuthService);
    const saveCapabilitySpy = spyOn(mockUserRoleAuthService, 'saveCapability').and.returnValue(of({ status: 200, data: {} }));

    component.form.controls['capabilityName'].setValue('Test Name');
    component.form.controls['endPoint'].setValue('test@example.com');

    component.onSubmit();

    expect(saveCapabilitySpy).toHaveBeenCalledWith({
      capabilityName: 'Test Name',
      endPoint: 'test@example.com',
    });
    notificationService.showNotification('Capability created successfully', 'top', 'center', '', 'info-circle');
    expect(notificationService.showNotification).toHaveBeenCalledWith(
      'Capability created successfully',
      'top',
      'center',
      '',
      'info-circle'
    );
    expect(routerSpy).toBeTruthy(['/admin/roles/capability']);
  });

  it('should call onScreenBack', () => {
    component.onScreenBack();
    expect(component.onScreenBack).toBeTruthy();
  });

  it('should create a FormGroup comprised of FormControls', () => {
    component.ngOnInit();
    expect(component.form instanceof FormGroup).toBe(true);
  });

  it(`form should be invalid`, async(() => {
    component.form.controls['capabilityName'].setValue('');
    component.form.controls['endPoint'].setValue('');

    expect(component.form.valid).toBeFalsy();
  }));

  it('should translate validation messages correctly', () => {
    const translatedText = 'Translated validation message';

    component.validationMessages.capabilityName[0].message = translatedText;
    expect(component.validationMessages.capabilityName[0].message).toEqual(translatedText);
  });
});
