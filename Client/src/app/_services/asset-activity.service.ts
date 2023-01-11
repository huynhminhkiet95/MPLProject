import { Injectable } from '@angular/core';
import { ApplicationHttpClient } from './_base/http-client';

@Injectable()
export class AssetActivityService {

  urlAPI: string;

  constructor(private http: ApplicationHttpClient) {
    this.urlAPI = http._urlAPI + "/assetactivity";
  }

  Search(model: any) {
    return this.http.Post(this.urlAPI + '/search', model).map((response: Response) => response);
  }

  Insert(model: any) {
    return this.http.Post(this.urlAPI, model).map((response: Response) => response);
  }

  Update(model: any) {
    return this.http.Put(this.urlAPI, model).map((response: Response) => response);
  }
  
  Delete(id: any) {
    return this.http.Delete(this.urlAPI + '/' + id).map((response: Response) => response);
  }
}
