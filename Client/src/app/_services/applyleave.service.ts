import { Injectable } from '@angular/core';
import { LeaveSearch, LeaveModel } from '../_models/index';
import { ExecCallApi } from '../_helpers';

@Injectable()
export class ApplyLeaveService {

    private urlAPI: string;
    
    constructor(private execAPI: ExecCallApi) {
        this.urlAPI = 'leaveservice';
    }

    searchPage(model: LeaveSearch) {
        const _endPoint = `${this.urlAPI}/leaves`;
        return this.execAPI.postDataApi(_endPoint, model);
    }

    searchApprovalList(model: LeaveSearch) {
        const _endPoint = `${this.urlAPI}/leaves/approvallist`;
        return this.execAPI.postDataApi(_endPoint, model);
    }

    getById(userId: number, id: String) {
        const _endPoint = `${this.urlAPI}/leave/${userId}/lvid/${id}`;
        return this.execAPI.getDataApi(_endPoint);
    }

    create(model: LeaveModel) {
        const _endPoint = `${this.urlAPI}/save`;
        return this.execAPI.postDataApi(_endPoint, model);
    }

    update(model: LeaveModel) {
        const _endPoint = `${this.urlAPI}/update`;
        return this.execAPI.postDataApi(_endPoint, model);
    }

    approval(model: any) {
        const _endPoint = `${this.urlAPI}/leave/approval`;
        return this.execAPI.postDataApi(_endPoint, model);
    }

    delete(userid: number, id: String) {
        const _endPoint = `${this.urlAPI}/delete/${userid}/lvid/${id}`;
        return this.execAPI.deleteDataApi(_endPoint);
    }

    cancel(model: any) {
        const _endPoint = `${this.urlAPI}/cancel`;
        return this.execAPI.postDataApi(_endPoint, model);
    }

    searchReport(model: any) {
        const _endPoint = `${this.urlAPI}/leaves/report`;
        return this.execAPI.postDataApi(_endPoint, model);
    }

    getReport(model: any) {
        const _endPoint = `${this.urlAPI}/leaves/export`;
        return this.execAPI.postDataApi(_endPoint, model);
    }

    getDivisionleave(model: any) {
        const _endPoint = `${this.urlAPI}/getleavesdashboard`;
        return this.execAPI.postDataApi(_endPoint, model);
    }

    getLeaveentitles(employeeid: number, year: string) {
        const _endPoint = `${this.urlAPI}/getleaveentitles/${employeeid}/${year}`;
        return this.execAPI.getDataApi(_endPoint);
    }

    saveLeaveEntitle(model: any) {
        const _endPoint = `${this.urlAPI}/saveleaveentitle`;
        return this.execAPI.postDataApi(_endPoint, model);
    }

    searchLeaveEntitle(model: any) {
        const _endPoint = `${this.urlAPI}/leaveentitle/seach`;
        return this.execAPI.postDataApi(_endPoint, model);
    }

    searchHolidays(model: any) {
        const _endPoint = `${this.urlAPI}/subsholiday/seach`;
        return this.execAPI.postDataApi(_endPoint, model);
    }
    /**
     * Get data leave entitle report
     * @param leaveMonth format yyyyMM 202003
     * @param divisionCode 
     * @param deptCode 
     */
    getLeaveEntitleReport(leaveMonth: string, divisionCode: string, deptCode: string) {
        const _endPoint = `${this.urlAPI}/getleaveentitlereport/${leaveMonth}/${divisionCode}/${deptCode}`;
        return this.execAPI.getDataApi(_endPoint);
    }
}