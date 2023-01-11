import { Injectable } from '@angular/core';
import { ApplicationHttpClient } from './_base/http-client';
import { ExecCallApi } from '../_helpers';

@Injectable()
export class HtsDevicesService {

  private urlAPI: string;

  constructor(
    private execAPI: ExecCallApi
  ) {
    this.urlAPI = 'devices';
  }

  getAll() {
    const endPoint = `${this.urlAPI}/getall`;
    return this.execAPI.getDataApi(endPoint);
  }

  insert(model: any) {
    const endPoint = `${this.urlAPI}/insert`;
    return this.execAPI.postDataApi(endPoint, model);
  }

  update(model: any) {
    const endPoint = `${this.urlAPI}/update`;
    return this.execAPI.putDataApi(endPoint, model);
  }
}