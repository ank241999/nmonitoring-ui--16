import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PingDeviceAlertComponent } from './pingdevicealert.component';

describe('PingDeviceAlertComponent', () => {
  let component: PingDeviceAlertComponent;
  let fixture: ComponentFixture<PingDeviceAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PingDeviceAlertComponent],
      imports: [MatDialogModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: () => { }
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            icon: 'Ping-icon',
            iconColor: 'Yellow',
            options: false,
            input: false,
            button: 'Ping',
            device1Name: 'Device 1',
            device1Address: '111.111.111.11',
            device1Status: 'Status 1',
            device2Name: 'Device 2',
            device2Address: '222.222.222.22',
            device2Status: 'Status 2',
            time: 1000
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PingDeviceAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog on screen close', () => {
    spyOn(component.dialogRef, 'close');
    component.onScreenClose();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should close the dialog after a delay when data.time is truthy', fakeAsync(() => {
    const data = TestBed.get(MAT_DIALOG_DATA);
    spyOn(component.dialogRef, 'close');
    data.time = 1000;
    tick(data.time);
    expect(component.dialogRef.close).toBeTruthy();
  }));

  afterEach(() => {
    fixture.destroy();
  });
});


