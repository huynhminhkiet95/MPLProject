import { Component, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { AnnounceService, CommonService, FileService, SSOCommonService } from '../../_services/index'
import * as moment from 'moment';
import CustomStore from 'devextreme/data/custom_store';;
import 'rxjs/add/operator/take';
import { AnnounceDetailComponent } from './announce-detail/announce-detail.component';
import { BaseComponent } from '../../_directives/base.component';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { confirm } from 'devextreme/ui/dialog';
import { _const } from '../../_helpers/constants';

declare var AdminLTE: any;

@Component({
  selector: 'app-announce',
  templateUrl: './announce.component.html',
  styleUrls: ['./announce.component.css']
})

export class AnnounceComponent extends BaseComponent {

  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  searchModel: any = {};
  bsModalRef: BsModalRef;
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
  _isAdmin = false;
  listWorkLocs: any = [];

  constructor(
    private modalService: BsModalService
    , private commonSvc: CommonService
    , private announceSvc: AnnounceService
    , private ssoCommonSvc: SSOCommonService
    , public router: Router
    , public fileSvc: FileService
    , public route: ActivatedRoute
  ) {
    super(router);
  }

  ngOnInit() {
    this.title = this.languages.announcement;
    AdminLTE.init();
    this.bsRangeValue = [moment().subtract(10, 'days')["_d"], new Date()];
    this.searchModel.Type = '';
    this.searchModel.Subject = '';
    this.searchModel.DateFrom = moment(this.bsRangeValue[0]).format(_const.DATE_FORMAT.yyyymmdd);
    this.searchModel.DateTo = moment(this.bsRangeValue[1]).format(_const.DATE_FORMAT.yyyymmdd);
    this.searchModel.AnnounceGroup = "ANN";

    if (this.currentuser.roleId == _const.APP_CONFIG.default_password)
      this._isAdmin = true;

    this.dataSource.store = new CustomStore({
      load: (loadOptions) => {
        let that = this;

        this.searchModel.SkipRecord = loadOptions.skip || 0;
        this.searchModel.TakeRecord = loadOptions.take || 12;

        if (loadOptions.sort) {
          this.searchModel.SortColumn = loadOptions.sort[0].selector;
          if (loadOptions.sort[0].desc) {
            this.searchModel.SortOrder = ' desc';
          }
        }
        return that.announceSvc.search(this.searchModel)
          .toPromise()
          .then(res => {
            return {
              data: res[this.payLoad],
              totalCount: res[this.payLoad][0] ? res[this.payLoad][0].totalCount : 0
            }
          }).catch(error => { throw 'Data Loading Error' });

      },
      remove: (key) => {
        key.UpdateUser = this.currentuser.employeeId;
        key.expireDate = null;
        key.createDate = null;
        return this.announceSvc.delete(key)
          .toPromise()
          .then(res => {
            this.dataGrid.instance.refresh();
          });
      }
    });

    this.getStdcodes();
    this.getSubsidiaries();
    //this.search();
  }

  openModalWithComponent() {
    this.bsModalRef = this.modalService.show(AnnounceDetailComponent, {
      class: 'modal-lg', backdrop: true,
      ignoreBackdropClick: true,
    });

    this.bsModalRef.content.title = this.languages.addannoucement;
    this.bsModalRef.content.model.createUserId = this.currentuser.employeeId;
    this.bsModalRef.content.listServiceTypes = this.listServiceTypes;
    this.bsModalRef.content.listSubsidiaries = this.listSubsidiaries;
    this.bsModalRef.content.model.createUserId = this.currentuser.employeeId;
   
    let items: any = [];
    let selectedValue: any = [];
    this.listSubsidiaries.forEach(element => {
      items.push({ id: element.subsidiaryId, text: element.subsidiaryName });
      if (this.currentuser.subsidiaryId == element.subsidiaryId) {
        selectedValue.push({ id: element.subsidiaryId, text: element.subsidiaryName });
      }
    });
    if (this.bsModalRef.content.mymultipleSelect) {
      this.bsModalRef.content.mymultipleSelect.items = items;
      this.bsModalRef.content.mymultipleSelect.refreshValue(selectedValue);
    }
    let items2: any = [];

    this.listWorkLocs.forEach(element => {
      items2.push({ id: element.id, text: element.locationName });

    });
    if (this.bsModalRef.content.location) {
      this.bsModalRef.content.location.items = items2;

    }

    this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
  }

  search() {
    if (this.bsRangeValue != null && this.bsRangeValue.length == 2) {
      this.searchModel.DateFrom = moment(this.bsRangeValue[0]).format(_const.DATE_FORMAT.yyyymmdd);
      this.searchModel.DateTo = moment(this.bsRangeValue[1]).format(_const.DATE_FORMAT.yyyymmdd);
    }

    if (this.dataGrid.instance) {
      this.dataGrid.instance.refresh();
    }
  }

  delete(key) {
    var result = confirm("Are you sure delete this row?", 'Confirm delete');
    result.done((dialogResult: any) => {
      if (dialogResult) {
        var model: any = {};
        model.AnnId = key;
        var currentuser = JSON.parse(localStorage.getItem('currentUser')) || {};
        model.UpdateUser = currentuser.employeeId;
        return this.announceSvc.delete(model)
          .toPromise()
          .then(res => {
            this.dataGrid.instance.refresh();
          });
      }
    })
  }

  edit(annId) {
    this.announceSvc.getById(annId, this.currentuser.employeeId).subscribe(
      data => {
        let announce = data[this.payLoad].announInfo;
        this.bsModalRef = this.modalService.show(AnnounceDetailComponent, {
          class: 'modal-lg', backdrop: true,
          ignoreBackdropClick: true
        });
        this.bsModalRef.content.title = this.languages.editannouncement;
        this.bsModalRef.content.listServiceTypes = this.listServiceTypes;
        this.bsModalRef.content.listSubsidiaries = this.listSubsidiaries;
        // this.bsModalRef.content.listDivision = this.listDivision;
        this.bsModalRef.content.listWorkLocs = this.listWorkLocs;
        this.bsModalRef.content.model = data[this.payLoad].announInfo;
        this.bsModalRef.content.bsValue = new Date(announce.expireDate);
        this.bsModalRef.content.myEditor.editor.setContent(data[this.payLoad].announInfo.contents);
        this.bsModalRef.content.areacontent.contents = data[this.payLoad].announInfo.contents;
        this.bsModalRef.content.editlabel = "Update"
        this.bsModalRef.content.attachments = data[this.payLoad].listDoc;
        let rellist: string = data[this.payLoad].announInfo.relsubsidiarys;
        let items: any = [];
        let selectedValue: any = [];

        this.listSubsidiaries.forEach(element => {
          items.push({ id: element.subsidiaryId, text: element.subsidiaryName });
          if (rellist != null && rellist.indexOf(element.subsidiaryId) > 0) {
            selectedValue.push({ id: element.subsidiaryId, text: element.subsidiaryName });
          }
        });
        if (this.bsModalRef.content.mymultipleSelect) {
          this.bsModalRef.content.mymultipleSelect.items = items;
          this.bsModalRef.content.mymultipleSelect.refreshValue(selectedValue);

        }
        let items2: any = [];
        let selectedValue2: any = [];

        rellist = data[this.payLoad].announInfo.allowLocation;
        let locaselect = rellist.split(',');
        this.listWorkLocs.forEach(element => {
          items2.push({ id: element.id, text: element.locationName });
          if (rellist != null && locaselect.find(x => x == element.id.toString())) {
            selectedValue2.push({ id: element.id, text: element.locationName });
          }
        });
        if (this.bsModalRef.content.location) {
          this.bsModalRef.content.location.items = items2;
          this.bsModalRef.content.location.refreshValue(selectedValue2);
        }

        this.bsModalRef.content.editMode = true;
        this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
      }
    );
  }

  getStdcodes() {
    this.commonSvc.getStdcodesByCode('ANNTYPE').subscribe(
      data => {
        this.listServiceTypes = data[this.payLoad].filter(
          tagVariant => tagVariant != null && tagVariant.tagVariant === "ANN");;
      }
    );
    this.commonSvc.getWorkLoc().subscribe(
      data => {
        this.listWorkLocs = data[this.payLoad];
      }
    )
  }

  openNewsModel(template: TemplateRef<any>, news: any) {
    this.announceSvc.getById(news.data.annId, this.currentuser.employeeId).subscribe(
      data => {

        this.newsView = data[this.payLoad].announInfo;
        this.newsView.listDocs = data[this.payLoad].listDoc;
        this.newsView.viewCount = data[this.payLoad].viewCount;
        this.bsModalRef = this.modalService.show(template);
      })
  }

  downloadFile(docNo) {
    this.fileSvc.downloadFile(docNo);
  }

  private getSubsidiaries(): void {
    this.ssoCommonSvc.getSubsidiaries().subscribe(
      data => {
        this.listSubsidiaries = data[_const.API_KEYS.payload];
      }
    );
  }
}
