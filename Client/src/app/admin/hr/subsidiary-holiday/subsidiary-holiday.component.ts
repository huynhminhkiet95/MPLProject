import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../_directives/base.component';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SubsidiaryHolidayPopupComponent } from './subsidiary-holiday-popup/subsidiary-holiday-popup.component';
import { SSOCommonService } from '../../../_services';
import { HolidaySubsidiary } from '../../../_services/holiday-subsidiary.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { _const } from '../../../_helpers/constants';

declare var AdminLTE: any;
@Component({
  selector: 'app-subsidiary-holiday',
  templateUrl: './subsidiary-holiday.component.html',
  styleUrls: ['./subsidiary-holiday.component.css']
})

export class SubsidiaryHolidayComponent extends BaseComponent {

  searchModel: any = {
    DateF: new Date(),
    DateT: new Date().setMonth((new Date()).getMonth() + 1),
  };
  bsModalRef: BsModalRef;
  listSubsidiaries: any = [];
  dataSource: any = [];

  constructor(router: Router
    , private modalService: BsModalService
    , private ssoCommonSvc: SSOCommonService
    , private holidaysv: HolidaySubsidiary
    , private toastr: ToastrService
  ) {
    super(router);
  }

  ngOnInit() {
    this.searchModel.subsidiary = this.currentuser.subsidiaryId
    this.getSubsidiaries();
    AdminLTE.init();
    this.search();
  }

  addnew(value) {
    if (value == 'NEW') {
      const initialState = {
        id: value
      };

      this.bsModalRef = this.modalService.show(SubsidiaryHolidayPopupComponent, {
        class: 'modal-xs', initialState, backdrop: true,
        ignoreBackdropClick: true
      });

      this.bsModalRef.content.listSubsidiaries = this.listSubsidiaries;
      this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
    }
    else {
      let data = this.dataSource.filter(m => m.holidayId == value)[0];
      const initialState = {
        id: value,
        detail: data
      };

      this.bsModalRef = this.modalService.show(SubsidiaryHolidayPopupComponent, {
        class: 'modal-xs', initialState, backdrop: true,
        ignoreBackdropClick: true
      });

      this.bsModalRef.content.listSubsidiaries = this.listSubsidiaries;
      this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
    }

    // this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
  }

  search() {
    let model = {
      "SubsidiaryId": this.searchModel.subsidiary,
      "HDateF": moment(this.searchModel.DateF).format(_const.DATE_FORMAT.yyyy_mm_dd),
      "HDateT": moment(this.searchModel.DateT).format(_const.DATE_FORMAT.yyyy_mm_dd)
    };

    this.holidaysv.search(model).subscribe(
      data => {
        this.dataSource = data[this.payLoad];
      });
  }

  delete(e) {
    this.holidaysv.delete(e.key).subscribe(
      data => {
        if (data[this.payLoad] > 0) {
          this.toastr.success("Deleted Sucessfull", "Delete Holiday");
          this.search();
        }
      });
  }

  private getSubsidiaries() {
    this.ssoCommonSvc.getSubsidiaries().subscribe(
      data => {
        this.listSubsidiaries = data[this.payLoad];
      }
    );
  }
}