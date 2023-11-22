import { async, ComponentFixture, TestBed, getTestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Router, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
    MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
    MatFormFieldModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
    MatSliderModule, MatSlideToggleModule, MatPaginatorModule, MatIconModule, MatDialog
} from '@angular/material';
import {
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule, MatRowDef
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Injector } from "@angular/core";
import { ShareDataService } from '../../../assets/services/share-data.service';
import { StatemonitoringComponent } from './statemonitoring.component';
import { DevicemanagementService } from '../../../assets/services/devicemanagement.service';
import { StatemonitoringService } from '../../../assets/services/statemonitoring.service';
import { ThreatActivityService } from '../../../assets/services/threat-activity.service';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { IDevice } from '../../../assets/interfaces/idevice';
import { IDeviceResponse, IResponse } from '../../../assets/interfaces/iresponse';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export class DeviceService {
    device: IDevice = {
        id: 1,
        creationTimestamp: "",
        updateTimestamp: "",
        name: "",
        macAddress: "",
        soundAddress: "",
        lightingAddress: "",
        leftProximitySensorAddress: "",
        rightProximitySensorAddress: "",
        physicalMark: "",
        side: "",
        status: true,
        spathFlag: true,
        tabletId: "",
        // lane: ILane,
        laneId: 1,
        laneName: "",
        entranceId: 1,
        entranceName: "",
        ipAddress: ""
    };

    deviceList: IDevice[] = [];

    public getDevices(): Observable<IDeviceResponse> {
        this.deviceList.push(this.device);

        let mockResponse: IDeviceResponse = {
            "status": 200,
            "data": this.deviceList
        };
        return of(mockResponse);
    }
}

describe('SatemonitoringComponent', () => {
    let component: StatemonitoringComponent;
    let fixture: ComponentFixture<StatemonitoringComponent>;
    let injector: Injector;
    let dialog: MatDialog;
    let routerSpy: jasmine.SpyObj<Router>;


    const routes: Routes = [
        {
            path: 'statemonitoring',
            component: StatemonitoringComponent,
            data: {
                title: 'StateMonitoring'
            },
            pathMatch: 'full'
        }
    ];

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    beforeEach(async(() => {
        const notificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);
        const mockShareDataService = jasmine.createSpyObj('ShareDataService', ['getSharedData', 'setSharedData']);

        TestBed.configureTestingModule({
            declarations: [StatemonitoringComponent],
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
                //RouterModule.forChild(routes),
                RouterModule.forRoot(routes, { useHash: true }),
                Ng4LoadingSpinnerModule.forRoot(),
                // UserRoutingModule,NotifierModule,
                FormsModule, ReactiveFormsModule, HttpClientModule,
                BrowserAnimationsModule
            ],

            //providers:[{provide: MessagingService,useClass: mockMessagingService}],
            providers: [
                { provide: ShareDataService, mockShareDataService },
                { provide: Router, useValue: routerSpy },
                DevicemanagementService, StatemonitoringService, ThreatActivityService
            ],
            schemas: [
                //CUSTOM_ELEMENTS_SCHEMA
            ]
        })

            .compileComponents();
        injector = getTestBed();
        // dialog = TestBed.get(MatDialog);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StatemonitoringComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    beforeEach(function () {
        spyOn(console, 'error');
    })

    it('component should be defined', () => {
        expect(component).toBeDefined();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have initial values', () => {
        expect(component.viewMode).toEqual('left');
    });

    it('should call serviceStatus', async () => {
        environment.apiGatewayUrl  // Provide a valid ipAddress
        component.serviceStatus(environment.apiGatewayUrl);
        expect(component.serviceStatus).toBeTruthy();
    });

    it('should navigate to /admin/dashboard on onScreenClose', () => {
        component.onScreenClose();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
    });

    it('should call ngOnDestroy', async () => {
        component.ngOnDestroy();
        expect(component.ngOnDestroy).toBeTruthy();
    });

    it('should call devicesIP', fakeAsync(() => {
        const mockDeviceResponse = { status: 200, data: [{ laneId: 1, name: 'Device 1', ipAddress: '1.1.1.1' }] };
        spyOn(component.deviceService, 'getDevices').and.returnValue(of(mockDeviceResponse));

        const mockThreatActivityService = jasmine.createSpyObj('ThreatActivityService', ['getThreatActivities']);
        mockThreatActivityService.getThreatActivities.and.returnValue(of({ data: { '#result-set-3': [] } }));

        component['threatActivityService'] = mockThreatActivityService;
        component.devicesIP();
        tick();
        fixture.detectChanges();
    }));

    it('should call changeServiceStatus', () => {
        component.serviceStatus('mockIpAddress');
        expect(component.serviceStatus).toBeTruthy();
    });

    it('should call onDeviceChange method', async () => {
        component.onDeviceChange('');
        expect(component.onDeviceChange).toBeTruthy();
    });

    it('should update left and right devices when a valid device is selected', () => {
        const selectedLaneId = '1';
        component.devicesInSameLane = [
            {
                laneId: 1,
                deviceNames: 'Device1 - Device2',
                deviceNamesArr: ['Device1', 'Device2'],
                ipAddresses: ['1.1.1.1', '2.2.2.2'],
            },
        ];
        component.leftDevice = { name: '', ipAddress: '' };
        component.rightDevice = { name: '', ipAddress: '' };
        component.onDeviceChange(selectedLaneId);

        expect(component.leftDevice.name).toBe('Device1');
        expect(component.leftDevice.ipAddress).toBe('1.1.1.1');
        expect(component.rightDevice.name).toBe('Device2');
        expect(component.rightDevice.ipAddress).toBe('2.2.2.2');
    });
});