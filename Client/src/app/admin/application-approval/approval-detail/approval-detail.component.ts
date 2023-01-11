import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { CommonService, ApplyLeaveService, FileService } from '../../../_services/index'
import 'rxjs/add/operator/take';
import { Globalconst } from '../../../_helpers/globalvariable'
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import { BaseComponent } from '../../../_directives/base.component';
import { SignalRService } from '../../../_services/signalR.Service';
import { _const } from '../../../_helpers/constants';
import { Helpers } from '../../../_helpers/helpers';

declare var AdminLTE: any;
@Component({
  selector: 'app-approval-detail',
  templateUrl: './approval-detail.component.html',
  styleUrls: ['./approval-detail.component.css']
})

export class ApprovalDetailComponent extends BaseComponent {

  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;

  private hlvId: string = '';

  model: any = {};
  bsModalRef: BsModalRef;
  listIdRequest: any[] = [];
  replyModel: any = {};
  statusList: any = [];
  minDate = new Date(2018, 1, 1);
  title = "Leave Approval";
  maxDate = new Date();
  listServiceTypes: any = [];
  bsValue: Date = new Date();
  bsRangeValue: any = [];
  dataSource: any = [];
  listSubsidiaries: any = [];
  self: any;
  showRadioApproval: any = {};
  events: Array<string> = [];

  constructor(
    private route: ActivatedRoute
    , private leaveSvc: ApplyLeaveService
    , public fileSvc: FileService
    , public router: Router
    , private toastr: ToastrService
    , public _signalRService: SignalRService
    , public commonSvc: CommonService
  ) {
    super(router);
  }

  ngOnInit() {
    AdminLTE.init();
    this.replyModel.existedUserId = "1";
    this.hlvId = this.route.params["_value"].id;

    if (!Helpers.isNullOrEmpty(this.hlvId))
      this.getById(this.hlvId);
  }

  getById(id) {
    this.leaveSvc.getById(this.currentuser.employeeId, id).subscribe(
      data => {
        this.dataSource = data[this.payLoad].hlvLeaveDetails;
        this.model = data[this.payLoad];

        if (this.model.replyType == 'APPO' && this.model.leaveStatus != 'CLOS' 
            && this.model.leaveStatus != 'CAN' && this.model.approvalTypes == null)
          this.showRadioApproval = true;
        else
          this.showRadioApproval = false;
      },
      error => {
      })
  }

  replyRequest() {
    this.replyModel.hLvNo = this.hlvId;
    this.replyModel.Userid = this.currentuser.employeeId;
    this.replyModel.employeeId = this.dataSource.find(x => x.replyItemNo == 0).assignedUser;
    this.replyModel.fromDate =  this.commonSvc.convertMilisecondToUTCDate2(this.model.fromDate, "YYYY-MM-DD");
    this.replyModel.leaveDays = this.model.leaveDays;
    this.replyModel.marker = this.model.marker;

    
    if (this.showRadioApproval) {
      if (this.replyModel.existedUserId === "1")
        this.replyModel.ApprovalType = 'Approved';
      else if (this.replyModel.existedUserId === "0")
        this.replyModel.ApprovalType = 'Rejected';
    }else
      this.replyModel.ApprovalType = 'Action';
    
    this.leaveSvc.approval(this.replyModel).subscribe(
      data => {
        this.toastr.success(_const.NOTIFICATIONS.update_success, 'Success!');
        this.replyModel.comment = '';
        try
        {
          if (this.replyModel.ApprovalType == 'Approved')
            this.sendNotifyRequest(1);
          else
            this.sendNotifyRequest(0);
        }
        catch(e)
        {

        }
        this.getById(this.hlvId);
      },
      error => {
        this.toastr.error(_const.NOTIFICATIONS.update_fail, 'Failed!');
      }
    )
  }

  Back() {
    this.route.queryParams.subscribe(params => {
      this.router.navigate(['intranet/serviceapproval'], { queryParams: params })
      params = [];
    });
    //this.router.navigateByUrl('intranet/serviceapproval');
  }

  sendNotifyRequest(status: number) {
    if (status == 1) {
      let emp = this.model.employeeName;
      let detail = this.dataSource.find(x => x.replyType == 'APPO' && x.assignedUser != this.currentuser.employeeId && x.leaveStatus == null);
      
      if (detail != null) {
        let userId = detail.assignedUser;
        this._signalRService.sendMessageToUser(userId.toString(), `You have a leave request need to approval from ${emp}`);
      }else {
        let userId = this.dataSource.find(x => x.replyType == 'REQ').assignedUser
        this._signalRService.sendMessageToUser(userId.toString(), `The Leave request ${this.model.lvNo} has been approved`);
      }

    }else {
      let userId = this.dataSource.find(x => x.replyType == 'REQ').assignedUser
      this._signalRService.sendMessageToUser(userId.toString(), `The Leave request ${this.model.lvNo} has been Rejected`);
    }
  }
}
