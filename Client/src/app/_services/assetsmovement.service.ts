import { Injectable } from '@angular/core';
import { WindowRef } from '../_helpers/windowRef';
import { ApplicationHttpClient } from './_base/http-client';
import { environment } from '../../environments/environment';

@Injectable()
export class AssetsmovementService {
  urlAPI:string;
  constructor(private http: ApplicationHttpClient,
              private window:WindowRef)
    {
      this.urlAPI=http._urlAPI+"/assetsservice";
    }
    search(model:any)
    {
      return this.http.Post(this.urlAPI+"/assetmovements/search",model).map((response: Response) => response);
    }
    searchAsesets(model:any)
    {
      return this.http.Post(this.urlAPI+"/assets/search",model).map((response: Response) => response);
    }
    save(model:any)
    {
      return this.http.Post(this.urlAPI+"/assets",model).map((response: Response) => response);
    }
    saveAssetsMovement(model:any)
    {
      return this.http.Post(this.urlAPI+"/assetsmovement",model).map((response: Response) => response);
    }
    update(model:any)
    {
      return this.http.Put(this.urlAPI+"/assets",model).map((response: Response) => response);
    }
    updateAssetMovement(model:any)
    {
      return this.http.Put(this.urlAPI+"/assetsmovement",model).map((response: Response) => response);
    }
    getAssetGroups()
    {
      return this.http.Get(this.urlAPI+"/assetgroups").map((response: Response) => response);
    }
    getAsset(assetGroup)
    {
      return this.http.Get(this.urlAPI+"/assets/"+assetGroup+"").map((response: Response) => response);
    }
    getAssetById(id:any)
    {
      return this.http.Get(this.urlAPI+"/asset/"+id).map((response: Response) => response);
    }
    deleteasset(model:any)
    {
      return this.http.Put(this.urlAPI+"/assetdelete",model).map((response: Response) => response);
    }
}
