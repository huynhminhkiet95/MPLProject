import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TimesheetService } from '../../../_services';
import { Globalconst } from '../../../_helpers';
import * as moment from 'moment';

@Component({
  selector: 'app-timesheetapproval-popup',
  templateUrl: './timesheetapproval-popup.component.html',
  styleUrls: ['./timesheetapproval-popup.component.css']
})
export class TimesheetapprovalPopupComponent implements OnInit {
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()

model:any={};
replyModel:any={};
title = "TimeSheet Approval";
isDisableApprocomment:boolean=false;
  constructor(public toastr:ToastrService,private modalService: BsModalService,
    public bsModalRef: BsModalRef,private timesheetSvc:TimesheetService,private _global:Globalconst) { 
    this.model=modalService.config["initialState"].model;
    
    this.model.startTime=this.convertLocalTime(modalService.config["initialState"].model.startTime);
    this.model.endTime=this.convertLocalTime(modalService.config["initialState"].model.endTime);
    this.model.approveComment = modalService.config["initialState"].model.approveComment;
    if (this.model.tsStatus=='CLOS') {
      this.isDisableApprocomment = true;
      
    }
    let employeeId=this._global._userinfo.employeeId;
    
    this.replyModel.tsId=this.model.tsId;
    this.replyModel.updateUser=employeeId;

    if(this.model.employeeId===employeeId)
    {
      this.model.isCanApproval=false;
    }
    else this.model.isCanApproval=true;
  }
  convertLocalTime(localtime)
  {
    var localTime1  = moment.utc(localtime);
    return moment(localTime1).local(true)["_d"];
  }
  ngOnInit() {
    this.replyModel.approveType="Approved";
  }
  replyRequest(form)
  {
    this.replyModel.approveComment = this.model.approveComment;
    this.timesheetSvc.approval(this.replyModel).subscribe(
      data=>{
        this.toastr.success("Update Successful","Update Timesheet")
        this.reloadGrid.emit(null);
        this.bsModalRef.hide();
        
    },
    error=>{
      this.toastr.error("Update Unuccessful","Update Timesheet")
    }
    );
  }
}
