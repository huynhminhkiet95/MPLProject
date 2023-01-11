import { Component, ViewChild } from '@angular/core';
import { CommonService } from '../../_services/common.service';
import CustomStore from 'devextreme/data/custom_store';
import { StdCodeService } from '../../_services/stdcode.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import { _const } from '../../_helpers/constants';
import { BaseComponent } from '../../_directives/base.component';
import { Router } from '@angular/router';

declare var AdminLTE: any;

@Component({
  selector: 'app-assetcode',
  templateUrl: './assetcode.component.html',
  styleUrls: ['./assetcode.component.css']
})
export class AssetcodeComponent extends BaseComponent {

  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;

  listcodetype: any = [];
  dataSource: any = {};
  typecode: "";
  title = "";
  searchModel: any = {};
  id: any;

  constructor(
    public router: Router
    , private commonSvc: CommonService
    , private stdCodeSvc: StdCodeService
    , private toastr: ToastrService
  ) {
    super(router);
    this.searchModel.codeType = _const.CODE_TYPE.cpumodel;

    this.dataSource.store = new CustomStore({
      load: (loadOptions) => {
        this.id = this.searchModel.codeType;

        return this.stdCodeSvc.getByCodeType(this.id)
          .toPromise()
          .then(res => {
            return {
              data: res[this.payLoad],
              totalCount: res[this.payLoad][0] ? res[this.payLoad][0].totalCount : 0
            }
          }).catch(error => {
            throw 'Data Loading Error'
          });
      },
    });
  }

  ngOnInit() {
    AdminLTE.init();
    
    this.stdCodeSvc.stdCodeCodeTypes().subscribe(
      data => {
        let datacodetype = data[this.payLoad];
        this.listcodetype = datacodetype.filter(m => m == 'CPUTYPE' || m == 'CPUMODEL' || m == 'OS' || m == 'RAMCAPACITY' || m == 'STORAGETYPE' || m == 'STORAGECAPACITY' || m == 'STORAGEMODEL' || m == 'OSLICENSEVALID' || m == 'ASSETSCREENSIZE');
      }
    );
  }

  search() {
    if (this.dataGrid.instance) {
      this.dataGrid.instance.refresh();
    }
  }

  insertStdCode(eventName) {
    let model = eventName.data;
    model.codeType = this.searchModel.codeType;

    this.stdCodeSvc.insertStdCode(model).subscribe(
      data => {
        if (data[this.payLoad] == 1) {
          this.toastr.success(_const.NOTIFICATIONS.save_success, "Insert StdCode");
          this.dataGrid.instance.refresh();
        }
        else if (data[this.payLoad] == -1) {
          this.toastr.error("This value already exists ! Please enter a different value.", "Insert StdCode");
        }
      },
      error => {
        this.toastr.error(error[this.message] ? error[this.message] : error);
      }
    );
  }

  onEditorPreparing(e) {
    if (e.parentType === "dataRow" && e.dataField === "codeId") {
      if (e.row.inserted == true)
        e.editorOptions.disabled = false;
      else
        e.editorOptions.disabled = true;
    }
  }

  updateStdCode(eventName) {
    eventName.newData.codeType = eventName.newData.codeType == undefined ? eventName.oldData.codeType : eventName.newData.codeType;
    eventName.newData.codeId = eventName.newData.codeId == undefined ? eventName.oldData.codeId : eventName.newData.codeId;
    eventName.newData.codeDesc = eventName.newData.codeDesc == undefined ? eventName.oldData.codeDesc : eventName.newData.codeDesc;
    eventName.newData.numericVariant = eventName.newData.numericVariant == undefined ? eventName.oldData.numericVariant : eventName.newData.numericVariant;
    eventName.newData.tagVariant = eventName.newData.tagVariant == undefined ? eventName.oldData.tagVariant : eventName.newData.tagVariant;
    eventName.newData.seqNo = eventName.newData.seqNo == undefined ? eventName.oldData.seqNo : eventName.newData.seqNo;
    eventName.newData.isUse = eventName.newData.isUse == undefined ? eventName.oldData.isUse : eventName.newData.isUse;

    this.stdCodeSvc.updateStdCode(eventName.newData).subscribe(
      data => {
        if (data[this.payLoad] == 1) {
          this.toastr.success(_const.NOTIFICATIONS.update_success, "Update StdCode");
          this.dataGrid.instance.refresh();
        }
        else if (data[this.payLoad] == -1)
          this.toastr.error(_const.NOTIFICATIONS.update_fail, "Update StdCode");
      },
      error => {
        this.toastr.error(error[this.message] ? error[this.message] : error);
      }
    );
  }
}