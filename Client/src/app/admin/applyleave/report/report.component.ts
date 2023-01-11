import { Component, OnInit, ViewChild, EventEmitter, Output, TemplateRef } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { CommonService, UserService, EmployeeService, ApplyLeaveService, FileService, SSOCommonService } from '../../../_services/index'
import * as moment from 'moment';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/take';
import { Globalconst } from '../../../_helpers';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import { confirm } from 'devextreme/ui/dialog';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { _const } from '../../../_helpers/constants';
import { BaseComponent } from '../../../_directives/base.component';
import { Router } from '@angular/router';

declare var AdminLTE: any;
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})

export class ReportComponent extends BaseComponent {

  private 
  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  modalRef: BsModalRef;
  searchModel: any = {};
  listusers: any = [];
  listusers2: any = [];
  loading = false;
  title = "Leave Report";
  listDivision: any = [];
  statuslist: any = [];
  departments: any = [];
  departments2: any = [];
  dataSource: any = {};
  bsRangeValue: any = [];
  lvid: string;
  reasonCancel: string;
  listWorkingLocation: any[];
  @Output() viewDetailUser: EventEmitter<any> = new EventEmitter();

  constructor(
    public router: Router
    , public _global: Globalconst
    , private commonSvc: CommonService
    , private ssoCommonSvc: SSOCommonService
    , private leaveSvc: ApplyLeaveService
    , private toastr: ToastrService
    , private empSver: EmployeeService
    , private fileSvc: FileService
    , public globals: Globalconst
    , private modalService: BsModalService
  ) {
    super(router);
  }

  ngOnInit() {
    const subsidiaryId = this.currentuser.subsidiaryId;
    AdminLTE.init();
    this.getStdcodes();
    this.getDivisions();
    this.getSubDepts(subsidiaryId);

    this.bsRangeValue = [moment().subtract(30, 'days')["_d"], new Date()];
    this.searchModel.status = '';
    //this.searchModel.userId = this._global._userinfo.employeeId;
    this.searchModel.division = 'ISD';

    this.searchModel.SubmitDateF = moment(this.bsRangeValue[0]).format('YYYY/MM/DD');
    this.searchModel.SubmitDateT = moment(this.bsRangeValue[1]).format('YYYY/MM/DD');
    this.dataSource.store = new CustomStore({
      load: (loadOptions) => {
        let that = this;

        this.searchModel.SkipRecord = loadOptions.skip || 0;
        this.searchModel.TakeRecord = loadOptions.take || 12;
        if (loadOptions.sort) {
          this.searchModel.SortColumn = loadOptions.sort[0].selector;
          if (loadOptions.sort[0].desc) {
            this.searchModel.SortOrder = ' desc';
          }
        }
        return that.leaveSvc.searchReport(this.searchModel)
          .toPromise()
          .then(res => {
            return {
              data: res[this.payLoad],
              totalCount: res[this.payLoad][0] ? res[this.payLoad][0].totalCount : 0
            }
          }).catch(error => { throw 'Data Loading Error' });
      },
      remove: (key) => {
        let that = this;
        let model = {
          "userid": that._global._userinfo.employeeId,
          "lvid": key.lvNo
        }
        return that.leaveSvc.cancel(model)
          .toPromise().then(
            data => {
              if (data['success'] && data['payload'] > 0) {
                that.toastr.success("Delete Leave sucessfull", "Delete Leave")
                that.dataGrid.instance.refresh();
              }
              else {
                that.toastr.warning("Delete Leave unsucessfull, only new request can be deleted", "Delete Leave")
              }

            }
          );
      },
    });
  }

  search() {
    if (this.bsRangeValue != null && this.bsRangeValue.length == 2) {
      this.searchModel.SubmitDateF = moment(this.bsRangeValue[0]).format('YYYY/MM/DD');
      this.searchModel.SubmitDateT = moment(this.bsRangeValue[1]).format('YYYY/MM/DD');
    }

    if (this.dataGrid.instance) {
      this.dataGrid.instance.refresh();
    }
  }

  getStdcodes() {

    let empModel: any = {};
    empModel.EmployeeName = "";
    empModel.Mobile = "";
    empModel.Subsidary = "";
    empModel.Division = "";
    empModel.Department = "";

    this.empSver.search(empModel).subscribe(
      data => {
        this.listusers = data[this.payLoad];
        this.listusers2 = data[this.payLoad];
      }
      , error => {

      }
    );

    

    this.commonSvc.getStdcodesByCode(_const.CODE_TYPE.docgen_status).subscribe(
      data => {
        this.statuslist = data[this.payLoad];
      }
    );

    this.commonSvc.getWorkLoc().subscribe(
      data => {
        this.listWorkingLocation = data[this.payLoad];
      },
      error => {

      }
    );
  }

  exportExcel() {
    this.leaveSvc.getReport(this.searchModel).subscribe(
      data => {
        this.fileSvc.downloadExcel(data[this.payLoad], "LeaveReport.xlsx");
      }
    );
  }

  changedDepartment() {

    let code = this.searchModel.department;
    if (code && code != '' && code != '0') {
      this.listusers2 = this.listusers.filter(function (x) {
        return x.deptCode == code;
      });
    }
    else {
      let divisionCode = this.searchModel.division;

      if (divisionCode && divisionCode != '') {
        this.listusers2 = this.listusers.filter(function (x) {
          return x.divisionCode == divisionCode;
        });
      }
      else
        this.listusers2 = this.listusers;
    }
  }

  changedDivision() {

    let divisionCode = this.searchModel.division;
    if (divisionCode && divisionCode != '') {
      this.departments2 = this.departments.filter(function (x) {
        return x.divisionCode == divisionCode;
      });
    }
    else {
      this.departments2 = this.departments;
    }

    this.changedDepartment();
  }

  cancel() {
    if (this.reasonCancel == undefined || this.reasonCancel == '') {

      return;
    }
    let model = {
      "userid": this._global._userinfo.employeeId,
      "lvid": this.lvid,
      "reasonCancel": this.reasonCancel,
    }
    var result = confirm("Are you sure to confirm?", 'Confirm Contract');
    result.done((rs) => {
      if (rs) {

        this.leaveSvc.cancel(model).toPromise().then(
          data => {
            if (data['success'] && data['payload'] > 0) {
              this.toastr.success("Delete Leave sucessfull", "Delete Leave");
              this.modalRef.hide();
              this.dataGrid.instance.refresh();
            }
            else {
              this.toastr.warning("Delete Leave unsucessfull, only new request can be deleted", "Delete Leave")
            }
            this.reasonCancel = '';
          });
      }
    })
  }

  openModal(lvid, template: TemplateRef<any>) {
    this.lvid = lvid;
    this.modalRef = this.modalService.show(template);
  }

  private getDivisions() {
    this.ssoCommonSvc.getDivisions().subscribe(
      data => {
        this.listDivision = data[this.payLoad];
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
