import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';

import { ApplicationDataService } from '../services/application-data-service';
import { environment } from '../../environments/environment';
import { ShareDataService } from '../services/share-data.service';
// import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private lastActivity: Date;
  private loggingOut: boolean;

  constructor(private injector: Injector, private router: Router) {
    const lastActivityStr = localStorage.getItem('lastActivity');
    if (lastActivityStr) {
      this.lastActivity = new Date(lastActivityStr);
    }
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const shareDataService = this.injector.get(ShareDataService);
    const currentUser = shareDataService.currentUser;
    if (currentUser) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + currentUser
        }
      });

      const now = new Date();
      if (this.lastActivity && now.getTime() - this.lastActivity.getTime() > Number(localStorage.getItem('idleTimeout'))) {
        // last activity exceeded the idle timeout
        if (!this.loggingOut) { // check if not already logging out
          this.loggingOut = true;
          this.logout();
        }
      } else {
        this.lastActivity = now;
        localStorage.setItem('lastActivity', now.toISOString());
      }

      if (environment.isMobile) {
        const str: string = request.url.toString();
        const urlPartitions: string[] = str.split(':');

        if (urlPartitions.length > 1) {
          const replacingUrl = new RegExp(str.split(':')[1].substring(2), 'gi');
          const newstr: string = str.replace(replacingUrl, shareDataService.serverUrl);
          // console.log(newstr)

          request = request.clone({ url: newstr });
        }
      }
    }

    return next.handle(request);//.catch(err => this.handleAuthError(err, request));
  }

  // private handleAuthError(err: HttpErrorResponse, request: HttpRequest<any>): Observable<any> {
  //   if (request.url.toString().indexOf('api/stop') === -1 &&
  //     request.url.toString().indexOf('api/start') === -1 && !request.url.includes('/device/detection-result')) {
  //     console.log(request.url.toString() + ' ::> ' + request.url.toString().indexOf('api/start'));
  //     // handle your auth error or rethrow
  //     if (err.status === 401 || err.status === 403 || err.status === 500) {
  //       // navigate /delete cookies or whatever
  //       this.logout(); // this.router.navigateByUrl('/');
  //       // if you've caught / handled the error,
  //       // you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
  //       // return Observable.of(err.message); // or EMPTY may be appropriate here
  //       return throwError({ message: err.message });
  //     }
  //     if (err.name === 'HttpErrorResponse') {
  //       // console.log("error: " + err.name + ":: " + JSON.stringify(err) + " >> " + err.message);
  //       if (err.error.indexOf('Response1: 500 INTERNAL_SERVER_ERROR') === -1) {
  //         this.logout();
  //       }// this.router.navigateByUrl('/');
  //     }
  //   }
  //   // this.router.navigateByUrl('/');
  //   return throwError(err);
  // }

  logout() {
    const shareDataService = this.injector.get(ShareDataService);
    const userService = this.injector.get(UserService);
    userService.logOutUser().subscribe(res => {
      if (res['status'] === 200) {
        // ActivityConstants.retainRequiredValues();
        userService.logoutLog();
        shareDataService.clearSessionVariables();

        localStorage.removeItem('userLogId');
        this.router.navigate(['/']);
      } else if (res['status'] === 400) {
        userService.logoutLog();
        shareDataService.clearSessionVariables();

        localStorage.removeItem('userLogId');
        this.router.navigate(['/']);
      } else if (res['status'] === 500) {
      }
    },
      err => {
        console.log('Error occurred: ' + err.message);
      });
  }
}
