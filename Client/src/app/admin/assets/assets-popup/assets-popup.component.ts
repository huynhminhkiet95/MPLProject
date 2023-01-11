import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService, UserService, FileService, SSOCommonService } from '../../../_services/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FileuploadComponent } from '../../../_directives/fileupload/fileupload.component';
import { ToastrService } from 'ngx-toastr';
import { Globalconst } from '../../../_helpers/globalvariable'
import * as moment from 'moment';
import { AssetsmovementService } from '../../../_services/assetsmovement.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { BaseComponent } from '../../../_directives/base.component';
import { BasePopupComponent } from '../../../_directives/base.popup.component';

declare var AdminLTE: any;
@Component({
  selector: 'app-assets-popup',
  templateUrl: './assets-popup.component.html',
  styleUrls: ['./assets-popup.component.css']
})
export class AssetsPopupComponent extends BasePopupComponent {

  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  @ViewChild(FileuploadComponent) private fileUpload: FileuploadComponent;
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()
  loading = false;
  modalRef: BsModalRef;
  model: any = {};
  bsExpireddate: Date = new Date();
  bsPurchaseDate: Date = new Date();
  bsDisposalDate: Date;
  id: any = '';
  listDivision: any = [];
  assetGroups = [];
  attachments: any = [];
  languages: any = [];
  movements: any = {};
  maxDate = new Date();
  assetId: any = {};
  title = "Edit Asset";
  listOs: any = [];
  listcputype: any = [];
  listcpumodel: any = [];
  listramcapacity: any = [];
  liststoragetype: any = [];
  liststoragecapacity: any = [];
  liststoragemodel: any = [];
  listoslicensevalid: any = [];
  isLaptop: boolean = false;

  constructor(
    private router: Router
    , private route: ActivatedRoute
    , private commonSvc: CommonService
    , private ssoCommonSvc: SSOCommonService
    , private toastr: ToastrService
    , private modalService: BsModalService
    , private fileSvc: FileService
    , public globals: Globalconst
    , public assetsSvc: AssetsmovementService
    , public bsModalRef: BsModalRef
  ) {
    super();
    this.assetId = modalService.config["initialState"].model;
    this.languages = globals._resources || {};
  }

  ngOnInit() {
    AdminLTE.init();
    this.getDivisions();
    this.getStdcodes();

    this.commonSvc.getStdcodesByCode('OS').subscribe(
      data => {
        this.listOs = data["payload"];
      }
    );

    this.commonSvc.getStdcodesByCode('CPUTYPE').subscribe(
      data => {
        this.listcputype = data["payload"];
      }
    );

    this.commonSvc.getStdcodesByCode('CPUMODEL').subscribe(
      data => {
        this.listcpumodel = data["payload"];
      }
    );

    this.commonSvc.getStdcodesByCode('RAMCAPACITY').subscribe(
      data => {
        this.listramcapacity = data["payload"];
      }
    );

    this.commonSvc.getStdcodesByCode('STORAGETYPE').subscribe(
      data => {
        this.liststoragetype = data["payload"];
      }
    );

    this.commonSvc.getStdcodesByCode('STORAGECAPACITY').subscribe(
      data => {
        this.liststoragecapacity = data["payload"];
      }
    );

    this.commonSvc.getStdcodesByCode('STORAGEMODEL').subscribe(
      data => {
        this.liststoragemodel = data["payload"];
      }
    );
    this.commonSvc.getStdcodesByCode('OSLICENSEVALID').subscribe(
      data => {
        this.listoslicensevalid = data["payload"];
      }
    );
    if (this.assetId && this.assetId != 'addnew') {
      this.getAssetDetail(this.assetId);
    }
  }

