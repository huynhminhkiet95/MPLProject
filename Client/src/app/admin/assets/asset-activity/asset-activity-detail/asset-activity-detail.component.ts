import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../_directives/base.component';
import { Globalconst } from '../../../../_helpers';
import { AssetActivityService } from '../../../../_services/asset-activity.service';
import { CommonService, FileService } from '../../../../_services';
import { AssetsmovementService } from '../../../../_services/assetsmovement.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import * as moment from 'moment';
import { FileuploadComponent } from '../../../../_directives/fileupload/fileupload.component';

@Component({
  selector: 'app-asset-activity-detail',
  templateUrl: './asset-activity-detail.component.html',
  styleUrls: ['./asset-activity-detail.component.css']
})
export class AssetActivityDetailComponent extends BaseComponent {
  @ViewChild("assetUploadFile") public fileUpload: FileuploadComponent;
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()
  model: any = {};
  activityTypes: any = [];
  assetGroups: any = [];
  assets: any = [];
  editMode = false;
  searchModel: any={};
  constructor(public router: Router,
    public modalService: BsModalService,
    public _global: Globalconst,
    private _svcAssetActivity: AssetActivityService,
    private commonSvc: CommonService,
    private assetsMovementSvc: AssetsmovementService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    public bsModalRef: BsModalRef,
    public fileSvc: FileService,
  ) {
    super(router);
  }
  ngOnInit() {
    this.searchModel.status = '';
     
    this.searchModel.assetCode = '';
    this.searchModel.division = '';
    this.searchModel.brand = '';
    this.searchModel.serialNo = '';
    this.searchModel.PurchaseDateF= "2010/02/01";
    this.searchModel.PurchaseDateT= "2019/08/05";
    
    this.searchModel.assignedEmployee=0;
 
    if (this.modalService.config["model"]) {
      this.model = this.modalService.config["model"];
      this.fileUpload.getFile(this.model.haatId, 'ASSAC');
    }
    else { 
      this.model.currency = 'VND';
    }

  }
  changeAssetGroup() {
    this.searchModel.assetGroup = this.model.assetGroup;
    this.assetsMovementSvc.searchAsesets(this.searchModel).subscribe(
      data => {
        this.assets = data["payload"];
      },
      error => {
      }
    );
  }
  Save() {
    if (this.editMode) {
      this.Update();
    }
    else {
      this.model.CreateUser = this._global._userinfo.employeeId;
      this._svcAssetActivity.Insert(this.model).subscribe(
        data => {
          if (data["payload"]) {
            if (this.fileUpload.files.length > 0) {
              let doc: any = {};
              doc.IDR = 'ASSAC';
              doc.refNoValue = data['payload'];
              doc.IDR = 'ASSAC';
              doc.employeeId = this._global._userinfo.employeeId;
              this.fileUpload.SaveFile(doc).subscribe(
                data => {

                }
              );
            }
            this.reloadGrid.emit(null);
            this.bsModalRef.hide();
          }
        }
      );
    }

  }
  Update() {
    this.model.updateUser = this._global._userinfo.employeeId;
    this.model.activityDate = moment(this.model.activityDate).format("MM/DD/YYYY");
    this.model.createDate = moment(this.model.createDate).format("MM/DD/YYYY");
    if(this.model.expireDate && this.model.expireDate!='')
      this.model.expireDate = moment(this.model.expireDate).format("MM/DD/YYYY");
    if (this.model.updateDate) {
      this.model.updateDate = moment(this.model.updateDate).format("MM/DD/YYYY");
    }
    this._svcAssetActivity.Update(this.model).subscribe(
      data => {
        if (data['payload']) {
          if (this.fileUpload.files.length > 0) {
            let doc: any = {};
            doc.IDR = 'ASSAC';
            doc.refNoValue = this.model.haatId;
            doc.IDR = 'ASSAC';
            doc.employeeId = this._global._userinfo.employeeId;
            this.fileUpload.SaveFile(doc).subscribe(
              data => {

              }
            );
          }

          this.toastr.success("Update Sucessfull", "Update Asset Activity");
          this.reloadGrid.emit(null);
          this.bsModalRef.hide();
        }
      }
    );
  }
  Delete(id) {
    this._svcAssetActivity.Delete(id).subscribe(
      data => {
        if (data['payload']) {
          this.toastr.success("Delete Sucessfull", "Update Asset Activity");
          this.reloadGrid.emit(null);
          this.bsModalRef.hide();
        }
      }
    );
  }
  localAmountChange(_value) {
    this.model.cost = _value;
  }
}
