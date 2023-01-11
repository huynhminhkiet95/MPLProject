import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService, SSOCommonService, SSOUserProfileService } from '../../../_services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { EmployeeDependentService } from '../../../_services/employee-dependent.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-employee-dependent',
  templateUrl: './employee-dependent.component.html',
  styleUrls: ['./employee-dependent.component.css']
})
export class EmployeeDependentComponent implements OnInit {
  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  languages: any = {};
  dataSource: any = [];
  employeeId: any;
  listGender:any=[
    {
      id:'Male',
      name:'Male'
    },
    {
      id:'FeMale',
      name:'Fe Male'
    }
  ];
  listRealtion:any=[
    {
      id:'Mother',
      name:'Mother'
    },
    {
      id:'Father',
      name:'Father'
    },
    {
      id:'Child',
      name:'Child'
    }
    ,
    {
      id:'Child in law',
      name:'Child in law'
    }
    ,
    {
      id:'Mother in law',
      name:'Mther in law'
    }
    ,
    {
      id:'Father in law',
      name:'Father in law'
    }
  ];
  constructor(
    public bsModalRef: BsModalRef,
    router: Router,
    private languageSvc: CommonService,
    public dependentSvc: EmployeeDependentService,
    public route: ActivatedRoute,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private ssoUserProfileService:SSOUserProfileService
  ) {
    this.employeeId = modalService.config["initialState"].employeeId;
  }

  ngOnInit() {
    this.dependentSvc.getByEmployeeId(this.employeeId).subscribe(
      data => {
        this.dataSource = data['payload'];
      }
    );
  }

  insert(data) {
    let dto: any = data.data;
    dto.employeeId = this.employeeId;
    this.dependentSvc.create(dto).subscribe(
      data => {
        this.toastr.success("Update Sucessfull", "Insert Dependent")
      },
      error => {
        this.toastr.error(error, "Insert Dependent");
      }
    );
  }

  update(data) {
    const dto = Object.assign({}, data.oldData, data.newData);
    this.dependentSvc.update(dto).subscribe(
      data => {
        this.toastr.success("Update Sucessfull", "Uppdate Dependent")
      },
      error => {
        this.toastr.error(error, "Update Dependent");
      }
    );
  }
  delete(data) {
    const dto:any={};
    dto.id = data.data.id;
    this.dependentSvc.delete(dto).subscribe(
      data => {
        this.toastr.success("Delete Sucessfull", "Uppdate Dependent")
      },
      error => {
        this.toastr.error(error, "Delete Dependent");
      }
    );
  }
}
