import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApplicationHttpClient } from './_base/http-client';

@Injectable()
export class ActivityGroupSerivce {

  private urlApi: string;
  constructor(private http: ApplicationHttpClient) {
      this.urlApi = environment.urlAPIService + "/activityservice";
  }
  search(model:any) {
      return this.http.Post(this.urlApi+'/search',model).map((response: Response) => response);
  }
  save(items: any) 
  {
    return this.http.Post(this.urlApi ,items).map((response: Response) => response);
  }
  update(items: any) 
  {
    return this.http.Put(this.urlApi ,items).map((response: Response) => response);
  }
  updateStatus(items: any) 
  {
    return this.http.Put(this.urlApi +'/status',items).map((response: Response) => response);
  }
  getBySeviceId(SVRNo:any,userId :any)
  {
    return this.http.Get(this.urlApi+'/'+userId+'/'+SVRNo).map((response: Response) => response);
  }
  UpdateItems(items: any) 
  {
    return this.http.Put(this.urlApi+'/details' ,items).map((response: Response) => response);
  }
  saveLog(items: any) 
  {
    return this.http.Post(this.urlApi+'/log' ,items).map((response: Response) => response);
  }
  delete(actNo:any,userId :any)
  {
    return this.http.Delete(this.urlApi+'/'+userId+'/'+actNo).map((response: Response) => response);
  }
}
