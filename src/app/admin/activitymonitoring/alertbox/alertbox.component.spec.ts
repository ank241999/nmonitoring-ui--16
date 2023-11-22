import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertboxComponent } from './alertbox.component';

describe('AlertboxComponent', () => {
  let component: AlertboxComponent;
  let fixture: ComponentFixture<AlertboxComponent>;
  let dialogRefMock: jasmine.SpyObj<MatDialogRef<AlertboxComponent>>;
  let spinnerServiceMock: jasmine.SpyObj<Ng4LoadingSpinnerService>;

  beforeEach(() => {

    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);
    spinnerServiceMock = jasmine.createSpyObj('Ng4LoadingSpinnerService', ['show', 'hide']);

    TestBed.configureTestingModule({
      declarations: [AlertboxComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { text: 'Test message' } },
        { provide: Ng4LoadingSpinnerService, useValue: spinnerServiceMock },
        { provide: MatDialog, useValue: {} }
      ],
    });

    fixture = TestBed.createComponent(AlertboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set text from MAT_DIALOG_DATA', () => {
    expect(component.text).toBe('Test message');
  });

  it('should call onclick method when onScreenClose is called', () => {
    spyOn(component, 'onclick');
    component.onScreenClose();
    expect(component.onclick).toHaveBeenCalled();
  });

  it('should close the dialog when onclick is called', () => {
    component.onclick();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});
