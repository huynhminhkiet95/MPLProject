import { Component, OnInit, ViewChild, Output, EventEmitter, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../../_directives/base.component';
import { CoWorkLocModel } from '../../../../_models/coWorkLocModel';
import { de } from 'ngx-bootstrap';
import { COWorkLocService } from '../../../../_services/co-work-loc.service';
import { CommonService } from '../../../../_services';
import * as moment from 'moment';

@Component({
  selector: 'app-co-work-loc-popup',
  templateUrl: './co-work-loc-popup.component.html',
  styleUrls: ['./co-work-loc-popup.component.css'],
})
export class CoWorkLocPopupComponent extends BaseComponent {
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()

  model = new CoWorkLocModel();
  title: any;
  locTypes: any = [];

  constructor(public router: Router,
    public modalService: BsModalService,
    private toastr: ToastrService,
    public _coWorkLocService: COWorkLocService,
    private _commonService: CommonService,
    public bsModalRef: BsModalRef) {
    super(router);

    this.model = this.modalService.config["initialState"].model;
    this.title = this.modalService.config["initialState"].title;
    
    // Check is this.model not empty object
    if (Object.keys(this.model).length > 0) {
      // Add StartTime and EndTime as Time of Current UTC date
        this.model.starTime != null ? this.model.starTime = moment.utc().hour(0).minute(0).second(0).valueOf() + this.model.starTime : '';
        this.model.endTime != null ? this.model.endTime = moment.utc().hour(0).minute(0).second(0).valueOf() + this.model.endTime : '';
    } else this.model = new CoWorkLocModel();
    
  }

  ngOnInit() {
    this._commonService.getStdcodesByCode('LOCTYPE').subscribe(
      data => {
        this.locTypes = data['payload'];
      }
    )
  }

  Save() {
    // Convert time to UTC time with HH:mm format before save to DB
    this.model.starTime = this._commonService.convertTime(this.model.starTime);
    this.model.endTime = this._commonService.convertTime(this.model.endTime);

    if (this.model.id) {
      this.UpdateCoWorkLoc(this.model);
    } else {
      this.InsertCoWorkLoc(this.model);
    }
  }

  InsertCoWorkLoc(model) {
    this._coWorkLocService.insertCoWorkLoc(model).subscribe(
      data => {
        if (data["sucess"] = true) {
          this.toastr.success("Insert successfuly", "Insert CO_Work Loc");
          this.reloadGrid.emit(null);
          this.modalService.hide(1);
        } else {
          this.toastr.error("Error: This data already exists !!", "Insert CO_Work Loc");
        }
      }, error => {
        this.toastr.error(error["message"] ? error["message"] : error);
      }
    )
  }

  UpdateCoWorkLoc(model) {
    this._coWorkLocService.updateCoWorkLoc(model).subscribe(
      data => {
        if (data["payload"] > 0) {
          this.toastr.success("Update successfuly", "Update CO_Work Loc");
          this.reloadGrid.emit(null);
          this.modalService.hide(1);
        }
      }, error => {
        this.toastr.error(error["message"] ? error["message"] : error);
      }
    )
  }

}
