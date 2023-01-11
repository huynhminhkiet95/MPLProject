import { Component, OnInit, ViewChild, NgModule, ViewContainerRef, Inject, EventEmitter, Output, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { LeaveModel, LeaveSearch } from '../../../_models/index';
import { CommonService, FileService } from '../../../_services/index';
import { ApplyLeaveService } from '../../../_services/index';
import * as moment from 'moment';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/take';
import { ApplyleaveViewComponent } from '../../applyleave/applyleave-view/applyleave-view.component'; // '../applyleave-view/applyleave-view.component';
import {ApplyleaveaddComponent} from '../../applyleave/applyleaveadd/applyleaveadd.component';
import { Route, Router } from '../../../../../node_modules/@angular/router';
import { RenderDebugInfo } from '../../../../../node_modules/@angular/core/src/render/api';
import { ToastrService } from 'ngx-toastr';
import { RequestOnBehalfAddComponent } from './requestonbehalf-add/requestonbehalf-add.component';
declare var AdminLTE: any;


@Component({
  selector: 'app-requestonbehalf',
  templateUrl: './requestonbehalf.component.html',
  styleUrls: ['./requestonbehalf.component.css']
})
export class RequestOnBehalfComponent implements OnInit {
  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  model = new LeaveModel;
  searchModel = new LeaveSearch;
  minDate = new Date(2018, 1, 1);
  maxDate = new Date();
  leaveList: any = [];
  leavetypes: any = [];
  statuslist: any = [];
  dataSource: any = {};
  bsValue: Date = new Date();
  bsRangeValue: any = [];
  bsModalRef: BsModalRef;
  self: any;
  lvNo: string = "";
  languages: any = [];
  @Input() messageEvent = new EventEmitter<string>();
  constructor(
    public leaveService: ApplyLeaveService,
    private modalService: BsModalService, private commonSvc: CommonService,
    public toastr: ToastrService, private fileSvc: FileService, private router: Router) {

    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
    this.dataSource.store = new CustomStore({
      load: (loadOptions) => {
        var params = '?';
        params += 'skip=' + loadOptions.skip || 0;
        params += '&take=' + loadOptions.take || 12;

        if (loadOptions.sort) {
          params += '&orderby=' + loadOptions.sort[0].selector;
          if (loadOptions.sort[0].desc) {
            params += ' desc';
          }
        }
        let that = this;
        return that.leaveService.searchReport(this.searchModel)
          .toPromise()
          .then(response => {
            return {
              data: response["payload"],
              totalCount: response["payload"][0] ? response["payload"][0].totalCount : 0
            }
          })
          .catch(error => { throw 'Data Loading Error' });
      }
    });
  }

  ngOnInit() {
    AdminLTE.init();
    this.bsRangeValue = [moment().subtract(10, 'days')["_d"], new Date()];
    var currentuser = JSON.parse(localStorage.getItem('currentUser')) || {};
    this.searchModel = {
      "SubmitDateF": moment(this.bsRangeValue[0]).format('YYYY/MM/DD'),
      "SubmitDateT": moment(this.bsRangeValue[1]).format('YYYY/MM/DD'),
      "UserId": currentuser.employeeId,
      "LeaveType": '',
      "Status": ''
    }
    this.searchLeaves();
    this.getStdcodes();
  }
  GetDetail(lvNo) {

    this.getLeaveDetail(lvNo);
  }
  searchLeaves() {
    if (this.bsRangeValue != null && this.bsRangeValue.length == 2) {
      this.searchModel.SubmitDateF = moment(this.bsRangeValue[0]).format('YYYY/MM/DD');
      this.searchModel.SubmitDateT = moment(this.bsRangeValue[1]).format('YYYY/MM/DD');
    }

    if (this.dataGrid.instance) {
      this.dataGrid.instance.refresh();
    }
  }

  getLeaveDetail(lvNo) {
    var currentuser = JSON.parse(localStorage.getItem('currentUser')) || {};
    this.leaveService.getById(currentuser.employeeId, lvNo).subscribe(
      data => {

        var result = data["payload"];
        if (result.leaveStatus === 'DRAF') {
          this.model.leaveDays = result.leaveDays;
          this.model.leaveType = result.result;
          this.model.ampmFull = result.ampmFull;
          this.model.leaveDays = result.leaveDays;
          this.model.leaveStatus = result.leaveStatus;
          this.model.fromDate = new Date(result.fromDate);
          this.model.toDate = new Date(result.toDate);
          this.model.leaveType = result.leaveType;
          this.model.remark = result.remark;
          this.model.marker = result.marker;
          this.model.lvNo = result.lvNo;
          this.model.attachments = result.documents;
          this.fileSvc.getByRefNoValue(lvNo)
          var isCancel = false;
          var isDraf = false;
          var isSubmit = false;
          if (this.model.leaveStatus == "DRAF") {
            isCancel = true;
            isDraf = true;
            isSubmit = true;
          }
          const initialState = {
            bsDateRank: [new Date(result.fromDate), new Date(result.toDate)],
            model:this.model
          };
          this.lvNo = lvNo;
          this.messageEvent.emit(this.lvNo);
          this.bsModalRef = this.modalService.show(RequestOnBehalfAddComponent, Object.assign({}, { class: 'modal-lg',ignoreBackdropClick: true, initialState }));
          this.bsModalRef.content.title = this.languages.editleave + " : " + lvNo;
          this.bsModalRef.content.lvno = lvNo
          this.bsModalRef.content.model = this.model;
          this.bsModalRef.content.leaveList = this.leaveList;
          this.bsModalRef.content.statuslist = this.statuslist;
          this.bsModalRef.content.isCancel = isCancel;
          this.bsModalRef.content.isDraf = isDraf;
          this.bsModalRef.content.isSubmit = isSubmit;
          this.bsModalRef.content.bsRangeValue = [new Date(result.fromDate), new Date(result.toDate)];
          this.bsModalRef.content.reloadGrid.subscribe(this.searchLeaves.bind(this));
        }
        else {
          this.router.navigate([{ outlets: { modal: ['applyleaveview', lvNo] } }]);
          //this.router.navigate()
          // this.router.navigate(['/leaves', {modal: {'applyleaveview': [lvNo]}}]);
          //this.bsModalRef = this.modalService.show(ApplyleaveViewComponent,{class: 'modal-lg'});
          // this.bsModalRef.content.model=result;
          // this.bsModalRef.content.dataSource=result.hlvLeaveDetails;
        }
      },
      error => {
        this.toastr.error(error.message);
      }
    )
  }

  openModalWithComponent() {

    this.model = new LeaveModel;
    this.model.fromDate = new Date();
    this.model.toDate = new Date();
    this.model.marker = "AM";
    this.model.lvNo = "";
    this.bsModalRef = this.modalService.show(RequestOnBehalfAddComponent, { class: 'modal-lg',ignoreBackdropClick: true});
    this.bsModalRef.content
    this.bsModalRef.content.lvno = "";
    this.bsModalRef.content.model = this.model
    this.bsModalRef.content.isCancel = false;
    this.bsModalRef.content.isDraf = true;
    this.bsModalRef.content.isSubmit = true;
    this.bsModalRef.content.title = this.languages.addnewleave;
    this.bsModalRef.content.leaveList = this.leaveList;
    this.bsModalRef.content.statuslist = this.statuslist;
    this.bsModalRef.content.reloadGrid.subscribe(this.searchLeaves.bind(this));
  }
  downloadFile(docNo) {
    this.fileSvc.downloadFile(docNo);
  }

  getStdcodes() {
    this.commonSvc.getStdcodesByCode('HRLEAVETYPE ').subscribe(
      data => {
        this.leavetypes = data["payload"];
      }
    );

    this.commonSvc.getStdcodesByCode('DOCGENSTATUS').subscribe(
      data => {
        this.statuslist = data["payload"];
      }
    );
  }
}
