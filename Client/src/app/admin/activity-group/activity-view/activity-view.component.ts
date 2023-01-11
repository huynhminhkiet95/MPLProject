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
import { ActionLogDto } from '../../../_models/ActionLogDto';
declare function escape(s: string): string;

@Component({
  selector: 'app-activity-view',
  templateUrl: './activity-view.component.html',
  styleUrls: ['./activity-view.component.css']
})
export class ActivityViewComponent extends BaseComponent {
  @ViewChild(FileuploadComponent) public fileUpload: FileuploadComponent;
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter();
  model: any = {};
  activityTypes: any = [];
  listEmp: any = [];
  listLogs: any = [];
  editMode = false;
  comment: any = {};
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
    }

  }

  ngOnInit() {
    this.comment.comment = '';
    this.fileUpload.refNoType = 'ACT';
    this.fileUpload.autoSave = true;
    this.fileUpload._userId = this.currentuser.employeeId;
    this.fileUpload.refNoValue = this.model.actNo;
    this.fileUpload.getFile2();
  }
  Save() {
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
      }
    );
  }
  keyupHandlerFunction(event) {

    this.model.details = event;
  }
  addComment() {
    if (this.model.comment == undefined || this.model.comment == '')
      return;
    let commentDto: ActionLogDto = new ActionLogDto();
    commentDto.ACTNo = this.model.actNo;
    commentDto.CreatedBy = this.currentuser.employeeId;
    commentDto.ActionType = 'COMMENT';
    commentDto.Details = this.model.comment;
    commentDto.CreatedOn = new Date();
    this._service.saveLog(commentDto).subscribe(
      data => {

        this.toastr.success("Add comment sucessfull", "Add Comment");
        this.model.comment = '';          
       
        let newLog = {
          'actNo': commentDto.ACTNo,
          'details': commentDto.Details,
          'actionType': commentDto.ActionType,
          'createdOn': data["payload"].createdOn,
          'createdBy': commentDto.CreatedBy,
          'createdByName': this.currentuser.employeeName,
          'avatar': this.currentuser.avartarThumbnail,
          'isUse': true
        }
        this.listLogs.push(newLog);       
      }
    );
  }
  updateStatus(status: string) {
    let dto: any = {};
    dto.userId = this.currentuser.employeeId;
    dto.actNo = this.model.actNo;
    dto.status = status;
    this._service.updateStatus(dto).subscribe(
      data => {
        if (data['payload'] > 0) {
          this.toastr.success("Update Status Sucessfull", "Update Status");
          this.model.status = status;
          this.reloadGrid.emit(null);
        }
      }
    );
  }
}
