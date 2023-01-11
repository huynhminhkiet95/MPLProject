import { Component, OnInit } from '@angular/core';
import { CommonService, EmployeeService, ApplyLeaveService, SSOCommonService } from '../../_services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LeaveentitlePopupComponent } from './leaveentitle-popup/leaveentitle-popup.component';
import { _const } from '../../_helpers/constants';
import { BaseComponent } from '../../_directives/base.component';
import { Router } from '@angular/router';
import { Helpers } from '../../_helpers/helpers';
import { ToastrService } from 'ngx-toastr';

declare var AdminLTE: any;
@Component({
  selector: 'app-leaveentitle',
  templateUrl: './leaveentitle.component.html',
  styleUrls: ['./leaveentitle.component.css']
})
export class LeaveentitleComponent extends BaseComponent {

  public isDisableAdd: boolean = true;

  listSubsidiaries: any = [];
  listDivision: any = [];
  searchModel: any = {};
  listusers: any = [];
  bsmodalref: BsModalRef
  bsValue: Date = new Date();
  minDate = new Date();
  listyear: any = [];
  dataSource: any = [];
  dataSource1: any = [];
  d = new Date();
  dataSource2: any = [];

  constructor(
    public router: Router
    , private commonSvc: CommonService
    , private ssoCommonSvc: SSOCommonService
    , private empSvc: EmployeeService
    , private bsModalSvc: BsModalService
    , private applyleaveSvc: ApplyLeaveService
    , private toastrSvc: ToastrService
  ) {
    super(router);
  }

  ngOnInit() {
    const _strCode = _const.CODE_TYPE.year;
    AdminLTE.init();
    this.getSubsidiaries();
    this.getDivisions();
    this.getStdCode(_strCode);

    var getyear = this.d.getFullYear();
    this.searchModel.year = getyear.toString();
    this.searchModel.Subsidiary = this.currentuser.subsidiaryId;
    this.searchModel.divisionCode = this.currentuser.divisionCode;
    this.searchModel.viewmode = "Individual Employee";
    this.changeEmployee();
  }

  changeEmployee() {
    let empModel: any = {};
    empModel.EmployeeName = "";
    empModel.Mobile = "";
    empModel.Subsidary = this.searchModel.Subsidiary || '';
    empModel.Division = this.searchModel.divisionCode || '';
    empModel.Department = "";

    this.empSvc.search(empModel).subscribe(
      data => {
        this.listusers = data[this.payLoad];
      }
      , error => {
      }
    );
  }

  OpenPopupAddleaveEntitle() {
    this.bsmodalref = this.bsModalSvc.show(LeaveentitlePopupComponent, { class: 'modal-lg', backdrop: true, ignoreBackdropClick: true });
    this.bsmodalref.content
    this.bsmodalref.content.title = 'Leave Entitle';
    this.bsmodalref.content.employeeId = this.searchModel.employeeId;
    this.bsmodalref.content.year = this.searchModel.year;
    this.bsmodalref.content.reloadGrid.subscribe(this.searchLeaveenTitles.bind(this));
  }

  searchLeaveenTitles() {
    const _employeeId = this.searchModel.employeeId
    , _year = this.searchModel.year;

    if (!Helpers.isNullOrEmpty(_employeeId))
      this.getLeaveenTitles(_employeeId, _year);
    else
      this.toastrSvc.warning('Please select Employee', 'Warning');
  }

  changeDisableBtn() {
    if (!Helpers.isNullOrEmpty(this.searchModel.employeeId))
      this.isDisableAdd = false;

    // if (this.searchModel.employeeId == undefined && this.isDisableAdd == false)
    //   this.isDisableAdd = true;
  }

  private getStdCode(strCode: string) {
    this.commonSvc.getStdcodesByCode(strCode).subscribe(
      data => {
        this.listyear = data[this.payLoad];
      }
    )
  }

  private getLeaveenTitles(employeeId: number, year: string) {
    this.applyleaveSvc.getLeaveentitles(employeeId, year).subscribe(
      data => {
        let model = data[this.payLoad]
        this.dataSource = model.result2;
        this.dataSource1 = model.result1;
        this.dataSource2 = model.leaveUse;
      }
    )
  }  

  private getSubsidiaries() {
    this.ssoCommonSvc.getSubsidiaries().subscribe(
      data => {
        this.listSubsidiaries = data[this.payLoad];
      }
    );
  }

  private getDivisions() {
    this.ssoCommonSvc.getDivisions().subscribe(
      data => {
        this.listDivision = data[_const.API_KEYS.payload];
      }
    );
  }
}