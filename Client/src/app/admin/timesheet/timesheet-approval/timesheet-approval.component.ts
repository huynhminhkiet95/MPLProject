import { Component, OnInit,ViewChild,Output,EventEmitter, Input} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AnnounceService,FileService, TimesheetService } from '../../../_services/index';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Globalconst } from '../../../_helpers';
@Component({
  selector: 'app-timesheet-approval',
  templateUrl: './timesheet-approval.component.html',
  styleUrls: ['./timesheet-approval.component.css']
})
export class TimesheetApprovalComponent implements OnInit {
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()
  model:any={};
  replyModel:any={};
  title='';
  isValid:any={};
  constructor(public toastr:ToastrService,private modalService: BsModalService,
    public bsModalRef: BsModalRef,private timesheetSvc:TimesheetService,private _global:Globalconst) { 
    this.model=modalService.config["initialState"].model;
    
    this.model.startTime=this.convertLocalTime(modalService.config["initialState"].model.startTime);
    this.model.endTime=this.convertLocalTime(modalService.config["initialState"].model.endTime);

    let employeeId=this._global._userinfo.employeeId;
    
    this.replyModel.tsId=this.model.tsId;
    this.replyModel.updateUser=employeeId;

    if(this.model.employeeId===employeeId)
    {
      this.model.isCanApproval=false;
    }
    else this.model.isCanApproval=true;

  }

  ngOnInit() {
    this.replyModel.approveType="Approved";
  }
  convertLocalTime(localtime)
  {
    var localTime1  = moment.utc(localtime);
    return moment(localTime1).local(true)["_d"];
  }
  replyRequest()
  {
    
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
