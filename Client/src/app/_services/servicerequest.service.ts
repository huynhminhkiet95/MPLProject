import { Injectable } from '@angular/core';
import {Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { ApplicationHttpClient } from './_base/http-client';
@Injectable()
export class ServiceRequestService {

    urlApi: string;
    constructor(private http: ApplicationHttpClient) {
        this.urlApi = environment.urlAPIService + "/servicerequests";
    }

    getAll() {
        return this.http.Get(this.urlApi).map((response: Response) => response);
    }
    search(model: any) {

        return this.http.Post(this.urlApi + "/search", model).map((response: Response) => response);
    }
    ApprovalList(model: any) {

        return this.http.Post(this.urlApi + "/search/approvallist", model).map((response: Response) => response);
    }
    getById(id: number) {
        return this.http.Get(this.urlApi+"/servicerequest/" + id).map((response: Response) => response);
    }
    getByIdForApproval(id: any,userId :any) {
        return this.http.Get(this.urlApi+"/id/"+id+"/userId/" + userId).map((response: Response) => response);
    }
    create(country: any) {
        return this.http.Post(this.urlApi+"/servicerequests", country).map((response: Response) => response);
    }
    approval(model: any) {
        return this.http.Post(this.urlApi+"/servicerequests/approval", model).map((response: Response) => response);
    }
    update(model: any) {
        return this.http.Put(this.urlApi+"/servicerequests", model).map((response: Response) => response);
    }
    delete(model: any) {
        return this.http.Put(this.urlApi+"/servicerequests/delete" ,model).map((response: Response) => response);
    }
    exportPdf(id: any) {
        return this.http.Get(this.urlApi+"/report/" + id).map((response: Response) => response);
    }
    updateComment(model:any)
    {
        return this.http.Put(this.urlApi+"/detail/update", model).map((response: Response) => response);
    }
    stationaryReport(model: any) 
    {
        return this.http.Post(this.urlApi+"/stationary/report", model).map((response: Response) => response);
    }
}