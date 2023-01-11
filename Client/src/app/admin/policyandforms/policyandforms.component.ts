import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { AnnounceService, CommonService, FileService, SSOCommonService } from '../../_services/index'
import * as moment from 'moment';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/take';
import { PolicyandformsdetailComponent } from './policyandformsdetail/policyandformsdetail.component'
declare var AdminLTE: any;

@Component({
  selector: 'app-policyandforms',
  templateUrl: './policyandforms.component.html',
  styleUrls: ['./policyandforms.component.css']
})

export class PolicyandformsComponent implements OnInit {
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
  events: Array<string> = [];
  languages: any = [];
  newsView: any = {};
  currentuser: any = {};
  _isAdmin: boolean;

  constructor(
    private modalService: BsModalService,
    private commonSvc: CommonService,
    private ssoCommonSvc: SSOCommonService,
    private announceSvc: AnnounceService,
    public svcFile: FileService) {
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
    this.currentuser = JSON.parse(localStorage.getItem('currentUser')) || {};
  }

  ngOnInit() {
    this.title = this.languages.announcement;
    AdminLTE.init();
    this.bsRangeValue = [new Date("2017/01/01"), new Date()];
    this.searchModel.Type = '';
    this.searchModel.Subject = '';
    this.searchModel.DateFrom = moment(this.bsRangeValue[0]).format('YYYY/MM/DD');
    this.searchModel.DateTo = moment(this.bsRangeValue[1]).format('YYYY/MM/DD');
    this.searchModel.AnnounceGroup = "PNF";
    if (this.currentuser.roleId == '5A6869E0-1C3D-11E8-ACCF-0ED5F89F718B') {
      this._isAdmin = true;
    }
    else
      this._isAdmin = false;
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
              data: res["payload"],
              totalCount: res["payload"][0] ? res["payload"][0].totalCount : 0
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
    //this.search();
  }
  openModalWithComponent() {
    this.bsModalRef = this.modalService.show(PolicyandformsdetailComponent, {
      class: 'modal-lg', backdrop: true,
      ignoreBackdropClick: true
    });

    this.bsModalRef.content.title = this.languages.addannoucement;
    this.bsModalRef.content.model.createUserId = this.currentuser.employeeId;
    this.bsModalRef.content.listServiceTypes = this.listServiceTypes;
    this.bsModalRef.content.listSubsidiaries = this.listSubsidiaries;

    let items: any = [];
    this.listSubsidiaries.forEach(element => {
      items.push({ id: element.subsidiaryId, text: element.subsidiaryName });
    });
    if (this.bsModalRef.content.mymultipleSelect) {
      this.bsModalRef.content.mymultipleSelect.items = items;
    }

    this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
  }

  search() {
    if (this.bsRangeValue != null && this.bsRangeValue.length == 2) {
      this.searchModel.DateFrom = moment(this.bsRangeValue[0]).format('YYYY/MM/DD');
      this.searchModel.DateTo = moment(this.bsRangeValue[1]).format('YYYY/MM/DD');
    }

    if (this.dataGrid.instance) {
      this.dataGrid.instance.refresh();
    }
  }
  delete(key) {
    if (confirm("Are you sure delte this row?")) {
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
  }
  edit(annId) {
    const initialState = {
      editMode: true,
      annId: annId
    };
    this.announceSvc.getById(annId, this.currentuser.employeeId).subscribe(
      data => {
        this.bsModalRef = this.modalService.show(PolicyandformsdetailComponent, Object.assign({}, { class: 'modal-lg', ignoreBackdropClick: true, initialState }));
        this.bsModalRef.content.title = this.languages.editannouncement;
        this.bsModalRef.content.listServiceTypes = this.listServiceTypes;
        this.bsModalRef.content.listSubsidiaries = this.listSubsidiaries;
        this.bsModalRef.content.model = data["payload"].announInfo;
        this.bsModalRef.content.myEditor.editor.setContent(data["payload"].announInfo.contents);
        this.bsModalRef.content.areacontent.contents = data["payload"].announInfo.contents;
        this.bsModalRef.content.editlabel = "Update"
        this.bsModalRef.content.attachments = data["payload"].listDoc;
        let rellist: string = data["payload"].announInfo.relsubsidiarys;
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
        this.bsModalRef.content.editMode = true;
        this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
      }
    );

  }
  getStdcodes() {
    this.commonSvc.getStdcodesByCode('ANNTYPE').subscribe(
      data => {
        this.listServiceTypes = data["payload"].filter(
          tagVariant => tagVariant != null && tagVariant.tagVariant == "PNF");;
      }
    );

    this.ssoCommonSvc.getSubsidiaries().subscribe(
      data => {
        this.listSubsidiaries = data["payload"];
      }
    );
  }

  openNewsModel(template: TemplateRef<any>, news: any) {
    this.announceSvc.getById(news.data.annId, this.currentuser.employeeId).subscribe(
      data => {
        template
        this.newsView = data["payload"].announInfo;
        this.newsView.listDocs = data["payload"].listDoc;
        this.bsModalRef = this.modalService.show(
          template,
          Object.assign({}, { class: 'gray modal-lg' })
        );
      })
  }
}
