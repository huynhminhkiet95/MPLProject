import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../_directives/base.component';
import { Router } from '@angular/router';
import { SSOCommonService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { ConfiSystemDto } from '../../../../_models/interface/configurationSystemDto';

@Component({
  selector: 'app-configuration-system',
  templateUrl: './configuration-system.component.html',
  styleUrls: ['./configuration-system.component.css']
})
export class ConfigurationSystemComponent extends BaseComponent {

  model:any={};
  constructor(public router:Router,
    public _commonService:SSOCommonService,
    private _toastService: ToastrService,) {
    super(router);
  }

  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this._commonService.getConfiguration("S1", "SYSTEM").subscribe(
      data => {
        this.model = data['payload'];
        this.model.boardisactive=this.model.boardisactive=="false"?false:true;
      });;
  }
  update()
  {
    this.save(this.model);
  }
  save(data:ConfiSystemDto)
  {
      let saveModel: any = [];
      saveModel.push(this.CreateParam("BOARDISACTIVE", data.boardisactive));
      saveModel.push(this.CreateParam("INACTIVEMESSAGE", data.inactivemessage));
      saveModel.push(this.CreateParam("SYSTEMNAME", data.systemname));
      saveModel.push(this.CreateParam("ADDRESS", data.address));
      saveModel.push(this.CreateParam("ADMINISTRATOREMAILADDRESS", data.administratoremailaddress));
      saveModel.push(this.CreateParam("ALERTANDNOTIFYEMAIL", data.alertandnotifyemail));
      saveModel.push(this.CreateParam("DATETIMEFORMAT", data.datetimeformat));
      saveModel.push(this.CreateParam("DEFAULTCURRENCY", data.defaultcurrency));
      saveModel.push(this.CreateParam("FAX", data.fax));
      saveModel.push(this.CreateParam("HOTLINE", data.hotline));
      saveModel.push(this.CreateParam("WORKINGDAY", data.workingday)); 
      saveModel.push(this.CreateParam("EMPCODEPRE", data.empcodepre)); 
      this._commonService.saveConfiguration(saveModel).subscribe(
        data => {
          this._toastService.success("Update configuration sucessfull", "Update Configuration");
        }
      );
  }
  CreateParam(name:string,value:any)
  {
    return {
      "ParaName":name,
      "ParaValue":value,
      "Type":"SYSTEM",
      "SubsidiaryId":"S1"
    }
  }
}
