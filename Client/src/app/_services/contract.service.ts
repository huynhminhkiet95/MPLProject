import { Injectable } from '@angular/core';
import { ApplicationHttpClient } from './_base/http-client';

@Injectable()
export class ContractService {

  private urlAPI:string;
  constructor(private http: ApplicationHttpClient) { 
      this.urlAPI=http._urlAPI+"/contract";
  }
  search(model:any)
  {
      return this.http.Post(this.urlAPI+'/search',model).map((response: Response) => response);
  }
  insert(model:any)
  {
      return this.http.Post(this.urlAPI,model).map((response: Response) => response);
  }
  update(model:any)
  {
      return this.http.Put(this.urlAPI,model).map((response: Response) => response);
  }
  delete(model:any)
  {
      return this.http.Delete(this.urlAPI+'/'+model.id).map((response: Response) => response);
  }

  SaveeContract(model:any)
  {
      return this.http.Post(this.urlAPI + '/eContract',model).map((response: Response) => response);
  }
  UpdateeContract(model:any)
  {
      return this.http.Put(this.urlAPI + '/eContract',model).map((response: Response) => response);
  }
  getEContract(id:string)
  {
      return this.http.Get(this.urlAPI + '/eContract/'+ id).map((response: Response) => response);
  }
  exportPdfById(id:any)
  {
      return this.http.Get(this.urlAPI + '/exportpdf/'+id).map((response: Response) => response);
  }

  updateStatus(model: any) {
    return this.http.Post(this.urlAPI + '/eContract/updateStatus', model).map((response: Response) => response);
  }

  verifyContract(model: any) {
    return this.http.Post(this.urlAPI + '/eContract/verrify', model).map((response: Response) => response);
  }

}
