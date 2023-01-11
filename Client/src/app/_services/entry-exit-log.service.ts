import { Injectable } from '@angular/core';
import { ApplicationHttpClient } from './_base/http-client';

@Injectable()
export class EntryExitLogService {

  urlAPI:string;
  constructor(private httpClient:ApplicationHttpClient) {
      this.urlAPI=httpClient._urlAPI + "/baovescan";
  }

  insert(model:any) {
    return this.httpClient.Post(this.urlAPI, model).map((response: Response) => response);
  }

}
