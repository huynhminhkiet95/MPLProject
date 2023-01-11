import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { CommonService, TimesheetService, UserService, EmployeeService, FileService, SSOCommonService } from '../../../_services/index'
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/operator/take';
import { Globalconst } from '../../../_helpers';
import { TimesheetDetailComponent } from '../timesheet-detail/timesheet-detail.component'
import { TimesheetApprovalComponent } from '../timesheet-approval/timesheet-approval.component'
import { CheckInOutDetailComponent } from '../check-in-out-detail/check-in-out-detail.component';
import { _const } from '../../../_helpers/constants';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../_directives/base.component';
declare var AdminLTE: any;

@Component({
  selector: 'app-announce',
  templateUrl: './timesheet-report.component.html',
  styleUrls: ['./timesheet-report.component.css']
})
export class TimesheetReportComponent extends BaseComponent {

  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  searchModel: any = {};
  bsModalRef: BsModalRef;
  title = "";
  bsRangeValue: any = [];
  dataSource: any = {};
  listEmployee: any = [];
  listDivision: any = [];
  listusers: any = [];
  listusers2: any = [];
  listSubsidiary: any = [];
  listSubsidiary2: any = [];
  departments: any = [];
  departments2: any = [];
  IsManualUpdate: boolean = false;
  IsCheckTime: boolean = false;
  IsStatusEmployee: boolean = false;
  IsManualPost: string;
  EmployeeIdSelected: number;
  listTimesheetType: any = [];
  updateTimeshtBsModalRef: BsModalRef;
  listWorkingLocation: any = [];

  constructor(
    public router: Router
    , private modalService: BsModalService
    , private commonSvc: CommonService
    , private timesheetSvc: TimesheetService
    , private ssoCommonSvc: SSOCommonService
    , private empSver: EmployeeService
    , public globals: Globalconst
    , public svcFile: FileService
    , public toastService: ToastrService
    , private fileSvc: FileService
  ) {
    super(router);
  }

  ngOnInit() {
    const subsidiaryId = this.currentuser.subsidiaryId;
    this.searchModel.subsidiary = "";
    this.searchModel.division = "";
    this.searchModel.DeptCode = "";
    this.searchModel.subsidiary = this.globals._userinfo.subsidiaryId;

    AdminLTE.init();
    this.getSubsidiaries();
    this.getDivisions();
    this.getSubDepts(subsidiaryId);
    this.getStdcodes();

    this.bsRangeValue = [moment().subtract(10, 'days')["_d"], new Date()];
    this.searchModel.status = '';
    this.searchModel.userId = this.globals._userinfo.employeeId;
    this.searchModel.SubmitDateF = moment(this.bsRangeValue[0]).format('YYYY/MM/DD');
    this.searchModel.SubmitDateT = moment(this.bsRangeValue[1]).format('YYYY/MM/DD');
  }

  search() {
    if (this.IsManualUpdate == true) {
      this.searchModel.IsManualPost = '1';
    }
    else {
      this.searchModel.IsManualPost = '0';
    }
    if (this.IsCheckTime == true) {
      this.searchModel.IsCheckTime = '1';
    }
    else {
      this.searchModel.IsCheckTime = '0';
    }
    if (this.bsRangeValue != null && this.bsRangeValue.length == 2) {
      this.searchModel.SubmitDateF = moment(this.bsRangeValue[0]).format('YYYY/MM/DD');
      this.searchModel.SubmitDateT = moment(this.bsRangeValue[1]).format('YYYY/MM/DD');
    }

    // if (this.dataGrid.instance) {
    //   this.dataGrid.instance.refresh();
    // }
    this.timesheetSvc.SearchForExport(this.searchModel).subscribe(
      data => {
        this.dataSource = data[this.payLoad];

        for (let index = 0; index < this.dataSource.length; index++) {
          this.dataSource[index].createDateFormat = this.commonSvc.convertDate(this.dataSource[index].createDate);
          this.dataSource[index].startTimeFormat = this.commonSvc.convertTime(this.dataSource[index].startTime);
          this.dataSource[index].endTimeFormat = this.commonSvc.convertTime(this.dataSource[index].endTime);
          this.dataSource[index].originalStartTimeFormat = this.commonSvc.convertTime(this.dataSource[index].originalStartTime);
          this.dataSource[index].originalEndTimeFormat = this.commonSvc.convertTime(this.dataSource[index].originalEndTime);
          this.dataSource[index].updateDate = this.commonSvc.convertMilisecondToUTCDateTime2(this.dataSource[index].updateDate);
        }
      }
    );
  }
  exportExcel() {
    this.timesheetSvc.exportExcel(this.searchModel).subscribe(
      data => {
        this.svcFile.downloadExcel(data[this.payLoad], "Timesheet_Report.xlsx");
      }
    );
  }
  openModalWithComponent(model) {

    let newCourse = Object.assign({}, model.data);

    const initialState = {
      model: newCourse,
      title: this.languages.updateworktime
    };

    let employeeId = this.globals._userinfo.employeeId;
    if (employeeId === model.data.employeeId && model.data.tsStatus === "NEW") {
      this.bsModalRef = this.modalService.show(TimesheetDetailComponent, Object.assign({}, { class: 'modal-lg', initialState }));
      //this.bsModalRef.content.listStatus=this.listTimesheetType;
    }
    else {
      this.bsModalRef = this.modalService.show(TimesheetApprovalComponent, Object.assign({}, { class: 'modal-lg', initialState }));
    }
    this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
    this.bsModalRef.content.title = this.languages.updateworktime
  }

