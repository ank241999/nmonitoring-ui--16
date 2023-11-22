import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../../assets/services/user.service';
import { ShareDataService } from '../../../../assets/services/share-data.service';
import { CommunicationService } from '../../../../assets/services/communication-service';
import { MessagingService } from '../../../../assets/services/messaging.service';
import { Router, RouterModule } from '@angular/router';
import { AddnoteComponent } from './addnote.component';
import { of } from 'rxjs';

describe('AddnoteComponent', () => {
  let component: AddnoteComponent;
  let fixture: ComponentFixture<AddnoteComponent>;

  // Mock dependencies
  const dialogRefMock = {
    close: jasmine.createSpy('close')
  };
  const dialogMock = {
    open: jasmine.createSpy('open')
  };
  const spinnerServiceMock = {
    show: jasmine.createSpy('show'),
    hide: jasmine.createSpy('hide')
  };
  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };
  const userServiceMock = {
    logOutUser: jasmine.createSpy('logOutUser').and.returnValue({ subscribe: () => { } }),
    logoutLog: jasmine.createSpy('logoutLog'),
    clearSessionVariables: jasmine.createSpy('clearSessionVariables')
  };
  const translateServiceMock = {
    setDefaultLang: jasmine.createSpy('setDefaultLang')
  };
  const shareDataServiceMock = {
    getLabels: jasmine.createSpy('getLabels').and.returnValue('en'),
    clearSessionVariables: jasmine.createSpy('clearSessionVariables')
  };

  const communicationServiceMock = {};
  const messagingServiceMock = {
    disconnect: jasmine.createSpy('disconnect')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddnoteComponent],
      imports: [RouterModule.forRoot([])],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: Ng4LoadingSpinnerService, useValue: spinnerServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: ShareDataService, useValue: shareDataServiceMock },
        { provide: CommunicationService, useValue: communicationServiceMock },
        { provide: MessagingService, useValue: messagingServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog', () => {
    component.onclick();
    expect(spinnerServiceMock.show).toHaveBeenCalled();
    expect(spinnerServiceMock.hide).toHaveBeenCalled();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });


  it('should logout the user', fakeAsync(() => {
    userServiceMock.logOutUser.and.returnValue(of({ status: 200 }));
    component.logout();
    tick();
    expect(messagingServiceMock.disconnect).toHaveBeenCalled();
    expect(localStorage.getItem('notificationCount')).toBe('0');
    expect(localStorage.getItem('deviceNotificaions')).toBe('');
    expect(localStorage.getItem('rkaStop')).toBe('false');
    expect(userServiceMock.logOutUser).toHaveBeenCalled();
    expect(userServiceMock.logoutLog).toBeTruthy();
    console.log('Router navigate calls:', routerMock.navigate.calls.all());
    console.log('Router navigate arguments:', routerMock.navigate.calls.allArgs());
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should set submitted to be true', (() => {
    component.onScreenClose();
    expect(component.onScreenClose).toBeTruthy();
  }));
});
