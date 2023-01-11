import { Component } from '@angular/core';
import * as moment from 'moment';
import { SSOCommonService, ApplyLeaveService } from '../../../_services';
import { BaseComponent } from '../../../_directives/base.component';
import { Router } from '@angular/router';
import { _const } from '../../../_helpers/constants';
import { Helpers } from '../../../_helpers/helpers';
import { ToastrService } from 'ngx-toastr';

declare var AdminLTE: any;
@Component({
  selector: 'app-leave-entitle-report',
  templateUrl: './leave-entitle-report.component.html',
  styleUrls: ['./leave-entitle-report.component.css']
})

export class LeaveEntitleReportComponent extends BaseComponent {

  dataSource: any = [];
  maxDateValue: any;
  leaveMonth: any;
  listDivision: any = [];
  listDepartment: any = [];
  searchModel: any = {};

  constructor(
    public router: Router
    , private ssoCommonSvc: SSOCommonService
    , private appLeaveSvc: ApplyLeaveService
    , private toastrSvc: ToastrService
  ) {
    super(router);
  }

  ngOnInit() {
    this.maxDateValue = moment();
    this.leaveMonth = moment();

    AdminLTE.init();
    this.getDivisions();
    this.getDataDepartments();
  }

  search() {
    this.searchModel.leaveMonth = moment(this.leaveMonth).format(_const.DATE_FORMAT.yyyymm);
    
    if(!this.validateParams(this.searchModel))
      return this.toastrSvc.error('Please select all param!', 'Search Leave Entitle report');

    this.appLeaveSvc.getLeaveEntitleReport(this.searchModel.leaveMonth, this.searchModel.division, this.searchModel.department).subscribe(
      data => {
        this.dataSource = data[this.payLoad];
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
        this.listDepartment = data[this.payLoad];
      }
    )
  }

  private validateParams(params: any): boolean {

    if (Helpers.isNullOrEmpty(params.department))
      params.department = 'all';

    if (!Helpers.isNullOrEmpty(params.leaveMonth) && !Helpers.isNullOrEmpty(params.division))
      return true;

    return false;
  }
}