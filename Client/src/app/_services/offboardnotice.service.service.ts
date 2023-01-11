import { Injectable } from '@angular/core';
import { ApplicationHttpClient } from './_base/http-client';

@Injectable()
export class OffboardnoticeServiceService {

  constructor(private _http: ApplicationHttpClient) { }
  save(model)
  {
    return this._http.Post(this._http._urlAPI+`/offboardnotice`,model).map((response:Response)=>{ return response});
  }
  getbyEmpId(id:any)
  {
    return this._http.Get(this._http._urlAPI+`/offboardnotice/empId/${id}`).map((response:Response)=>{ return response});
  }
  getForReport(model)
  {
    return this._http.Post(this._http._urlAPI+`/offboardnotice/report`,model).map((response:Response)=>{ return response});
  }
  getForApproval(model)
  {
    return this._http.Post(this._http._urlAPI+`/offboardnotice/approvals`,model).map((response:Response)=>{ return response});
  }
  getbyId(id:any,empId:any)
  {
    return this._http.Get(this._http._urlAPI+`/offboardnotice/id/${id}/${empId}`).map((response:Response)=>{ return response});
  }
  confirmed(model)
  {
    return this._http.Post(this._http._urlAPI+`/offboardnotice/confirmed`,model).map((response:Response)=>{ return response});
  }
}
