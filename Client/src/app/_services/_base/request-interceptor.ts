import { Injectable, Injector } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpErrorResponse, HttpUserEvent, HttpEvent } from "@angular/common/http";
import { AuthService } from "./auth-service";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs";
import { RouterStateSnapshot, Router } from "@angular/router";
import { AuthenticationService } from "../authentication.service";
import { Helpers } from "../../_helpers/helpers";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  timer: any;
  snapshot: RouterStateSnapshot;
  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  authSvc: AuthenticationService
  constructor(
    private router: Router
    , private _loadingBar: SlimLoadingBarService
    , private spinner: NgxSpinnerService
    , private toastr: ToastrService
    , private authService: AuthService
    , private injector: Injector
  ) {
    this.snapshot = router.routerState.snapshot;
  }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } })

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpEvent<any> | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    this._loadingBar.start();

    if (this.timer)
      clearTimeout(this.timer);

    this.timer = setTimeout(() => this.spinner.show(), 500);
    return next.handle(this.addToken(req, this.authService.getAuthToken())).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        this._loadingBar.complete();
        this.spinner.hide();
        if (this.timer) {
          clearTimeout(this.timer);
        }

      }
    })
      .catch(error => {
        debugger;
        if (error instanceof HttpErrorResponse) {
          switch ((<HttpErrorResponse>error).status) {
            case 400:
              return this.handle400Error(error);
            case 401:
              return this.handle401Error(req, next);
          }
        } else {
          //return Observable.throw(error);
          
          return null;
        }
        console.log(error);
        this._loadingBar.complete();
        this.spinner.hide();
      });
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.authSvc = this.injector.get(AuthenticationService)
      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);

      return this.authSvc.refeshTokenAsync()
        .switchMap((newToken) => {
          if (newToken) {
            this.spinner.hide();
            Helpers.setLocalStorage("authenInfo", newToken);
            this.tokenSubject.next(newToken['access_token']);
            return next.handle(this.addToken(req, newToken['access_token']));
          }

          // If we don't get a new token, we are in trouble so logout.
          return this.logoutUser();
        })
        .catch(error => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          return this.logoutUser();
        })
        .finally(() => {
          this.isRefreshingToken = false;
        });
    } else {
      return this.tokenSubject
        .filter(token => token != null)
        .take(1)
        .switchMap(token => {
          return next.handle(this.addToken(req, token)).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              this._loadingBar.complete();
              this.spinner.hide();
              if (this.timer) {
                clearTimeout(this.timer);
              }
            }
          })
        });
    }
  }

  handle400Error(error) {
    if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
      // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
      return this.logoutUser();
    }

    return Observable.throw(error);
  }

  logoutUser() {
    // Route to the login page (implementation up to you)
    this.toastr.error("Your session is expired, please login.", "Session Timout")
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.snapshot.url, logout: true } });
    return Observable.throw("");
  }
}