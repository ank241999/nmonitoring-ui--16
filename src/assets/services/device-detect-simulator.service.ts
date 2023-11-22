import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IDeviceDetect } from '../interfaces/idevicedetect';

@Injectable()
export class DeviceDetectSimulatorService {

  constructor(private http: HttpClient) { }

  /*public detectDevice(deviceDetail: any): Observable<string> {
    var detail = {
      "leftMacAddress": deviceDetail,
      "rightMacAddress": deviceDetail
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

    return this.http.post<string>(environment.apiGatewayUrl + '/detect', detail, httpOptions);
  }*/

  public detectDevice(deviceIpAddress: string, deviceMacAddress: string): Observable<string> {
    // let url: string = environment.apiGatewayUrl + '/api/deviceDetect?macAddress='+deviceMacAddress;
    //const url: string = 'http://' + deviceIpAddress + ':8000' + '/device/detect/' + deviceMacAddress;
    //const url: string = 'http://' + deviceIpAddress + ':8000' + '/device/ping/' + deviceMacAddress;
    const url: string = 'http://' + deviceIpAddress + ':9012/device/ping';
    return this.http.get(url) as Observable<string>;
  }

  public sendStatus(deviceIP: string, status: IDeviceDetect): Observable<string> {
    let url: string;
    if (deviceIP === '') {
      url = environment.apiGatewayUrl + '/device/detection-result';
    } else {
      url = 'http://' + deviceIP + ':8000' + '/device/detection-result';
    }
    return this.http.post(url, status) as Observable<string>;
  }

  public stopScanning(deviceIP: string): Observable<string> {
    let url: string;
    if (deviceIP === '') {
      url = environment.apiGatewayUrl + '/device/scanning-stopped';
    } else {
      url = 'http://' + deviceIP + ':9012' + '/device/scanning-stopped';
    }
    return this.http.get(url) as Observable<string>;
  }

  public resumeScanning(deviceIP: string): Observable<string> {
    let url: string;
    if (deviceIP === '') {
      url = environment.apiGatewayUrl + '/device/resume-scanning';
    } else {
      url = 'http://' + deviceIP + ':9012' + '/device/resume-scanning';
    }
    return this.http.get(url) as Observable<string>;
  }
}
