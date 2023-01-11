import { Injectable } from '@angular/core';
import { ApplicationHttpClient } from './_base/http-client';
import { ExecCallApi } from '../_helpers';

@Injectable()
export class WfRouteService {

  urlAPI: string;

  constructor(
    private execAPI: ExecCallApi
  ) {
    this.urlAPI = 'wfrouteservice';
  }

  getAllWfRouteBySubId(subsidiaryId: string) {
    const _endPoint = `${this.urlAPI}/getallby/${subsidiaryId}`;
    return this.execAPI.getDataApi(_endPoint);
  }

  getListWfRouteByParams(workFlowId: number, subsidiaryId: string) {
    const _endPoint = `${this.urlAPI}/getlistby/${workFlowId}/${subsidiaryId}`;
    return this.execAPI.getDataApi(_endPoint);
  }

  getFlowCondition() {
    const _endPoint = `${this.urlAPI}/getflowcondition`;
    return this.execAPI.getDataApi(_endPoint);
  }

  getWorkFlow() {
    const _endPoint = `${this.urlAPI}/getworkflow`;
    return this.execAPI.getDataApi(_endPoint);
  }

  saveWfRoute(model: any) {
    const _endPoint = `${this.urlAPI}/savewfroute`;
    return this.execAPI.postDataApi(_endPoint, model);
  }

  updatetWfRoute(model: any) {
    const _endPoint = `${this.urlAPI}/updatewfroute`;
    return this.execAPI.postDataApi(_endPoint, model);
  }

  deleteWfRoute(model: any) {
    const _endPoint = `${this.urlAPI}/deletewfroute`;
    return this.execAPI.postDataApi(_endPoint, model);
  }
}