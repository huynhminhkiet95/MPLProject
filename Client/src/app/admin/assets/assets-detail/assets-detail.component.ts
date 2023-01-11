import { Component, OnInit, ViewChild, trigger, state, transition, style, animate } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService, UserService, FileService, ServiceRequestService, SSOCommonService } from '../../../_services/index';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { FileuploadComponent } from '../../../_directives/fileupload/fileupload.component';
import { ToastrService } from 'ngx-toastr';
import { Globalconst } from '../../../_helpers/globalvariable'
import * as moment from 'moment';
import { AssetsmovementService } from '../../../_services/assetsmovement.service';
import { BaseComponent } from '../../../_directives/base.component';
import { BasePopupComponent } from '../../../_directives/base.popup.component';

declare var AdminLTE: any;
@Component({
  selector: 'app-assets-detail',
  templateUrl: './assets-detail.component.html',
  styleUrls: ['./assets-detail.component.css']
})

export class AssetsDetailComponent extends BasePopupComponent {

  @ViewChild("assetUploadFile") public fileUpload: FileuploadComponent;
  @ViewChild('staticModal') public modalAvatar: ModalDirective;
  
  loading = false;
  model: any = {};
  bsExpireddate: Date = null;
  bsPurchaseDate: Date = null;
  bsDisposalDate: Date = null;
  id: any = '';
  title = "Asset Detail";
  listDivision: any = [];
  assetGroups = [];
  attachments: any = [];
  movements: any = {};
  maxDate = new Date();
  assetId: any = {};
  listOs: any = [];
  listcputype: any = [];
  listcpumodel: any = [];
  listramcapacity: any = [];
  liststoragetype: any = [];
  liststoragecapacity: any = [];
  liststoragemodel: any = [];
  listoslicensevalid: any = [];
  listscreensize: any = [];
  isLaptop: boolean = false;

  constructor(
    public router: Router
    , private route: ActivatedRoute,
    private commonSvc: CommonService,
    private ssoCommonSvc: SSOCommonService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private fileSvc: FileService,
    public globals: Globalconst,
    public assetsSvc: AssetsmovementService,
    public serviceRequestSvc: ServiceRequestService
  ) {
    super();
    this.IsSubmit = false;
  }

  ngOnInit() {
    AdminLTE.init();
    this.model.usdDocAmount = 10;
    this.getStdcodes();
    this.getDivisions();
    this.commonSvc.getStdcodesByCode('OS').subscribe(
      data => {
        this.listOs = data[this.payLoad];
      }
    );

    this.commonSvc.getStdcodesByCode('CPUTYPE').subscribe(
      data => {
        this.listcputype = data[this.payLoad];
      }
    );

    this.commonSvc.getStdcodesByCode('CPUMODEL').subscribe(
      data => {
        this.listcpumodel = data[this.payLoad];
      }
    );

    this.commonSvc.getStdcodesByCode('RAMCAPACITY').subscribe(
      data => {
        this.listramcapacity = data[this.payLoad];
      }
    );

    this.commonSvc.getStdcodesByCode('STORAGETYPE').subscribe(
      data => {
        this.liststoragetype = data[this.payLoad];
      }
    );

    this.commonSvc.getStdcodesByCode('STORAGECAPACITY').subscribe(
      data => {
        this.liststoragecapacity = data[this.payLoad];
      }
    );

    this.commonSvc.getStdcodesByCode('STORAGEMODEL').subscribe(
      data => {
        this.liststoragemodel = data[this.payLoad];
      }
    );
    this.commonSvc.getStdcodesByCode('OSLICENSEVALID').subscribe(
      data => {
        this.listoslicensevalid = data[this.payLoad];
      }
    );
    this.commonSvc.getStdcodesByCode('ASSETSCREENSIZE').subscribe(
      data => {
        this.listscreensize = data[this.payLoad];
      }
    );
    this.assetId = this.route.params["_value"].id;
    if (this.assetId && this.assetId != 'addnew') {
      this.getAssetDetail(this.assetId);
    }
  }
  
