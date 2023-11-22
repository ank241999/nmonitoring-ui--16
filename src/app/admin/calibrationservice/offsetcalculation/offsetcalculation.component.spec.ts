import { CUSTOM_ELEMENTS_SCHEMA, Injector } from '@angular/core';
import { ComponentFixture, TestBed, getTestBed } from "@angular/core/testing";
import { OffsetcalculationComponent } from "./offsetcalculation.component";
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { RouterModule, Routes } from '@angular/router';
import { ChartsDataService, Ng2ChartsResolver } from '../../../charts';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ActivityConstants } from '../../../../assets/constants/activity-constants';
import { NotificationService } from '../../../../assets/services/notification.service';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { UserSettingService } from '../../../../assets/services/userSettingService';
import { SideMenuService, MessagesMenuService, NotificationsMenuService } from '../../../core';
import { SharedModule } from '../../../shared';
import { ExtendedTablesResolver, TableDataService } from '../../../tables';
import { HttpLoaderFactory } from '../../accountmanagement/accountmanagement.module';
import { event } from 'jquery';
const translation: any = { 'CARDS_TITLE': 'This is a test' };
class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translation);
  }
}
describe("OffsetcalculationComponent", () => {
  let component: OffsetcalculationComponent;
  let fixture: ComponentFixture<OffsetcalculationComponent>;
  let translate: TranslateService;
  let injector: Injector;
  const routes: Routes = [
    {
      path: 'offsetcalculationComponent',
      component: OffsetcalculationComponent,
      resolve: {
        data: Ng2ChartsResolver
      }
    }
  ];
  beforeEach(async () => {
    const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables']);
    shareDataServicespy.getSharedData.and.returnValue(true);
    TestBed.configureTestingModule({
      declarations: [OffsetcalculationComponent],
      imports: [
        //RouterModule.forChild(routes),
        RouterModule.forRoot(routes),
        CommonModule,
        SharedModule,
        MatTableModule,
        BrowserAnimationsModule,
        HttpClientModule, TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        Ng2ChartsResolver,
        ChartsDataService,
        ExtendedTablesResolver,
        TableDataService,
        SideMenuService,
        MessagesMenuService,
        UserSettingService,
        NotificationsMenuService,
        NotificationService,
        ShareDataService,
        ActivityConstants,
        Ng4LoadingSpinnerService
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(OffsetcalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('component should be defined', () => {
    expect(component).toBeDefined();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it(`should call getoffset`, async () => {
    component.getoffset();
    expect(component.getoffset).toBeTruthy();
  });
  it(`should checkValue`, () => {
    component.checkValue({ target: { value: -1 } });
    expect(component.firstFormGroup.get('firstframe').value).toBeTruthy(1);
  });
  it(`should call onScreenClose`, async () => {
    component.onScreenClose();
    expect(component.onScreenClose).toBeTruthy();
  });
  it(`should call refresh`, async () => {
    component.refresh();
    expect(component.refresh).toBeTruthy();
  });
  it(`should call firstFormHandleMinus`, async () => {
    component.firstFormHandleMinus();
    expect(component.firstFormHandleMinus).toBeTruthy();
  });
  it(`should call firstFormHandlePlus`, async () => {
    component.firstFormHandlePlus();
    expect(component.firstFormHandlePlus).toBeTruthy();
  });
})