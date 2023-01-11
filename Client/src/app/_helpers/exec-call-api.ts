/*********************************************************
 * File Name: ExecCallApi
 * Created By: hau.le
 * Created Date: 09/09/2019
 * Description: Execute GET, POST, PUT, DELETE API
 *********************************************************/

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'
import { ApplicationHttpClient } from '../_services/_base/http-client';
import { Observable } from 'rxjs/Observable';
import { BaseURLAPIs, IBaseUrlAPIs } from '../_services/_base/base-url-apis';

export class ApiSSO {
  static _isAuthenSSO: boolean = false;

  get isAuthenSSO(): boolean {
    return ApiSSO._isAuthenSSO;
  }

  set isAuthenSSO(value: boolean) {
    ApiSSO._isAuthenSSO = value;
  }
}

@Injectable()
export class ExecCallApi extends ApiSSO implements IBaseUrlAPIs {

  private baseURL: BaseURLAPIs;
  private _endPointURL: string;

  // static _isAuthenSSO: boolean = false;

  // get isAuthenSSO(): boolean {
  //   return ExecCallApi._isAuthenSSO;
  // }

  // set isAuthenSSO(value: boolean) {
  //   ExecCallApi._isAuthenSSO = value;
  // }
  
  constructor(private _httpClient: ApplicationHttpClient) {
    super();
  }

  /**
   * Get data from API
   * @param {string} endPoint url api
   */
  getDataApi(endPoint: string): any {
    if (!this.checkUrlEndPoint(endPoint, this.isAuthenSSO))
      return this._httpClient
      .Get(this._endPointURL)
      .map((response: Response) => response)
      // .catch(error => Observable.of({ error: true }));
      .catch( this.handleError);
  }

  /**
   * Get data from API use ASYNC - AWAIT
   * @param {string} endPoint url API
   */
  async getAsyncDataApi(endPoint: string): Promise<any> {
    if (!this.checkUrlEndPoint(endPoint, this.isAuthenSSO))
      return await this._httpClient
      .GetAsync(this._endPointURL);
  }

  /**
   * Post data to API
   * @param {string} endPoint url API
   * @param {object} model data params post to API
   */
  postDataApi(endPoint: string, model: any): any {
    
    if (!this.checkUrlEndPoint(endPoint, this.isAuthenSSO))
      return this._httpClient
      .Post(this._endPointURL, model)
      .map((response: Response) => response);
  }

  /**
   * Post data to API use ASYNC - AWAIT
   * @param {string} endPoint url API
   * @param {object} model data params post to API
   */
  async postAsyncDataApi(endPoint: string, model: any): Promise<any> {
    if (!this.checkUrlEndPoint(endPoint, this.isAuthenSSO))
      return await this._httpClient
      .PostAsync(this._endPointURL, model);
  }

  /**
   * Post data to API
   * @param {string} endPoint url API
   * @param {object} model data params post to API
   */
  putDataApi(endPoint: string, model: any): any {
    if (!this.checkUrlEndPoint(endPoint, this.isAuthenSSO))
      return this._httpClient
      .Put(this._endPointURL, model)
      .map((response: Response) => response);
  }

  async putAsyncDataApi(endPoint: string, model: any): Promise<any> {

  }

  deleteDataApi(endPoint: string): any {
    if (!this.checkUrlEndPoint(endPoint, this.isAuthenSSO))
      return this._httpClient
      .Delete(this._endPointURL)
      .map((response: Response) => response);
  }

  async deleteAsyncDataApi(endPoint: string): Promise<any> {

  }

  getEndPointURLByParam(isAuthenSSO: boolean): string {
    return '';
  }

  resetEndPointURL() {
    this.isAuthenSSO = false;
  }

  private checkUrlEndPoint(endPoint: string, _isAuthenSSO: boolean): boolean {
    this.baseURL = new BaseURLAPIs(_isAuthenSSO, endPoint);
    this._endPointURL = this.baseURL.urlEndPointAPI;
    this.isAuthenSSO = false; // reset value isAuthenSSO
    return !this._endPointURL;
  }

  private handleError = (error: Response) => {
    return Observable.throw(error.statusText);
  }
}