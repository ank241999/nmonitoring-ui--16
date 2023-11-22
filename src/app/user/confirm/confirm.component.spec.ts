import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfirmComponent } from './confirm.component';

describe('ConfirmComponent', () => {
  let component: ConfirmComponent;
  let fixture: ComponentFixture<ConfirmComponent>;
  let dialogRef: MatDialogRef<string>;

  beforeEach(() => {
    const dialogRefMock = {
      close: jasmine.createSpy('close')
    };

    TestBed.configureTestingModule({
      declarations: [ConfirmComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock }
      ]
    });

    fixture = TestBed.createComponent(ConfirmComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.get(MatDialogRef);
  });

  it('should create the ConfirmComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call onScreenClose', () => {
    component.onScreenClose();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
