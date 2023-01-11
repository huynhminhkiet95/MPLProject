import { Component } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonService, ServiceRequestService, SSOCommonService } from '../../../_services/index'
import * as moment from 'moment';
import 'rxjs/add/operator/take';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../_directives/base.component';
declare var AdminLTE: any;
@Component({
  selector: 'app-service-stationary-report',
  templateUrl: './service-stationary-report.component.html',
  styleUrls: ['./service-stationary-report.component.css']
})
export class ServiceStationaryReportComponent extends BaseComponent {

  constructor(router: Router,
    private modalService: BsModalService,
    private commonSvc: CommonService,
    private ssoCommonSvc: SSOCommonService,
    private toastr: ToastrService,
    private serviceSVR: ServiceRequestService

  ) {
    super(router);
  }
  searchModel: any = {};
  listDivision: any = [];
  departments2: any = [];
  departments: any = [];
  dataSource: any = [];

  ngOnInit() {

    this.searchModel.DateT = new Date();
    this.searchModel.DateF = moment().subtract(1, 'months');
    this.searchModel.DivisionId = '';
    this.searchModel.DepartmentId = '';

    this.getDivisions();
    this.getDataDepartments();
    AdminLTE.init();
  }

  changedDivision() {

    let divisionCode = this.searchModel.DivisionId;
    if (divisionCode && divisionCode != '') {
      this.departments2 = this.departments.filter(function (x) {
        return x.divisionCode == divisionCode;
      });
      this.searchModel.DepartmentId = '';
    }
    else {
      this.departments2 = this.departments;
    }
  }

  search() {
    this.searchModel.DateT = moment(this.searchModel.DateT).format('YYYY-MM-DD');
    this.searchModel.DateF = moment(this.searchModel.DateF).format('YYYY-MM-DD');
    
    this.serviceSVR.stationaryReport(this.searchModel).subscribe(
      data => {
        this.dataSource = data['payload'];
        this.dataSource.forEach(element => {
          element.createDate = moment(element.createDate).format('DD/MM/YYYY');
        });
      }
    );
  }

  private getDivisions() {
    this.ssoCommonSvc.getDivisions().subscribe(
      data => {
        this.listDivision = data[this.payLoad];
        
        if (this.searchModel.division == "")
          this.searchModel.division = this.currentuser.divisionCode;
      }
    );
  }

  private getDataDepartments() {
    this.ssoCommonSvc.getDepartments().subscribe(
      data => {
        this.departments = data[this.payLoad];
        this.departments2 = this.departments;
      }
    )
  }
} 
