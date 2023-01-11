import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ItServiceModel } from '../_models/index';
import { environment } from '../../environments/environment';
import { ApplicationHttpClient } from './_base/http-client';
@Injectable()
export class ItServiceRequest {
    urlAPI:string;

    constructor(private http: ApplicationHttpClient) { 
        this.urlAPI = http._urlAPI+"/requestservice";
    }

    getAll() {
        return this.http.Get(this.urlAPI+'/ITServiceRequests').map((response: Response) => response);
    }
    search(model: any) 
    {
        return this.http.Post(this.urlAPI+'/ITServiceRequests/search',model).map((response: Response) => response);
    }
    deleteservicerequest(model: any) 
    {
        return this.http.Put(this.urlAPI+'/ITServiceRequests/deleteservicerequest',model).map((response: Response) => response);
    }
    getById(id: string)
    {
        return this.http.Get(this.urlAPI+'/ITServiceRequest/' + id).map((response: Response) => response);
    }

    create(itService: ItServiceModel) {
        return this.http.Post(this.urlAPI+'/ITServiceRequest', itService).map((response: Response) => response);
    }

    update(itService: ItServiceModel) {
        return this.http.Put(this.urlAPI+'/ITServiceRequests/' + itService.ISRNo, itService).map((response: Response) => response);
    }

    delete(id: number) {
        return this.http.Delete(this.urlAPI+'/ITServiceRequests/' + id).map((response: Response) => response);
    }
   
    replyItRequest(model:any)
    {
        return this.http.Post(this.urlAPI+'/ITServiceRequest/reply', model).map((
            
        response: Response) => response
        );
    }
     
}