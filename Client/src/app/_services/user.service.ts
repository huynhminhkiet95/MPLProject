import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from "rxjs/Rx"
import { ApplicationHttpClient } from './_base/http-client';
import { ExecCallApi } from '../_helpers';

@Injectable()
export class UserService {

    private urlAPI: string;

    constructor(
        private httpClient: ApplicationHttpClient
        , private execAPI: ExecCallApi
    ) {
        this.urlAPI = 'employeeservice';
    }

    getGenderType() {
        return [{
            "ID": 'M',
            "Name": "Male"
        }, {
            "ID": 'F',
            "Name": "Female"
        }];
    }    

    public handleError = (error: Response) => {
        return Observable.throw(error.statusText)
    }

    getStatusSummary(model: any): any {
        const _endPoint = `${this.urlAPI}/employee/statussummary`;
        return this.execAPI.postDataApi(_endPoint, model);
    }

    updateUserDevice(model: any) {
        const _endPoint = `${this.urlAPI}/updateuser2system`;
        return this.execAPI.putDataApi(_endPoint, model);
    }
}