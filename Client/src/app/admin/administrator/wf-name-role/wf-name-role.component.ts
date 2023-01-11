import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../_directives/base.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService, EmployeeService, SSOCommonService } from '../../../_services';
import { _const } from '../../../_helpers/constants';
import { WfNameRoleService } from '../../../_services/wf-name-role.service';

declare var AdminLTE: any;
@Component({
  selector: 'app-wf-name-role',
  templateUrl: './wf-name-role.component.html',
  styleUrls: ['./wf-name-role.component.css']
})

export class WfNameRoleComponent extends BaseComponent {

  dataSource: any = [];
  listSubsidary: any = {};
  listNameRole: any = {};
  listDivision: any = {};
  listDepartments: any = {};
  listusers: any = {};
  listGroup: any = {};

  constructor(
    public router: Router,
    public toastr: ToastrService,
    public commonSvc: CommonService,
    public wfnameroleSv: WfNameRoleService,
    public empSver: EmployeeService,
    private ssoCommonSvc: SSOCommonService
  ) {
    super(router);
  }

  ngOnInit() {
    AdminLTE.init();
    this.getnamerole();
    this.LoadDataInit();
  }

  LoadDataInit() {

    this.getSubsidiaries();
    this.getDivisions();
    this.getDataDepartments();

    this.commonSvc.getStdcodesByCode('WKNAMEDROLE').subscribe(
      data => {
        this.listNameRole = data["payload"];
      }
    );
    this.commonSvc.getStdcodesByCode('DOCREPLYTYPE').subscribe(
      data => {
        this.listGroup = data["payload"];
      }
    );

    let empModel: any = {};
    empModel.EmployeeName = "";
    empModel.Mobile = "";
    empModel.Subsidary = "";
    empModel.Division = "";
    empModel.Department = "";
    this.empSver.search(empModel).subscribe(
      data => {
        this.listusers = data["payload"];
      }
      , error => {
      }
    );
  }

  getnamerole() {
    this.wfnameroleSv.getNameRole().subscribe(
      data => {
        this.dataSource = data["payload"];
      });
  }

  insertnamedrole(e) {
    let model: any = e.data;
    this.wfnameroleSv.insertnamedrole(model).subscribe(
      data => {
        if (data["payload"] > 0) {
          this.toastr.success("Insert successfuly", "Insert Name Role");
        }
        else {
          this.toastr.error("Error: This data already exists !!", "Insert Name Role");
        }
      },
      error => {
        this.toastr.error(error["message"] ? error["message"] : error);
      }
    );
  }

  updatenamedrole(eventName) {
    let model = Object.assign({}, eventName.oldData, eventName.newData);
    this.wfnameroleSv.updatenamedrole(model).subscribe(
      data => {
        if (data["payload"] > 0) {
          this.toastr.success("Updated successfuly", "Updated Name Role");
        }
      },
      error => {
        this.toastr.error(error["message"] ? error["message"] : error);
      });
  }

  deletenamerole(eventName) {
    let model = eventName.data;
    this.wfnameroleSv.deletenamerole(model).subscribe(
      data => {
        if (data["payload"] > 0) {
          this.toastr.success("Deleted successfuly", "Deleted Name Role");
        }
      },
      error => {
        this.toastr.error(error["message"] ? error["message"] : error);
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

  private getDataDepartments() {
    this.ssoCommonSvc.getDepartments().subscribe(
      data => {
        this.listDepartments = data[this.payLoad];
      }
    )
  }
}