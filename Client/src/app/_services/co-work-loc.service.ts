import { Injectable } from '@angular/core';
import { ApplicationHttpClient } from './_base/http-client';
import { debug } from 'util';

@Injectable()
export class COWorkLocService {
    private urlAPI: string;

    constructor(private http: ApplicationHttpClient) {
        this.urlAPI = http._urlAPI + "/coworklocservice";
    }

    getAllCoWorkLoc(workType) {
        return this.http.Post(this.urlAPI + '/coworklocs/'+workType, '').map((response: Response) => response);
    }

    insertCoWorkLoc(model: any) {
        return this.http.Post(this.urlAPI + '/coworkloc', model).map((response: Response) => response);
    }

    updateCoWorkLoc(model: any) {
        return this.http.Put(this.urlAPI + '/coworkloc', model).map((response: Response) => response);
    }

    deleteCoWorkLoc(model: any) {
        return this.http.Post(this.urlAPI + '/deletecoworkloc', model).map((response: Response) => response);
    }

}