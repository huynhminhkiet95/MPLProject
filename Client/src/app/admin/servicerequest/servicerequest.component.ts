import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { CommonService, SSOCommonService } from '../../_services/index'
import * as moment from 'moment';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/take';
import { ServiceRequestService } from '../../_services/servicerequest.service';
import { ServicerequestPopupComponent } from './servicerequest-popup/servicerequest-popup.component';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../_directives/base.component';
import { Router } from '@angular/router';
import { confirm } from 'devextreme/ui/dialog';
import { _const } from '../../_helpers/constants';
import { Globalconst } from '../../_helpers';

declare var AdminLTE: any;
@Component({
  selector: 'app-servicerequest',
  templateUrl: './servicerequest.component.html',
  styleUrls: ['./servicerequest.component.css']
})
export class ServicerequestComponent extends BaseComponent {

  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  searchModel: any = {};
  bsModalRef: BsModalRef;
  listStatus: any = [];
  minDate = new Date(2018, 1, 1);
  title = "";
  maxDate = new Date();
  listServiceTypes: any = [];
  bsValue: Date = new Date();
  bsRangeValue: any = [];
  dataSource: any = {};
  listSubsidiaries: any = [];
  self: any;
  events: Array<string> = [];
  IsRoleID: boolean = false;

  constructor(
    private modalService: BsModalService
    , private commonSvc: CommonService
    , private ssoCommonSvc: SSOCommonService
    , private servicereqSvc: ServiceRequestService
    , private toastr: ToastrService
    , public router: Router
  ) {
    super(router);
  }

  ngOnInit() {
    
    if (this.currentuser.roleId == _const.APP_CONFIG.default_role_id)
      this.IsRoleID = true;

    this.title = this.languages.announcement;
    AdminLTE.init();
    this.bsRangeValue = [moment().subtract(1, 'month')["_d"], new Date()];
    this.searchModel.Type = '0';
    this.searchModel.Status = '';
    this.searchModel.UserId = this.currentuser.employeeId;
    this.searchModel.SubmitDateF = moment(this.bsRangeValue[0]).format(_const.DATE_FORMAT.yyyymmdd);
    this.searchModel.SubmitDateT = moment(this.bsRangeValue[1]).format(_const.DATE_FORMAT.yyyymmdd);

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
        return that.servicereqSvc.search(this.searchModel)
          .toPromise()
          .then(res => {
            return {
              data: res[this.payLoad],
              totalCount: res[this.payLoad][0] ? res[this.payLoad][0].totalCount : 0
            }
          }).catch(error => { throw 'Data Loading Error' });
      },
      remove: (key) => {
        return this.servicereqSvc.delete(key)
          .toPromise()
          .then(res => {
            this.dataGrid.instance.refresh();
          });
      }
    });

    this.getSubsidiaries();
    this.getStdcodes();
    //this.search();
  }

  openModalWithComponent() {
    // this.bsModalRef = this.modalService.show(AnnounceDetailComponent,{class: 'modal-lg'});

    this.bsModalRef.content.title = this.languages.addannoucement;
    this.bsModalRef.content.listServiceTypes = this.listServiceTypes;
    this.bsModalRef.content.listSubsidiaries = this.listSubsidiaries;

    let items: any = [];
    this.listSubsidiaries.forEach(element => {
      items.push({ id: element.subsidiaryId, text: element.subsidiaryName });
    });

    if (this.bsModalRef.content.mymultipleSelect)
      this.bsModalRef.content.mymultipleSelect.items = items;

    this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
  }

  search() {
    console.log('HERE')
    if (this.bsRangeValue != null && this.bsRangeValue.length == 2) {
      this.searchModel.SubmitDateF = moment(this.bsRangeValue[0]).format(_const.DATE_FORMAT.yyyymmdd);
      this.searchModel.SubmitDateT = moment(this.bsRangeValue[1]).format(_const.DATE_FORMAT.yyyymmdd);
    }

    if (this.dataGrid.instance)
      this.dataGrid.instance.refresh();
  }

  delete(key) {
    var result = confirm("Are you sure delete this row?", 'Confirm delete');
    result.done((dialogResult: any) => {
      if (dialogResult) {
        var model: any = {};
        model.SVRNo = key;
        model.UpdateUser = this.currentuser.employeeId;

        return this.servicereqSvc.delete(model).subscribe(
          data => {
            if (data[this.payLoad] > 0) {
              this.toastr.success("Delete Successfully", "Delete Service Request");
              this.dataGrid.instance.refresh();
            }
            else {
              this.toastr.error("Error: ", "Delete Service Request");
            }
          },
          error => {
            this.toastr.error("Error: " + error, "Delete Service Request");
          }
        )
      }
    })
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
        this.listStatus = data[this.payLoad];
      }
    );
  }

  popup(valueid: any) {
    const initialState = {
      model: valueid,
      title: this.languages.updateworktime
    }
    this.bsModalRef = this.modalService.show(ServicerequestPopupComponent, {
      class: 'modal-lg', initialState, backdrop: true
    });
  }

  private getSubsidiaries() {
    this.ssoCommonSvc.getSubsidiaries().subscribe(
      data => {
        this.listSubsidiaries = data[this.payLoad];
      }
    );
  }
}