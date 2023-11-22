import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IUserSetting } from '../interfaces/iuser-setting';
import { map } from 'rxjs/operators';

@Injectable()
export class UserSettingService {

    constructor(private http: HttpClient) {
    }

    public getUserSetting(userid: string): Observable<IUserSetting> {
        return this.http.get(environment.apiGatewayUrl + '/api/setting/' + userid) as Observable<IUserSetting>;
    }

    public putUserSetting(user: IUserSetting): Observable<IUserSetting> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };

        return this.http.put<IUserSetting>(environment.apiGatewayUrl + '/api/setting/', user, httpOptions);
    }

    public uploadAlertSound(formData: FormData): Observable<string> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'type': 'formData',
                'Access-Control-Allow-Origin': '*'
            })
        };

        return this.http.post<string>(environment.apiGatewayUrl + '/api/setting/upload-file', formData, httpOptions);
    }
}
