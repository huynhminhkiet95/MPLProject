import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import 'rxjs/add/operator/take';
import { EmpRequisitionEntry } from '../../../../_models/index'
import { CommonService, FileService } from '../../../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { Globalconst } from '../../../../_helpers/globalvariable'

import { EmpRequisitionService } from '../../../../_services/index';
import { ToastrService } from '../../../../../../node_modules/ngx-toastr';
import { EmployeeRequisitionDetailComponent } from '../../employee-requisition-detail/employee-requisition-detail.component';
declare var AdminLTE: any;
@Component({
  selector: 'app-employee-requisition-approval-detail',
  templateUrl: './employee-requisition-approval-detail.component.html',
  styleUrls: ['./employee-requisition-approval-detail.component.css']
})
export class EmployeeRequisitionApprovalDetailComponent implements OnInit {
  model: EmpRequisitionEntry=new EmpRequisitionEntry();
  currentuser: any = {};
  documentInfos: any = [];
  title = "";
  empReqId = "";
  dataSource: any = [];
  modelApproval: any = {}
  self: any;
  IsNew = false;
  RequisitionItem: any = {}
  events: Array<string> = [];
  showRadioApproval = false;
  isApprove = false;
  bsModalRef: BsModalRef;
  isAction = false;
  languages: any = [];
  constructor(public empRequisitionService: EmpRequisitionService, private modalService: BsModalService, private commonSvc: CommonService, private fileSvc: FileService, public toastr: ToastrService,
    public globals: Globalconst, private router: Router, private route: ActivatedRoute) {
    this.currentuser = JSON.parse(localStorage.getItem('currentUser')) || {};
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
  }
  ngOnInit() {
    AdminLTE.init();
    this.title = "Requisition Approval"
    this.currentuser = JSON.parse(localStorage.getItem('currentUser')) || {};
    this.empReqId = this.route.params["_value"].id;
    this.GetEmpRequisitionDetail(this.empReqId);
    this.modelApproval = {
      EmpReqId: "",
      UserId: this.currentuser.employeeId,
      Comment: "",
      ApprovalType: "1"
    }
  }

  downloadFile(docNo) 
  {
    this.fileSvc.downloadFile(docNo);
  }

  replyRequest() 
  {
    this.modelApproval.EmpReqId = this.model.Id;
    if (this.showRadioApproval) {
      if (this.modelApproval.ApprovalType === "1")
        this.modelApproval.ApprovalType = 'Approved';
      else if (this.modelApproval.ApprovalType === "0")
        this.modelApproval.ApprovalType = 'Rejected';
    }
    else {
      this.modelApproval.ApprovalType = 'Action';
    }

    this.empRequisitionService.approveEmpRequisition(this.modelApproval).subscribe(
      data => {
        this.toastr.success('Update Sucessful', 'Success!');
        
        this.modelApproval.Comment = '';
        this.GetEmpRequisitionDetail(this.model.Id);
      },
      error => {

        this.toastr.error('Update Failed', 'Failed!');
      }
    )
  }

  GetEmpRequisitionDetail(id) {
    this.showRadioApproval = false;
    this.empRequisitionService.getEmpRequisitionDetail(id, this.currentuser.employeeId).subscribe(response => {
      
      var data = response["payload"];
      this.model=data;
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
      this.model.UserName = data.createUserName;
      this.model.CreateDate = data.createDate;
      this.model.DeptDesc=data.deptDesc
      this.model.EducationLevelDesc=data.educationLevelDesc;
      this.model.AgeRangeDesc = data.ageRankDesc;
      this.model.ExperienceYearDesc = data.experienceYearDesc;
      this.model.HRAssignerName=data.hrAssignerName;
      this.model.ApprovalType=data.approvalType
      this.documentInfos = data.documentInfos;

      this.dataSource = data.empRequisitionItems;

      if (this.model.IsNew == 'Y') {
        this.IsNew = true;
      }

      this.RequisitionItem = data.empRequisitionItems.find(x => x.assignedUser == this.currentuser.employeeId);
      if (this.RequisitionItem != null && ((this.RequisitionItem.replyType == 'APPO' && (this.RequisitionItem.approvalType == null || this.RequisitionItem.approvalType == "")))) {
        this.showRadioApproval = true;
      }
      this.isApprove = false;
      this.isAction = false;

      if ((this.RequisitionItem != null && this.RequisitionItem.replyType == 'APPO' && (this.RequisitionItem.approvalType == null || this.RequisitionItem.approvalType == ""))) {
        this.isApprove = true;
      }

      if ((this.RequisitionItem != null && this.RequisitionItem.replyType == 'ACTI' && (this.RequisitionItem.approvalType == null || this.RequisitionItem.approvalType == ""))) {
        this.isAction = true;
      }
    })
  }
  
  ShowDetail() {
      this.bsModalRef = this.modalService.show(EmployeeRequisitionDetailComponent, { class: 'modal-lg' });
      this.bsModalRef.content.Id = this.model.erqNo;
      this.bsModalRef.content.isView = true;
      this.bsModalRef.content.model = this.model
      this.bsModalRef.content.title = 'View Requisition : ' + this.model.Id;
      this.bsModalRef.content.documentInfos = this.documentInfos;
  }
}
