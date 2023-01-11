import { Injectable } from '@angular/core';
import { ApplicationHttpClient } from './_base/http-client';

@Injectable()
export class OnlineTrainingService {
  urlAPI: string;

  constructor(private http: ApplicationHttpClient) {
    this.urlAPI = http._urlAPI + "/onlinetrainingservice";
  }

  search(model: any) {
    return this.http
      .Post(this.urlAPI + "/onlinetraining/search", model)
      .map((response: Response) => response);
  }

  getById(id: string, employeeId: any) {
    return this.http
      .Get(this.urlAPI + "/onlinetraining/" + id + '/' + employeeId)
      .map((response: Response) => response);
  }

  addNewOnlineTraining(model: any) {
    return this.http
      .Post(this.urlAPI + "/onlinetraining", model)
      .map((response: Response) => response);
  }

  update(model: any) {
    return this.http
      .Put(this.urlAPI + "/onlinetraining", model)
      .map((response: Response) => response);
  }

  delete(model: any) {
    return this.http
      .Post(this.urlAPI + "/onlinetraining/delete", model)
      .map((response: Response) => response);
  }
  
}