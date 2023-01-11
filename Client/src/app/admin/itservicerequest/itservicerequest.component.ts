import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { ItServiceModel } from '../../_models/index'
import { ItServiceRequest, CommonService, SSOCommonService } from '../../_services/index'
import { ItservicerequestAddComponent } from './itservicerequest-add/itservicerequest-add.component'
import * as moment from 'moment';
import 'rxjs/add/operator/take';
import { Globalconst } from '../../_helpers/globalvariable';
import { ToastrService } from 'ngx-toastr';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../_directives/base.component';
import { confirm } from 'devextreme/ui/dialog';
import { _const } from '../../_helpers/constants';
declare var AdminLTE: any;

@Component({
  selector: 'app-itservicerequest',
  templateUrl: './itservicerequest.component.html',
  styleUrls: ['./itservicerequest.component.css']
})
export class ItservicerequestComponent extends BaseComponent {

  // @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  searchModel = new ItServiceModel;
  bsModalRef: BsModalRef;
  listIdRequest: any[] = [];
  minDate = new Date(2018, 1, 1);
  title = "Service Request";
  maxDate = new Date();
  listItSvcStatus: any = [];
  listItServices: any = [];
  listServiceTypes: any = [];
  listPrioritys: any = [];
  bsValue: Date = new Date();
  bsRangeValue: any = [];
  dataSource: any = {};
  listSubsidiaries: any = [];
  self: any;
  checkrole: any = false;
  current: any = {};
  paras: any = {};
  IsRoleID: boolean = false;
  pageIndex: any = 0;
  pageSize: number = 10;

  constructor(
    public itServiceSvc: ItServiceRequest
    , private toastr: ToastrService
    , private ssoCommonSvc: SSOCommonService
    , private modalService: BsModalService
    , private commonSvc: CommonService
    , private _global: Globalconst
    , public router: Router
    , public route: ActivatedRoute
  ) {
    super(router);
  }

  ngOnInit() {
    if (this.currentuser.roleId == _const.APP_CONFIG.default_role_id)
      this.IsRoleID = true;

    AdminLTE.init();
    this.bsRangeValue = [moment().subtract(30, 'days')["_d"], new Date()];
    this.searchModel = {
      "Details": '',
      "ISRNo": '',
      "ITService": '',
      "PostDateF": '01-01-2017',
      "PostDateT": '01-01-2018',
      "SvcType": '',
      "CreateUserName": '',
      "Subject": '',
      "SubsidiaryId": '',
      "Subsidiary": '',
      "Status": '',
      "ServiceType": '',
      "CreatedUser": '',
      "SkipRecord": 0,
      "TakeRecord": 20,
      "SortColumn": 'ISRNo',
      "SortOrder": 'ASC',
      "employeeId": this._global._userinfo.employeeId
    }
    if (Object.keys(this.route.snapshot["queryParams"]).length > 0) {
      this.searchModel.ISRNo = this.route.snapshot.queryParams["ISRNo"];
      this.searchModel.ITService = this.route.snapshot.queryParams["ITService"];
      this.searchModel.PostDateF = this.route.snapshot.queryParams["PostDateF"];
      this.searchModel.PostDateT = this.route.snapshot.queryParams["PostDateT"];
      this.searchModel.SvcType = this.route.snapshot.queryParams["SvcType"];
      this.searchModel.CreateUserName = this.route.snapshot.queryParams["CreateUserName"];
      this.searchModel.Subject = this.route.snapshot.queryParams["Subject"];
      this.searchModel.SubsidiaryId = this.route.snapshot.queryParams["SubsidiaryId"];
      this.searchModel.Status = this.route.snapshot.queryParams["Status"];
      this.searchModel.SkipRecord = this.route.snapshot.queryParams["SkipRecord"];
      this.searchModel.TakeRecord = this.route.snapshot.queryParams["TakeRecord"];
      this.searchModel.SortColumn = this.route.snapshot.queryParams["SortColumn"];
      this.searchModel.SortOrder = this.route.snapshot.queryParams["SortOrder"];
      this.searchModel.employeeId = this.route.snapshot.queryParams["employeeId"];
      this.pageSize = Number(this.route.snapshot.queryParams["pageSize"]);
      this.pageIndex = Number(this.route.snapshot.queryParams["pageIndex"]);
      this.bsRangeValue = [new Date(this.searchModel.PostDateF), new Date(this.searchModel.PostDateT)];
    }

    this.searchIdRequest();
    this.getSubsidiaries();
    this.getStdcodes();
    this.checkrole = this.commonSvc.isAdmin(this._global._userinfo.employeeId);
  }

