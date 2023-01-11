import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService, UserService, FileService, ServiceRequestService, SSOCommonService } from '../../../_services/index';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { FileuploadComponent } from '../../../_directives/fileupload/fileupload.component';
import { Globalconst } from '../../../_helpers/globalvariable'
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { WindowRef } from '../../../_helpers/windowRef'
import { ServicerequestPrintComponent } from '../servicerequest-print/servicerequest-print.component';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { WorkflowPopupComponent } from './workflow-popup/workflow-popup.component';
import { ServiceItemsService } from '../../../_services/service-items.service';
import { SVRItemDetailDto } from '../../../_models';
import { BaseComponent } from '../../../_directives/base.component';
import { _const } from '../../../_helpers/constants';
import { VendorService } from '../../../_services/vendor.service';

declare var AdminLTE: any;
@Component({
  selector: 'app-servicerequest-detail',
  templateUrl: './servicerequest-detail.component.html',
  styleUrls: ['./servicerequest-detail.component.css']
})
export class ServicerequestDetailComponent extends BaseComponent {

  @ViewChild(FileuploadComponent)
  private fileUpload: FileuploadComponent;
  @ViewChild('childModal') childModal: ModalDirective;
  @ViewChild('childModal2') childModal2: ModalDirective;
  @ViewChild(ServicerequestPrintComponent) private printerLayout: ServicerequestPrintComponent;
  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  @ViewChild("gridContainer") dataGrid2: DxDataGridComponent;
  
  bsModalRef: BsModalRef;
  loading = false;
  model: any = {};
  bsDueDate = new Date();
  id: any = '';
  listDivision: any = [];
  listServiceType: any = [];
  attachments: any = [];
  maxDate = new Date();
  listPriority = [];
  private window: WindowRef;
  isView = false;
  Items: any;
  ItemsSelected: any = [];
  ItemSelected: any;
  dropId: any = '';
  copyDocsModel: any = {};
  vendorsList: any = [];
  serviceCategories: any = [];

  constructor(
    public router: Router
    , private route: ActivatedRoute
    , private commonSvc: CommonService
    , private ssoCommonSvc: SSOCommonService
    , private toastr: ToastrService
    , private modalService: BsModalService
    , private fileSvc: FileService
    , public globals: Globalconst
    , public serviceRequestSvc: ServiceRequestService
    , public svcItemSvc: ServiceItemsService
    , private sanitizer: DomSanitizer
    , private vendorSvc: VendorService
  ) {
    super(router);
  }

  ngOnInit() {
    AdminLTE.init();
    this.id = this.route.params["_value"].id;
    this.dropId = this.id;

    this.getVendors();
    this.getCommonData().subscribe(
      data => {

        this.listDivision = data[0][this.payLoad];
        let codeType = data[1][this.payLoad];
        // this.Items = data[2][this.payLoad];

        this.commonSvc.getApplications().subscribe(
          data => {
            var list = data[this.payLoad];
            this.listServiceType = list.filter(function (x) {
              return x.appGroup == 'SVR';
            });
          }
        );

        this.listPriority = codeType.filter(function (x) {
          return x.codeType == _const.CODE_TYPE.priority;
        });

        this.serviceCategories = codeType.filter(function (x) {
          return x.codeType == 'SVRCOSTTYPE';
        });

        if (this.id != null && this.id != 'addnew') {
          this.fileUpload.autoSave = true;
          this.fileUpload.refNoType = 'SVR';
          this.fileUpload._userId = this.currentuser.employeeId;

          this.serviceRequestSvc.getById(this.id).subscribe(
            data => {
              this.model = data[this.payLoad];
              this.isView = this.model.svrStatus != 'DRAF';
              this.bsDueDate = new Date(this.model.dueDate);
            },
            error => {
            }
          );

          this.fileSvc.getList("SVR", this.id).subscribe(
            data => {
              this.fileUpload.files2 = data[this.payLoad];
            }
          );
        }
        else //add new 
        {
          this.bsDueDate = new Date();
          this.model.HasBudget = 'No';
        }
      }
    )
  }

  save(status) {
    this.isView = true;
    //this.model.svrStatus = status;

    if (this.id == '' || this.id == undefined || this.model.svrStatus == 'DROP') {
      if (this.model.svrStatus == 'DROP')
        this.model.createDate = null;

      this.model.svrStatus = status;
      this.loading = true;
      this.model.dueDate = this.bsDueDate;
      this.model.subsidiaryId = this.currentuser.subsidiaryId;
      this.model.divisionCode = this.currentuser.divisionCode;
      this.model.createUser = this.currentuser.employeeId;
      this.model.dueDate = moment(this.model.dueDate).format("YYYY-MM-DD");

      this.serviceRequestSvc.create(this.model).subscribe(
        data => {
          if (this.model.svrServiceType == 'SPR' && this.Items.length > 0) {
            this.ItemsSelected.forEach(element => {
              element.SVRNo = data[this.payLoad];

            });
            
            this.svcItemSvc.saveItems(this.ItemsSelected).subscribe(
              data => {
              }
            );
          }

          this.attachedFile(data[this.payLoad]);
          this.copyAttachFiles(this.dropId, data[this.payLoad]);

          if (status == 'NEW') {
            this.isView = true;
          }

          this.router.navigate(['intranet/servicerequest/' + data[this.payLoad]]);
        },
        error => {
          this.isView = false
          this.toastr.error("Save unsuccessfull", "Save Service Request");
          // console.log(error["message"]);
        }, () => {
          this.loading = false;
        }
      );
    }
    else {
      this.model.svrStatus = status;
      this.model.dueDate = this.bsDueDate;
      this.model.updateUser = this.currentuser.employeeId;
      this.serviceRequestSvc.update(this.model).subscribe(
        data => {
          this.attachedFile(this.id);
          if (status == 'NEW') {
            this.isView = true;
          }
          this.router.navigate(['intranet/servicerequest/' + this.id]);
        },
        error => {
          this.toastr.error("Update unsuccessfull", "Save Service Request");
          // console.log(error["message"]);
        }, () => {
          this.loading = false;
        }
      );
    }
  }


