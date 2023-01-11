import { Injectable } from '@angular/core';
import { UpdateEmpRequisitionModel, EmpRequisitionSearch, EmpRequisitionEntry, ApprovalEmpRequisitionModel } from '../_models/index';
import { ExecCallApi } from '../_helpers';

@Injectable()
export class EmpRequisitionService {

    private urlAPI: string;

    constructor(
        private execAPI: ExecCallApi
    ) {
        this.urlAPI = 'employeerequisitionservice';
    }

    getEmpRequisitionDetail(empReqId: string, userId: string) {
        const _endPoint = `${this.urlAPI}/emprequisitionDetail/${empReqId}/userid/${userId}`;
        return this.execAPI.getDataApi(_endPoint);
    }

    getEmpRequisition(model: EmpRequisitionSearch) {
        const _endPoint = `${this.urlAPI}/emprequisitions`;
        return this.execAPI.postDataApi(_endPoint, model);
    }

    getEmpRequisitionsForApproval(model: EmpRequisitionSearch) {
        const _endPoint = `${this.urlAPI}/emprequisitionsforapproval`;
        return this.execAPI.postDataApi(_endPoint, model);
    }

    createEmpRequisition(model: EmpRequisitionEntry) {
        const _endPoint = `${this.urlAPI}/saveemprequisition`;
        return this.execAPI.postDataApi(_endPoint, model);
    }

    approveEmpRequisition(model: ApprovalEmpRequisitionModel) {
        const _endPoint = `${this.urlAPI}/approvalemprequisition`;
        return this.execAPI.postDataApi(_endPoint, model);
    }

    updateEmprequisition(model: UpdateEmpRequisitionModel) {
        const _endPoint = `${this.urlAPI}/updateemprequisition`;
        return this.execAPI.postDataApi(_endPoint, model);
    }

    deleteEmprequisition(empReqId: string, userId: string) {
        const _endPoint = `${this.urlAPI}/deleteemprequisition/${empReqId}/userid/${userId}`;
        return this.execAPI.getDataApi(_endPoint);
    }
}