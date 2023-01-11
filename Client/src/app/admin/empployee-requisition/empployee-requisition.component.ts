import { Component, OnInit, ViewChild, NgModule, ViewContainerRef, EventEmitter, Output, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { EmpRequisitionSearch } from '../../_models/index';
import { DxDataGridComponent } from 'devextreme-angular';
import { CommonService, SSOCommonService } from '../../_services/index'
import { EmpRequisitionService } from '../../_services/index';
import { EmpRequisitionEntry } from '../../_models/index'
import CustomStore from 'devextreme/data/custom_store';
import * as moment from 'moment';
import 'rxjs/add/operator/take';
import { EmployeeRequisitionDetailComponent } from '../empployee-requisition/employee-requisition-detail/employee-requisition-detail.component'
import { WfUserGroupService } from '../../_services/wf-user-group.service';
import { BaseComponent } from '../../_directives/base.component';
import { Router } from '@angular/router';
import { _const } from '../../_helpers/constants';

declare var AdminLTE: any;
@Component({
  selector: 'app-empployee-requisition',
  templateUrl: './empployee-requisition.component.html',
  styleUrls: ['./empployee-requisition.component.css']
})

export class EmpployeeRequisitionComponent extends BaseComponent {

  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  @Input() messageEvent = new EventEmitter<string>();

  title: string;
  status: string = ""
  model = new EmpRequisitionEntry;
  bsRangeValue: any = [];
  searchModel = new EmpRequisitionSearch;
  dataSource: any = {};
  statuslist: any = [];
  ageRangeList: any = [];
  eduLevelList: any = [];
  exYearsList: any = [];
  departments: any = [];
  genderList: any = [];
  employeeAssignList: any = [];
  bsModalRef: BsModalRef;
  documentInfos: any = [];
  empRequisitionItems: any = [];

  constructor(
    public router: Router
    , public empRequisitionSvc: EmpRequisitionService
    , private modalService: BsModalService
    , private commonSvc: CommonService
    , private ssoCommonSvc: SSOCommonService
    , public _userGroupService: WfUserGroupService
  ) {
    super(router);
    this.title = this.languages.employeerequisition;

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
        return this.empRequisitionSvc.getEmpRequisition(this.searchModel)
          .toPromise()
          .then(response => {
            return {
              data: response[this.payLoad],
              totalCount: response[this.payLoad][0] ? response[this.payLoad][0].totalCount : 0
            }
          }).catch(error => { throw error });
      }
    });
  }

  ngOnInit() {
    AdminLTE.init();
    this.bsRangeValue = [moment().subtract(10, 'days')["_d"], new Date()];

    this.searchModel = {
      "SubmitDateF": moment(this.bsRangeValue[0]).format(_const.DATE_FORMAT.yyyy_mm_dd),
      "SubmitDateT": moment(this.bsRangeValue[1]).format(_const.DATE_FORMAT.yyyy_mm_dd),
      "UserId": this.currentuser.employeeId,
      //"UserId": '1',
      "Status": ''
    }

    this.getStdcodes();
    this.getDepartmentsByDivisionCode();
    this.searchrequisitions();
    this.getEmployeeUserGroupAssignForHR();

  }

  getEmployeeUserGroupAssignForHR() {
    this._userGroupService.getEmployeeUserGroup(_const.CODE_TYPE.hrer).subscribe(
      data => {
        this.employeeAssignList = data[this.payLoad];
      }
    )
  }

  GetEmpRequisitionDetail(id) {
    this.empRequisitionSvc.getEmpRequisitionDetail(id, this.currentuser.employeeId).subscribe(response => {
      var data = response[this.payLoad];
      this.model = new EmpRequisitionEntry;
      this.model.SubsidiaryId = data.subsidiaryId;
      this.model.DeptCode = data.deptCode;
      this.model.JobTitle = data.jobTitle;
      this.model.Qty = data.qty;
      this.model.ExpectedStartDate = new Date(data.expectedStartDate);
      this.model.IsNew = data.isNew;
      this.model.ReplaceFor = data.replaceFor;
      this.model.EducationLevel = data.educationLevel;
      this.model.ExperienceYear = data.experienceYear;
      this.model.AgeRange = data.ageRange;
      this.model.JobDescription = data.jobDescription;
      this.model.RequiredSkill = data.requiredSkill;
      this.model.LanguageSkill = data.languageSkill;
      this.model.Benefit = data.benefit;
      this.model.CreateUser = data.createUser;
      this.model.ReportTo = data.reportTo;
      this.model.WorkingLocation = data.workingLocation;
      this.model.Gender = data.gender;
      this.model.EmpReqStatus = data.empReqStatus;
      this.model.Id = data.erqNo;
      this.model.hrEmployeeId = data.hrEmployeeId;
      this.model.reasonRequisition = data.reasonRequisition;
      this.documentInfos = data.documentInfos;
      this.empRequisitionItems = data.empRequisitionItems;

      var isCancel = false;
      var isDraf = false;
      var isSubmit = false;

      if (this.model.EmpReqStatus == "DRAF") {
        isCancel = true;
        isDraf = true;
        isSubmit = true;
      }
      this.bsModalRef = this.modalService.show(EmployeeRequisitionDetailComponent, { class: 'modal-lg' });
      this.bsModalRef.content
      this.bsModalRef.content.Id = data.erqNo;
      this.bsModalRef.content.model = this.model
      this.bsModalRef.content.title = 'Update Requisition : ' + data.erqNo;
      this.bsModalRef.content.exYearsList = this.exYearsList;
      this.bsModalRef.content.ageRangeList = this.ageRangeList;
      this.bsModalRef.content.eduLevelList = this.eduLevelList;
      this.bsModalRef.content.genderList = this.genderList;
      this.bsModalRef.content.departments = this.departments;
      this.bsModalRef.content.documentInfos = this.documentInfos;
      this.bsModalRef.content.isCancel = isCancel;
      this.bsModalRef.content.isDraf = isDraf;
      this.bsModalRef.content.isSubmit = isSubmit;
      this.bsModalRef.content.employeeAssignList = this.employeeAssignList;
      this.bsModalRef.content.reloadGrid.subscribe(this.searchrequisitions.bind(this));
      this.bsModalRef.content.empRequisitionItems = this.empRequisitionItems;
    })
  }

  searchrequisitions() {
    if (this.bsRangeValue != null && this.bsRangeValue.length == 2) {
      this.searchModel.SubmitDateF = moment(this.bsRangeValue[0]).format(_const.DATE_FORMAT.yyyy_mm_dd);
      this.searchModel.SubmitDateT = moment(this.bsRangeValue[1]).format(_const.DATE_FORMAT.yyyy_mm_dd);
    }
    if (this.dataGrid.instance) {
      this.dataGrid.instance.refresh();
    }
  }

  getDepartmentsByDivisionCode() {
    this.ssoCommonSvc.getDepartmentsBydivisionCode(this.currentuser.subsidiaryId, this.currentuser.divisionCode).subscribe(
      data => {
        this.departments = data[this.payLoad];
      }
    );
  }

  getStdcodes() {
    const strCodeType = `${_const.CODE_TYPE.docgen_status},${_const.CODE_TYPE.hrage_range},${_const.CODE_TYPE.gender},${_const.CODE_TYPE.hredu_level},${_const.CODE_TYPE.hrexp_year}`;
    
    this.commonSvc.getStdcodesByCode(strCodeType).subscribe(
      data => {
        const arrStdCode = data[this.payLoad];
        this.filterStdCode(arrStdCode);
      }
    );
  }

  openModalWithComponent() {
    this.model = new EmpRequisitionEntry;
    this.model.ExpectedStartDate = new Date();
    this.model.IsNew = "Y";
    this.bsModalRef = this.modalService.show(EmployeeRequisitionDetailComponent, { class: 'modal-lg' });
    this.bsModalRef.content
    this.bsModalRef.content.Id = "";
    this.bsModalRef.content.model = this.model
    this.bsModalRef.content.model.Id = "";
    this.bsModalRef.content.model.Qty = 1;
    this.bsModalRef.content.title = this.languages.newrequisition;
    this.bsModalRef.content.exYearsList = this.exYearsList;
    this.bsModalRef.content.ageRangeList = this.ageRangeList;
    this.bsModalRef.content.eduLevelList = this.eduLevelList;
    this.bsModalRef.content.genderList = this.genderList;
    this.bsModalRef.content.departments = this.departments;
    this.bsModalRef.content.documentInfos = [];
    this.bsModalRef.content.isCancel = false;
    this.bsModalRef.content.isDraf = true;
    this.bsModalRef.content.isSubmit = true;
    this.bsModalRef.content.employeeAssignList = this.employeeAssignList;
    this.bsModalRef.content.reloadGrid.subscribe(this.searchrequisitions.bind(this));
  }

  private filterStdCode(arrStdCode: any) {
    this.statuslist = arrStdCode.filter(function (x) {
      return x.codeType == _const.CODE_TYPE.docgen_status;
    });
    
    this.ageRangeList = arrStdCode.filter(function (x) {
      return x.codeType == _const.CODE_TYPE.hrage_range;
    });

    this.genderList = arrStdCode.filter(function (x) {
      return x.codeType == _const.CODE_TYPE.gender;
    });

    this.eduLevelList = arrStdCode.filter(function (x) {
      return x.codeType == _const.CODE_TYPE.hredu_level;
    });

    this.exYearsList = arrStdCode.filter(function (x) {
      return x.codeType == _const.CODE_TYPE.hrexp_year;
    });
  }
}