import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
    IWeaponDetected,
    IThroughput,
    IThreatActivity,
    IThreatLogReport,
    IAnalyticReport,
    IPersonScannedDetails,
    IThroughputFilter,
    IPersonSpecific,
    IScanCount,
    IAlarmCount,
    IScanCountDetails,
    IOperatorAction,
    IOperatorInfo,
    IdeviceInfo,
    IRegionWise,
    IScreenerMessage
} from '../interfaces/ireports';
import { ShareDataService } from '../services/share-data.service';
import { CommonFunctions } from '../common/common-functions';

@Injectable()
export class ReportService {
    constructor(private http: HttpClient, private shareDataService: ShareDataService, private commonFunctions: CommonFunctions) {
    }

    public getThroughput(startDate: number, endDate: number): Observable<IThroughput[]> {
        let url: string = environment.apiGatewayUrl + '/report/throughput?locale=' + encodeURIComponent(this.shareDataService.locale);
        if (startDate !== null && startDate !== 0 && endDate != null && endDate !== 0) {
            url = environment.apiGatewayUrl
                + '/report/throughput?startDate=' + startDate + '&endDate=' + endDate + '&locale='
                + encodeURIComponent(this.shareDataService.locale);
        }

        return this.commonFunctions.httpGetList(url);
    }

    public getPersonSpecific(startDate: number, endDate: number): Observable<IPersonSpecific[]> {
        let url: string = environment.apiGatewayUrl + '/report/alarm-info=' + encodeURIComponent(this.shareDataService.locale);
        if (startDate !== null && startDate !== 0 && endDate !== null && endDate !== 0) {
            url = environment.apiGatewayUrl
                + '/report/alarm-info?startDate=' + startDate + '&endDate=' + endDate + '&locale='
                + encodeURIComponent(this.shareDataService.locale);
        }

        return this.commonFunctions.httpGetList(url);
    }
    public getAlarmCount(startDate: number, endDate: number): Observable<IAlarmCount[]> {
        let url: string = environment.apiGatewayUrl + '/report/alarm-count?locale=' + encodeURIComponent(this.shareDataService.locale);
        if (startDate !== null && startDate !== 0 && endDate !== null && endDate !== 0) {
            url = environment.apiGatewayUrl
                + '/report/alarm-count?startDate=' + startDate + '&endDate=' + endDate + '&locale='
                + encodeURIComponent(this.shareDataService.locale);
        }

        return this.commonFunctions.httpGetList(url);
    }
    public getScanCount(startDate: number, endDate: number): Observable<IScanCount[]> {
        let url: string = environment.apiGatewayUrl + '/report/scan-count?locale=' + encodeURIComponent(this.shareDataService.locale);
        if (startDate !== null && startDate !== 0 && endDate !== null && endDate !== 0) {
            url = environment.apiGatewayUrl
                + '/report/scan-count?startDate=' + startDate + '&endDate=' + endDate + '&locale='
                + encodeURIComponent(this.shareDataService.locale);
        }

        return this.commonFunctions.httpGetList(url);
    }
    public getScanCountDetails(startDate: number, endDate: number): Observable<IScanCountDetails[]> {
        let url: string = environment.apiGatewayUrl
            + '/report/scan-count-details?locale='
            + encodeURIComponent(this.shareDataService.locale);
        if (startDate !== null && startDate !== 0 && endDate !== null && endDate !== 0) {
            url = environment.apiGatewayUrl
                + '/report/scan-count-details?startDate=' + startDate + '&endDate=' + endDate + '&locale='
                + encodeURIComponent(this.shareDataService.locale);
        }

        return this.commonFunctions.httpGetList(url);
    }
    public getThroughputFilter(startDate: number, endDate: number, filterValue: string): Observable<IThroughputFilter[]> {
        let url: string = environment.apiGatewayUrl
            + '/report/throughput-filter?locale='
            + encodeURIComponent(this.shareDataService.locale) + '&filterValue=' + filterValue;
        if (startDate !== null && startDate !== 0 && endDate !== null && endDate !== 0) {
            url = environment.apiGatewayUrl
                + '/report/throughput-filter?startDate=' + startDate + '&endDate=' + endDate + '&locale='
                + encodeURIComponent(this.shareDataService.locale) + '&filterValue=' + filterValue;
        }

        return this.commonFunctions.httpGetList(url);
    }

    public getOperatorAction(startDate: number, endDate: number): Observable<IOperatorAction[]> {
        let url: string = environment.apiGatewayUrl + '/report/operatorAction?locale=' + encodeURIComponent(this.shareDataService.locale);
        if (startDate !== null && startDate !== 0 && endDate !== null && endDate !== 0) {
            url = environment.apiGatewayUrl
                + '/report/operatorAction?startDate=' + startDate + '&endDate=' + endDate + '&locale='
                + encodeURIComponent(this.shareDataService.locale);
        }

        return this.commonFunctions.httpGetList(url);
    }
    public getPersonScannedDetail(startDate: string, endDate: string): Observable<IPersonScannedDetails[]> {
        const url: string = environment.apiGatewayUrl + '/report/person-scanned-details?startDate=' + startDate + '&endDate=' + endDate;

        return this.commonFunctions.httpGetList(url);
    }

    public getThreatActivity(startDate: number, endDate: number): Observable<IThreatActivity[]> {
        let url: string = environment.apiGatewayUrl + '/report/threat-activity';
        if (startDate !== null && startDate !== 0 && endDate !== null && endDate !== 0) {
            url = environment.apiGatewayUrl
                + '/report/threat-activity?startDate=' + startDate + '&endDate=' + endDate + '&locale='
                + encodeURIComponent(this.shareDataService.locale);
        }

        return this.commonFunctions.httpGetList(url);
    }

