import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { IUserRoleAuth } from '../interfaces/iuserroleauth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ShareDataService {
    private rkaStartStop: any;
    private rkaStartStopB: boolean;
    private sharedData: any;
    private globalObject: any;
    openPopup = false;
    activityDashboardList: any;
    private isScanningStoppedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    // session variables
    // session variables
    locale!: string;
    currentUser!: string;
    role!: string;
    email!: string;
    refreshToken!: string;

    logoImageName!: string;
    logoImagePath!: string;
    footPrintImageName!: string;
    footPrintImagePath!: string;

    avtarImage!: string;
    labels = 'en-US';
    scanCountBasis = "All";
    betaTestMode!: boolean;

    id!: string;
    serverUrl!: string;

    moduleName!: string;
    userRoleAuth!: IUserRoleAuth[];

    constructor() {
        this.rkaStartStop = localStorage.getItem("rkaStop");
        this.rkaStartStopB = this.rkaStartStop === "true" ? true : false;
        this.isScanningStoppedSubject = new BehaviorSubject<boolean>(this.rkaStartStopB);
    }

    ngOnInit() {
        this.rkaStartStop = localStorage.getItem("rkaStop");
        this.rkaStartStopB = this.rkaStartStop === "true" ? true : false;
        this.isScanningStoppedSubject = new BehaviorSubject<boolean>(this.rkaStartStopB);
    }

    getisScanningStopped(): Observable<boolean> {
        this.rkaStartStop = localStorage.getItem("rkaStop");
        this.rkaStartStopB = this.rkaStartStop === "true" ? true : false;
        this.isScanningStoppedSubject = new BehaviorSubject<boolean>(this.rkaStartStopB);
        return this.isScanningStoppedSubject.asObservable();
    }

    setIsScanningStopped(val: boolean): void {
        this.isScanningStoppedSubject.next(val);
    }

    public getSharedData(): any {
        const sharedDataString = localStorage.getItem('sharedData');

        if (sharedDataString !== null) {
            return JSON.parse(sharedDataString);
        } else {
            return null; // Or return {} or throw an error, depending on your requirements.
        }
    }


    public setSharedData(shared: any) {
        this.sharedData = shared;
        localStorage.setItem('sharedData', JSON.stringify(this.sharedData));
    }

    public getAvtarImage(): any {
        return this.avtarImage;
    }

    public setAvtarImage(avtarImage: string) {
        this.avtarImage = avtarImage;
    }

    public getBetaTestMode(): any {
        return this.betaTestMode;
    }

    public setBetaTestMode(betaTestMode: boolean) {
        this.betaTestMode = betaTestMode;
    }

    public getLabels(): any {
        return this.labels;
    }

    public setLabels(labels: string) {
        if (labels === 'hexwave') {
            this.labels = 'en-US-hexwave';
        } else {
            this.labels = 'en-US';
        }
    }

    public getScanCountBasis(): any {
        return this.scanCountBasis;
    }

    public setScanCountBasis(scanCountBasis: string) {
        if (scanCountBasis === 'All') {
            this.scanCountBasis = 'All';
        } else {
            this.scanCountBasis = 'PersonOut';
        }
    }

    public getGlobalObject(): any {
        const sharedDataString = localStorage.getItem('globalObject');
        if (sharedDataString !== null) {
            return JSON.parse(sharedDataString);
        } else {
            return null; // Or return {} or throw an error, depending on your requirements.
        }
    }



    public setGlobalObject(global: any) {
        this.globalObject = global;
        localStorage.setItem('globalObject', JSON.stringify(this.globalObject));
    }

    public clearSessionVariables() {
        this.globalObject = null;
        this.openPopup = false;
        this.activityDashboardList = null;

        this.locale = '';
        this.currentUser = '';
        this.role = '';
        this.email = '';
        this.refreshToken = '';
        this.moduleName = '';

        // this.logoImageName = null;
        // this.logoImagePath = null;
        // this.footPrintImageName = null;
        // this.footPrintImagePath = null;

        this.id = '';
        // this.serverUrl = null;
        this.userRoleAuth = [];

        if (!environment.isMobile) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('email');
            localStorage.removeItem('shData');
            localStorage.removeItem('userRoleAuth');
        }
    }

    setApplicationVariables() {
        if (this.logoImagePath != null && this.logoImagePath !== localStorage.getItem('logoImagePath')) {
            localStorage.setItem('logoImagePath', this.logoImagePath);
        }
        this.logoImagePath = localStorage.getItem('logoImagePath') as string;

        if (environment.isMobile) {
            if (this.logoImageName !== null && this.logoImageName !== localStorage.getItem('logoImageName')) {
                localStorage.setItem('logoImageName', this.logoImageName);
            }
            if (this.footPrintImageName !== null && this.footPrintImageName !== localStorage.getItem('footPrintImageName')) {
                localStorage.setItem('footPrintImageName', this.footPrintImageName);
            }
            if (this.footPrintImagePath !== null && this.footPrintImagePath !== localStorage.getItem('footPrintImagePath')) {
                localStorage.setItem('footPrintImagePath', this.footPrintImagePath);
            }
            if (this.avtarImage !== null && this.avtarImage !== localStorage.getItem('avtarImage')) {
                localStorage.setItem('avtarImage', this.avtarImage);
            }
            if (this.labels !== null && this.labels !== localStorage.getItem('labels')) {
                localStorage.setItem('labels', this.labels);
            }
            if (this.scanCountBasis !== null && this.scanCountBasis !== localStorage.getItem('scanCountBasis')) {
                localStorage.setItem('scanCountBasis', this.scanCountBasis);
            }
            if (this.betaTestMode !== null && this.betaTestMode !== (localStorage.getItem('betaTestMode') === 'true')) {
                localStorage.setItem('betaTestMode', this.betaTestMode.toString());
            }
            if (this.currentUser !== null && this.currentUser !== localStorage.getItem('currentUser')) {
                localStorage.setItem('currentUser', this.currentUser);
            }
            if (this.refreshToken !== null && this.refreshToken !== localStorage.getItem('refreshToken')) {
                localStorage.setItem('refreshToken', this.refreshToken);
            }
            if (this.email !== null && this.email !== localStorage.getItem('email')) {
                localStorage.setItem('email', this.email);
            }
            if (this.serverUrl !== null && this.serverUrl !== localStorage.getItem('serverUrl')) {
                localStorage.setItem('serverUrl', this.serverUrl);
            }
            if (this.locale !== null && this.locale !== localStorage.getItem('locale')) {
                localStorage.setItem('locale', this.locale);
            }
            if (this.role !== null && this.role !== localStorage.getItem('role')) {
                localStorage.setItem('role', this.role);
            }
            if (this.moduleName !== null && this.moduleName !== localStorage.getItem('moduleName')) {
                localStorage.setItem('moduleName', this.moduleName);
            }
            if (this.id !== null && this.id !== localStorage.getItem('id')) {
                localStorage.setItem('id', this.id);
            }
            if (this.userRoleAuth !== null && this.userRoleAuth.toString() !== localStorage.getItem('userRoleAuth')) {
                localStorage.setItem('userRoleAuth', this.userRoleAuth.toString());
            }

            this.avtarImage = localStorage.getItem('avtarImage') as string;
            this.labels = localStorage.getItem('labels') as string;
            this.scanCountBasis = localStorage.getItem('scanCountBasis') as string;
            this.betaTestMode = localStorage.getItem('betaTestMode') === 'true' ? true : false;
            this.footPrintImageName = localStorage.getItem('footPrintImageName') as string;
            this.footPrintImagePath = localStorage.getItem('footPrintImagePath') as string;
            this.currentUser = localStorage.getItem('currentUser') as string;
            this.refreshToken = localStorage.getItem('refreshToken') as string;
            this.email = localStorage.getItem('email') as string;
            this.serverUrl = localStorage.getItem('serverUrl') as string;
            this.locale = localStorage.getItem('locale') as string;
            this.role = localStorage.getItem('role') as string;
            this.moduleName = localStorage.getItem('moduleName') as string;
            this.id = localStorage.getItem('id') as string;
            this.userRoleAuth = JSON.parse(localStorage.getItem('userRoleAuth') as string);
        } else {
            if (this.currentUser != null) {
                const shData: any = {
                    'logoImageName': this.logoImageName,
                    'logoImagePath': this.logoImagePath,
                    'footPrintImageName': this.footPrintImageName,
                    'footPrintImagePath': this.footPrintImagePath,
                    'avtarImage': this.avtarImage,
                    'labels': this.labels,
                    'scanCountBasis': this.scanCountBasis,
                    'betaTestMode': this.betaTestMode,
                    'currentUser': this.currentUser,
                    'refreshToken': this.refreshToken,
                    'email': this.email,
                    'serverUrl': this.serverUrl,
                    'locale': this.locale, 'role': this.role,
                    'id': this.id, 'userRoleAuth': this.userRoleAuth
                };
                localStorage.setItem('shData', CryptoJS.AES.encrypt(JSON.stringify(shData), '1234').toString());
            } else if (localStorage.getItem('shData') != null && this.currentUser == null) {
                const shData: any = CryptoJS.AES.decrypt(localStorage.getItem('shData') as string, '1234');
                const shValues: any = JSON.parse(shData.toString(CryptoJS.enc.Utf8));

                this.logoImageName = shValues.logoImageName;
                this.footPrintImageName = shValues.footPrintImageName;
                this.footPrintImagePath = shValues.footPrintImagePath;
                this.avtarImage = shValues.avtarImage;
                this.labels = shValues.labels;
                this.scanCountBasis = shValues.scanCountBasis;
                this.betaTestMode = shValues.betaTestMode;
                this.currentUser = shValues.currentUser;
                this.refreshToken = shValues.refreshToken;
                this.email = shValues.email;
                this.serverUrl = shValues.serverUrl;
                this.locale = shValues.locale;
                this.role = shValues.role;
                this.moduleName = shValues.moduleName;
                this.id = shValues.id;
                this.userRoleAuth = shValues.userRoleAuth;
            }
        }
    }
}
