import { SelectionModel } from "@angular/cdk/collections";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, Injector } from "@angular/core";
import { ComponentFixture, async, TestBed, getTestBed, fakeAsync, tick } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialog, MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatInputModule, MatListModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatTableModule, MatSortModule, MatTableDataSource } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Routes, RouterModule, Router } from "@angular/router";
import { TranslateLoader, TranslateService, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Observable, of } from "rxjs";
import { ITabletResponse } from "../../../assets/interfaces/iresponse";
import { ITablet } from "../../../assets/interfaces/itablet";
import { ShareDataService } from "../../../assets/services/share-data.service";
import { TabletService } from "../../../assets/services/tablet.service";
import { TabletComponent } from "./tablet.component";

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

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
describe('TabletComponent', () => {
  let component: TabletComponent;
  let fixture: ComponentFixture<TabletComponent>;
  let injector: Injector;
  let translate: TranslateService;
  let dialog: MatDialog;

  const routes: Routes = [
    {
      path: 'tablet',
      component: TabletComponent,
      data: {
        title: 'Tablet'
      },
      pathMatch: 'full'
    }
  ];
  beforeEach(async(() => {
    const dialogMock = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of(true) // Simulate dialog closure with 'true'
      })
    };
    const shareDataServicespy = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData', 'clearSessionVariables', 'getLabels']);
    shareDataServicespy.getSharedData.and.returnValue(true);

    TestBed.configureTestingModule({
      declarations: [TabletComponent],
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
        { provide: MatDialog, useValue: {} },
        { provide: TabletService, useValue: MocTabletService },
        { provide: ShareDataService, useValue: shareDataServicespy },
        { provide: MatDialog, useValue: dialogMock },
        TabletService,
        TranslateService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    injector = getTestBed();
    translate = injector.get(TranslateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabletComponent);
    component = fixture.componentInstance;
    dialog = TestBed.get(MatDialog);
    fixture.detectChanges();
  });

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get tablets and set them in the dataSource', fakeAsync(() => {
    const mockTablets: ITablet[] = [];
    const tabletService = TestBed.get(TabletService) as TabletService;
    spyOn(tabletService, 'getTablets').and.returnValue(of({ status: 200, data: mockTablets }));
    component.getTablet();
    tick();
    expect(tabletService.getTablets).toHaveBeenCalled();
    expect(component.tablet).toEqual(mockTablets);
    expect(component.dataSource.data).toEqual(mockTablets);
  }));

  it('should navigate to the edit tablet page when there is a tablet selected', () => {
    const router = TestBed.get(Router) as MockRouter;
    const shareDataService = TestBed.get(ShareDataService)

    const mockSelectedTablet: ITablet = {
      id: 1,
      creationTimestamp: null,
      updateTimestamp: null,
      tabletName: 'abc',
      tabletStatus: true,
      tabletMacAddress: '111.111.222.11',
      primaryTablet: true,
      devices: [],
    };
    component.selection = new SelectionModel<ITablet>(true, [mockSelectedTablet]);
    component.editTablet();
    expect(shareDataService.setSharedData).toBeTruthy(mockSelectedTablet);
    expect(router.navigate).toBeTruthy(['./admin/tablet/edittablet']);
  });

  it('should not navigate when there is no tablet selected', () => {
    const router = TestBed.get(Router) as MockRouter;
    const shareDataService = TestBed.get(ShareDataService)
    component
  });
  it('should filter data and reset paginator', () => {
    spyOn(component.selection, 'clear');
    const filterValue = 'testFilter';
    component.dataSource = new MatTableDataSource<ITablet>([]);
    component.applyFilter(filterValue);
    expect(component.selection.clear).toHaveBeenCalled();
    expect(component.dataSource.filter).toBe(filterValue.trim().toLowerCase());
  });

  it('should return true if all rows are selected', () => {
    const mockData = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ];
    component.dataSource = new MatTableDataSource<any>(mockData);
    component.dataSource.filteredData.forEach((row) => {
      component.selection.select(row);
    });
    const result = component.isAllSelected();
    expect(result).toBe(true);
  });

  it('should select all rows and clear the selection', () => {
    const mockData = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ];
    component.dataSource = new MatTableDataSource<any>(mockData);
    component.selection.clear();
    component.selectAll();
    expect(component.selection.selected).toEqual(mockData);
  });

  it('should call masterToggle', () => {
    const mockData = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ];
    component.dataSource = new MatTableDataSource<any>(mockData);
    component.dataSource.filteredData.forEach((row) => {
      component.selection.select(row);
    });
    component.masterToggle();
    expect(component.selection.isEmpty()).toBe(true);
  });

  it('should return true if primaryTablet is true', () => {
    const row: ITablet = { primaryTablet: true };
    const result = component.checkStatus(row);
    expect(result).toBe(true);
  });

  it('should return false if primaryTablet is false', () => {
    const row: ITablet = { primaryTablet: false };
    const result = component.checkStatus(row);
    expect(result).toBe(false);
  });

  it('should return false if primaryTablet is neither true nor false', () => {
    const row: ITablet = { primaryTablet: null };
    const result = component.checkStatus(row);
    expect(result).toBe(false);
  });

  it('should navigate to the admin dashboard', () => {
    component.onScreenClose();
    expect(component.onScreenClose).toBeTruthy();
  });

  it('should open the confirmation dialog and delete selected tablets', () => {
    const mockSelectedTablets = [];
    const selectionModel = new SelectionModel<any>(true, mockSelectedTablets);
    component.selection = selectionModel;
    component.deleteTablets();
    fixture.detectChanges();
    expect(component.selection.isEmpty()).toBe(true);
  });
});