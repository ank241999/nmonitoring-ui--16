import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser, IUserAgreement } from '../interfaces/iuser';
import { environment } from '../../environments/environment';
import { ShareDataService } from '../services/share-data.service';
import { IAuth } from '../interfaces/iauth';
import { IUserLoginLog } from '../interfaces/iuserloginlog';
import { IRoleModule } from '../interfaces/irolemodule';
import { IRoles } from '../interfaces/iroles';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    localIp = sessionStorage.getItem('LOCAL_IP');

    private ipRegex = new RegExp(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);

    constructor(private http: HttpClient, private zone: NgZone, private shareDataService: ShareDataService) { }

    public getUsers(search: string): Observable<IUser[]> {
        return this.http.get(environment.apiGatewayUrl + '/user?searchString=' + search) as Observable<IUser[]>;
    }

    public loginUser(user: IUser): Observable<IUser> {
        return this.http.post<IUser>(environment.apiGatewayUrl + '/user/login', user);
    }

    public registerUser(user: IUser): Observable<IUser> {
        return this.http.post<IUser>(environment.apiGatewayUrl + '/user/register', user);
    }

    public updateUser(user: IUser): Observable<IUser> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };

        return this.http.put<IUser>(environment.apiGatewayUrl + '/user', user, httpOptions);
    }

    public deleteUser(ids: number[]): Observable<IUser> {
        // return this.http.delete<IUser>(environment.apiGatewayUrl + '/user/',ids);
        const httpOptions = {
            headers: new HttpHeaders({
                // 'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        return this.http.post<IUser>(environment.apiGatewayUrl + '/user/delete/', ids, httpOptions);
    }

    public logOutUser(): Observable<IUser> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };

        const body = {
            'client_id': environment.tokenVerifyClientId,
            'client_secret': environment.tokenVerifySecret,
            'username': this.shareDataService.email,
            'refresh_token': this.shareDataService.refreshToken
        };
        return this.http.post<IUser>(environment.apiGatewayUrl + '/user/logout', body);
    }

    public logOutAll(username: string, password: string, device: string): Observable<IUser> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };

        const body = {
            'client_id': environment.tokenVerifyClientId,
            'client_secret': environment.tokenVerifySecret,
            'device': device,
            'password': password,
            'username': username
        };
        return this.http.post<IUser>(environment.apiGatewayUrl + '/user/logoutall', body);
    }

    public verifyToken(): Observable<IAuth> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };
        const body = new HttpParams()
            .set('client_id', environment.tokenVerifyClientId)
            .set('client_secret', environment.tokenVerifySecret)
            .set('token', this.shareDataService.currentUser)
            .set('username', this.shareDataService.email);

        return this.http.post<IAuth>(environment.keycloakUrl + '/token/introspect', body, httpOptions);
    }

    public updateUserAgreement(user: IUserAgreement): Observable<IUser> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };

        return this.http.put<IUser>(environment.apiGatewayUrl + '/user/updateAgreement', user, httpOptions);
    }

    public userLoginLog(userLoginLog: IUserLoginLog): Observable<IUserLoginLog> {
        return this.http.post<IUserLoginLog>(environment.apiGatewayUrl + '/loginlog', userLoginLog);
    }

    public userLogoutLog(userLoginLog: IUserLoginLog): Observable<IUserLoginLog> {
        return this.http.put<IUserLoginLog>(environment.apiGatewayUrl + '/logoutlog', userLoginLog);
    }

    public loginLog() {
        const userLoginLogObject = {
            userId: this.shareDataService.id,
            tabletMacAddress: this.determineLocalIp()
        };

        this.userLoginLog(userLoginLogObject).subscribe(res => {
            if ((res as { status: number })['status'] === 201) {
                const userLoginLog: IUserLoginLog = (res as { data: IUserLoginLog })['data'];
                localStorage.setItem('userLogId', userLoginLog.id.toString());
                console.log('Logged-in');
            }
        },
            err => {
                console.log('Error occurred: ' + err.message);
            });
    }

    public logoutLog() {
        const userLoginLogObject = {
            id: parseInt(localStorage.getItem('userLogId') as string, 10)
        };

        this.userLogoutLog(userLoginLogObject).subscribe(res => {
            console.log('Logged out');
        },
            err => {
                console.log('Error occurred: ' + err.message);
            });
    }

    public determineLocalIp(): string {
        let ip: string;
        const peerConnection = new RTCPeerConnection({});
        peerConnection.createDataChannel('');
        peerConnection.onicecandidate = function (event) {
            if (event.candidate) {
                ip = /^candidate:.+ (\S+) \d+ typ/.exec(event.candidate.candidate)[1];
                console.log('IP address: ', ip);
                peerConnection.close();
            }
        };
        sessionStorage.setItem('LOCAL_IP', ip);
        return ip;
    }

    public getRolebyname(search: string): Observable<IRoleModule[]> {
        return this.http.get(environment.apiGatewayUrl + '/rolebyname?roleName=' + search) as Observable<IRoleModule[]>;
    }

    public getRole(): Observable<IRoles[]> {
        return this.http.get(environment.apiGatewayUrl + '/role') as Observable<IRoles[]>;
    }

    public getScancountTimezone(): Observable<object> {
        return this.http.get(environment.apiGatewayUrl + '/threat-config/getCount-Time') as Observable<object>;
    }
}
