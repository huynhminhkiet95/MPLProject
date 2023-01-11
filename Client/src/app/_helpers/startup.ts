import { HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { SSOCommonService } from "../_services";
import { Globalconst } from "./globalvariable";

@Injectable()
  export class StartupClass
  {
    private http:SSOCommonService
    constructor(private injector: Injector,public _global:Globalconst)
    {
       
        
         
    }
  
    async startup()
    {
        this.http = this.injector.get(SSOCommonService);
        let data =  await this.http.getConfigurationAsysn('S1','GENERATE');
        
        if(data){
            this._global._themeOption=data['payload'];
        }

        let data2 = await this.http.getConfigurationAsysn("S1", "SYSTEM");
        if (data2) {
            this._global._systemOption = data['payload'];
            this._global._systemOption.boardisactive = data['payload'].boardisactive == "false" ? false : true;
        }
    }
  }