import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../_directives/base.component';
import { CommonService, EmployeeService, SSOCommonService } from '../../../_services';
import { _const } from '../../../_helpers/constants';

declare var AdminLTE: any;
@Component({
  selector: 'app-division-admin',
  templateUrl: './division-admin.component.html',
  styleUrls: ['./division-admin.component.css']
})

export class DivisionAdminComponent extends BaseComponent {

  dataSource: any = [];
  listUser: any = [];
  listSubsidary: any = [];

  constructor(
    public router: Router
    , private toastr: ToastrService
    , private empSver: EmployeeService
    , private ssoCommonSvc: SSOCommonService
  ) {
    super(router);
  }

  ngOnInit() {
    AdminLTE.init();
    
    let empModel: any = {};
    empModel.EmployeeName = "";
    empModel.Mobile = "";
    empModel.Subsidary = "";
    empModel.Division = "";
    empModel.Department = "";

    this.getDivision();
    this.getSubsidiaries();
    this.getListEmployee(empModel);
  }

  private getDivision() {
    this.ssoCommonSvc.getDivision().subscribe(
      data => {
        this.dataSource = data[this.payLoad];
      });
  }

  onEditorPreparing(e) {
    if (e.parentType === "dataRow" && e.dataField === "divisionCode") {
      if (e.row.inserted == true)
        e.editorOptions.disabled = false;
      else
        e.editorOptions.disabled = true;
    }
  }

  saveDivision(eventName, IsSubmit) {
    let model: any;

    if (IsSubmit == 1) { // add
      model = eventName.data;
      model.IsSubmit = 1;
    } else if (IsSubmit == 2 || IsSubmit == 3) { //2 = update , 3 = delete

      if (IsSubmit == 2)
        model = Object.assign({}, eventName.oldData, eventName.newData);
      else {
        model = eventName.data;
        model.isUse = 0;
      }

      model.IsSubmit = 2;
    }

    this.saveDivisionData(model, IsSubmit);
  }

  private saveDivisionData(model: any, action: number): void {
    this.ssoCommonSvc.saveDivision(model).subscribe(
      data => {
        if (data[this.payLoad] > 0) {
          if (action == 1)
            this.toastr.success(_const.NOTIFICATIONS.save_success, "Insert Division");
          else
            this.toastr.success(_const.NOTIFICATIONS.update_success, "Update Division");
        }
        else if (data[this.payLoad] == -1)
          this.toastr.error("Update failed !", "Update Division");
      },
      error => {
        this.toastr.error(error[this.message] ? error[this.message] : error);
      }
    );
  }

  private getListEmployee(model: any) {
    this.empSver.search(model).subscribe(
      data => {
        this.listUser = data[this.payLoad];
      },
      error => {
      }
    );
  }

  private getSubsidiaries() {
    this.ssoCommonSvc.getSubsidiaries().subscribe(
      data => {
        this.listSubsidary = data[this.payLoad];
      }
    );
  }
}
