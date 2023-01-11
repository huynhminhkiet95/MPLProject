import { Injectable } from '@angular/core';
import { ApplicationHttpClient } from './_base/http-client';
@Injectable()
export class AnnounceService {
    urlAPI:string;
    constructor(private http: ApplicationHttpClient) {
        this.urlAPI=http._urlAPI+"/announceservice";
     }
    search(model: any) {
        return this.http.Post(this.urlAPI+'/announce/search',model)
        .map((response: Response) => response);
    }
    searchForDashboard(model: any) {
        return this.http.Post(this.urlAPI+'/announce/dashboard',model)
        .map((response: Response) => response);
    }
    getById(id: string, employeeId: any) {
        return this.http.Get(this.urlAPI+'/announce/' + id + '/' + employeeId).map((response: Response) => response);
    }

    create(model: any) {
        return this.http.Post(this.urlAPI+'/announce', model).map((response: Response) => response);
    }

    update(model: any) {
        return this.http.Put(this.urlAPI+'/announce', model).map((response: Response) => response);
    }

    delete(model: any) {
        return this.http.Post(this.urlAPI+'/announce/delete',model).map((response: Response) => response);
    }
    getByListId(id: string) {
        return this.http.Get(this.urlAPI+'/announces/' + id).map((response: Response) => response);
    }
}