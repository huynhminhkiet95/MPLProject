/*********************************************************
 * File Name: API ENDPOINT
 * Created By: hau.le
 * Created Date: 21/02/2020
 * Description: return url endpoint api
 *********************************************************/

import { environment } from '../../../environments/environment';
import { Helpers } from '../../_helpers/helpers';

export class BaseURLAPIs {

  private _isAuthenSSO: boolean = false;
  private _endPoint: string;
  private _baseURL: string = null;
  private _endsWith: string = '/';

  public constructor(isAuthenSSO: boolean, endPoint: string) {
    this._isAuthenSSO = isAuthenSSO;
    this._endPoint = endPoint;
    this.setBaseURL();
  }

  get urlEndPointAPI(): string {
    return this._baseURL;
  }

  /**
   * set base url API
   */
  private setBaseURL(): string {
    if (this._isAuthenSSO)
      this._baseURL = environment.urlAPISSO;
    else
      this._baseURL = environment.urlAPIService;
    
      // Check ending base url
    if (!Helpers.confirmEnding(this._baseURL, this._endsWith))
      this._baseURL += this._endsWith;

    this._baseURL += this._endPoint;

    return this._baseURL;
  }
}

export interface IBaseUrlAPIs {

  getDataApi(endPoint: string): any;

  getAsyncDataApi(endPoint: string): any;

  postDataApi(endPoint: string, model: any): any;

  postAsyncDataApi(endPoint: string, model: any): any;

  putDataApi(endPoint: string, model: any): any;

  putAsyncDataApi(endPoint: string, model: any): any;

  deleteDataApi(endPoint: string): any;

  deleteAsyncDataApi(endPoint: string): any;

  getEndPointURLByParam(isAuthenSSO: boolean): string;

  resetEndPointURL(): void;
}