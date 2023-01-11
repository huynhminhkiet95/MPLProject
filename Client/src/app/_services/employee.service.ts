import { Injectable } from '@angular/core';
import { ApplicationHttpClient } from './_base/http-client';
import { ExecCallApi } from '../_helpers';

@Injectable()
export class EmployeeService {

    urlAPI: string;
    urlAPIEmployee: string;

    constructor(
        private httpClient: ApplicationHttpClient
        , private execAPI: ExecCallApi
    ) {
        this.urlAPI = `${httpClient._urlAPI}/employeeservice`;
        this.urlAPIEmployee = 'employeeservice'
    }

    search(model: any) {
        const endPoint = `${this.urlAPIEmployee}/employee/search`;
        return this.execAPI.postDataApi(endPoint, model);
    }

    getAllEmployee(model: any) {
        const endPoint = `${this.urlAPIEmployee}/employee/getallemployee`;
        return this.execAPI.postDataApi(endPoint, model);
    }

    getEmployeeDetailById(empId: number) {
        const endPoint = `${this.urlAPIEmployee}/employee/detail/${empId}`;
        return this.execAPI.getDataApi(endPoint);
    }

    getListByDevision(model: any) {
        const endPoint = `${this.urlAPIEmployee}/employee/division`;
        return this.execAPI.postDataApi(endPoint, model);
    }

    updateUserId(_models: any) {
        return this.httpClient.Put(this.urlAPI + '/employee/updateuserid', _models).map((response: Response) => response);
    }

    getemployeepermission(employeeid: number) {
        return this.httpClient.Get(this.urlAPI + '/employeepermission/' + employeeid).map((response: Response) => response);
    }

    employeepermissiondelete(_model: any) {
        return this.httpClient.Post(this.urlAPI + '/employeepermission/delete', _model).map((response: Response) => response);
    }

    employeepermissionadd(_model: any) {
        return this.httpClient.Post(this.urlAPI + '/employeepermission/add', _model).map((response: Response) => response);
    }

    checkuserid(userid: string) {
        return this.httpClient.Get(this.urlAPI + '/employee/checkuserid/' + userid).map((response: Response) => response);
    }

    getExtenalAccount(userId: number) {
        const endPoint = `${this.urlAPIEmployee}/employee/externalaccount/${userId}`;
        return this.execAPI.getDataApi(endPoint);
    }

    getExtenalAccountByEmpIdType(userId: number, type: string) {
        const endPoint = `${this.urlAPIEmployee}/employee/externalaccount/${userId}/${type}`;
        return this.execAPI.getDataApi(endPoint);
    }

    saveExternalAccount(model: any) {
        const endPoint = `${this.urlAPIEmployee}/employee/externalaccount/save`;
        return this.execAPI.postDataApi(endPoint, model);
    }

    searchOndesk(division: string, filterType: string) {
        const endPoint = `${this.urlAPIEmployee}/ondesk/${division}/${filterType}`;
        return this.execAPI.getDataApi(endPoint);
    }

    getTimesheetByEmployeeId(employeeId: string) {
        const endPoint = `${this.urlAPIEmployee}/employeetimesheet/getbyempid/${employeeId}`;
        return this.execAPI.getDataApi(endPoint);
    }

    saveTimesheetEmployee(model: any) {
        const endPoint = `${this.urlAPIEmployee}/timesheet/save`;
        return this.execAPI.postDataApi(endPoint, model);
    }

    getNewEmployee() {
        const endPoint = `${this.urlAPIEmployee}/employeenew`;
        return this.execAPI.getDataApi(endPoint);
    }

    exportEmployees(model: any) {
        const endPoint = `${this.urlAPIEmployee}/employee/export`;
        return this.execAPI.postDataApi(endPoint, model);
    }

    async getEmployeeForAddNew(model: any): Promise<any> {
        const endPoint = `${this.urlAPIEmployee}/employeeaddnew`;
        return await this.execAPI.postAsyncDataApi(endPoint, model);
        // return this.httpClient.Post(this.urlAPI + '/employeeaddnew', model).toPromise();
    }

    getItAdmin(relatedITsvc: string) {
        const endPoint = `${this.urlAPIEmployee}/itadmin/${relatedITsvc}`;
        return this.execAPI.getDataApi(endPoint);
    }
}