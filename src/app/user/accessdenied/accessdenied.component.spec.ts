import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AccessdeniedComponent } from './accessdenied.component';

class MatDialogRefMock {
  close(): void { }
}

describe('AccessdeniedComponent', () => {
  let component: AccessdeniedComponent;
  let fixture: ComponentFixture<AccessdeniedComponent>;
  let dialogRefMock: MatDialogRefMock;

  const mockDialogData = {
    title: 'Access Denied',
    text: 'Access Denied',
    longtext: false,
  };

  beforeEach(() => {
    dialogRefMock = new MatDialogRefMock();

    TestBed.configureTestingModule({
      declarations: [AccessdeniedComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
    });

    fixture = TestBed.createComponent(AccessdeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call MAT_DIALOG_DATA', () => {
    expect(component.title).toBe(mockDialogData.title);
    expect(component.text).toBe(mockDialogData.text);
    expect(component.longtext).toBe(mockDialogData.longtext);
  });

  it('should call onScreenClose', () => {
    spyOn(dialogRefMock, 'close');
    component.onScreenClose();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});
