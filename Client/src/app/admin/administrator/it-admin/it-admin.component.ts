import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../_directives/base.component';
import { CommonService, SSOCommonService } from '../../../_services';
import { ISRITAdminService } from '../../../_services/isr-itadmin.service';
import { ModalDirective } from 'ngx-bootstrap';
import { _const } from '../../../_helpers/constants';

declare var AdminLTE: any;
@Component({
  selector: 'app-it-admin',
  templateUrl: './it-admin.component.html',
  styleUrls: ['./it-admin.component.css']
})

export class ItAdminComponent extends BaseComponent {

  private subsidiaryId: string = '';

  dataSource: any = [];
  listEmployees: any = [];
  listEmployees1: any = [];
  listITServices: any = [];
  itAminModel: any = {
    itadmin: '',
    relatedITSvc: ''
  };
  devisions: any = [];
  departments: any = [];
  departments2: any = [];
  currentItAdmin: any = [];
  divisionCode: any;
  deptCode: any;
  tao: any
  @ViewChild('childModal') itAdminModal: ModalDirective;

  constructor(
    public router: Router
    , private toastr: ToastrService
    , private commonsv: CommonService
    , private ssoCommonSvc: SSOCommonService
    , private itAdminSvc: ISRITAdminService
  ) {
    super(router);
  }

  ngOnInit() {
    this.subsidiaryId = this.currentuser.subsidiaryId;

    AdminLTE.init();
    this.getITAdmins();
    this.loadInitData();
  }

  getITAdmins() {
    this.itAdminSvc.getAllITAdmin().subscribe(
      data => {
        this.dataSource = data[this.payLoad];
        this.currentItAdmin = this.dataSource.map(function (itadmin) {
          return itadmin.itAdmin;
        });
    });
  }

  loadInitData() {
    this.commonsv.getStdcodesByCode(_const.CODE_TYPE.it_service).subscribe(
      data => {
        this.listITServices = data[this.payLoad];
      }
    );

    this.itAdminSvc.getEmployees({ divisionCode: '', deptCode: '' }).subscribe(
      data => {
        this.listEmployees = data[this.payLoad];
      }
    );

    this.getDivisions();
    this.getSubDepts(this.subsidiaryId);
  }

  onEditorPreparing(e) {
    if (e.parentType === "dataRow" && e.dataField === "itAdmin") {
      if (e.row.inserted == true) {
        e.editorOptions.disabled = false;
      }
      else {
        e.editorOptions.disabled = true;
      }
    }
  }

  saveITAdmin() {
    if (this.itAminModel.itadmin == '' || this.itAminModel.itadmin == undefined || this.itAminModel.itadmin == 0) {
      this.toastr.info("IT Admin can not be NULL", "Insert IT Admin");
      return;
    }

    if (this.itAminModel.relatedITSvc == '' || this.itAminModel.relatedITSvc == undefined || this.itAminModel.relatedITSvc == 0) {
      this.toastr.info("Related Service can not be NULL", "Insert IT Admin");
      return;
    }

    this.itAdminSvc.insertITAdmin(this.itAminModel).subscribe(
      data => {
        if (data[this.payLoad] > 0) {
          this.toastr.success("Insert Successfuly", "Insert IT Admin");
          this.getITAdmins();
          this.itAminModel.itadmin = '';
          this.itAminModel.relatedITSvc == ''
          this.hideModal();
        }
        else {
          this.toastr.error("Error: Insert Failed !!", "Insert IT Admin");
        }
      },
      error => {
        this.toastr.error(error["message"] ? error["message"] : error);
      }
    );
  }

  deleteITAdmin(event) {
    let model = event.data;

    this.itAdminSvc.deleteITAdmin(model).subscribe(
      data => {
        if (data[this.payLoad] > 0) {
          this.toastr.success("Delete Successfuly", " Delete IT Admin");
        }
      },
      error => {
        this.toastr.error(error["message"] ? error["message"] : error);
      });
  }

  updateITAdmin(event) {
    let model = Object.assign({}, event.oldData, event.newData);

    this.itAdminSvc.updateITAdmin(model).subscribe(
      data => {
        if (data[this.payLoad] > 0) {
          this.toastr.success("Updated Successfuly", "Updated IT Admin");
        } else {
          this.toastr.warning("Updated Failed", "Updated IT Admin");
        }
        this.getITAdmins();
      },
      error => {
        this.toastr.error(error["message"] ? error["message"] : error);
      });
  }

  addNewITAdmin() {
    this.itAdminModal.show();
    var that = this;

    this.listEmployees1 = this.listEmployees.filter(
      function (empl) {
          return empl;
      }
    );

    this.deptCode = '';
    this.filterEmployees(this.divisionCode, '');
  }

  changedDivision() {
    let divisionCode = this.divisionCode;

    if (divisionCode && divisionCode != '') {
      this.filterEmployees(divisionCode, '');

      this.departments2 = this.departments.filter(function (x) {
        return x.divisionCode == divisionCode;
      });
    }
    else {
      this.filterEmployees(divisionCode, '');
      this.departments2 = this.departments;
    }
  }

  changedDepartment() {
    let department = this.deptCode;

    if (department == '') {
      this.filterEmployees(this.divisionCode, department);
    } else this.filterEmployees('', department);
  }

  filterEmployees(divisionCode, department) {
    var that = this;

    this.listEmployees1 = this.listEmployees.filter(function (empl) {
        if (divisionCode && divisionCode != '') {
          return empl.divisionCode == divisionCode;
        } else if (department && department != '') {
          return empl.deptCode == department;
        } else return empl;
    });

    if (this.listEmployees1.length <= 0) this.itAminModel.itadmin = '';
  }

  hideModal() {
    this.itAdminModal.hide();
  }

  private getDivisions() {
    this.ssoCommonSvc.getDivisions().subscribe(
      data => {
        this.devisions = data[this.payLoad];
      }
    );
  }

  private getSubDepts(sub: string): any {
    this.ssoCommonSvc.getSubDepts(sub).subscribe(
      data => {
        this.departments = data[this.payLoad];
        this.departments2 = this.departments;
      }
    );
  }
}