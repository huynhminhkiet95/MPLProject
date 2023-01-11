import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { ApplicationHttpClient } from './_base/http-client';
import { ExecCallApi } from '../_helpers';

@Injectable()
export class ServiceItemsService {

  private urlApi: string;
  
  constructor(
    private execAPI: ExecCallApi
  ) {
    this.urlApi = 'svritems';
  }

  getAll() {
    const _endPoint = `${this.urlApi}/getall`;
    return this.execAPI.getDataApi(_endPoint);
  }

  saveItems(model: any) {
    const _endPoint = `${this.urlApi}/insert`;
    return this.execAPI.postDataApi(_endPoint, model);
  }

  getBySeviceId(SVRNo: any) {
    const _endPoint = `${this.urlApi}/details/${SVRNo}`;
    return this.execAPI.getDataApi(_endPoint);
  }

  UpdateItems(model: any) {
    const _endPoint = `${this.urlApi}/update`;
    return this.execAPI.postDataApi(_endPoint, model);
  }
}
