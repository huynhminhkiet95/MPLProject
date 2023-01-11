import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { ApplicationHttpClient } from './_base/http-client';
@Injectable()
export class TimesheetService {
    constructor(private httpClient: ApplicationHttpClient) { }

    search(_models: any) {
        return this.httpClient.Post(environment.urlAPIService + '/timesheetservice/timesheets', _models).map((response: Response) => response);
    }

    exportExcel(_models: any) {
        return this.httpClient.Post(environment.urlAPIService + '/timesheetservice/timesheets/export/excel', _models).map((response: Response) => response);
    }
    exportPdf(_models: any) {
        return this.httpClient.Post(environment.urlAPIService + '/timesheetservice/timesheets/export/pdf', _models).map((response: Response) => response);
    }
    SearchForExport(_models: any) {
        return this.httpClient.Post(environment.urlAPIService + '/timesheetservice/timesheets/export', _models).map((response: Response) => response);
    }

    update(_models: any) {
        return this.httpClient.Put(environment.urlAPIService + '/timesheetservice/timesheet', _models).map((response: Response) => response);
    }

    approval(_models: any) {
        return this.httpClient.Post(environment.urlAPIService + '/timesheetservice/timesheet/approval', _models).map((response: Response) => response);
    }
    searchtimesheetapproval(_model: any) {
        return this.httpClient.Post(environment.urlAPIService + '/timesheetservice/timesheetapproval', _model).map((response: Response) => response);

    }
    getHistoryDetail(_model: any) {
        return this.httpClient.Post(environment.urlAPIService + '/timesheetservice/timesheets/detail/employee', _model).map((response: Response) => response);
    }
}