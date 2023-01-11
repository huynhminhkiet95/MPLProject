import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DxDataGridComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { CommonService, UserService, EmployeeService, FileService, SSOCommonService } from '../../_services/index'
import * as moment from 'moment';
import 'rxjs/add/operator/take';
import { Globalconst } from '../../_helpers';
import { AssetsmovementService } from '../../_services/assetsmovement.service';
import { ToastrService } from 'ngx-toastr';
import { FileuploadComponent } from '../../_directives/fileupload/fileupload.component';
import { BaseComponent } from '../../_directives/base.component';
import { Router } from '@angular/router';

declare var AdminLTE: any;
@Component({
  selector: 'app-assetsmovement',
  templateUrl: './assetsmovement.component.html',
  styleUrls: ['./assetsmovement.component.css']
})
export class AssetsmovementComponent extends BaseComponent {
  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  @ViewChild('childModal') childModal: ModalDirective;
  @ViewChild("assetuploadFile") fileUpload: FileuploadComponent;
  searchModel: any = {};
  model: any = {};
  assetMovement: any = {};
  listusers: any = [];
  listusers2: any = [];
  listusers3: any = [];
  genders: any[];
  modalId = "hoplaModal";
  modalTitle = "Add new";
  loading = false;
  title = "Assets Movement";
  listDivision: any = [];
  assetGroups: any = [];
  assets: Array<any> = [];
  assets2: any = [];
  dataSource: any = {};
  bsValue: Date = new Date();
  bsRangeValue: any = [];
  languages: any = [];
  bsHandoverDate: Date;
  bsReturnDate: Date;
  modalRef: BsModalRef;
  IsNew = false;
  isButtonSave = "add";
  fromDateValue:Date = new Date();
  @Output() viewDetailUser: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: BsModalService, public _global: Globalconst,
    private commonSvc: CommonService
    , private ssoCommonSvc: SSOCommonService
    , private assetsMovementSvc: AssetsmovementService, private toastr: ToastrService,
    private userSvc: UserService
    , private empSver: EmployeeService, private fileSvc: FileService,
    public globals: Globalconst,
    public router:Router
  ) {
    super(router);
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
  }

  ngOnInit() {
    AdminLTE.init();
    this.getStdcodes();
    this.bsRangeValue = [moment().subtract(30, 'days')["_d"], new Date()];
    this.bsHandoverDate = new Date();
    this.searchModel.status = '';
    this.searchModel.userId = this._global._userinfo.employeeId;
    this.searchModel.employeeId = this._global._userinfo.employeeId;
    this.searchModel.AssetGroup = '';
    this.searchModel.AssetCode = '';
    this.searchModel.Division = '';
    this.searchModel.Brand = '';
    this.searchModel.SerialNo = '';
    this.searchModel.dateMode = "handover";
    this.searchModel.PurchaseDateF = moment(this.bsRangeValue[0]).format('YYYY/MM/DD');
    this.searchModel.PurchaseDateT = moment(this.bsRangeValue[1]).format('YYYY/MM/DD');
    //this.assetMovement.assetGroup = "BAR";
    //this.assetMovement.assetGroup = 'BAR';
    //getAssetGroup(assetGroup);

  }
  search() {
    if (this.bsRangeValue != null && this.bsRangeValue.length == 2) {
      this.searchModel.PurchaseDateF = moment(this.bsRangeValue[0]).format('YYYY/MM/DD');
      this.searchModel.PurchaseDateT = moment(this.bsRangeValue[1]).format('YYYY/MM/DD');
    }
    this.assetsMovementSvc.search(this.searchModel).subscribe(
      data => {
        this.dataSource = data["payload"];
      }
    );
  }
  getStdcodes() {

    this.assetsMovementSvc.getAssetGroups().subscribe(
      data => {
        this.assetGroups = data["payload"];

      },
      error => {

      }
    );
    let empModel: any = {};
    empModel.EmployeeName = "";
    empModel.Mobile = "";
    empModel.Subsidary = "";
    empModel.Division = "";
    empModel.Department = "";
    this.empSver.search(empModel).subscribe(
      data => {
        this.listusers = data["payload"];
        this.listusers2 = data["payload"];
        this.listusers3 = data["payload"];
      }
      , error => {

      }
    );

    this.ssoCommonSvc.getDivisions().subscribe(
      data => {
        this.listDivision = data["payload"];
      },
      error => {
      }
    );

  }
  viewDetail(data) {
   

    this.IsNew = false;
    this.listusers3 = this.listusers;
    this.bsHandoverDate = new Date(data.handoverDate);
    this.isButtonSave = "update";//
    Object.assign(this.assetMovement,data);;
    this.assetMovement.employeeId = data.assignedEmployeeId;
    if (data.returnDate) {
      this.bsReturnDate = new Date(data.returnDate);
    }
    else
    {
      this.bsReturnDate=null;
    }
    this.fileSvc.getList("ASSM", data.amoId).subscribe(
      data => {
        this.fileUpload.setFile(data["payload"]);
      },
       error => {
      }
    );
    this.showChildModal();
  }

  showChildModal(): void {
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }
  Addnew() {
    this.assetMovement = {};
    this.bsReturnDate = null;
    this.IsNew = true;
    this.searchModel.divisionpopup = "";
    this.showChildModal();
  }
  changeAssetGroup() {
    let assetGroup = this.assetMovement.assetGroup;
    if (assetGroup && assetGroup != '') {
      this.getAssetGroup(assetGroup);
    }
    else {
      this.assets = this.assets2;
    }
  }
  getAssetGroup(assetGroup) {
    this.assetsMovementSvc.getAsset(assetGroup).subscribe(
      data => {
        this.assets = data["payload"];
        this.assets2 = data["payload"];

      },
      error => {
      }
    );
  }
  saveAssetMovement(model: any,employeeid) {
    if (this.isButtonSave == "add") {
      this.IsSubmit = true;
      this.assetMovement.employeeId = employeeid;
      this.assetMovement.handoverDate = this.bsHandoverDate;
      this.assetMovement.createuser = this._global._userinfo.employeeId;
      this.assetsMovementSvc.saveAssetsMovement(this.assetMovement).subscribe(
        data => {
          let asset = this.assets2.find(x => x.assetId == this.assetMovement.assetId);
          this.assets2.splice(this.assets2.indexOf(asset), 1);

          let doc: any = {};
          doc.employeeId = this.globals._userinfo.employeeId;
          doc.refNoValue = data["payload"];
          doc.IDR = "ASSM";
          if (this.fileUpload.files.length > 0) {
            this.fileUpload.SaveFile(doc).subscribe(
              data => {
                this.hideChildModal();
                this.assetMovement = {};
                this.toastr.success("Save success", "Save Assets Movement");
                this.search();
              },
              error => {
                this.toastr.error("Failed", "Save Attach");

              }
            );
          }
          else {
            this.hideChildModal();
            this.assetMovement = {};
            this.toastr.success("Save success", "Save Assets Movement");
            this.search();
          }
          this.IsSubmit = false;
        }
        , error => {
        }
      );
    }
    else {
      this.UpdateAssetMovement()
    }
  }
  UpdateAssetMovement() {
    this.IsSubmit = true;
    this.assetMovement.updateUser = this._global._userinfo.employeeId;
    this.assetMovement.returnDate = this.bsReturnDate;
    this.assetMovement.handoverDate = this.bsHandoverDate;
    this.assetsMovementSvc.updateAssetMovement(this.assetMovement).subscribe(
      data => {
        this.toastr.success("Update Success", "info");
        this.IsSubmit = false;
        this.hideChildModal();
        this.getAssetGroup(this.assetMovement.assetGroup);
        this.isButtonSave = "add";
        this.search();
      }
    );
  }
  changedDivision() {

    let divisionCode = this.searchModel.division;
    if (divisionCode && divisionCode != '') {
      this.listusers2 = this.listusers.filter(function (x) {
        return x.divisionCode == divisionCode;
      });
    }
    else {
      this.listusers2 = this.listusers;
    }
  }
  changedDivision1() {
    let divisionpopup = this.searchModel.divisionpopup;
    if (divisionpopup && divisionpopup != '') {
      this.listusers3 = this.listusers.filter(function (x) {
        return x.divisionCode == divisionpopup;
      });
    }
    else {
      this.listusers3 = this.listusers;
    }
  }
}
