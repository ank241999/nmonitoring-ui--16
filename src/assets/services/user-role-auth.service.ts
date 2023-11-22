import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ShareDataService } from './share-data.service';
import { IAccesslevel, ICapability, IRole, IRoleCapability, IUserRoleAuth } from '../interfaces/iuserroleauth';

@Injectable()
export class UserRoleAuthService {
    localIp = sessionStorage.getItem('LOCAL_IP');

    private ipRegex = new RegExp(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);

    constructor(private http: HttpClient, private zone: NgZone, private shareDataService: ShareDataService) { }

    public getUserEndPoint(userID: string): Observable<IUserRoleAuth[]> {
        return this.http.get(environment.apiGatewayUrl + '/roleauth/auth-userendpoints?userID=' + userID) as Observable<IUserRoleAuth[]>;
    }

    public getRoles(): Observable<IRole[]> {
        return this.http.get(environment.apiGatewayUrl + '/roles') as Observable<IRole[]>;
    }

    public getCapability(): Observable<ICapability[]> {
        return this.http.get(environment.apiGatewayUrl + '/capability') as Observable<ICapability[]>;
    }

    public getRoleCapability(): Observable<IRoleCapability[]> {
        return this.http.get(environment.apiGatewayUrl + '/rolecapability') as Observable<IRoleCapability[]>;
    }

    public getRoleCapabilityByAccesslevelId(accesslevelId: number): Observable<IRoleCapability[]> {
        return this.http.get(environment.apiGatewayUrl
            + '/rolecapability/rolecapabilitybyaccesslevelid?id=' + accesslevelId) as Observable<IRoleCapability[]>;
    }

    public saveRoleCapability(roleCapability: IRoleCapability[]): Observable<IRoleCapability> {
        return this.http.post<IRoleCapability>(environment.apiGatewayUrl + '/rolecapability', roleCapability);
    }

    public saveCapability(capability: ICapability): Observable<ICapability> {
        return this.http.post<ICapability>(environment.apiGatewayUrl + '/capability', capability);
    }

    public updateCapability(capability: ICapability): Observable<ICapability> {
        return this.http.put<ICapability>(environment.apiGatewayUrl + '/capability', capability);
    }

    public deleteCapability(capability: number[]): Observable<ICapability> {
        return this.http.post<ICapability>(environment.apiGatewayUrl + '/capability/delete', capability);
    }

    public getAccessibilities(): Observable<IAccesslevel[]> {
        return this.http.get(environment.apiGatewayUrl + '/roleauth/getAccessibility') as Observable<IAccesslevel[]>;
    }
}
