import { Injectable } from '@angular/core';
import { ApplicationHttpClient } from './_base/http-client';

@Injectable()
export class WfNameRoleService {
  urlAPI: string;

  constructor(
    private httpClient: ApplicationHttpClient

  ) {
    this.urlAPI = httpClient._urlAPI + "/wfnameroleservice";
  }
  
  getNameRole() {
    return this.httpClient.Get(this.urlAPI + "/getnamerole").map((response: Response) => response);
  }

  insertnamedrole(model: any) {
    return this.httpClient.Post(this.urlAPI + "/insertnamedrole", model).map((response: Response) => response);
  }

  updatenamedrole(model: any) {
    return this.httpClient.Post(this.urlAPI + "/updatenamedrole", model).map((response: Response) => response);
  }

  deletenamerole(model: any) {
    return this.httpClient.Post(this.urlAPI + "/deletenamerole", model).map((response: Response) => response);
  }

  getsubsidiary() {
    return this.httpClient.Get(this.urlAPI + "/getsubsidiary").map((response: Response) => response);
  }

  getdivision() {
    return this.httpClient.Get(this.urlAPI + "/getdivision").map((response: Response) => response);
  }
}
