import { Component, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import * as moment from 'moment';
import { CommonService, AnnounceService, SSOCommonService } from '../../../_services';
import { Router } from '@angular/router';
import { WelcomeBoardModel } from '../../../_models/WelcomeBoardModel';
import { _const } from '../../../_helpers/constants';
import { BasePopupComponent } from '../../../_directives/base.popup.component';

declare var AdminLTE: any;
@Component({
  selector: 'app-announce-popup',
  templateUrl: './announce-popup.component.html',
  styleUrls: ['./announce-popup.component.css']
})

export class AnnouncePopupComponent extends BasePopupComponent {

  @ViewChild('template') childModal: TemplateRef<any>;
  searchModel: any = {};
  okButtonOptions: any;
  listIdRequest: any[] = [];
  minDate = new Date(2018, 1, 1);
  title = "";
  maxDate = new Date();
  listServiceTypes: any = [];
  bsValue: Date = new Date();
  bsRangeValue: any = [];
  dataSource: any = {};
  listSubsidiaries: any = [];
  self: any;
  events: Array<string> = [];
  newsView: any = {};
  config = {
    backdrop: true,
    ignoreBackdropClick: false
  };
  selectedItemKeys: any[] = [];
  idslide: string;
  dataslide: any;
  welcomeBoard = new WelcomeBoardModel;
  modalRef: BsModalRef;
  isBtnView: boolean = false;

  constructor(
      public router:Router,
      public bsModalRef: BsModalRef
    , private modalService: BsModalService
    , private commonSvc: CommonService
    , private announceSvc: AnnounceService
    , private ssoCommonSvc: SSOCommonService
  ) {
    super();
  }

  selectionChanged(data: any) {
    this.dataslide = data.selectedRowKeys;
    this.selectedItemKeys = data.selectedRowKeys;
    if (data.selectedRowKeys.length == 0)
      this.isBtnView = false;
    else
      this.isBtnView = true;
  }

  viewdataanouncement() {
    this.idslide = "";
    let theme = this.welcomeBoard.Theme;
    for (var i = 0; i < this.dataslide.length; i++) {

      if ((i + 1) == this.dataslide.length)
        this.idslide += "" + this.dataslide[i].annId + "";
      else
        this.idslide += "" + this.dataslide[i].annId + ",";
    }
    window.open('announcement-board/' + this.idslide + '/' + theme, '', 'height=400,width=600');
  }

  ngOnInit() {
    this.openModal(this.childModal);
    this.title = this.languages.announcement;
    AdminLTE.init();
    this.welcomeBoard.Theme = "wooden.jpg";
    this.bsRangeValue = [moment().subtract(100, 'days')["_d"], new Date()];
    this.searchModel.Type = '';
    this.searchModel.Subject = '';

    this.searchModel.DateFrom = moment(this.bsRangeValue[0]).format(_const.DATE_FORMAT.yyyymmdd);
    this.searchModel.DateTo = moment(this.bsRangeValue[1]).format(_const.DATE_FORMAT.yyyymmdd);
    this.searchModel.AnnounceGroup = "ANN";

    this.getStdcodes();
    this.getSubsidiaries();
    this.search();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {
        class: 'gray modal-lg', backdrop: true,
        ignoreBackdropClick: true, keyboard: false
      })
    );
  }

  close() {
    this.modalRef.hide();
    this.router.navigate([{ outlets: { modal: null } }]);
  }

  getStdcodes() {
    this.commonSvc.getStdcodesByCode(_const.CODE_TYPE.ann_type).subscribe(
      data => {
        this.listServiceTypes = data[this.payLoad].filter(
          tagVariant => tagVariant != null && tagVariant.tagVariant === "ANN");;
      }
    );
  }

  search() {
    if (this.bsRangeValue != null && this.bsRangeValue.length == 2) {
      this.searchModel.DateFrom = moment(this.bsRangeValue[0]).format(_const.DATE_FORMAT.yyyymmdd);
      this.searchModel.DateTo = moment(this.bsRangeValue[1]).format(_const.DATE_FORMAT.yyyymmdd);
    }

    this.announceSvc.search(this.searchModel)
      .toPromise()
      .then(res => {
        this.dataSource = res[this.payLoad]
      }).catch(error => { alert('Data Loading Error') });
  }

  private getSubsidiaries(): void {
    this.ssoCommonSvc.getSubsidiaries().subscribe(
      data => {
        this.listSubsidiaries = data[_const.API_KEYS.payload];
      }
    );
  }
}