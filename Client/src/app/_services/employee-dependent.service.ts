import { Injectable } from '@angular/core';
import { ApplicationHttpClient } from './_base/http-client';
@Injectable()
export class EmployeeDependentService {

    urlAPI:string;
    constructor(private httpClient: ApplicationHttpClient) 
    {
        this.urlAPI = httpClient._ssoAPI+"/api/userprofile/employeedependent";
    }
    getByEmployeeId(id: string)
    {
        return this.httpClient.Get(this.urlAPI+'/' + id).map((response: Response) => response);
    }
    create(model: any) 
    {
        return this.httpClient.Post(this.urlAPI, model).map((response: Response) => response);
    }
    update(model: any) 
    {
      return this.httpClient.Put(this.urlAPI, model).map((response: Response) => response);
    }
    delete(model: any) 
    {
      return this.httpClient.Delete(this.urlAPI+'/'+model.id).map((response: Response) => response);
    }
}
