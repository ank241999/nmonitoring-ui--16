import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IAllProcessResponse, IStateMonitoring } from '../interfaces/istatemonitoring';

@Injectable()
export class StatemonitoringService {

  constructor(private http: HttpClient) { }

  public getServiceHealthStatus(deviceIP: string): Observable<IStateMonitoring> {
    // return this.http.get(environment.apiGatewayUrl + '/devicestatus/' + deviceIP) as Observable<IStateMonitoring>;
    return this.http.get('http://' + deviceIP + ':9011/device/' + deviceIP) as Observable<IStateMonitoring>;
  }

  public getAllProcess(deviceIP: string): Observable<IAllProcessResponse[]> {
    return this.http.get('http://' + deviceIP + ':9011/getAllProcess') as Observable<IAllProcessResponse[]>;
  }

  public getCoreStatus(deviceIP: string): Observable<IStateMonitoring> {
    return this.http.get('http://' + deviceIP + ':9011/corestatus') as Observable<IStateMonitoring>;
  }

  public changeServiceStatus(serviceStatus: string): Observable<string> {
    // return this.http.get(environment.apiGatewayUrl + serviceStatus) as Observable<string>;
    return this.http.get('state-monitor' + '/' + serviceStatus) as Observable<string>;
  }

  public rebootService(password: string): Observable<string> {
    return this.http.get(environment.threatMessageUrl.replace('8123', '9011') + '/reboot/' + password) as Observable<string>;
  }

  public shutdownService(password: string): Observable<string> {
    return this.http.get(environment.threatMessageUrl.replace('8123', '9011') + '/shutdown/' + password) as Observable<string>;
  }
}
