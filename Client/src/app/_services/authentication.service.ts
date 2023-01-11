import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map'
import { environment } from '../../environments/environment';
import { ExecCallApi, ApiSSO } from '../_helpers/exec-call-api';
import { Helpers } from '../_helpers/helpers';
import { _const } from '../_helpers/constants';
import { EnumMPLSystem } from '../_helpers/enums';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class AuthenticationService extends ApiSSO {

    private redirectUrl: string = '/';
    private loginUrl: string = '/login';
    private isloggedIn: boolean = false;
    private loggedInUser: any;
    private authenSSOAPI: string;
    private ssoAuthenModule: string;

    data: any = {};

    constructor(private http: Http
        , private execCallApi: ExecCallApi
    ) {
        super();
        this.authenSSOAPI = environment.urlAPISSO;
        this.ssoAuthenModule = 'api/authentication';
    }

    /**
     * New func authen SSO login with params userName and password
     * @param {string} userName param userName login
     * @param {string} password param password login
     * @returns {object}
     */
    async loginWithParams(userName: string, password: string): Promise<any> {

        let result = {
            error: false
            , data: null
            , message: null
        }

        if (Helpers.isNullOrEmpty(userName) || Helpers.isNullOrEmpty(password)) {
            result.error = true;
            result.message = 'Username or password can\'t not null';
            return result;
        }

        try {
            // Validate user login in server
            const data = await this.validateUserLoginAsync(userName, password);

            if (data)
                result.data = data.json();
            else {
                result.error = true;
                result.message = 'Username or password is incorrect';
            }
        } catch (ex) {
            result.error = true;
            let error =JSON.parse(ex['_body']);
            if(error)
            {
                result.message = error["error_description"];
            }
            else
            {
                result.message = ex.message;
            }
        }

        return result;
    }

    isUserLoggedIn(): boolean {
        let user = Helpers.getLocalStorage(_const.LOCAL_STORAGE.current_user);
        return user != null;
    }

    getRedirectUrl(): string {
        return this.redirectUrl;
    }

    setRedirectUrl(url: string): void {
        this.redirectUrl = url;
    }

    getLoginUrl(): string {
        return this.loginUrl;
    }

    getLoggedInUser(): any {
        return this.loggedInUser;
    }

    logoutUser(): void {
        this.isloggedIn = false;
    }

    logout() {
        // remove user from local storage to log user out
        this.removeAllDataLocalStorage();
    }

    /**
   * Remove data local storage
   */
    removeAllDataLocalStorage() {
        const _arrKey = [
            _const.LOCAL_STORAGE.current_user
            , _const.LOCAL_STORAGE.current_menus
            , _const.LOCAL_STORAGE.img_avatar
            , _const.LOCAL_STORAGE.languages
            , _const.LOCAL_STORAGE.authen_info
            , _const.LOCAL_STORAGE.user_private_info
        ];

        Helpers.removeArrayLocalStorage(_arrKey);
    }

    /**
     * Get user info profile 
     * Method: GET
     * API: SSO/authentication
     * @param id user id current login
     */
    getUserInfoById(id: number) {
        this.isAuthenSSO = true;
        const endPoint = `${this.ssoAuthenModule}/userprofile/${id}`;
        return this.execCallApi.getDataApi(endPoint);
    }

    /**
     * Change password user
     * Method: POST
     * API: SSO/authentication
     * @param model Model info
     */
    changePassword(model: any) {
        this.isAuthenSSO = true;
        const endPoint = `${this.ssoAuthenModule}/changepassword`;
        return this.execCallApi.postDataApi(endPoint, model);
    }

    /**
     * Validate user login Async
     * @param {string} userName
     * @param {string} password
     */
    private async validateUserLoginAsync(userName: string, password: string) {
        // Add header content-type, get params login
        const headers = this.setHeaderLogin();
        const params = await this.getParamsLogin(userName, password);

        // Url API SSO use grantrefreshtoken
        const endPoint = `${this.authenSSOAPI}token`;

        return this.http
            .post(endPoint, params, { headers: headers })
            .toPromise();
    }
    public  refeshTokenAsync() {
        // Add header content-type, get params login
        const headers = this.setHeaderLogin();
        const params =  this.getParamsRefreshToken();

        // Url API SSO use grantrefreshtoken
        const endPoint = `${this.authenSSOAPI}token`;

        return this.http.post(endPoint, params, { headers: headers }).map(response=> response.json());
    }
    private setHeaderLogin(): any {
        return new Headers({
            'Accept': 'application/x-www-form-urlencoded'
            , 'Content-Type': 'application/x-www-form-urlencoded'
        });
    }

    private getParamsLogin(userName: string, password: string): any {
        const body = new URLSearchParams();
        body.set('grant_type', _const.APP_CONFIG.grant_type);
        body.set('username', userName);
        body.set('password', password);
        body.set('client_id', EnumMPLSystem.DEFAULT.toString());

        return body.toString();
    }
    private getParamsRefreshToken(): any {
        let authInfo:any = Helpers.getLocalStorage("authenInfo");
        const body = new URLSearchParams();
        body.set('grant_type', "refresh_token");
        body.set('refresh_token',authInfo.refresh_token);
        body.set('client_id', EnumMPLSystem.DEFAULT.toString());

        return body.toString();
    }
}