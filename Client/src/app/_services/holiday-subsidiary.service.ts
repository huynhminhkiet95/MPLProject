import { Injectable } from '@angular/core';
import { ExecCallApi } from '../_helpers';

@Injectable()
export class HolidaySubsidiary {

  urlAPI: string;

  constructor(
    private execAPI: ExecCallApi
  ) {
    this.urlAPI = 'subsidiaryholiday';
  }

  search(model: any) {
    const _endPoint = `${this.urlAPI}/search`;
    return this.execAPI.postDataApi(_endPoint, model);
  }
  
  add(model: any) {
    const _endPoint = `${this.urlAPI}/insert`;
    return this.execAPI.postDataApi(_endPoint, model);
  }

  update(model: any) {
    const _endPoint = `${this.urlAPI}/update`;
    return this.execAPI.putDataApi(_endPoint, model);
  }

  delete(id: number) {
    const _endPoint = `${this.urlAPI}/delete/${id}`;
    return this.execAPI.deleteDataApi(_endPoint);
  }
}
