import { Component, OnInit, ViewChild, NgModule, ViewContainerRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { IdrequestAddComponent } from './idrequest-add/idrequest-add.component'

import { IdRequestService, CommonService, SSOCommonService } from '../../_services/index'
import * as moment from 'moment';
import 'rxjs/add/operator/take';
import { Globalconst } from '../../_helpers/globalvariable';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../_directives/base.component';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { _const } from '../../_helpers/constants';
declare var AdminLTE: any;
@Component({
  selector: 'app-idrequest',
  templateUrl: './idrequest.component.html',
  styleUrls: ['./idrequest.component.css']
})
export class IdrequestComponent extends BaseComponent {

  bsModalRef: BsModalRef;
  listIdRequest: any = [];
  listIDServices: any = [];
  listIDStatus: any = [];
  listGender = [];
  listSubsidiaries: any = [];
  bsValue: Date = new Date();
  bsRangeValue: any = [];
  languages: any = [];
  title = "ID Request";
  checkrole = false;

  constructor(private modalService: BsModalService,
    public router: Router,
    private idRequestSvc: IdRequestService,
    private commonSvc: CommonService,
    private ssoCommonSvc: SSOCommonService,
    private toastr: ToastrService,
    private _global: Globalconst,
    public route: ActivatedRoute
  ) {
    super(router);
    this.languages = this._global._resources || {};
    this.payLoad = _const.API_KEYS.payload;
  }
  searchModel: any = {
    IdrNo: '',
    SubsidiaryId: '',
    idService: '',
    CreateUserName: '',
    status: '',
    employeeId: this._global._userinfo.employeeId
  };

  ngOnInit() {
    AdminLTE.init();
    this.bsRangeValue = [moment().subtract(10, 'days')["_d"], new Date()];

    this.getSubsidiaries();
    this.searchIdRequest();
    this.getStdcodes();
    this.checkrole = this.commonSvc.isAdmin(this._global._userinfo.employeeId);
  }
  openModalWithComponent() {
    this.bsModalRef = this.modalService.show(IdrequestAddComponent, { class: 'modal-lg' });
    this.bsModalRef.content.listGender = this.listGender;
    this.bsModalRef.content.listIDServices = this.listIDServices;
    this.bsModalRef.content.listGender = this.listGender;
    this.bsModalRef.content.title = 'Add new Id Request';
    this.bsModalRef.content.listSubsidiaries = this.listSubsidiaries;
    this.bsModalRef.content.reloadGrid.take(1).subscribe(this.searchIdRequest.bind(this));
  }

  searchIdRequest() {
    if (this.bsRangeValue != null && this.bsRangeValue.length == 2) {
      this.searchModel.CreateDateF = moment(this.bsRangeValue[0]).format('YYYY/MM/DD');
      this.searchModel.CreateDateT = moment(this.bsRangeValue[1]).format('YYYY/MM/DD');
    }
    this.idRequestSvc.searchPage(this.searchModel).subscribe(
      data => {
        this.listIdRequest = data[this.payLoad];
      },
      error => {
      });
  }
  logEvent(event) {

  }
  getStdcodes() {
    this.commonSvc.getStdcodesByCode('IDSERVICE').subscribe(
      data => {
        this.listIDServices = data[this.payLoad];
      }
    );

    this.commonSvc.getStdcodesByCode('EMPSTATUS').subscribe(
      data => {
        this.listIDStatus = data[this.payLoad];
      }
    );
    this.commonSvc.getStdcodesByCode('GENDER').subscribe(
      data => {
        this.listGender = data[this.payLoad];
      }
    );
  }
  deleteidrrequest(key) {
    this.toastr.clear();
    var model: any = {};
    var currentuser = JSON.parse(localStorage.getItem('currentUser')) || {};
    model.ID = key;
    model.User = currentuser.employeeId;

    if (confirm("Are you sure delte this row?")) {
      this.idRequestSvc.deleteidrrequest(model).subscribe(
        data => {
          this.toastr.success("Delete success", "Delete employee");
          this.searchIdRequest();
        },
        error => {
          this.toastr.error(error["message"] ? error["message"] : error);
        }
      )
    }
  }

  private getSubsidiaries() {
    this.ssoCommonSvc.getSubsidiaries().subscribe(
      data => {
        this.listSubsidiaries = data[this.payLoad];
      }
    );
  }
}
