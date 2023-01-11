import { Component, ViewChild } from '@angular/core';
import { BaseComponent } from '../../_directives/base.component';
import { Router } from '@angular/router';
import { CommonService } from '../../_services/common.service'
import { EmployeeService, SSOCommonService, SSOUserProfileService } from '../../_services';
import { DxDataGridComponent } from 'devextreme-angular';
import { ModalDirective } from 'ngx-bootstrap/modal';

declare var AdminLTE: any;
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})

export class DepartmentComponent extends BaseComponent {
  
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent
  @ViewChild('childModal') editModal: ModalDirective;
  title = this.languages.department || 'Department';
  dataSource = [];
  listEmp = [];
  editModel: any = {};

  constructor(public router: Router
    , public commonsvc: CommonService
    , private empSvc: EmployeeService
    , private ssoUserProfileSvc: SSOUserProfileService
    , private ssoCommonSvc: SSOCommonService
  ) {
    super(router);
  }

  ngOnInit() {
    AdminLTE.init();
    setTimeout(() => {
      this.getDepartment();
    }, 300);
    AdminLTE.init();
  }

  private getDepartment() {
    this.ssoCommonSvc.getDepartmentAdmin().subscribe(
      data => {
        //console.log(data)
        this.dataSource = data[this.payLoad];
      });
  }


  onEditorPreparing(e) {
    if (e.parentType === "dataRow" && e.dataField === "codeId") {
      if (e.row.inserted == true) {
        e.editorOptions.disabled = false;
      }
      else {
        e.editorOptions.disabled = true;
      }
    }
  }

  edit(model: any) {
    this.editModel = model;
    this.editModel.hoDeptEmployeeId = this.editModel.employeeId;
    let paras: any = {};
    paras.employeeName = '';
    paras.mobile = '';
    paras.subsidary = 'S1';
    paras.division = model.divisionCode;
    paras.department = "";

    this.empSvc.search(paras).subscribe(
      data => {
        this.listEmp = data[this.payLoad];
        this.editModal.show();
      },
      error => {
      }
    );
  }

  hideModal() {
    this.editModal.hide();
  }

  updateSubDept() {
    this.editModel.subsidiaryId = 'S1';

    this.ssoUserProfileSvc.updateSubDept(this.editModel).subscribe(
      data => {
        if (data[this.payLoad]) {
          let item = this.listEmp.find(x => x.employeeId === this.editModel.hoDeptEmployeeId);
          if (item) {
            this.editModel.employeeName = item.employeeName;
          }
          this.editModal.hide();
        }
      }
    );
  }
}