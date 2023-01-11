import { Injectable } from "@angular/core";
import { ApplicationHttpClient } from "./_base/http-client";

@Injectable()
export class AssetGroupService
{
    urlAPI:string;
    constructor
    (
        private httpClient:ApplicationHttpClient
    )
    {
        this.urlAPI=httpClient._urlAPI+"/assetgroupservice";

    }
    getassetgroup()
    {
        return this.httpClient.Get(this.urlAPI + '/assetgroups').map((response: Response) => response);
    }
    insertassetgroup(model:any)
    {
        return this.httpClient.Post(this.urlAPI + '/assetgroupinsert',model).map((reponse:Response) => reponse);
    }
    updateassetgroup(model:any)
    {
        return this.httpClient.Put(this.urlAPI + '/assetgroupupdate',model).map((response:Response)=>response);
    }
    deleteassetgroup(model:any)
    {
        return this.httpClient.Put(this.urlAPI + '/assetgroupdelete',model).map((response:Response)=> response);
    }
}