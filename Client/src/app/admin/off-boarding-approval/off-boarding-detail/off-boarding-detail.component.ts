import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { OffBoardNoticeDTO } from '../../../_models/interface/offBoardNoticeDto';
import { BasePopupComponent } from '../../../_directives/base.popup.component';
import { BsModalService } from 'ngx-bootstrap';
import { OffboardnoticeServiceService } from '../../../_services/offboardnotice.service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-off-boarding-detail',
  templateUrl: './off-boarding-detail.component.html',
  styleUrls: ['./off-boarding-detail.component.css']
})
export class OffBoardingDetailComponent extends BasePopupComponent {
  @Output() reloadData: EventEmitter<any> = new EventEmitter()
  offBoardNoticeModel: any = {};
  remark2: any = {};
  listLeaveType = [];
  listReasonToLeave = [];
  constructor(private bsModalSvc: BsModalService,
    private offboardingService:OffboardnoticeServiceService,
    private toastrService:ToastrService) {
    super();
  }

  ngOnInit() {
  }
  hidemodal() {
    this.bsModalSvc.hide(1);
  }
  saveConfirmed()
  {
    this.offBoardNoticeModel.ConfirmUser = this.currentuser.employeeId;
    this.offboardingService.confirmed(this.offBoardNoticeModel).subscribe(
      data=>{
        this.toastrService.success("Update successull","Confirmed Off Boarding Notice");
        this.hidemodal();
        this.reloadData.emit();
      }
    );
  }
}
