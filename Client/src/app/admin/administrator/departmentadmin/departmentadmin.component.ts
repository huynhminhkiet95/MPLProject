import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../_directives/base.component';
import { EmployeeService, SSOCommonService } from '../../../_services';
import { _const } from '../../../_helpers/constants';

declare var AdminLTE: any
@Component({
  selector: 'app-departmentadmin',
  templateUrl: './departmentadmin.component.html',
  styleUrls: ['./departmentadmin.component.css']
})

export class DepartmentAdminComponent extends BaseComponent {

  listUser: any = [];
  dataSource: any = [];
  listDivision: any = [];
  listSubsidary: any = [];

  constructor(
    public router: Router
    , private toastr: ToastrService
    , public empSver: EmployeeService
    , private ssoCommonSvc: SSOCommonService
  ) {
    super(router);
    this.getFilteredEmployees = this.getFilteredEmployees.bind(this);
    this.getFilteredDept=this.getFilteredDept.bind(this);
  }

  getFilteredEmployees(options) {
    return {
      store: this.listUser,
      filter: options.data ? [["divisionCode", "=", options.data.divisionCode]] : null
    };
  }
  getFilteredDept(options) {
    return {
      store: this.dataSource,
      filter: options.data ? [["divisionCode", "=", options.data.divisionCode]] : null
    };
  }
  setStateValue(rowData: any, value: any): void {
    rowData.CityID = null;
    (<any>this).defaultSetCellValue(rowData, value);
  }

  ngOnInit() {
    
    AdminLTE.init();
    setTimeout(() => {
      this.getDepartmentadmin();
    }, 300);

    this.loadInitGrid();
  }

  private loadInitGrid() {
    let empModel: any = {};
    empModel.EmployeeName = "";
    empModel.Mobile = "";
    empModel.Subsidary = "";
    empModel.Division = "";
    empModel.Department = "";

    this.getSubsidiaries();
    this.getDivisions();
    this.getListEmployee(empModel);
  }

  saveDepartmentAdmin(eventName: any, action: any) {
    let model: any;

    if (action == 1) { // add
      model = eventName.data;
      model.IsSubmit = 1;
    } else if (action == 2 || action == 3) { //2 = update , 3 = delete

      if (action == 2)
        model = Object.assign({}, eventName.oldData, eventName.newData);
      else {
        model = eventName.data;
        model.isUse = 0;
      }

      model.IsSubmit = 2;
    }

    this.saveDeptAdminByData(model, action);
  }

  onEditorPreparing(e) {
    if (e.parentType === "dataRow" && (e.dataField === "deptCode" || e.dataField === "divisionCode" || e.dataField === "subsidiaryId")) {
      if (e.row && e.row.inserted == true)
        e.editorOptions.disabled = false;
      else
        e.editorOptions.disabled = true;
    }
  }

  private getDepartmentadmin() {
    this.ssoCommonSvc.getDepartmentAdmin().subscribe(
      data => {
        console.log(data)
        this.dataSource = data[this.payLoad];
      });
  }

  private getSubsidiaries(): void {
    this.ssoCommonSvc.getSubsidiaries().subscribe(
      data => {
        this.listSubsidary = data[this.payLoad];
      }
    );
  }

  private getDivisions() {
    this.ssoCommonSvc.getDivisions().subscribe(
      data => {
        this.listDivision = data[this.payLoad];
      }
    );
  }

  private saveDeptAdminByData(model: any, action: number): void {
    model.hODeptEmployeeId = model.employeeId;
    if (model.hODeptEmployeeId == undefined || model.hODeptEmployeeId == null) model.hODeptEmployeeId = 0;
    this.ssoCommonSvc.saveDepartmentadmin(model).subscribe(
      data => {
        if (data[this.payLoad] == 1) {
          if (action == 1)
            this.toastr.success(_const.NOTIFICATIONS.save_success, "Save department");
          else
            this.toastr.success(_const.NOTIFICATIONS.save_fail, "Save department");

        } else if (data[this.payLoad] == 2) {
          if (action == 1)
            this.toastr.success(_const.NOTIFICATIONS.save_success, "Update department and SubDept");
          else
            this.toastr.success(_const.NOTIFICATIONS.update_success, "Update department");

        }else if (data[this.payLoad] == -1)
          this.toastr.error(_const.NOTIFICATIONS.update_fail, "Update department");
      },
      error => {
        this.toastr.error(error[this.message] ? error[this.message] : error);
      }
    );
  }

  private getListEmployee(model: any) {
    this.empSver.search(model).subscribe(
      data => {
        // console.log('emp list: ', data)
        this.listUser = data[this.payLoad];
        this.getFilteredEmployees = this.getFilteredEmployees.bind(this);
      }
      , error => {
      }
    );
  }
}