import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { CommonService, TimesheetService, UserService, FileService, EmployeeService } from '../../_services/index'
import * as moment from 'moment';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/take';
import { Globalconst } from '../../_helpers';
import { TimesheetDetailComponent } from './timesheet-detail/timesheet-detail.component'
import { TimesheetApprovalComponent } from './timesheet-approval/timesheet-approval.component'
import { Router } from '../../../../node_modules/@angular/router';
import { ToastrService } from 'ngx-toastr';

declare var AdminLTE: any;

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})

export class TimesheetComponent implements OnInit {

  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  @Output() SendValue = new EventEmitter<string>();
  searchModel: any = {};
  bsModalRef: BsModalRef;
  listIdRequest: any[] = [];
  minDate = new Date(2018, 1, 1);
  title = "";
  maxDate = new Date();
  listTimesheetType: any = [];
  listStatus: any = [];
  bsValue: Date = new Date();
  bsRangeValue: any = [];
  dataSource: any = {};
  listEmployee: any = [];
  languages: any = [];
  InitialState: any;
  Component1Variable: string = "Component1VariableSent";
  IsCheckTime: boolean = false;

  constructor(
    public router: Router
    , private fileSvc: FileService
    , private modalService: BsModalService
    , private _global: Globalconst
    , public toastService: ToastrService
    , private commonSvc: CommonService
    , private timesheetSvc: TimesheetService
    , private userSvc: UserService
    , private empSvc: EmployeeService
  ) {
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
  }

  ngOnInit() {
    
    AdminLTE.init();
    this.getStdcodes();
    
    this.bsRangeValue = [moment().startOf('month'), moment().endOf('month')];
    this.searchModel.status = '';
    this.searchModel.userId = this._global._userinfo.employeeId;
    this.searchModel.employeeId = this._global._userinfo.employeeId;
    this.searchModel.SubmitDateF = moment(this.bsRangeValue[0]).format('YYYY/MM/DD');
    this.searchModel.SubmitDateT = moment(this.bsRangeValue[1]).format('YYYY/MM/DD');

    if (this.IsCheckTime == true) {
      this.searchModel.IsCheckTime = '1';
    }
    else {
      this.searchModel.IsCheckTime = '0';
    }

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
        return that.timesheetSvc.search(this.searchModel)
          .toPromise()
          .then(res => {
            return {
              data: res["payload"],
              totalCount: res["payload"][0] ? res["payload"][0].totalCount : 0
            }
          }).catch(error => { throw 'Data Loading Error' });
      }
    });

  }

  search() {
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

    if (this.dataGrid.instance) {
      this.dataGrid.instance.refresh();
    }
  }
  report() {

    this.toastService.info("Downloading...", "Print Report");

    if (this.listEmployee.length > 0) {
      let employee = this.listEmployee.find(x => x.employeeId == this.searchModel.employeeId);
      this.searchModel.EmployeeName = employee.employeeName;
      this.searchModel.DeptCode = employee.deptDesc;
      this.searchModel.Division = employee.divisionDesc;
    }
    else {
      this.searchModel.EmployeeName = this._global._userinfo.employeeName;
      this.searchModel.DeptCode = this._global._userinfo.deptCode;
      this.searchModel.Division = this._global._userinfo.divisionCode;
    }
    this.searchModel.Subsidiary = this._global._userinfo.subsidiaryName;
    this.searchModel.deptDesc = this._global._userinfo.deptDesc;
    this.searchModel.divisionDesc = this._global._userinfo.divisionDesc;
    this.timesheetSvc.exportPdf(this.searchModel).subscribe(
      data => {
        this.toastService.clear();
        this.fileSvc.downloadExcel(data['payload'], 'TSReport' + moment().format("YYYYMMDDHHmmss") + '.pdf');
      }
    );
  }
  openModalWithComponent(model) {
   
    model.data.selectedType = this.listTimesheetType[0];
    let newCourse = Object.assign({}, model.data);

    const initialState = {
      model: newCourse,
      title: this.languages.updateworktime
    };

    let employeeId = Number.parseInt(this._global._userinfo.employeeId);
    if (employeeId === model.data.employeeId && model.data.tsStatus === "NEW") {
      this.bsModalRef = this.modalService.show(TimesheetDetailComponent, Object.assign({}, { class: 'modal-lg', initialState }));
      this.bsModalRef.content.listStatus = this.listTimesheetType;
    }
    else 
    {
      this.bsModalRef = this.modalService.show(TimesheetApprovalComponent, Object.assign({}, { class: 'modal-lg', initialState }));
    }
    this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
    this.bsModalRef.content.title = this.languages.updateworktime
  }
  getStdcodes() {
    this.commonSvc.getStdcodesByCode('DOCGENSTATUS,TSPOSTTYPE').subscribe(
      data => {
        let resultData = data["payload"];
        this.listStatus = resultData.filter(function (x) {
          return x.codeType == 'DOCGENSTATUS';
        });
        this.listTimesheetType = resultData.filter(function (x) {
          return x.codeType == 'TSPOSTTYPE';
        });
      }
    );

    let usermodel: any = {};
    usermodel.EmployeeName = '';
    usermodel.Mobile = '';
    usermodel.Subsidary = 'S1';
    usermodel.Division = '';
    usermodel.Department = '';
    usermodel.EmployeeId = this._global._userinfo.employeeId;

    this.empSvc.getListByDevision(usermodel).subscribe(
      data => {
        this.listEmployee = data["payload"];
      }
    );
  }

  convertLocalTime(localtime) {
    var localTime1 = moment.utc(localtime);
    return moment(localTime1).format('HH:mm');
  }

  convertDateTime(localtime) {
    var localTime1 = moment.utc(localtime);
    return moment(localTime1).format('DD/MM/YYYY');
  }
  colortimestarttime(date: number) {
    var timedefault = new Date();
    timedefault.setHours(8, 0, 59);
    timedefault.setFullYear(1, 1, 2018);
    var starttime = new Date(date);
    starttime = new Date(starttime.getTime() + ((-420) * 60 * 1000));
    var demo = starttime.getDay()
    if (starttime.getDay() == 0) {
      return 0;
    }
    starttime.setFullYear(1, 1, 2018);
    if (moment(starttime).format('HH:mm') == '00:00') {
      return 1;
    }
    if (starttime > timedefault) {
      return 1;
    }
    else {
      return 0;
    }
  }
  colortimeendtime(date: number) {
    var d = new Date(date);
    var n = d.getDay()
    var endTimeObject = new Date();
    endTimeObject.setHours(17, 29, 59);
    endTimeObject.setFullYear(1, 1, 2018);
    var outTimeObject = new Date(date);

    var outTimeObject = new Date(outTimeObject.getTime() + ((-420) * 60 * 1000));
    var dayofweek = outTimeObject.getDay();

    outTimeObject.setFullYear(1, 1, 2018);
    if (n == 6) {
      endTimeObject.setHours(12, 0, 0);
      if (outTimeObject > endTimeObject) {
        return 1;
      }
      else {
        return 0;
      }
    }
    if (outTimeObject > endTimeObject) {
      return 1;
    }
    else {
      if (dayofweek == 0) {
        return 1;
      }
      return 0;
    }
  }

  formatRow(e) {
    if (e.rowType == 'data') {
      if (e.data.createDate) {
        var day = new Date(e.data.createDate);
        if (day.getDay() == 0) {
          e.rowElement.className = "dx-row dx-data-row dx-row-lines dx-column-lines ts-sunday";
        }
      }
    }
  }
}