  getAssetDetail(id) {
    this.assetsSvc.getAssetById(id).subscribe(
      data => {
        this.model = data["payload"].asset;
        this.model.assetModel = this.model.model;
        this.movements = data["payload"].movement[0] ? data["payload"].movement[0] : {};
        this.bsExpireddate = new Date(this.model.warrantyExpired);
        this.bsPurchaseDate = new Date(this.model.purchasingDate);
        if (this.model.disposalDate)
          this.bsDisposalDate = new Date(this.model.disposalDate);
        this.fileSvc.getList("ASS", id).subscribe(
          data => {
            this.fileUpload.setFile(data["payload"]);
          }, error => {
          }
        );
        this.changeOptionPC();
      },
      error => {
      }
    );
  }
  saveAsset() {

    this.IsSubmit = true;
    this.model.model = this.model.assetModel;
    this.model.createUser = this.globals._userinfo.employeeId;
    this.model.subsidiaryId = this.globals._userinfo.subsidiaryId;
    this.model.purchasingDate = this.bsPurchaseDate;
    this.model.warrantyExpired = this.bsExpireddate;
    this.model.disposalDate = this.bsDisposalDate;
    if (this.assetId == "addnew") {

      this.assetsSvc.save(this.model).subscribe(
        data => {
          this.assetId = data["payload"];
          if (this.fileUpload.files.length > 0) {
            let doc: any = {};
            doc.employeeId = this.globals._userinfo.employeeId;
            doc.refNoValue = data["payload"];
            doc.IDR = "ASS";
            this.fileUpload.SaveFile(doc).subscribe(
              data => {
                this.fileSvc.getList("ASS", this.assetId).subscribe(
                  data => {
                    this.fileUpload.setFile(data["payload"]);
                  }, error => {
                  }
                );
              },
              error => {
                this.toastr.error("Failed", "Save Attach");
              }
            );

            this.toastr.success("Save success", "Save Assets");
            this.IsSubmit = false;
            this.router.navigate(['intranet/assets/' + data["payload"]]);
          }
          else {

            this.toastr.success("Save success", "Save Assets");
            this.IsSubmit = false;
            this.router.navigate(['intranet/assets/' + data["payload"]]);
          }
        },
        error => {
        }
      );
    }
    else {
      if (this.model.assetGroup != "LAPTOP" && this.model.assetGroup != "DESKTOP") {
        this.model.os = null;
        this.model.cpuType = null;
        this.model.cpuModel = null;
        this.model.ramCapacity = null;
        this.model.storageType = null;
        this.model.storageCapacity = null;
        this.model.storageModel = null;
        this.model.osLicenseValid = null;
      }
      setTimeout(() => {
        this.assetsSvc.update(this.model).subscribe(
          data => {
            if (this.fileUpload.files.length > 0) {
              let doc: any = {};
              doc.employeeId = this.globals._userinfo.employeeId;
              doc.refNoValue = this.assetId;
              doc.IDR = "ASS";
              this.fileUpload.SaveFile(doc).subscribe(
                data => {
                  this.fileSvc.getList("ASS", this.assetId).subscribe(
                    data => {
                      this.fileUpload.setFile(data["payload"]);
                      this.reloadGrid.emit(null);
                    }, error => {
                    }
                  );
                },
                error => {
                  this.toastr.error("Failed", "Save Attach");
                }
              );
            }
            this.reloadGrid.emit(null);
            this.toastr.success("update success", "Save Assets");
            this.IsSubmit = false;
          },
          error => {
            this.toastr.error(error['message'], "Save Assets");
          }
        );
      }, 300);

    }
    this.bsModalRef.hide();
  }

  getStdcodes() {
    this.assetsSvc.getAssetGroups().subscribe(
      data => {
        this.assetGroups = data["payload"];
      },
      error => {
      }
    );
  }

  UpdateWarrantyDate() {
    this.bsExpireddate = moment().add(this.model.warrantyPeriod, "years")["_d"];
  }

  changeOptionPC() {
    let code = this.model.assetGroup;
    if (code == "DESKTOP" || code == "LAPTOP") {
      this.isLaptop = true;
    }
    else {
      this.isLaptop = false;
    }
  }

  purchasingPriceChange(_value) {
    this.model.purchasingPrice = _value;
  }

  private getDivisions() {
    this.ssoCommonSvc.getDivisions().subscribe(
      data => {
        this.listDivision = data[this.payLoad];
      }
    );
  }
}