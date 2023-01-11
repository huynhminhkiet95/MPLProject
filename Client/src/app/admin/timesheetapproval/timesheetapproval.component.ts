import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService, UserService, TimesheetService, EmployeeService } from '../../_services';
import { Globalconst } from '../../_helpers';
import * as moment from 'moment';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent } from 'devextreme-angular';
import { TimesheetapprovalPopupComponent } from './timesheetapproval-popup/timesheetapproval-popup.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

declare var AdminLTE: any;

@Component({
  selector: 'app-timesheetapproval',
  templateUrl: './timesheetapproval.component.html',
  styleUrls: ['./timesheetapproval.component.css']
})
export class TimesheetapprovalComponent implements OnInit {
  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;

  languages: any = [];
  listStatus: any = [];
  listTimesheetType: any = [];
  listEmployee: any = [];
  bsRangeValue: any = [];
  searchModel: any = {};
  dataSource: any = {};
  bsModalRef: BsModalRef;

  constructor(
    private commonSvc: CommonService
    , private empSvc: EmployeeService
    , private _global: Globalconst
    , private timesheetSvc: TimesheetService
    , private modalService: BsModalService
  ) {
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
  }

  ngOnInit() {
    this.getStdcodes();
    this.bsRangeValue = [moment().startOf('month'), moment().endOf('month')];
    this.searchModel.status = '';
    this.searchModel.employeeId = '0';

    this.searchModel.userId = this._global._userinfo.employeeId;
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
        return that.timesheetSvc.searchtimesheetapproval(this.searchModel)
          .toPromise()
          .then(res => {
            return {
              data: res["payload"],
              totalCount: res["payload"][0] ? res["payload"][0].totalCount : 0
            }
          }).catch(error => { throw 'Data Loading Error' });
      }
    });
    AdminLTE.init();
  }
  getStdcodes() {
    this.commonSvc.getStdcodesByCode('DOCGENSTATUS,TSPOSTTYPE').subscribe(
      data => {
        let resultData = data["payload"];
        this.listStatus = resultData.filter(function (x) {
          return x.codeType == 'DOCGENSTATUS' && x.codeId != 'DRAF';
        });
        this.listTimesheetType = resultData.filter(function (x) {
          return x.codeType == 'TSPOSTTYPE';
        });
        this.searchModel.status = 'NEW';
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
        this.listEmployee = data["payload"].filter(m => m.employeeId != this._global._userinfo.employeeId);
      }
    );
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
  convertLocalTime(localtime) {
    var localTime1 = moment.utc(localtime);
    return moment(localTime1).format('HH:mm');
  }

  convertDateTime(localtime) {
    var localTime1 = moment.utc(localtime);
    return moment(localTime1).format('DD/MM/YYYY');
  }
  openModalWithComponent(model) {
    model.data.selectedType = this.listTimesheetType[0];
    let newCourse = Object.assign({}, model.data);

    const initialState = {
      model: newCourse,
      title: this.languages.updateworktime
    };

    this.bsModalRef = this.modalService.show(TimesheetapprovalPopupComponent, Object.assign({}, { class: 'modal-lg', initialState }));
    this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
    this.bsModalRef.content.title = this.languages.updateworktime
  }
}
