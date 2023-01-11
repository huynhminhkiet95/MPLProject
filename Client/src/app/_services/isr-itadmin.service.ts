import { Injectable } from '@angular/core';
import { ApplicationHttpClient } from './_base/http-client';

@Injectable()
export class ISRITAdminService {

    private urlAPI: string;

    constructor(private http: ApplicationHttpClient) {
        this.urlAPI = http._urlAPI + "/isritadminservice";
    }

    getAllITAdmin() {
        return this.http.Post(this.urlAPI + '/isritadmins', '').map((response: Response) => response);
    }

    insertITAdmin(model: any) {
        return this.http.Post(this.urlAPI + '/isritadmin', model).map((response: Response) => response);
    }

    updateITAdmin(model: any) {
        return this.http.Put(this.urlAPI + '/isritadmin', model).map((response: Response) => response);
    }

    deleteITAdmin(model: any) {
        return this.http.Post(this.urlAPI + '/deleteisritadmin', model).map((response: Response) => response);
    }

    getEmployees(model: any) {
        return this.http.Post(this.urlAPI + '/employeesisritadmin', model).map((response: Response) => response);
    }


}