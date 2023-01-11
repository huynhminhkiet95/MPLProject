import { Component } from '@angular/core';
import { BaseComponent } from '../../_directives/base.component';
import { Router } from '@angular/router';
import { ActivityGroupSerivce } from './../../_services/activity-group-serivce.service'
import * as moment from 'moment';
import { CommonService, EmployeeService, SSOCommonService } from '../../_services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivityViewComponent } from './activity-view/activity-view.component';
declare var AdminLTE: any;
declare function unescape(s: string): string;
import { confirm } from 'devextreme/ui/dialog';
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import { environment } from '../../../environments/environment';
import { DateTimeFormatDirective } from '../../_directives/date-time-format.directive';
@Component({
  selector: 'app-activity-group',
  templateUrl: './activity-group.component.html',
  styleUrls: ['./activity-group.component.css']
})
export class ActivityGroupComponent extends BaseComponent {
  searchModel: any = {};
  dataSource: any = [];
  listStatus: any = [];
  listType: any = [];
  listEmp: any;
  model: any = {};
  bsModalRef: BsModalRef;
  departments: any;
  constructor(
    router: Router,
    public _service: ActivityGroupSerivce,
    public _serviceCommon: CommonService,
    private empSvc: EmployeeService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private ssoCommonService:SSOCommonService

  ) {
    super(router);
  }
  ngOnInit() {
    this.searchModel.DateF = new Date();
    this.searchModel.DateT = moment().add(7, 'days');;
    this.searchModel.userId = this.currentuser.employeeId;
    this.searchModel.Status = '';
    this.searchModel.Type = '';
    this.searchModel.Subject = '';
    this.getCommon();
    this.search();
    AdminLTE.init();
  }
  search() {
    this._service.search(this.searchModel).subscribe(
      data => {
        this.dataSource = data['payload'];
      }
    );
  }
  addnew() {
    this.model = {};
    this.bsModalRef = this.modalService.show(ActivityDetailComponent, { class: 'modal-lg', ignoreBackdropClick: true });
    this.bsModalRef.content.listEmp = this.listEmp;
    this.bsModalRef.content.activityTypes = this.listType;
    this.bsModalRef.content.lvno = "";
    //this.bsModalRef.content.model = this.model
    this.bsModalRef.content.isCancel = false;
    this.bsModalRef.content.isDraf = true;
    this.bsModalRef.content.isSubmit = true;
    this.bsModalRef.content.title = this.languages.addnewleave;
    this.bsModalRef.content.reloadGrid.subscribe(this.search.bind(this));
  }
  getCommon() {
    this._serviceCommon.getStdcodesByCode("ACTTYPE,ACTSTATUS").subscribe(
      data => {
        let listcostCenter = data['payload'];
        this.listStatus = listcostCenter.filter(function (x) {
          return x.codeType == 'ACTSTATUS';
        });
        this.listType = listcostCenter.filter(function (x) {
          return x.codeType == 'ACTTYPE';
        });
      }
    );
    let paras: any = {};
    paras.employeeName = '';
    paras.mobile = '';
    paras.subsidary = this.currentuser.subsidiaryId;
    paras.division = this.currentuser.divisionCode;
    paras.department = "";
    this.empSvc.search(paras).subscribe(
      data => {
        this.listEmp = data["payload"];
      },
      error => {

      }
    );
    this.ssoCommonService.getSubDepts(this.currentuser.subsidiaryId).subscribe(
      data => {
          this.departments = data["payload"].filter(x=>x.divisionCode==this.currentuser.divisionCode);
      }
  )
  }
  ViewDetail(data: any) {
    this._service.getBySeviceId(data, this.currentuser.employeeId).subscribe(
      data => {
        this.model = data['payload'];
        this.model.activityDto.createdAvatar = environment.urlFileServer + this.model.activityDto.createdAvatar;
        if (this.model.listLog){
          this.model.listLog.forEach(element => {        
            element.avatar = environment.urlFileServer + element.avatar;
          });
        }        
        this.model.activityDto.details = unescape(this.model.activityDto.details);
        const initialState = {
          model: this.model.activityDto,
          logs: this.model.listLog
        };
        this.bsModalRef = this.modalService.show(ActivityViewComponent, Object.assign({}, { class: 'modal-lg', initialState, ignoreBackdropClick: true }));
        this.bsModalRef.content.listEmp = this.listEmp;
        this.bsModalRef.content.activityTypes = this.listType;
        this.bsModalRef.content.isNew = false;
        this.bsModalRef.content.title = this.languages.addnewleave;
        this.bsModalRef.content.reloadGrid.subscribe(this.search.bind(this));
      }
    );
  }
  edit(data: any) {
    this._service.getBySeviceId(data, this.currentuser.employeeId).subscribe(
      data => {
        this.model = data['payload'];
        this.model.activityDto.details = unescape(this.model.activityDto.details);
        const initialState = {
          model: this.model.activityDto,
          logs: this.model.listLog,
          editMode: true
        };
        this.bsModalRef = this.modalService.show(ActivityDetailComponent, Object.assign({}, { class: 'modal-lg', initialState, ignoreBackdropClick: true }));
        this.bsModalRef.content.listEmp = this.listEmp;
        this.bsModalRef.content.activityTypes = this.listType;
        this.bsModalRef.content.reloadGrid.subscribe(this.search.bind(this));
      }
    );
  }
  delete(data: any) {
    var result = confirm("Are you sure delete this row?", 'Confirm delete');
    result.done((dialogResult: any) => {
      if (dialogResult) {
        this._service.delete(data, this.currentuser.employeeId).subscribe(
          data => {
            if (data['payload'] > 0) {
              this.toastr.success("Delete sucessfull", "Delete Activity");
              this.search();
            }
            else {
              this.toastr.error("Delete Unsucessfull", "Delete Activity");
            }
          }
        );
      }
    })

  }
  
}