  getVendors() {
    this.vendorSvc.getAllVendor().subscribe(data => {
      this.vendorsList = data[this.payLoad];
    });
  }

  getCommonData() {
    let devisions = this.ssoCommonSvc.getDivisions();
    let stdCodes = this.commonSvc.getStdcodesByCode("SVRCOSTTYPE,PRIORITY,DESGINATION");

    // let itemSpr = this.svcItemSvc.getAll();
    return Observable.forkJoin([devisions, stdCodes]);
  }

  attachedFile(svrId: any) {
    if (this.fileUpload.files.length > 0) {
      if (!this.fileUpload.isValidFiles()) {
        this.toastr.error(this.fileUpload.errors[0]);
        return;
      }
      let doc: any = {};
      doc.employeeId = this.currentuser.employeeId;
      doc.refNoValue = svrId;
      doc.IDR = "SVR";

      this.fileUpload.SaveFile(doc).subscribe(
        data => {
          this.toastr.success("Update Success");
        },
        error => {
          this.toastr.error(error.message);
        }
      );
    } else {
      this.toastr.success("Save successfull", "Save Servie Request");
    }
  }

  onPrint() {
    this.printPdf();
  }

  openModalWithComponent() {
    this.bsModalRef = this.modalService.show(ServicerequestPrintComponent, { class: 'modal-lg' });
    this.bsModalRef.content
    this.bsModalRef.content.title = 'Add new service request';
  }

  printToCart() {
    let popupWinindow;

    let innerContents = document.getElementById("container-print").innerHTML;
    popupWinindow = window.open('', '_blank', 'scrollbars=no,fullscreen=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write('<html><head></head><body onload="window.print()">' + innerContents + '</body></html>');
    popupWinindow.document.close();
  }

  usdAmountChange(_value) {
    this.model.usdDocAmount = _value;
  }

  localAmountChange(_value) {
    this.model.localDocAmount = _value;
  }

  printPdf() {
    this.serviceRequestSvc.exportPdf(this.id).subscribe(
      data => {
        this.fileSvc.downloadExcel(data[this.payLoad], 'ServiceRequest' + moment().format("YYYYMMDDHHmmss") + '.pdf');
      }
    );
  }

  popup() {
    const initialState = {
      ApplicationCode: this.model.svrServiceType,
      LocalAmount: this.model.localDocAmount
    }
    this.bsModalRef = this.modalService.show(WorkflowPopupComponent, {
      class: 'modal-lg', initialState

    });
  }

  showChildModal(): void {
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  hideChildModal2(): void {
    this.childModal2.hide();
  }

  updateItemToPurchase() {
    let detailItem: string = '';

    this.Items.forEach(element => {
      if (element.quantity != null && element.quantity != 0) {
        detailItem = detailItem.concat(element.itemDesc, ': ', element.quantity, '(', element.unit, ')', '\n');
        this.ItemsSelected.push(new SVRItemDetailDto(element.spiId, element.quantity));
      }
    });

    this.hideChildModal();
    this.model.requiredDetail = detailItem;
  }

  ViewItems() {
    this.svcItemSvc.getBySeviceId(this.id).subscribe(
      data => {
        this.ItemSelected = data[this.payLoad];
        this.childModal2.show();
      }
    );
  }

  changeType() {
    if (this.model.svrServiceType == 'TSR') {
      this.model.requiredDetail = 'Người sử dụng: \nSố lượng: \nĐiểm đón: \nThời Gian: \nLộ trình: \nSố điện thoại:';
    }
    else {
      this.model.requiredDetail = '';
    }
  }

  resubmit() {
    this.isView = false;
    this.id = 'addnew';
  }

  copyAttachFiles(refNoValue, refNoValueNew) {
    this.copyDocsModel.refNoType = 'SVR';
    this.copyDocsModel.refNoValue = refNoValue;
    this.copyDocsModel.refNoValueNew = refNoValueNew;
    this.copyDocsModel.createUser = this.currentuser.employeeId;

    this.fileSvc.copyDocuments(this.copyDocsModel).subscribe(
      data => {
        console.log('-----------: ' + data[this.payLoad]);
      }
    );
  }
}
