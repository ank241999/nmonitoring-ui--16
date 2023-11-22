
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CustomAlertComponent } from "./customalert.component";

describe("CustomAlertComponent", () => {
  let component: CustomAlertComponent;
  let fixture: ComponentFixture<CustomAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomAlertComponent],
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
            icon: 'iconValue',
            iconColor: 'iconColorValue',
            title: 'TitleValue',
            text: 'TextValue',
            options: true,
            input: true,
            button: 'ButtonValue',
            time: 2000, // Add a time value for testing the setTimeout
          },
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomAlertComponent);
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

  it('should initialize properties based on MAT_DIALOG_DATA', () => {
    expect(component.icon).toBeTruthy('iconValue');
    expect(component.iconColor).toBeTruthy('iconColorValue');
    expect(component.title).toBeTruthy('TitleValue');
    expect(component.text).toBeTruthy('TextValue');
    expect(component.options).toBeTruthy(true);
    expect(component.input).toBeTruthy(true);
    expect(component.button).toBeTruthy('ButtonValue');
  });

  afterEach(() => {
    fixture.destroy();
  });
});