import { Component, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { CommonService, ApplyLeaveService, SSOCommonService } from '../../_services/index'
import * as moment from 'moment';
import 'rxjs/add/operator/take';
import { LeaveSearch } from '../../_models';
import { _const } from '../../_helpers/constants';
import { BaseComponent } from '../../_directives/base.component';
import { Router, ActivatedRoute } from '@angular/router';

declare var AdminLTE: any;
@Component({
  selector: 'app-application-approval',
  templateUrl: './service-approval.component.html',
  styleUrls: ['./service-approval.component.css']
})

export class ServiceApprovalComponent extends BaseComponent {

  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  searchModel: LeaveSearch = new LeaveSearch();
  bsModalRef: BsModalRef;
  listIdRequest: any[] = [];
  statusList: any = [];
  minDate = new Date(2018, 1, 1);
  title = "Application Approval";
  maxDate = new Date();
  listServiceTypes: any = [];
  bsValue: Date = new Date();
  bsRangeValue: any = [];
  dataSource: any = [];
  listSubsidiaries: any = [];
  leavetypes: any = [];
  events: Array<string> = [];

  constructor(
    public router: Router
    , private modalService: BsModalService
    , private commonSvc: CommonService
    , private ssoCommonSvc: SSOCommonService
    , private leaveSvc: ApplyLeaveService
    , private route: ActivatedRoute
  ) {
    super(router)
  }

  ngOnInit() {
    this.bsRangeValue = [moment().subtract(30, 'days')["_d"], new Date()];
    this.searchModel.LeaveType = '';
    this.searchModel.Status = '';
    if (Object.keys(this.route.snapshot["queryParams"]).length > 0) {
      this.searchModel.LeaveType = this.route.snapshot.queryParams["LeaveType"];
      this.searchModel.Status = this.route.snapshot.queryParams["Status"];
      this.bsRangeValue = [moment(this.route.snapshot.queryParams["SubmitDateF"]), moment(this.route.snapshot.queryParams["SubmitDateT"])];
    }
    this.getApplications();
    this.getSubsidiaries();
    this.getStdcodes();
    this.search();
    AdminLTE.init();
  }

  getStdcodes() {
    this.commonSvc.getStdcodesByCode(`${_const.CODE_TYPE.hrleave_type},${_const.CODE_TYPE.docgen_status}`).subscribe(
      data => {
        const arrCodeType = data[this.payLoad];
        this.leavetypes = arrCodeType.filter(x => x.codeType == _const.CODE_TYPE.hrleave_type);
        this.statusList = arrCodeType.filter(x => x.codeType == _const.CODE_TYPE.docgen_status);
      }
    );
  }
  
  search() {
    this.searchModel.UserId = this.currentuser.employeeId;
    this.searchModel.SubmitDateF = moment(this.bsRangeValue[0]).format(_const.DATE_FORMAT.yyyymmdd);
    this.searchModel.SubmitDateT = moment(this.bsRangeValue[1]).format(_const.DATE_FORMAT.yyyymmdd);
    this.leaveSvc.searchApprovalList(this.searchModel).subscribe(
      data => {
        this.dataSource = data[this.payLoad];
      },
      error => {
      }
    )
  }

  private getApplications() {
    this.commonSvc.getApplications().subscribe(
      data => {
        this.listServiceTypes = data[this.payLoad];
      }
    );
  }

  private getSubsidiaries() {
    this.ssoCommonSvc.getSubsidiaries().subscribe(
      data => {
        this.listSubsidiaries = data[this.payLoad];
      }
    );
  }
  detail(value: any) {
    this.router.navigate(['intranet/serviceapproval/' + value], { queryParams: this.searchModel });
  }
}