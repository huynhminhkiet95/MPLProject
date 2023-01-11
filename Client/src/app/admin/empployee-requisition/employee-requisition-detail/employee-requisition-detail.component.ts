import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as moment from 'moment';
import 'rxjs/add/operator/take';
import { UpdateEmpRequisitionModel } from '../../../_models/index'
import { CommonService, FileService } from '../../../_services/index';
import { FileuploadComponent } from '../../../_directives/fileupload/fileupload.component';
import { ToastrService } from 'ngx-toastr';
import { EmpRequisitionService } from '../../../_services/index';

import { WfUserGroupService } from '../../../_services/wf-user-group.service';
import { BaseComponent } from '../../../_directives/base.component';
import { Router } from '@angular/router';
import { _const } from '../../../_helpers/constants';
declare var AdminLTE: any;

@Component({
  selector: 'app-employee-requisition-detail',
  templateUrl: './employee-requisition-detail.component.html',
  styleUrls: ['./employee-requisition-detail.component.css']
})

export class EmployeeRequisitionDetailComponent extends BaseComponent {

  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()
  @ViewChild(FileuploadComponent)
  private myChild: FileuploadComponent;

  minToDate: any = {}
  maxToDate = Date.now;
  startDate: Date = new Date();
  bsRangeValue: any = [];
  IsNew = "1";
  model: any = {};
  isView: boolean = false;
  documentInfos: any = [];
  listRadioButton = [];
  statuslist: any = [];
  ageRangeList: any = [];
  eduLevelList: any = [];
  exYearsList: any = [];
  departments: any = [];
  genderList: any = [];
  employeeAssignList: any = [];
  isCancel = false;
  isDraf = false;
  isSubmit = false;
  title = "";
  basecpt: any = false;
  self: any;
  empRequisitionItems: any = [];

  constructor(
    public router: Router
    , public empRequisitionService: EmpRequisitionService
    , private fileSvc: FileService
    , public bsModalRef: BsModalRef
    , public toastr: ToastrService
    , public wfUserGrSvc: WfUserGroupService
  ) {
    super(router);
  }

  ngOnInit() {
    AdminLTE.init();
    this.bsRangeValue = [moment().subtract(10, 'days')["_d"], new Date()]
  }

  downloadFile(docNo) {
    this.fileSvc.downloadFile(docNo);
  }

  deleteFile(docNo) {
    this.fileSvc.delete(docNo, this.currentuser.employeeId).subscribe(
      data => {
        this.toastr.success('Deleted File Success', 'Success!');
        this.documentInfos.forEach((item, index) => {
          if (item.docNo === docNo) this.documentInfos.splice(index, 1);
        });
      },
      error => {
      }
    );
  }

  getUpdateEmpRequisitionModel() {
    var updateEmpRequisitionModel = new UpdateEmpRequisitionModel;
    updateEmpRequisitionModel.Id = this.model.Id;
    updateEmpRequisitionModel.AgeRange = this.model.AgeRange;
    updateEmpRequisitionModel.Benefit = this.model.Benefit;
    updateEmpRequisitionModel.EducationLevel = this.model.EducationLevel;
    updateEmpRequisitionModel.ExpectedStartDate = this.model.ExpectedStartDate;
    updateEmpRequisitionModel.ExperienceYear = this.model.ExperienceYear;
    updateEmpRequisitionModel.Gender = this.model.Gender;
    updateEmpRequisitionModel.JobDescription = this.model.JobDescription;
    updateEmpRequisitionModel.JobTitle = this.model.JobTitle;
    updateEmpRequisitionModel.LanguageSkill = this.model.LanguageSkill;
    updateEmpRequisitionModel.Qty = this.model.Qty;
    updateEmpRequisitionModel.ReplaceFor = this.model.ReplaceFor;
    updateEmpRequisitionModel.ReportTo = this.model.ReportTo;
    updateEmpRequisitionModel.RequiredSkill = this.model.RequiredSkill;
    updateEmpRequisitionModel.UpdateUser = this.currentuser.employeeId;
    updateEmpRequisitionModel.WorkingLocation = this.model.WorkingLocation;
    updateEmpRequisitionModel.IsNew = this.model.IsNew;
    updateEmpRequisitionModel.DeptCode = this.model.DeptCode;
    updateEmpRequisitionModel.hrEmployeeId = this.model.hrEmployeeId;
    updateEmpRequisitionModel.reasonRequisition = this.model.reasonRequisition;
    return updateEmpRequisitionModel;
  };

  radioChange() {
    if (this.model.IsNew == 'Y') {
      this.model.ReplaceFor = "";
    }
  }

  onSelectionChange(isNew) {
    this.model.IsNew = isNew;
  }

  Cancel() {
    this.empRequisitionService.deleteEmprequisition(this.model.id, this.currentuser.employeeId).subscribe(
      data => {
        this.reloadGrid.emit(null);
        this.bsModalRef.hide();
        this.toastr.success('Cancelled Requisition', 'Success!');
      },
      error => {
        alert(error.message);
      }
    )
  }

  Save(status) {
    this.basecpt = true;
    this.model.EmpReqStatus = status;

    if (this.model.Id == "") {
      this.model.SubsidiaryId = this.currentuser.subsidiaryId;
      this.model.DivisionCode = this.currentuser.divisionCode;
      this.model.CreateUser = this.currentuser.employeeId;

      this.empRequisitionService.createEmpRequisition(this.model).subscribe(
        data => {

          if (data[this.success] === true) {
            let doc: any = {};
            doc.employeeId = this.currentuser.employeeId;
            doc.refNoValue = data[this.payLoad];
            doc.IDR = _const.CODE_TYPE.her;

            this.myChild.SaveFile(doc).subscribe(
              data => {
              },
              error => {
                alert(error.message);
              }
            );

            this.reloadGrid.emit(null);
            this.bsModalRef.hide();
            this.toastr.success('Save Requisition', 'Success!');
            this.basecpt = false;
          }
        },
        error => {
          this.toastr.error('Save ID Request', error["message"]);
        }
      );
    }
    else {
      var updateEmpRequisitionModel = this.getUpdateEmpRequisitionModel();
      updateEmpRequisitionModel.EmpReqStatus = status;

      this.empRequisitionService.updateEmprequisition(updateEmpRequisitionModel).subscribe(
        data => {
          if (data[this.success] === true) {
            let doc: any = {};
            doc.employeeId = this.currentuser.employeeId;
            doc.refNoValue = this.model.Id;
            doc.IDR = "HER";
            this.myChild.SaveFile(doc).subscribe(
              data => {
              },
              error => {
              }
            );
            this.reloadGrid.emit(null);
            this.bsModalRef.hide();
            this.toastr.success('Updated Requisition', 'Success!');
            this.basecpt = false;
          }
        },
        error => {
          this.toastr.error('Save ID Request', error["message"]);
        }
      );
    }
  }
}
