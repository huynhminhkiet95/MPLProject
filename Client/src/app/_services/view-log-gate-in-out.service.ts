import { Injectable } from '@angular/core';
import { ApplicationHttpClient } from './_base/http-client';

@Injectable()
export class ViewLogGateInOutService {
  urlAPI:string;
  constructor(private httpClient:ApplicationHttpClient) {
      this.urlAPI=httpClient._urlAPI+"/baovescan";
  }

  search(model:any) {
    return this.httpClient.Post(this.urlAPI + '/search', model).map((response: Response) => response);
  }

}
