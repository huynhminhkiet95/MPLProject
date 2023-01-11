import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { BaseComponent } from '../../_directives/base.component';
import { CommonService, ServiceRequestService, SSOCommonService } from '../../_services/index'
import * as moment from 'moment';
import 'rxjs/add/operator/take';
import { Globalconst } from '../../_helpers/globalvariable'
import { Router, ActivatedRoute } from '@angular/router';
import { _const } from '../../_helpers/constants';

declare var AdminLTE: any;
declare var $: any;

@Component({
  selector: 'app-application-approval',
  templateUrl: './application-approval.component.html',
  styleUrls: ['./application-approval.component.css']
})
export class ApplicationApprovalComponent extends BaseComponent {

  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  searchModel: any = {};
  bsModalRef: BsModalRef;
  listIdRequest: any[] = [];
  statusList: any = [];
  minDate = new Date(2018, 1, 1);
  title = "Service Approval";
  maxDate = new Date();
  listServiceTypes: any = [];
  bsValue: Date = new Date();
  bsRangeValue: any = [];
  dataSource: any = [];
  listSubsidiaries: any = [];
  self: any;
  events: Array<string> = [];
  listCostcenter: any = [];

  constructor(
    private commonSvc: CommonService
    , private serviceSvc: ServiceRequestService
    , public router: Router
    , private route: ActivatedRoute
    , private ssoCommonSvc: SSOCommonService
  ) {
    super(router);
  }

  ngOnInit() {
    this.bsRangeValue = [moment().subtract(3, 'month')["_d"], new Date()];
    this.getStdcodes();
    this.searchModel.Type = '0';
    this.searchModel.isPending = 1;
    this.searchModel.CostCenter = '';
    
    if (Object.keys(this.route.snapshot["queryParams"]).length > 0) {
      this.searchModel.Type = this.route.snapshot.queryParams["Type"];
      this.searchModel.Status = this.route.snapshot.queryParams["Status"];
      this.searchModel.CostCenter = this.route.snapshot.queryParams["CostCenter"];
      this.searchModel.isPending = this.route.snapshot.queryParams["isPending"] == 'false' ? false : true;//this.route.snapshot.queryParams["isPending"];
      this.bsRangeValue = [new Date(this.route.snapshot.queryParams["SubmitDateF"]), new Date(this.route.snapshot.queryParams["SubmitDateT"])];
    }

    AdminLTE.init();
    this.getSubsidiaries();
    this.search();
  }

  getStdcodes() {
    this.commonSvc.getApplications().subscribe(
      data => {
        var list = data[this.payLoad];
        this.listServiceTypes = list.filter(function (x) {
          return x.appGroup == 'SVR';
        });
      }
    );

    this.commonSvc.getStdcodesByCode(_const.CODE_TYPE.docgen_status).subscribe(
      data => {
        this.statusList = data[this.payLoad].filter(function (x) {
          return x.codeId != 'DRAF';
        });
      }
    );
    
    this.commonSvc.getStdcodesByCode(_const.CODE_TYPE.cost_center).subscribe(
      data => {
        this.listCostcenter = data[this.payLoad];
      });
  }

  search() {
    this.searchModel.UserId = this.currentuser.employeeId;
    this.searchModel.SubmitDateF = moment(this.bsRangeValue[0]).format(_const.DATE_FORMAT.yyyymmdd);
    this.searchModel.SubmitDateT = moment(this.bsRangeValue[1]).format(_const.DATE_FORMAT.yyyymmdd);
    this.serviceSvc.ApprovalList(this.searchModel).subscribe(
      data => {
        this.dataSource = data[this.payLoad];
      },
      error => {
      }
    )
  }

  approvaldetail(value: any) {
    this.router.navigate(['intranet/application/approval/' + value], { queryParams: this.searchModel });
  }

  private getSubsidiaries() {
    this.ssoCommonSvc.getSubsidiaries().subscribe(
      data => {
        this.listSubsidiaries = data[this.payLoad];
      }
    );
  }
}
