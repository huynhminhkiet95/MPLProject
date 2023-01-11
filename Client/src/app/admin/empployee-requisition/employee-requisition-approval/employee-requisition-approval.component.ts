import { Component, OnInit,ViewChild, NgModule,ViewContainerRef,EventEmitter ,Output, Input  } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { EmpRequisitionSearch} from '../../../_models/index';
import {DxDataGridComponent } from 'devextreme-angular';
import { CommonService} from '../../../_services/index'
import { EmpRequisitionService} from './../../../_services/index';
import CustomStore  from 'devextreme/data/custom_store';
import * as moment from 'moment';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/take';
declare var AdminLTE: any; 

@Component({
  selector: 'app-employee-requisition-approval',
  templateUrl: './employee-requisition-approval.component.html',
  styleUrls: ['./employee-requisition-approval.component.css']
})
export class EmployeeRequisitionApprovalComponent implements OnInit {
  @ViewChild("gridContainer") dataGrid:DxDataGridComponent;
  title:string;
  status:string="";
  model:any = {};
  bsRangeValue: any = [];
  searchModel = new EmpRequisitionSearch;
  dataSource: any = {};
  statuslist:any = [];
  bsModalRef: BsModalRef;
  currentuser :any = {};
  documentInfos :any = [];
  languages:any = [];
  @Input() messageEvent = new EventEmitter<string>();
  constructor(public empRequisitionService: EmpRequisitionService,
    private modalService: BsModalService, private commonSvc:CommonService,
  ) 
  {
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
    this.title = this.languages.requisitionapproval;
    this.dataSource.store = new CustomStore({
      load:(loadOptions)=> {
        var params = '?';
        params += 'skip=' + loadOptions.skip || 0;
        params += '&take=' + loadOptions.take || 12;
        if(loadOptions.sort) {
          params += '&orderby=' + loadOptions.sort[0].selector;
          if(loadOptions.sort[0].desc) {
              params += ' desc';
          }
        }
          let that=this;
          return that.empRequisitionService.getEmpRequisitionsForApproval(this.searchModel)
          .toPromise()
          .then(response => {
              return {
                data: response["payload"],
                totalCount:response["payload"][0]?response["payload"][0].totalCount:0
              }
          }).catch(error => { throw error });
      }
    });
   }
  ngOnInit() {
    AdminLTE.init();
    this.title = "Requisition Approval"
    this.bsRangeValue = [moment().subtract(10, 'days')["_d"], new Date()];
     this.currentuser =JSON.parse(localStorage.getItem('currentUser')) || {};
    this.searchModel={
      "SubmitDateF":moment(this.bsRangeValue[0]).format('YYYY-MM-DD'),
      "SubmitDateT": moment(this.bsRangeValue[1]).format('YYYY-MM-DD'),
      "UserId":this.currentuser.employeeId,
      "Status": ''
    }
    
    this.getStdcodes();
    this.searchrequisitions();

  }
  GetEmpRequisitionDetail(id)
  {
    this.empRequisitionService.getEmpRequisitionDetail(id,this.currentuser.employeeId).subscribe(response =>{
      var data = response["payload"];
    })
  }
  
  searchrequisitions()
  {
    if(this.bsRangeValue!=null &&  this.bsRangeValue.length==2 )
    {
      this.searchModel.SubmitDateF=moment(this.bsRangeValue[0]).format('YYYY-MM-DD');
      this.searchModel.SubmitDateT=moment(this.bsRangeValue[1]).format('YYYY-MM-DD');
    }
    if(this.dataGrid.instance)
    {
      this.dataGrid.instance.refresh();
    }
  }

  getStdcodes()
  {
    this.commonSvc.getStdcodesByCode('DOCGENSTATUS').subscribe(
      data=>
      {
        this.statuslist=data["payload"];
      }
    );    
  }
}