  getStdcodes() {
    this.getAllEmployee();

    this.commonSvc.getStdcodesByCode(_const.CODE_TYPE.tspost_type).subscribe(
      data => {
        let resultData = data[this.payLoad];
        this.listTimesheetType = resultData.filter(function (x) {
          return x.codeType == _const.CODE_TYPE.tspost_type;
        });
      }
    );

    this.commonSvc.getWorkLoc().subscribe(
      data => {
        this.listWorkingLocation = data[this.payLoad];
      }
    );
  }

  getAllEmployee() {
    let empModel: any = {};
    empModel.EmployeeName = "";
    empModel.Mobile = "";
    empModel.Subsidary = this.searchModel.subsidiary;
    empModel.Division = this.searchModel.division;
    empModel.Department = this.searchModel.DeptCode;
    empModel.IsLeftEmployee = this.IsStatusEmployee == false ? "" : "Y";
    this.empSver.getAllEmployee(empModel).subscribe(
      data => {
        this.listusers = data[this.payLoad];
        this.listusers2 = data[this.payLoad];
      }
      , error => {
      }
    );
  }

  changedDivision() {
    let divisionCode = this.searchModel.division;
    if (divisionCode && divisionCode != '') {
      this.departments2 = this.departments.filter(function (x) {
        return x.divisionCode == divisionCode;
      });
    }
    else {
      this.departments2 = [];
    }
    this.getAllEmployee();
  }
  changedDepartment() {
    let departmentCode = this.searchModel.DeptCode;
    if (departmentCode && departmentCode != '') {
      this.listusers2 = this.listusers.filter(function (x) {
        return x.deptCode == departmentCode;
      });
    }
    else {
      this.listusers2 = [];
    }
    this.getAllEmployee();
  }

  changedSudidiary() {
    let subsidiaryId = this.searchModel.subsidiary;
    if (subsidiaryId && subsidiaryId != '') {
      this.listSubsidiary2 = this.listSubsidiary.filter(function (x) {
        return x.subsidiaryId == subsidiaryId;
      });
    }
    else {
      this.listSubsidiary2 = this.listSubsidiary;
    }
  }

  convertLocalTime(localtime) {
    if (localtime) {
      var localTime1 = moment.utc(localtime);
      return moment(localTime1).format('HH:mm');
    }
    return "00:00";
  }

  convertDateTime(localtime) {
    var localTime1 = moment.utc(localtime);
    return moment(localTime1).format('DD/MM/YYYY');
  }
  printPdf() {
    this.toastService.info("Downloading...", "Print Report");
    let param: any = {};
    if (this.listusers.length > 0) {
      let employee = this.listusers.find(x => x.employeeId == this.searchModel.employeeId);
      param.employeeId = this.searchModel.employeeId;
      param.EmployeeName = employee.employeeName;
      param.DeptCode = this.searchModel.DeptCode;
      param.Division = this.searchModel.division;
      param.deptDesc = employee.deptDesc;
      param.divisionDesc = employee.divisionDesc;
      param.SubmitDateF = this.searchModel.SubmitDateF;
      param.SubmitDateT = this.searchModel.SubmitDateT;
      param.userId = this.searchModel.employeeId;
      param.IsCheckTime = 0;
      param.status = "";
    }
    param.Subsidiary = this.globals._userinfo.subsidiaryName;
    this.timesheetSvc.exportPdf(param).subscribe(
      data => {
        this.toastService.clear();
        this.fileSvc.downloadExcel(data[this.payLoad], 'TSReport' + moment().format("YYYYMMDDHHmmss") + '.pdf');
      }
    );
  }
  viewHistory(model) {
    var param = { employeeId: model.employeeId, SubmitDateF: moment(model.createDateFormat, 'DD/MM/YYYY').format('MM/DD/YYYY') };
    this.timesheetSvc.getHistoryDetail(param).subscribe(
      data => {
        let newCourse = Object.assign({}, model);
        const initialState = {
          model: newCourse,
          title: "Timesheet history of " + model.employeeName + ' at ' + moment(model.createDateFormat, 'DD/MM/YYYY').format('DD/MM/YYYY'),
          data: data[this.payLoad]
        };
        this.bsModalRef = this.modalService.show(CheckInOutDetailComponent, Object.assign({}, { class: 'modal-lg', initialState }));
      }
    );
  }

  openEditTimesheetModalWithComponent(model) {
    model.data.selectedType = this.listTimesheetType[0];
    let newCourse = Object.assign({}, model.data);

    const initialState = {
      model: newCourse,
      title: this.languages.updateworktime
    };

    //let employeeId = this._global._userinfo.employeeId;
    if (model.data.tsStatus === "NEW") {
      this.updateTimeshtBsModalRef = this.modalService.show(TimesheetDetailComponent, Object.assign({}, { class: 'modal-lg', initialState }));
      this.updateTimeshtBsModalRef.content.listStatus = this.listTimesheetType;
    }

    // else {
    //   this.bsModalRef = this.modalService.show(TimesheetApprovalComponent, Object.assign({}, { class: 'modal-lg', initialState }));
    // }

    this.updateTimeshtBsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
    this.updateTimeshtBsModalRef.content.title = this.languages.updateworktime
  }

  private getSubsidiaries() {
    this.ssoCommonSvc.getSubsidiaries().subscribe(
      data => {
        this.listSubsidiary = data[this.payLoad];
        this.listSubsidiary2 = data[this.payLoad];
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

  private getSubDepts(sub: string): any {
    this.ssoCommonSvc.getSubDepts(sub).subscribe(
      data => {
        this.departments = data[this.payLoad];
      }
    );
  }
}