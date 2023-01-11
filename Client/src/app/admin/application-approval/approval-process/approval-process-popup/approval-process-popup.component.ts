import { Component, OnInit, ViewChild } from '@angular/core';
import { FileuploadComponent } from '../../../../_directives';
import { Globalconst } from '../../../../_helpers';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-approval-process-popup',
  templateUrl: './approval-process-popup.component.html',
  styleUrls: ['./approval-process-popup.component.css']
})
export class ApprovalProcessPopupComponent implements OnInit {
  @ViewChild("UploadFile") public fileUpload2: FileuploadComponent;
  hlvId: string = '';

  constructor(public globals: Globalconst, private route: ActivatedRoute, public modalService: BsModalService, public bsModalRef: BsModalRef) {
    this.hlvId = modalService.config["initialState"].hlvId;
  }

  ngOnInit() {
    this.fileUpload2.refNoType = "SVCRACCDOC";
    this.fileUpload2.refNoValue = this.hlvId;
    this.fileUpload2._userId = this.globals._userinfo.employeeId;
    this.fileUpload2.getFile(this.hlvId, "SVCRACCDOC");

  }

  close() {
    this.bsModalRef.hide();
  }

}
