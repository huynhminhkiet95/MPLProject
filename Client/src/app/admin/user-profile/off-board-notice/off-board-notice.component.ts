import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BasePopupComponent } from '../../../_directives/base.popup.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from '../../../_services';
import * as moment from 'moment'
import { OffboardnoticeServiceService } from '../../../_services/offboardnotice.service.service';
import { OffBoardNoticeDTO } from '../../../_models/interface/offBoardNoticeDto';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-off-board-notice',
  templateUrl: './off-board-notice.component.html',
  styleUrls: ['./off-board-notice.component.css']
})
export class OffBoardNoticeComponent extends BasePopupComponent {
  @Output() reloadData: EventEmitter<any> = new EventEmitter()
  offBoardNoticeModel: OffBoardNoticeDTO = new OffBoardNoticeDTO();
  remark2: any = {};
  listLeaveType = [];
  listReasonToLeave = [];
  constructor(private bsModalSvc: BsModalService,
    private _commonService: CommonService,
    private _offboardService: OffboardnoticeServiceService,
    private toastrbs: ToastrService
  ) {
    super();
    if (bsModalSvc.config["initialState"] != null) {
      this.offBoardNoticeModel = bsModalSvc.config["initialState"].model || {};
    }
  }

  ngOnInit() {
    this.getCommonData();
  }
  hidemodal() {
    this.bsModalSvc.hide(1);
  }
  save() {
    
    this.offBoardNoticeModel.employeeId = this.currentuser.employeeId;
    this._offboardService.save(this.offBoardNoticeModel).subscribe(
      data => {
          this.toastrbs.success("Submit off board","Submit Sucessfull");
          this.hidemodal();
          this.reloadData.emit(data['payload']);
      }
    );
  }
  getCommonData() {
    this._commonService.getStdcodesByCode("LEVEDATETYPE,REASONTOLEAVE").subscribe(
      data => {
        this.listLeaveType = data[this.payLoad].filter(x => x.codeType == 'LEVEDATETYPE');
        this.listReasonToLeave = data[this.payLoad].filter(x => x.codeType == 'REASONTOLEAVE');
      }
    );
  }
  changedType() {
    debugger;
    if (this.offBoardNoticeModel.leaveDateType == "STD30") {
      this.offBoardNoticeModel.expectedLeaveDate = moment().add(30, 'days');
    }
    else
      if (this.offBoardNoticeModel.leaveDateType == "STD60") {
        this.offBoardNoticeModel.expectedLeaveDate = moment().add(60, 'days');
      }
  }
  keyupHandlerFunction(event) {
     
  }
}
