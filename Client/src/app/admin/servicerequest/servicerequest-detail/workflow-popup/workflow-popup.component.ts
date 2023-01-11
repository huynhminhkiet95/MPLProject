import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FileService } from '../../../../_services/file.service';

@Component({
  selector: 'app-workflow-popup',
  templateUrl: './workflow-popup.component.html',
  styleUrls: ['./workflow-popup.component.css']
})
export class WorkflowPopupComponent implements OnInit {
  title ="Workflow";
  currentuser:any = {}
  dataSource:any=[];
  languages:any =[];
  employee:any={};
  constructor(
    public bsModalRef1: BsModalRef,
    public fileSv: FileService,
    public modalService: BsModalService
  ) {
    this.currentuser = JSON.parse(localStorage.getItem('currentUser')) || {};
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
   }

  ngOnInit() {
    this.employee = this.modalService.config["initialState"].Employee;
    this.getWorkflow();
  }
  getWorkflow()
  {
     
    let model :any = {
      "EmpId":this.employee?this.employee.employeeId:this.currentuser.employeeId,
      "SubsidiryID":this.currentuser.subsidiaryId,
      "DivisionCode":this.employee?this.employee.divisionCode:this.currentuser.divisionCode,
      "DeptCode":this.employee?this.employee.deptCode:this.currentuser.deptCode,
      "ApplicationCode":this.modalService.config["initialState"].ApplicationCode,
      "LocalAmount":this.modalService.config["initialState"].LocalAmount,
    }
    this.fileSv.getDocumentWorkflow(model).subscribe(
      data=>
      {
        this.dataSource = data["payload"];
      }
    )
  }
}