    public getWeaponDetected(startDate: number, endDate: number): Observable<IWeaponDetected> {
        let url: string = environment.apiGatewayUrl + '/report/weapons-detected';
        if (startDate !== null && startDate !== 0 && endDate !== null && endDate !== 0) {
            url = environment.apiGatewayUrl
                + '/report/weapons-detected?startDate=' + startDate + '&endDate=' + endDate + '&locale='
                + encodeURIComponent(this.shareDataService.locale);
        }

        return this.commonFunctions.httpGet(url);
    }

    public getDatewise(startDate: number, endDate: number): Observable<IWeaponDetected[]> {
        let url: string = environment.apiGatewayUrl
            + '/report/weapons-detected/date-wise?locale='
            + encodeURIComponent(this.shareDataService.locale);
        if (startDate !== null && startDate !== 0 && endDate !== null && endDate !== 0) {
            url = environment.apiGatewayUrl
                + '/report/weapons-detected/date-wise?startDate=' + startDate + '&endDate=' + endDate + '&locale='
                + encodeURIComponent(this.shareDataService.locale);
        }

        return this.commonFunctions.httpGetList(url);
    }

    public getPositionwise(startDate: number, endDate: number): Observable<IWeaponDetected[]> {
        let url: string = environment.apiGatewayUrl + '/report/weapons-detected/position-wise';
        if (startDate !== null && startDate !== 0 && endDate !== null && endDate !== 0) {
            url = environment.apiGatewayUrl
                + '/report/weapons-detected/position-wise?startDate=' + startDate + '&endDate=' + endDate + '&locale='
                + encodeURIComponent(this.shareDataService.locale);
        }

        return this.commonFunctions.httpGetList(url);
    }

    public getThreatLogsReport(startDate: string, endDate: string, pageFrom: number, pageTo: number,
        weaponType: string, threatLocation: string, threatType: string, actualResult: string,
        incorrectRecordsBy: string): Observable<IThreatLogReport[]> {
        let url: string = environment.apiGatewayUrl
            + '/threatReport/threatReport?startDate=' + startDate + '&endDate=' + endDate + '&pageFrom=' + pageFrom + '&pageTo=' + pageTo;
        url = url + (weaponType === '' ? '' : '&weaponType=' + weaponType);
        url = url + (threatLocation === '' ? '' : '&threatLocation=' + threatLocation);
        url = url + (threatType === '' ? '' : '&threatType=' + threatType);
        url = url + '&actualResult=' + actualResult + '';
        url = url + '&incorrectRecordsBy=' + incorrectRecordsBy + '';
        return this.commonFunctions.httpGetList(url);
    }

    public getBetaTestModeReportList(startDate: string, endDate: string): Observable<IAnalyticReport[]> {
        const url: string = environment.apiGatewayUrl
            + '/threatReport/betaTestModeReportList?startDate=' + startDate + '&endDate=' + endDate;
        return this.commonFunctions.httpGetList(url);
    }
    public getGuardInfo(startDate: number, endDate: number): Observable<IOperatorInfo[]> {
        let url: string = environment.apiGatewayUrl + '/report/guard-info?locale='
            + encodeURIComponent(this.shareDataService.locale);
        if (startDate !== null && startDate !== 0 && endDate !== null && endDate !== 0) {
            url = environment.apiGatewayUrl + '/report/guard-info?startDate=' + startDate + '&endDate=' + endDate + '&locale='
                + encodeURIComponent(this.shareDataService.locale);
        }

        return this.commonFunctions.httpGetList(url);
    }
    public getDeviceInfo(startDate: number, endDate: number,
        selectedDevice: string, selectedLane: string, selectedName: string): Observable<IdeviceInfo[]> {
        let url: string = environment.apiGatewayUrl + '/report/device-info?locale='
            + encodeURIComponent(this.shareDataService.locale);

        if (startDate != null && startDate !== 0 && endDate != null && endDate !== 0) {
            url = environment.apiGatewayUrl
                + '/report/device-info?startDate=' + startDate + '&endDate=' + endDate + '&locale='
                + encodeURIComponent(this.shareDataService.locale);
        }

        if (selectedDevice != null && selectedDevice) {
            url += '&device=' + selectedDevice;
        }

        if (selectedLane != null && selectedLane) {
            url += '&lane=' + selectedLane;
        }

        if (selectedName != null && selectedName) {
            url += '&terminal=' + selectedName;
        }

        return this.commonFunctions.httpGetList(url);
    }

    public getThroughputFilterRegion(startDate: number, endDate: number, filterValue: string): Observable<IRegionWise> {
        let url: string = environment.apiGatewayUrl + '/report/throughput-filter-region?locale='
            + encodeURIComponent(this.shareDataService.locale) + '&filterValue=' + filterValue;
        if (startDate !== null && startDate !== 0 && endDate !== null && endDate !== 0) {
            url = environment.apiGatewayUrl
                + '/report/throughput-filter-region?startDate='
                + startDate + '&endDate=' + endDate + '&locale='
                + encodeURIComponent(this.shareDataService.locale)
                + '&filterValue=' + filterValue;
        }

        return this.http.get(url) as Observable<IRegionWise>;
    }

    public getScreenerMessage(startDate: number, endDate: number): Observable<IScreenerMessage[]> {
        let url: string = environment.apiGatewayUrl + '/report/ScreenerMessage=' + encodeURIComponent(this.shareDataService.locale);
        if (startDate !== null && startDate !== 0 && endDate !== null && endDate !== 0) {
            url = environment.apiGatewayUrl
                + '/report/ScreenerMessage?startDate=' + startDate + '&endDate=' + endDate + '&locale='
                + encodeURIComponent(this.shareDataService.locale);
        }

        return this.commonFunctions.httpGetList(url);
    }
}
