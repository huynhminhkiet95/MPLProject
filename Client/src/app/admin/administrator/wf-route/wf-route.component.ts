import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../_directives/base.component';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../_services';
import { Router } from '@angular/router';
import { WfRouteService } from '../../../_services/wf-route.service';
import { _const } from '../../../_helpers/constants';
import { Helpers } from '../../../_helpers/helpers';

declare var AdminLTE: any;
@Component({
  selector: 'app-wf-route',
  templateUrl: './wf-route.component.html',
  styleUrls: ['./wf-route.component.css']
})

export class WfRouteComponent extends BaseComponent {

  private subsidiaryId: string;

  dataSource: any = [];
  listRoleCode: any = [];
  listconditionType: any = [];
  listNameRole: any = [];
  listWorkflowID: any = [];
  searchModel: any = {};

  constructor(
    public router: Router
    , private toastr: ToastrService
    , private wfrouteSvc: WfRouteService
    , private commonSvc: CommonService
  ) {
    super(router);
  }

  ngOnInit() {
    this.subsidiaryId = this.currentuser.subsidiaryId;

    this.getStdCodes();
    this.getWfRouteBySubId(this.subsidiaryId);
    this.getDataWorkFlow();
    this.getDataFlowCondition();

    AdminLTE.init();
  }

  getListWfRoute(workFlowId: number) {
    if (Helpers.isNumber(workFlowId))
      this.wfrouteSvc.getListWfRouteByParams(workFlowId, this.subsidiaryId).subscribe(
        data => {
          this.formatBeforeRender(data);
        });
  }

  onEditorPreparing(e) {
    if (e.parentType === "dataRow" && e.dataField === "wkid" || e.dataField === "itemNo") {
      if (e.row && e.row.inserted == true)
        e.editorOptions.disabled = false;
      else
        e.editorOptions.disabled = true;
    }
  }

  saveWfRoute(e) {
    let model: any = e.data;

    this.wfrouteSvc.saveWfRoute(model).subscribe(
      data => {
        if (data[this.payLoad] > 0)
          this.toastr.success(_const.NOTIFICATIONS.save_success, "Insert Work flow Route");
        else
          this.toastr.error(_const.NOTIFICATIONS.save_fail, "Insert Work flow Route");
      },
      error => {
        this.toastr.error(error[this.message] ? error[this.message] : error);
      }
    )
  }

  updatetWfRoute(eventName: any) {
    let model = Object.assign({}, eventName.oldData, eventName.newData);

    this.wfrouteSvc.updatetWfRoute(model).subscribe(
      data => {
        if (data[this.payLoad] > 0)
          this.toastr.success(_const.NOTIFICATIONS.update_success, "Update Work flow Route");
        else
          this.toastr.error(_const.NOTIFICATIONS.update_fail, "Update Work flow Route");
      },
      error => {
        this.toastr.error(error[this.message] ? error[this.message] : error);
      }
    )
  }

  deletewfroute(eventName) {
    let model = eventName.data;

    this.wfrouteSvc.deleteWfRoute(model).subscribe(
      data => {
        if (data[this.payLoad] > 0) {
          this.toastr.success(_const.NOTIFICATIONS.delete_success, "Delete Work flow Route");
        }
        else {
          this.toastr.error(_const.NOTIFICATIONS.delete_fail, "Deleted Work flow Route");
        }
      },
      error => {
        this.toastr.error(error[this.message] ? error[this.message] : error);
      }
    )
  }

  private getStdCodes() {
    this.commonSvc.getStdcodesByCode(`${_const.CODE_TYPE.doc_reply_type},${_const.CODE_TYPE.wk_name_drole}`).subscribe(
      data => {
        const arrStdCode = data[this.payLoad];

        this.listNameRole = arrStdCode.filter((x) => {
          return x.codeType == _const.CODE_TYPE.wk_name_drole;
        });

        this.listRoleCode = arrStdCode.filter((x) => {
          return x.codeType == _const.CODE_TYPE.doc_reply_type;
        });
      }
    );
  }

  private getWfRouteBySubId(subsidiaryId: string) {
    if (!Helpers.isNullOrEmpty(subsidiaryId)) {
      this.wfrouteSvc.getAllWfRouteBySubId(subsidiaryId).subscribe(
        data => {
          this.formatBeforeRender(data);
        });
    }
    else
      this.toastr.error(_const.NOTIFICATIONS.get_subsidiary_error, 'Get WfRoute');
  }

  private getDataWorkFlow() {
    this.wfrouteSvc.getWorkFlow().subscribe(
      data => {
        this.listWorkflowID = data[this.payLoad];
      });
  }

  private getDataFlowCondition() {
    this.wfrouteSvc.getFlowCondition().subscribe(
      data => {
        this.listconditionType = data[this.payLoad];
      });
  }

  private formatBeforeRender(wfData: any) {
    // Check data API result
    if (Helpers.checkObjAPIsReturn(wfData))
      this.dataSource = Helpers.sortBy(wfData[this.payLoad], 'wkid', 'seqNo', 'workFlowDesc');
  }
}