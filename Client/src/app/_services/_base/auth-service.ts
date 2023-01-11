import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { Helpers } from '../../_helpers/helpers';
import { _const } from '../../_helpers/constants';
import {AuthenticationService} from '../authentication.service'
import { Injectable, Injector } from '@angular/core';
import { Http } from '@angular/http';

export class AuthService {
  // Assuming this would be cached somehow from a login call.
  public authTokenStale: string; // stale auth token
  public authTokenNew: string; // new_auth_token
  public currentToken: string;

  constructor() {
    this.currentToken = this.authTokenStale;
  }

  getAuthToken() {
    let objData = Helpers.getLocalStorage(_const.LOCAL_STORAGE.authen_info);

    if (objData && objData[_const.AUTHEN_FIELDS.access_token])
      this.currentToken = objData[_const.AUTHEN_FIELDS.access_token];
    
    return this.currentToken;
  }

  refreshToken(): Observable<string> {

    //  this.authenticationService.refeshTokenAsync("").then(data=>{
    // 
    //  });
    /*
        The call that goes in here will use the existing refresh token to call
        a method on the oAuth server (usually called refreshToken) to get a new
        authorization token for the API calls.
    */

    // this.currentToken = this.authTokenNew;

    return Observable.of(this.authTokenNew).delay(200);
  }
}