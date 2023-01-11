import { Injectable } from '@angular/core';
import { ApplicationHttpClient } from './_base/http-client';
import { ExecCallApi } from '../_helpers';

@Injectable()
export class WfUserGroupService {

  private urlAPI: string;

  constructor(
    private execAPI: ExecCallApi
  ) {
    this.urlAPI = 'usergroup';
  }

  getAllUserGroup() {
    const _endPoint = `${this.urlAPI}/getall`;
    return this.execAPI.getDataApi(_endPoint);
  }

  insert(model: any) {
    const _endPoint = `${this.urlAPI}/insert`;
    return this.execAPI.postDataApi(_endPoint, model);
  }

  delete(model: any) {
    const _endPoint = `${this.urlAPI}/delete`;
    return this.execAPI.postDataApi(_endPoint, model);
  }

  getEmployeeUserGroup(groupId: string) {
    const _endPoint = `${this.urlAPI}/getemployeeusergroup/${groupId}`;
    return this.execAPI.getDataApi(_endPoint);
  }
}
