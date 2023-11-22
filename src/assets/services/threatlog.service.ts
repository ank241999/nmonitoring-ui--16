import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IThreatLog } from '../interfaces/ithreatlog';
import { environment } from '../../environments/environment';
import { Object } from 'lodash';

@Injectable()
export class ThreatLogService {

    constructor(private http: HttpClient) { }

    public getThreatLog(threatLogid: number): Observable<IThreatLog[]> {
        // return this.http.get(environment.apiGatewayUrl + '/active-monitor/threat-config') as Observable<IActivityMonitoring[]>;
        return this.http.get(environment.apiGatewayUrl + '/logs?id=' + threatLogid) as Observable<IThreatLog[]>;
    }

    public saveThreatLog(ithreatLog: IThreatLog): Observable<IThreatLog> {
        return this.http.post<IThreatLog>(environment.apiGatewayUrl + '/logs', ithreatLog);
    }

    public startThreatMessage(deviceIP: string): Observable<string> {
        if (deviceIP === '') {
            deviceIP = environment.threatMessageUrl.replace('http://', '').replace(':8123', '');
        }

        return this.http.get('http://' + deviceIP + ':8123' + '/api/start', { responseType: 'text' }) as Observable<string>;
    }

    public stopThreatMessage(deviceIP: string): Observable<string> {
        if (deviceIP === '') {
            deviceIP = environment.threatMessageUrl.replace('http://', '').replace(':8123', '');
        }

        return this.http.get('http://' + deviceIP + ':8123' + '/api/stop', { responseType: 'text' }) as Observable<string>;
    }
}
