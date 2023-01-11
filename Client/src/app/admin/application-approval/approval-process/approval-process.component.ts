import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'
import { DxDataGridComponent } from 'devextreme-angular';
import { CommonService, ServiceRequestService, FileService } from '../../../_services/index'
import 'rxjs/add/operator/take';
import { Globalconst } from '../../../_helpers/globalvariable'
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import { FileuploadComponent } from '../../../_directives/fileupload/fileupload.component';
import * as moment from 'moment';
import { ServiceItemsService } from '../../../_services/service-items.service';
import { ApprovalProcessPopupComponent } from './approval-process-popup/approval-process-popup.component';
declare var AdminLTE: any;
@Component({
  selector: 'app-approval-process',
  templateUrl: './approval-process.component.html',
  styleUrls: ['./approval-process.component.css']
})
export class ApprovalProcessComponent implements OnInit {
  @ViewChild("UploadFile") public fileUpload: FileuploadComponent;
  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  @ViewChild('childModal') childModal: ModalDirective;
  @ViewChild('childModal2') childModal2: ModalDirective;
  @ViewChild('childModal3') childModal3: ModalDirective;
  model: any = {};
  modeldetail: any = {};
  bsModalRef: BsModalRef;
  listIdRequest: any[] = [];
  replyModel: any = {};
  statusList: any = [];
  minDate = new Date(2018, 1, 1);
  title = "Service Approval";
  maxDate = new Date();
  hlvId: string = '';
  listServiceTypes: any = [];

  bsValue: Date = new Date();
  bsRangeValue: any = [];
  dataSource: any = [];
  listSubsidiaries: any = [];
  self: any;
  showRadioApproval: any = {};
  documents: any = []
  events: Array<string> = [];
  languages: any = {};
  listcostCenter: any = [];
  ItemSelected: any;
  SVRDetailSelected: any = {};
  IsShowDocumentAccount:boolean = false;
  constructor(
    private modalService: BsModalService,
    private commonSvc: CommonService,
    private route: ActivatedRoute,
    private serviceSvc: ServiceRequestService,
    public fileSvc: FileService,
    public globals: Globalconst,
    private router: Router,
    private toastr: ToastrService,
    private itemSvr: ServiceItemsService
  ) {
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
  }

  ngOnInit() {
    
    AdminLTE.init();
    this.getCommon();
    this.replyModel.existedUserId = "1";
    this.hlvId = this.route.params["_value"].id;
    this.getById(this.hlvId);
    this.fileUpload.refNoType = "SVR";
    this.fileUpload.refNoValue = this.hlvId;
    this.fileUpload._userId = this.globals._userinfo.employeeId;
    this.fileUpload.getFile2()
  }

  getById(id) {
    this.serviceSvc.getByIdForApproval(id, this.globals._userinfo.employeeId).subscribe(
      data => {
        if (data["payload"].info.isUse == '1') {
          this.dataSource = data["payload"].details;
          this.model = data["payload"].info;

          if (this.model.replyType == 'APPO') 
          {
            this.showRadioApproval = true;
          }
          else 
          {
            this.showRadioApproval = false;
          }

          if (this.model.svrServiceType == "SPR") {
            this.itemSvr.getBySeviceId(this.hlvId).subscribe(
              data => 
              {
                this.ItemSelected = data['payload'];
              }
            );
          }
          
          if((this.model.replyType=='APPO' || this.model.replyType=='ACTI') && (this.model.namedRole == 'PNC' || this.model.namedRole=='APA'))
          {
            this.IsShowDocumentAccount = true;
          }

        }
        else {
          this.toastr.info("This service request already removed.", "Information");
        }
      },
      error => {

      });
  }
  replyRequest() {
    this.replyModel.hLvNo = this.hlvId;
    this.replyModel.Userid = this.globals._userinfo.employeeId;
    this.replyModel.employeeId = this.model.createUser;
    this.replyModel.fromDate = this.commonSvc.convertMilisecondToUTCDate2(this.model.createDate, "YYYY-MM-DD");
    this.replyModel.marker = this.model.svrSubject;

    if (this.showRadioApproval) {
      if (this.replyModel.existedUserId === "1")
        this.replyModel.ApprovalType = 'Approved';
      else if (this.replyModel.existedUserId === "0")
        this.replyModel.ApprovalType = 'Rejected';
    }
    else {
      this.replyModel.ApprovalType = 'Action';
    }


    this.serviceSvc.approval(this.replyModel).subscribe(
      data => {
        this.toastr.success('Update Sucessful', 'Success!');
        this.replyModel.comment = '';
        this.getById(this.hlvId);
      },
      error => {
        this.toastr.error('Update Failed', 'Failed!');
      }
    )
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
  viewDetail() {
    this.printPdf();
  }
  ViewItemsRequest() {
    this.childModal2.show();
  }
  onEditorPreparing(e) {
    if (e.parentType === "dataRow" && e.dataField === "appQty") {

      e.editorOptions.disabled = false;

    }
    else {
      e.editorOptions.disabled = true;
    }


  }
  printPdf() {
    this.serviceSvc.exportPdf(this.hlvId).subscribe(
      data => {
        this.fileSvc.downloadExcel(data['payload'], 'ServiceRequest' + moment().format("YYYYMMDDHHmmss") + '.pdf');
      }
    );

  }
  getCommon() {
    this.commonSvc.getStdcodesByCode("COSTCENTER").subscribe(
      data => {
        this.listcostCenter = data['payload'];
      }
    );
  }
  back() {
    //this.commonSvc.urlback('intranet/itservicerequest');
    this.route.queryParams.subscribe(params => {
      this.router.navigate(['intranet/applicationapproval'], { queryParams: params })
      params = [];
    });
  }
  updateItemToPurchase() {
    this.itemSvr.UpdateItems(this.ItemSelected).subscribe(
      data => {
        this.toastr.success("Update Statiionary Qty Item Request", "Update Sucessfull");
        this.hideChildModal2();
      }
    );
  }
  OpenEditCommentF(d) {
    this.SVRDetailSelected = d.data;
    this.childModal3.show();
  }
  updateCommentDetail() {
    this.SVRDetailSelected.createDate = moment(this.SVRDetailSelected.createDate);
    this.SVRDetailSelected.createUser = this.globals._userinfo.employeeId;
    this.serviceSvc.updateComment(this.SVRDetailSelected).subscribe(
      data => {
        this.toastr.success("Update comment successfully", "Update");
        this.childModal3.hide();
      }
    );
  }
  Checkper(d) {
    if (d.data.itemNo == 0)
      return false;
    if (d.data.assignedUser != null)
      return d.data.assignedUser == this.globals._userinfo.employeeId;
    else
      return d.data.createUserId == this.globals._userinfo.employeeId;
  }

  showAccountDocument() {
    const initialState = {
      hlvId: this.hlvId
    };

    this.bsModalRef = this.modalService.show(ApprovalProcessPopupComponent, Object.assign({}, { initialState, class: 'modal-lg', ignoreBackdropClick: true, keyboard: false }));
  }

}
