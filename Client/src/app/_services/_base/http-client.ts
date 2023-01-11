import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
 
// Angular CLI configuration thing.
import {environment} from '../../../environments/environment';
 
export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  body?: any;
}
 
export function applicationHttpClientCreator(http: HttpClient) {
  return new ApplicationHttpClient(http);
}
 
@Injectable()
export class ApplicationHttpClient {
   
  public _urlAPI = environment.urlAPIService;
  public _ssoAPI = environment.urlAPISSO;
  // Extending the HttpClient through the Angular DI.
  public constructor(public http: HttpClient) {
  }
 
  /**
   * GET request
   * @param {string} endPoint it doesn't need / in front of the end point
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @param {string} api use if there is needed to send request to different back-end than the default one.
   * @returns {Observable<T>}
   */
  public Get<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    return this.http.get<T>(endPoint,  options);
  }

  /**
   * GET ASYNC request
   * @param {string} endPoint it doesn't need / in front of the end point
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @param {string} api use if there is needed to send request to different back-end than the default one.
   * @returns {Promise<T>}
   */
  public GetAsync<T>(endPoint: string, options?: IRequestOptions): Promise<T> {
    return this.http.get<T>(endPoint,  options).toPromise();
  }
 
  /**
   * POST request
   * @param {string} endPoint end point of the api
   * @param {Object} params body of the request.
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public Post<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<T> {
    return this.http.post<T>(endPoint, params, options);
  }

  /**
   * POST ASYNC request
   * @param {string} endPoint end point of the api
   * @param {Object} params body of the request.
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Promise<T>}
   */
  public PostAsync<T>(endPoint: string, params: Object, options?: IRequestOptions): Promise<T> {
    return this.http.post<T>(endPoint, params, options).toPromise();
  }
 
  /**
   * PUT request
   * @param {string} endPoint end point of the api
   * @param {Object} params body of the request.
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public Put<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<T> {
    return this.http.put<T>(endPoint, params, options);
  }
 
  /**
   * DELETE request
   * @param {string} endPoint end point of the api
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public Delete<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    return this.http.delete<T>(endPoint, options);
  }
}