  searchIdRequest() {
    if (this.bsRangeValue != null && this.bsRangeValue.length == 2) {
      this.searchModel.PostDateF = moment(this.bsRangeValue[0]).format('YYYY/MM/DD');
      this.searchModel.PostDateT = moment(this.bsRangeValue[1]).format('YYYY/MM/DD');
    }
    this.itServiceSvc.search(this.searchModel).subscribe(
      data => {
        this.dataSource = data['payload'];
      }
    );
  }

  openModalWithComponent() {
    this.bsModalRef = this.modalService.show(ItservicerequestAddComponent, { class: 'modal-lg' });
    this.bsModalRef.content
    this.bsModalRef.content.title = 'Add new IT Request';
    this.bsModalRef.content.listItServices = this.listItServices;
    this.bsModalRef.content.listPrioritys = this.listPrioritys;
    this.bsModalRef.content.listServiceTypes = this.listServiceTypes;
    this.bsModalRef.content.listSubsidiaries = this.listSubsidiaries;
    this.bsModalRef.content.reloadGrid.take(1).subscribe(this.searchIdRequest.bind(this));
  }

  getStdcodes() {
    this.commonSvc.getStdcodesByCode(_const.CODE_TYPE.it_service).subscribe(
      data => {
        this.listItServices = data[this.payLoad];
      }
    );

    this.commonSvc.getStdcodesByCode(_const.CODE_TYPE.svc_type).subscribe(
      data => {
        this.listServiceTypes = data[this.payLoad];
      }
    );
    this.commonSvc.getStdcodesByCode(_const.CODE_TYPE.srs_tatus).subscribe(
      data => {
        this.listItSvcStatus = data[this.payLoad];
      }
    );
    this.commonSvc.getStdcodesByCode(_const.CODE_TYPE.priority).subscribe(
      data => {
        this.listPrioritys = data[this.payLoad];
      }
    );
  }

  customSave = (state: any) => {
    for (let item in state) {
      if (item !== "columns" && item !== "allowedPageSizes") delete state[item];
    }
    localStorage.setItem("gridServiceRequest", JSON.stringify(state));
  };

  customLoad = () => {
    return JSON.parse(localStorage.getItem("gridServiceRequest"))
  };

  deleteservicerequest(key) {
    var result = confirm("Are you sure delete this row?", 'Confirm delete');
    result.done((dialogResult: any) => {
      if (dialogResult) {
        var model: any = {};
        model.ISRNo = key;
        model.UserNo = this.currentuser.employeeId;
        
        this.itServiceSvc.deleteservicerequest(model).subscribe(
          data => {
            if (data[this.payLoad] > 0) {
              this.toastr.success("Delete success", "Delete It Service request");
              this.searchIdRequest();
            }
          },
          error => {
            this.toastr.error(error[this.message] ? error[this.message] : error);
          })
      }
    });
  }

  back(id: string) {
    // console.log(this.dataGrid);
    // this.dataGrid.instance.columnOption("srSubject", "sortOrder", 'desc');
    let querypara: any = this.searchModel;
    querypara.pageIndex = this.dataGrid.instance["_options"].paging.pageIndex === undefined ? 0 : this.dataGrid.instance["_options"].paging.pageIndex;
    querypara.pageSize = this.dataGrid.instance["_options"].paging.pageSize === undefined ? 0 : this.dataGrid.instance["_options"].paging.pageSize;
    this.router.navigate(['intranet/itservicerequest/' + id], { queryParams: querypara })
  }

  private getSubsidiaries() {
    this.ssoCommonSvc.getSubsidiaries().subscribe(
      data => {
        this.listSubsidiaries = data[this.payLoad];
      }
    );
  }
}