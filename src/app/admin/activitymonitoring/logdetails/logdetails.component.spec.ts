import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { LogdetailsComponent } from './logdetails.component';
import { ThreatLogService } from '../../../../assets/services/threatlog.service';
import { HttpClientModule } from '@angular/common/http';

describe('LogdetailsComponent', () => {
  let component: LogdetailsComponent;
  let fixture: ComponentFixture<LogdetailsComponent>;
  let dialogRefMock: MatDialogRef<LogdetailsComponent>;
  let mockThreatLogService: ThreatLogService;
  let spinnerServiceMock: Ng4LoadingSpinnerService;

  const mockData = {
    logId: 1,
    anomalies: {
      cellphone: ['Location1'],
      keys: ['Location2'],
      genericAnomaly: ['Location3'],
    },
    threats: {
      handgun: ['Location4'],
      rifle: ['Location5'],
      pipeBomb: ['Location6'],
      knife: ['Location7'],
      genericThreat: ['Location8'],
    },
  };

  beforeEach(() => {
    dialogRefMock = jasmine.createSpyObj(['close']);
    mockThreatLogService = jasmine.createSpyObj('ThreatLogService', ['getThreatLog']);
    spinnerServiceMock = jasmine.createSpyObj('Ng4LoadingSpinnerService', ['hide']);

    TestBed.configureTestingModule({
      declarations: [LogdetailsComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: ThreatLogService, useValue: mockThreatLogService },
        { provide: Ng4LoadingSpinnerService, useValue: spinnerServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        ThreatLogService
      ],
    });

    fixture = TestBed.createComponent(LogdetailsComponent);
    component = fixture.componentInstance;
  });

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on onScreenClose()', () => {
    component.onScreenClose();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should ngOnInit()', () => {
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  });

});

