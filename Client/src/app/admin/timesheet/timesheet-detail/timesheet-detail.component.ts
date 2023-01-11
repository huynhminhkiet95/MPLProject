import { Component, OnInit,ViewChild,Output,EventEmitter, Input, TemplateRef} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {TimesheetService } from '../../../_services/index';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { BaseComponent } from '../../../_directives/base.component';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-timesheet-detail',
  templateUrl: './timesheet-detail.component.html',
  styleUrls: ['./timesheet-detail.component.css']
})
export class TimesheetDetailComponent extends BaseComponent {
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()
  @ViewChild('template') childModal: TemplateRef<any>;
  ValueFromComponent1:any;
   model:any={};
   listStatus:any=[];
   title="";
   isValid:any=[];
   modalRef: BsModalRef;

  constructor(
    public toastr:ToastrService,
    public modalService: BsModalService,
    public bsModalRef: BsModalRef,
    private timesheetSvc:TimesheetService,
    public router:Router  ,
    public route:ActivatedRoute
    
  ) { 
    
    super(router);
     this.languages = JSON.parse(localStorage.getItem('languages')) || {};
     this.model=modalService.config["initialState"].model;
     this.model.date2=modalService.config["initialState"].model.createDate;
     this.model.startTime=this.convertLocalTime(modalService.config["initialState"].model.startTime);
     this.model.endTime=this.convertLocalTime(modalService.config["initialState"].model.endTime);
     this.model.manualPostType=modalService.config["initialState"].model.selectedType.codeId;
  }

  ngOnInit() {
  
  }
 
  changed()
  {
     

     this.model.workHour=this.model.endTime.getHours() - this.model.startTime.getHours();
     var minute = this.model.endTime.getMinutes() - this.model.startTime.getMinutes();

     this.model.workHour += minute/60;

     if(this.model.workHour>8)
      {
        this.model.overtTimeHour=this.model.workHour-9;
      }
      else
      {
        this.model.overtTimeHour=0;
      }
  }
  convertLocalTime(localtime)
  {
    var localTime1  = moment.utc(localtime);
    return moment(localTime1).local(true)["_d"];
  }
  update()
  {
    var currentuser = JSON.parse(localStorage.getItem('currentUser')) || {};
      this.model.updateUser=currentuser.employeeId;
      this.timesheetSvc.update(this.model).subscribe(
        data=>{
            this.toastr.success("Update Successful","Update Timesheet")
            this.reloadGrid.emit(null);
            this.bsModalRef.hide();
        },
        error=>{
          this.toastr.error("Update fail","Update Timesheet")
        }
      )
  }
  ValueFromComp1(var1:any)
  {
    
      this.ValueFromComponent1=var1;
  }

  setCurrentStartTime() {
    this.model.startTime = moment(new Date()).format('YYYY/MM/DD HH:mm');
  }

  setCurrentEndTime() {
    this.model.endTime = moment(new Date()).format('YYYY/MM/DD HH:mm');
  }
}
