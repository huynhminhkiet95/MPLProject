import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpResponse } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Helpers } from '../../_helpers/helpers';
import { _const } from '../../_helpers/constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  snapshot: RouterStateSnapshot;
  timer: any;

  public constructor(
    private router: Router
    , private _loadingBar: SlimLoadingBarService
    , private spinner: NgxSpinnerService
    , private toastr: ToastrService
  ) {
    this.snapshot = router.routerState.snapshot;
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let clonedRequest: HttpRequest<any>;
    this._loadingBar.start();

    if (this.timer)
      clearTimeout(this.timer);
      
    this.timer = setTimeout(() => this.spinner.show(), 500);
    clonedRequest = req.clone({
      headers: req.headers.set(_const.REQUEST_HEADERS.authorization, this.getToken())
    });

    return next.handle(clonedRequest).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        this._loadingBar.complete();
        this.spinner.hide();
        if (this.timer) {
          clearTimeout(this.timer);
        }
        let response = event.body;
        if (response.Error) {
          //LOG
        }
      }
    },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          this._loadingBar.complete();
          this.spinner.hide();
          if (err.status === 401) {
            this.toastr.error("Your session is expired, please login.", "Session Timout")
            // redirect to the login route
            // or show a modal
            this.router.navigate(['/login'], { queryParams: { returnUrl: this.snapshot.url, logout: true } });
            return false;
          }
        }
      });
  }
  /**
    * Get token in local storage
    */
  private getToken() {
    let objData = Helpers.getLocalStorage(_const.LOCAL_STORAGE.authen_info);

    if (objData && objData[_const.AUTHEN_FIELDS.access_token]) {
      return "Bearer " + objData[_const.AUTHEN_FIELDS.access_token];
    }

    return "Bearer";
  }
}