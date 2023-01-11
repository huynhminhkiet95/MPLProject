import { Component, OnInit, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../_directives/base.component';
import { CommonService } from '../../../_services/common.service';
import { StdCodeService } from '../../../_services/stdcode.service';
import { _const } from '../../../_helpers/constants';

declare var AdminLTE: any;

@Component({
  selector: 'app-stdcode',
  templateUrl: './stdcode.component.html',
  styleUrls: ['./stdcode.component.css']
})

export class StdcodeComponent extends BaseComponent {

  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;

  private codeType: string;
  
  listCodeType: any = [];
  dataSource: any = {};
  title = "";
  searchModel: any = {};

  constructor(
    public router: Router
    , private commonSvc: CommonService
    , private stdCodeSvc: StdCodeService
    , private toastr: ToastrService
  ) {
    super(router);
    this.searchModel.codeType = _const.CODE_TYPE.ann_type;

    this.dataSource.store = new CustomStore({
      load: (loadOptions) => {
        this.codeType = this.searchModel.codeType;

        return this.stdCodeSvc.getByCodeType(this.codeType)
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
        this.listCodeType = data[this.payLoad];
      }
    );
  }

  search() {
    if (this.dataGrid.instance)
      this.dataGrid.instance.refresh();
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
        else if (data[this.payLoad] == -1)
          this.toastr.error("This value already exists ! Please enter a different value.", "Insert StdCode");
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

  updateStdCode(eventName: any) {
    const updatedObject = Object.assign({}, eventName.oldData, eventName.newData);
console.log('data: ', updatedObject)
    this.stdCodeSvc.updateStdCode(updatedObject).subscribe(
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