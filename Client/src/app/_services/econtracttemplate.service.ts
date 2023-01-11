import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ApplicationHttpClient } from './_base/http-client';

@Injectable()
export class EcontracttemplateService {
    private urlAPI:string;

    constructor(private http: ApplicationHttpClient) { 
        this.urlAPI=http._urlAPI+"/econtracttemplate";
    }

    getAll() 
    {
        return this.http.Get(this.urlAPI + '/search').map((response: Response) => response);
    }
    // getById(id:string) 
    // {
    //      this.http.Get(this.urlAPI + '/getbyid/'+ id).toPromise()
    // }


    getById(id:string) {
      return this.http.Get(this.urlAPI + '/getbyid/'+ id).map((response: Response) => response);
    }
    update(model:any) {
        return this.http.Put(this.urlAPI + '/update/',model).map((response: Response) => response);
      }


}

