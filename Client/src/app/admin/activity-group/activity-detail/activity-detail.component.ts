
import { BaseComponent } from '../../../_directives/base.component';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Globalconst } from '../../../_helpers';
import { CommonService, FileService } from '../../../_services';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import * as moment from 'moment';
import { FileuploadComponent } from '../../../_directives/fileupload/fileupload.component';
import { ActivityGroupSerivce } from '../../../_services/activity-group-serivce.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivityModel } from '../../../_models/ActivityModel';
declare function escape(s: string): string;

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.css']
})
export class ActivityDetailComponent extends BaseComponent {
  @ViewChild("assetUploadFile") public fileUpload: FileuploadComponent;
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()
  model: ActivityModel = new ActivityModel();
  activityTypes: any = [];
  listEmp: any = [];
  editMode = false;
  listLogs: any = [];
  current: Date = new Date();
  constructor(public router: Router,
    public modalService: BsModalService,
    public _global: Globalconst,
    private commonSvc: CommonService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    public bsModalRef: BsModalRef,
    public _service: ActivityGroupSerivce,
    public fileSvc: FileService,
    private sanitizer: DomSanitizer
  ) {
    super(router);
    if (modalService.config["initialState"] != null) {
      this.model = modalService.config["initialState"].model || {};
      this.listLogs = modalService.config["initialState"].logs || [];
      this.editMode = modalService.config["initialState"].editMode;
    }
  }
  ngOnInit() {
    if (this.editMode &&  this.fileUpload) {
      this.fileUpload.refNoType = 'ACT';
      this.fileUpload.autoSave = true;
      this.fileUpload._userId = this.currentuser.employeeId;
      this.fileUpload.refNoValue = this.model.actNo;
      this.fileUpload.getFile2();
    }
   
    // Set default value when adding a new activity
    if (!this.editMode && !this.model.activityDate) {
      this.model.activityDate =  new Date();
      this.model.dueDate = new Date();
    }
  }
  Save() {
    this.IsSubmit == true;
    if (this.editMode)
      this.Update();
    else
      this.Add();
  }
  Add() {
    this.model.subsidiaryId = this.currentuser.subsidiaryId;
    this.model.createdBy = this.currentuser.employeeId;
    this.model.divisionId = this.currentuser.divisionCode;
    let details2: string = this.model.details;
    this.model.details = escape(details2);
    this._service.save(this.model).subscribe(
      data => {
        this.reloadGrid.emit(null);
        this.bsModalRef.hide();
        this.toastr.success("Save sucessfull", "Update Activity");
      },
      error=>{
        this.IsSubmit=false;
      }
    );
  }
  Update() {
    this.model.updatedBy = this.currentuser.employeeId;
    let details2: string = this.model.details;
    this.model.details = escape(details2);
    this._service.update(this.model).subscribe(
      data => {
        this.reloadGrid.emit(null);
        this.bsModalRef.hide();
        this.toastr.success("Save sucessfull", "Update Activity");
      }
    );
  }
  keyupHandlerFunction(event) {
    this.model.details = event;
  }

  setCurrentUser(){
    this.model.assignedPerson = +this.currentuser.employeeId;
  }
}
