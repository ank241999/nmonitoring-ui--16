import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { IntermediateComponent } from './intermediate.component';
import { ShareDataService } from '../../../assets/services/share-data.service';
import { of } from 'rxjs';

describe('IntermediateComponent', () => {
  let component: IntermediateComponent;
  let fixture: ComponentFixture<IntermediateComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let shareDataService: ShareDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntermediateComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ isskip: null }),
          },
        },
        {
          provide: ShareDataService,
          useValue: {
          },
        },
      ],
    });

    fixture = TestBed.createComponent(IntermediateComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    activatedRoute = TestBed.get(ActivatedRoute);
    shareDataService = TestBed.get(ShareDataService);
  });

  it('should create the IntermediateComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login when userLogId is null', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(router, 'navigate');
    component.ngOnInit();
    expect(localStorage.getItem).toHaveBeenCalledWith('userLogId');
    expect(router.navigate).toHaveBeenCalledWith(['./login']);
  });

  it('should navigate to activitymonitoring when userLogId is not null and isskip is not 1', () => {
    spyOn(localStorage, 'getItem').and.returnValue('someValue');
    spyOn(router, 'navigate');
    component.ngOnInit();
    expect(localStorage.getItem).toHaveBeenCalledWith('userLogId');
    expect(router.navigate).toHaveBeenCalledWith(['./admin/activitymonitoring']);
  });

  it('should not navigate when isskip is 1', () => {
    activatedRoute.queryParams = of({ isskip: '1' });
    spyOn(localStorage, 'getItem').and.returnValue('someValue');
    spyOn(router, 'navigate');
    component.ngOnInit();
    expect(localStorage.getItem).toHaveBeenCalledWith('userLogId');
    expect(router.navigate).not.toHaveBeenCalledWith();
  });
});