  getAssetDetail(id) {
    this.assetsSvc.getAssetById(id).subscribe(
      data => {
        this.model = data[this.payLoad].asset;
        this.model.assetModel = this.model.model;
        this.movements = data[this.payLoad].movement[0] ? data[this.payLoad].movement[0] : {};
        this.bsExpireddate = new Date(this.model.warrantyExpired);
        this.bsPurchaseDate = new Date(this.model.purchasingDate);

        if (this.model.disposalDate)
          this.bsDisposalDate = new Date(this.model.disposalDate);

        this.fileSvc.getList("ASS", id).subscribe(
          data => {
            this.fileUpload.setFile(data[this.payLoad]);
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

    if (!this.fileUpload.isValidFiles()) {
      this.toastr.error(this.fileUpload.errors[0], "Error");
      this.IsSubmit = false;
      return;
    }

    this.model.model = this.model.assetModel;
    this.model.createUser = this.globals._userinfo.employeeId;
    this.model.subsidiaryId = this.globals._userinfo.subsidiaryId;
    this.model.purchasingDate = this.bsPurchaseDate;
    this.model.warrantyExpired = this.bsExpireddate;
    this.model.disposalDate = this.bsDisposalDate;

    if (this.assetId == "addnew") {
      this.assetsSvc.save(this.model).subscribe(
        data => {
          this.assetId = data[this.payLoad];
          if (this.fileUpload.files.length > 0) {
            let doc: any = {};
            doc.employeeId = this.globals._userinfo.employeeId;
            doc.refNoValue = data[this.payLoad];
            doc.IDR = "ASS";
            this.fileUpload.SaveFile(doc).subscribe(
              data => {
                this.fileSvc.getList("ASS", this.assetId).subscribe(
                  data => {
                    this.fileUpload.setFile(data[this.payLoad]);
                  }, error => {
                  }
                );
                this.toastr.success("Save success", "Save Assets");
                this.router.navigate(['intranet/assets/search' + data[this.payLoad]]);
              },
              error => {
                this.toastr.error("Failed", "Save Attach");
              }
            );
          }
          else {
            this.toastr.success("Save success", "Save Assets");
            this.router.navigate(['intranet/assets/search' + data[this.payLoad]]);
          }
          this.IsSubmit = false;
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
        this.model.screensize = null;
      }

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
                    this.fileUpload.setFile(data[this.payLoad]);
                    this.toastr.success("Update success", "Save Assets");
                    this.IsSubmit = false;
                  }, error => {
                  }
                );
              },
              error => {
                this.toastr.error("Failed", "Save Attach");
              }
            );
          }
          else {
            this.toastr.success("Update success", "Save Assets");
            this.IsSubmit = false;
          }
        },
        error => {
          this.toastr.error(error['message'], "Save Assets");
        }
      );
    }
  }

  getStdcodes() {
    this.assetsSvc.getAssetGroups().subscribe(
      data => {
        this.assetGroups = data[this.payLoad];
      },
      error => {
      }
    );
  }

  UpdateWarrantyDate() {
    this.bsExpireddate = moment(this.bsPurchaseDate).add(this.model.warrantyPeriod, "years")["_d"];
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

  back() {
    this.route.queryParams.subscribe(params => {
      this.router.navigate(['intranet/assets/search'], { queryParams: params })
      params = [];
    });
  }

  purchasingPriceChange(_value) {
    this.model.purchasingPrice = _value;
  }
  
  CheckAssetCode() {
    let assetCode: string = this.model.assetCode
    if (assetCode && assetCode.length > 6) {
      let searchModel = { "status": "", "assetGroup": "", "assetCode": "", "division": "", "brand": "", "serialNo": "", "assignedEmployee": 0, "PurchaseDateF": "2010/02/01", "PurchaseDateT": "2020/01/14" };
      if (this.assetId == 'addnew') {
        searchModel.assetCode = this.model.assetCode;
        this.assetsSvc.searchAsesets(searchModel).subscribe(
          data => {
            if (data[this.payLoad].length > 0) {
              this.toastr.warning("This Assetcode already existed", "Duplicate Asset Code");
            }
          }
        );

      }
    }
  }

  private getDivisions() {
    this.ssoCommonSvc.getDivisions().subscribe(
      data => {
        this.listDivision = data[this.payLoad];
      },
      error => {
      }
    );
  }
}
