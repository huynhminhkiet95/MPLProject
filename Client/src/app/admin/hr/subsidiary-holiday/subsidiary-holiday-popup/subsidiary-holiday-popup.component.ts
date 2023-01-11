import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../../_directives/base.component';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import * as moment from 'moment';
import { HolidaySubsidiary } from '../../../../_services/holiday-subsidiary.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subsidiary-holiday-popup',
  templateUrl: './subsidiary-holiday-popup.component.html',
  styleUrls: ['./subsidiary-holiday-popup.component.css']
})
export class SubsidiaryHolidayPopupComponent extends BaseComponent {
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()

  model: any = {};
  listSubsidiaries: any = [];
  detail:any = {};
  id:any;
  constructor(router: Router,
    public bsModalRef: BsModalRef,
    public hrsv: HolidaySubsidiary,
    public toastr: ToastrService,
    private modalService: BsModalService,

  ) {
    super(router);
    this.id= this.modalService.config["initialState"].id;
  }

  ngOnInit() {
    this.languages.submit = 'Save';
    if (this.id != 'NEW') {
      this.languages.submit = 'Update';
      this.detail= this.modalService.config["initialState"].detail;
      this.model.HolidaySubject = this.detail.holidaySubject;
      this.model.HolidayNote = this.detail.holidayNote;
      this.model.HDateF = new Date( this.detail.hDateF);
      this.model.HDateT =new Date( this.detail.hDateT);
      this.model.SubsidiaryId =this.detail.subsidiaryId;
    }
    this.model.SubsidiaryId = this.currentuser.subsidiaryId;
  }
  save() {
    let data: any = {
      "SubsidiaryId": this.model.SubsidiaryId,
      "HDateF": moment(this.model.HDateF).format("MM/DD/YYYY"),
      "HDateT": moment(this.model.HDateT).format("MM/DD/YYYY"),
      "HolidaySubject": this.model.HolidaySubject,
      "CreateUser": this.currentuser.employeeId,
      "HolidayNote": this.model.HolidayNote
    };
    if (this.id != 'NEW') {
      data.HolidayId = this.id;
      this.hrsv.update(data).subscribe(
        data=>
        {
          if (data["payload"] > 0) {
            this.toastr.success("Updated Sucessfull", "Update Holiday");
            this.reloadGrid.emit(null);
            this.bsModalRef.hide();
          }
         
        }
      )
      this.reloadGrid.emit(null);
      this.bsModalRef.hide();
    }
    else
    {
      
      this.hrsv.add(data).subscribe(
        data => {
          if (data["payload"].holidayId > 0) {
            this.toastr.success("Inserted Sucessfull", "Inserted Holiday");
            this.reloadGrid.emit(null);
            this.bsModalRef.hide();
          }
        });
    }
    

  }
}
