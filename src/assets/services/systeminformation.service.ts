import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IKeySystemInfo, ISystemInfo } from '../interfaces/isystemInfo';

@Injectable({
  providedIn: 'root'
})
export class SysteminformationService {

  constructor(private http: HttpClient) { }

  public getPairedIp(ipAddress: string): Observable<ISystemInfo[]> {
    return this.http.get('http://' + ipAddress + ':9003/' + 'device/ipName?ip=' + ipAddress) as Observable<ISystemInfo[]>;
  }

  public getSystemInformation(fileName: string): Observable<IKeySystemInfo[]> {
    return this.http.get(environment.threatMessageUrl.replace('8123', '9011')
      + '/backend/configItems?fileName='
      + fileName) as Observable<IKeySystemInfo[]>;
  }

  public getSystemInformationIp(fileName: string, ipAddress: string): Observable<IKeySystemInfo[]> {
    return this.http.get('http://' + ipAddress + ':9011' + '/backend/configItems?fileName=' + fileName) as Observable<IKeySystemInfo[]>;
  }

  public updateSystemInformation(fileName: string, configItemArrayn: IKeySystemInfo[]): Observable<IKeySystemInfo> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.post(environment.threatMessageUrl.replace('8123', '9011')
      + '/backend/updateConfigItems?fileName='
      + fileName, configItemArrayn, httpOptions);
  }

  public updateSystemInformationIp(fileName: string, ipAddress: string, configItemArrayn: IKeySystemInfo[]): Observable<IKeySystemInfo> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    const uri = 'http://' + ipAddress + ':9011' + '/backend/updateConfigItems?fileName=' + fileName;
    return this.http.post(uri, configItemArrayn, httpOptions);
  }

  public rebootService(password: string): Observable<string> {
    return this.http.get(environment.threatMessageUrl.replace('8123', '9011') + '/reboot/' + password) as Observable<string>;
  }

  public rebootServiceIP(password: string, ipAddress: string): Observable<string> {
    const uri = 'http://' + ipAddress + ':9011' + '/reboot/' + password;
    console.log(' URI - ' + uri);
    return this.http.get(uri) as Observable<string>;
  }
}
