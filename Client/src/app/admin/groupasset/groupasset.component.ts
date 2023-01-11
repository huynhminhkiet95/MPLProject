import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { CommonService } from '../../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { AssetGroupService } from '../../_services/assetgroup.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../_directives/base.component';
declare var AdminLTE: any;
@Component({
  selector: 'app-groupasset',
  templateUrl: './groupasset.component.html',
  styleUrls: ['./groupasset.component.css']
})
export class GroupassetComponent  extends BaseComponent {
  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  languages: any = [];
  dataSource: any = {};
  listassetgroupid: any = {};
 
  constructor
  (
    private commonsvc: CommonService,
    private toastr: ToastrService,
    private groupasset: AssetGroupService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super(router);
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
    this.dataSource.store = new CustomStore({
      load: (loadOptions) => {
        let that = this;
        return that.groupasset.getassetgroup()
          .toPromise()
          .then(res => {
            this.listassetgroupid = res["payload"];
            return {
              data: res["payload"],
              totalCount: res["payload"][0] ? res["payload"][0].totalCount : 0

            }
          }).catch(error => {
            throw 'Data Loading Error'
          });
      },
      // remove: (key)  => {
      //   let model:any;
      //    this.groupasset.deleteassetgroup(model).subscribe(

      //     data=> {
             
      //     }
      //    );
      // } ,
    });
  }
  ngOnInit() {
    AdminLTE.init();

  }
  insertassetgroup(eventName) {
    let model = eventName.data;
  
    var ckexists = this.checkexists(model.assetGroup);//check value exists thi insert
    if (ckexists == undefined) {
      model.assetGroup = model.assetGroup.toUpperCase();
      this.groupasset.insertassetgroup(model).subscribe(
        data => {
          if (data["payload"] == 1) {
            this.toastr.success("Insert success", "Insert AssetGroup");
            this.dataGrid.instance.refresh();
          }
          else {
            this.toastr.error("Insert failed", "Insert AssetGroup");
          }
        },
        error =>
        {
          this.toastr.error(error["message"] ? error["message"] : error);
        }
      )
    }
    else {
      this.toastr.error("This value already exists ! Please enter a different value.", "Insert AssetGroup");
    }
  }
  checkexists(groupid: string) {
    let group = this.listassetgroupid.find(x => x.assetGroup == groupid.toUpperCase());//tim kiem du lieu ton tai trong mang
    if (group != undefined) {
      return group.assetGroup;
    }
    return group;
  }
  onEditorPreparing(e) {
    
    if (e.parentType === "dataRow" && e.dataField === "assetGroup") {///disable primary key
      if (e.row.inserted == true) {
        e.editorOptions.disabled = false;
      }
      else {
        e.editorOptions.disabled = true;
      }
    }
  }
  updateassetgroup(eventName) {
    eventName.newData.assetGroup = eventName.newData.assetGroup == undefined ? eventName.oldData.assetGroup : eventName.newData.assetGroup;
    eventName.newData.assetGroupDesc = eventName.newData.assetGroupDesc == undefined ? eventName.oldData.assetGroupDesc : eventName.newData.assetGroupDesc;
    eventName.newData.assetLife = eventName.newData.assetLife == undefined ? eventName.oldData.assetLife : eventName.newData.assetLife;
    this.groupasset.updateassetgroup(eventName.newData).subscribe(
      data => {
        if (data["payload"] == 1) {
          this.toastr.success("Update Success", "Update Asset Group");
          this.dataGrid.instance.refresh();
        }
        else {
          this.toastr.error("Update failed !", "Update Asset Group");
        }
      },
      error => {
        this.toastr.error(error["message"] ? error["message"] : error);
      }
    );
  }
  deleteassetgroup(e) {
    this.groupasset.deleteassetgroup(e.data).subscribe(
      data => {
        if (data["payload"] == 1) {
          this.toastr.success("Delete Success", "Delete Asset Group");
          this.dataGrid.instance.refresh();
        }
        else {
          this.toastr.error("Delete failed !", "Delete Asset Group");
        }
      },
      error => {
        this.toastr.error(error["message"] ? error["message"] : error);
      }
    );
    $(".dx-resizable").fadeOut();
    $( " .dx-dialog, .dx-popup-wrapper ,.dx-dialog-wrapper ,.dx-dialog-root ,.dx-overlay-modal ,.dx-overlay-shader" ).remove();
  }
}
