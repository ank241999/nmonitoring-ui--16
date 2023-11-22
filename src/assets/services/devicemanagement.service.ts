import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITablet } from '../interfaces/itablet';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IAssignSerialNo, IDevice, IDeviceLightConfigration, IDeviceLightConfigrationReq } from '../interfaces/idevice';

@Injectable()
export class DevicemanagementService {

  constructor(private http: HttpClient) { }

  public getDevices(): Observable<IDevice[]> {
    return this.http.get(environment.apiGatewayUrl + '/device/getAllDevice') as Observable<IDevice[]>;
  }

  public updateDevice(device: IDevice): Observable<ITablet> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.put(environment.apiGatewayUrl + '/device', device, httpOptions);
  }

  public createDevice(device: IDevice): Observable<ITablet> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.post(environment.apiGatewayUrl + '/device', device, httpOptions);
  }

  public deleteDevice(selectedDeviceIds: string): Observable<ITablet> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.post(environment.apiGatewayUrl + '/device/deleteDevice/' + selectedDeviceIds, httpOptions);
  }

  public getDevicesLightSerialNos(ipAddress: string): Observable<IDevice[]> {
    return this.http.get('http://' + ipAddress + ':9012/device/devices') as Observable<IDevice[]>;
  }

  public getDevicesLightSerialNosHex(deviceId: number): Observable<IDeviceLightConfigration[]> {
    return this.http.get(environment.apiGatewayUrl +
      '/deviceConfigure/{deviceID}?deviceId='
      + deviceId) as Observable<IDeviceLightConfigration[]>;
    // return this.http.get(environment.apiGatewayUrl +'/deviceConfigure/'+deviceId) as Observable<IDeviceLightConfigration[]>;
  }

  public validateSerialNo(ipAddress: string, assignSerialNo: IAssignSerialNo): Observable<ITablet> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.put('http://' + ipAddress + ':9012/device/assignSerialNumber', assignSerialNo, httpOptions);
  }

  public resetSerialNo(deviceId: number): Observable<ITablet> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.post(environment.apiGatewayUrl + '/deviceConfigure/resetDevice?devieId=' + deviceId, {}, httpOptions);
  }

  public saveSerialNo(assignSerialNo: IDeviceLightConfigrationReq): Observable<ITablet> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.post(environment.apiGatewayUrl + '/deviceConfigure', assignSerialNo, httpOptions);
  }

  public getDeviceById(deviceId: number): Observable<IDevice[]> {
    return this.http.get(environment.apiGatewayUrl + '/device/' + deviceId) as Observable<IDevice[]>;
  }

  public pingDevice(ipAddress: string): Observable<IDevice[]> {
    return this.http.get('http://' + ipAddress + ':9012/device/ping') as Observable<IDevice[]>;
  }
}
