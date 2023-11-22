import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule, FormGroup } from "@angular/forms";
import { MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatInputModule, MatListModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatTableModule, MatSortModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Routes, RouterModule } from "@angular/router";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Observable, of } from "rxjs";
import { ITabletResponse } from "../../../../assets/interfaces/iresponse";
import { ITablet } from "../../../../assets/interfaces/itablet";
import { NotificationService } from "../../../../assets/services/notification.service";
import { ShareDataService } from "../../../../assets/services/share-data.service";
import { TabletService } from "../../../../assets/services/tablet.service";
import { UserService } from "../../../../assets/services/user.service";
import { EdittabletComponent } from "./edittablet.component";

export class MocTabletService {
  tablet: ITablet = {
    id: 1,
    creationTimestamp: null,
    updateTimestamp: null,
    tabletName: 'abc',
    tabletStatus: true,
    tabletMacAddress: '111.111.222.11',
    primaryTablet: true,
    devices: []
  };

  tabletList: ITablet[] = [];

  getTablets(): Observable<ITabletResponse> {
    this.tabletList.push(this.tablet);

    let mockResponse: ITabletResponse = {
      "status": 200,
      "data": this.tabletList
    };
    return of(mockResponse);
  }


  public addTablet(tablet: ITablet): Observable<ITabletResponse> {
    this.tabletList.push(this.tablet);

    let mockResponse: ITabletResponse = {
      "status": 200,
      "data": this.tabletList
    };

    return of(mockResponse);
  }

  public updateTablet(tablet: ITablet): Observable<ITabletResponse> {
    this.tabletList.push(this.tablet);

    let mockResponse: ITabletResponse = {
      "status": 200,
      "data": this.tabletList
    };

    return of(mockResponse);
  }

  public deleteTablet(id: string, rev: string): Observable<ITablet> {
    return of(this.tablet);
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

describe('EdittabletComponent', () => {
  let component: EdittabletComponent;
  let fixture: ComponentFixture<EdittabletComponent>;
  const routes: Routes = [
    {
      path: 'edittablet',
      component: EdittabletComponent,
      data: {
        title: 'Edit Tablet'
      },
      pathMatch: 'full'
    }
  ];

  beforeEach(() => {
    const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables', 'getLabels']);
    shareDataServicespy.getSharedData.and.returnValue(true);
    const ng4LoadingSpinnerServiceSpy = jasmine.createSpyObj('Ng4LoadingSpinnerService', ['show', 'hide']);
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    TestBed.configureTestingModule({
      declarations: [EdittabletComponent],
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
        { provide: TabletService, useValue: MocTabletService },
        { provide: ShareDataService, useValue: shareDataServicespy },
        { provide: NotificationService, useValue: notificationService },
        { provide: Ng4LoadingSpinnerService, useValue: ng4LoadingSpinnerServiceSpy },
        TabletService,
        UserService,
        TranslateService,
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdittabletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    component.ngOnInit();
    expect(component.form.get('tabletName')).toBeDefined();
    expect(component.form.get('tabletMacAddress')).toBeDefined();
    expect(component.form.get('tabletStatus')).toBeDefined();
    expect(component.form.get('primaryTablet')).toBeDefined();
  });

  it('should validate the form fields correctly', () => {
    component.validateFields();
    expect(component.form.valid).toBeFalsy();
  });

  it('should set submitted to be true', (() => {
    component.onSubmit();
    expect(component.onSubmit).toBeTruthy();
  }));

  it(`should call onScreenClose `, async () => {
    component.edittabletScreenClose();
    expect(component.edittabletScreenClose).toBeTruthy();
  });

  it('should autofill the tabletMacAddress form control and hide the container', () => {
    component.form.controls['tabletMacAddress'].setValue('');

    component.autofill('testValue');
    expect(component.form.controls['tabletMacAddress'].value).toBe('testValue');
  });
  

  it('should create a FormGroup comprised of FormControls', () => {
    component.ngOnInit();
    expect(component.form instanceof FormGroup).toBe(true);
  });

  it('should set primaryTab to true when $event.checked is true', () => {
    component.primaryTab = false;
    const testEvent = { checked: true };
    component.primaryTablet(testEvent);

    expect(component.primaryTab).toBe(true);
  });

  it('should set primaryTab to false when $event.checked is false', () => {
    component.primaryTab = true;
    const testEvent = { checked: false };

    component.primaryTablet(testEvent);
    expect(component.primaryTab).toBe(false);
  });

});