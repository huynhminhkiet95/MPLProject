import { Component, OnInit, ViewChild, EventEmitter, Output, TemplateRef } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { CommonService, UserService, EmployeeService, ApplyLeaveService, FileService, SSOCommonService } from '../../_services/index'
import * as moment from 'moment';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/take';
import { Globalconst } from '../../_helpers';
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import { confirm } from 'devextreme/ui/dialog';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { _const } from '../../_helpers/constants';
import { BaseComponent } from '../../_directives/base.component';
import { Router } from '@angular/router';
import { OffboardnoticeServiceService } from '../../_services/offboardnotice.service.service';
import { OffBoardingDetailComponent } from './off-boarding-detail/off-boarding-detail.component';

declare var AdminLTE: any;
@Component({
  selector: 'app-off-boarding-approval',
  templateUrl: './off-boarding-approval.component.html',
  styleUrls: ['./off-boarding-approval.component.css']
})
export class OffBoardingApprovalComponent extends BaseComponent {

  private
  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  modalRef: BsModalRef;
  searchModel: any = {};
  listusers: any = [];
  listusers2: any = [];
  loading = false;
  title = "Off Boarding Report";
  listDivision: any = [];
  statuslist: any = [];
  departments: any = [];
  departments2: any = [];
  dataSource: any = {};
  bsRangeValue: any = [];
  lvid: string;
  reasonCancel: string;
  listWorkingLocation: any[];
  bsModalRef: BsModalRef;
  @Output() viewDetailUser: EventEmitter<any> = new EventEmitter();

  constructor(
    public router: Router
    , public _global: Globalconst
    , private commonSvc: CommonService
    , private ssoCommonSvc: SSOCommonService
    , private leaveSvc: ApplyLeaveService
    , private toastr: ToastrService
    , private empSver: EmployeeService
    , private fileSvc: FileService
    , public globals: Globalconst
    , private modalService: BsModalService
    , private offBoardingService: OffboardnoticeServiceService
    , private bsModalSvc: BsModalService,
  ) {
    super(router);
  }

  ngOnInit() {
    const subsidiaryId = this.currentuser.subsidiaryId;
    AdminLTE.init();
    this.getStdcodes();
    this.getDivisions();
    this.getSubDepts(subsidiaryId);

    this.bsRangeValue = [moment().subtract(30, 'days')["_d"], moment().add(30, 'days')["_d"]];
    this.searchModel.status = '';

    this.searchModel.division = this.globals._userinfo.divisionCode;
    this.searchModel.employeeId = this.currentuser.employeeId;
    this.searchModel.DateF = moment(this.bsRangeValue[0]).format('YYYY/MM/DD');
    this.searchModel.DateT = moment(this.bsRangeValue[1]).format('YYYY/MM/DD');

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
        return that.offBoardingService.getForApproval(this.searchModel)
          .toPromise()
          .then(res => {
            return {
              data: res[this.payLoad],
              totalCount: res[this.payLoad][0] ? res[this.payLoad][0].totalCount : 0
            }
          }).catch(error => { throw 'Data Loading Error' });
      }
    });
  }

  search() {
    if (this.bsRangeValue != null && this.bsRangeValue.length == 2) {
      this.searchModel.DateF = moment(this.bsRangeValue[0]).format('YYYY/MM/DD');
      this.searchModel.DateT = moment(this.bsRangeValue[1]).format('YYYY/MM/DD');
    }

    if (this.dataGrid.instance) {
      this.dataGrid.instance.refresh();
    }
  }

  getStdcodes() {

    this.commonSvc.getStdcodesByCode(_const.CODE_TYPE.OFREQSTATUS).subscribe(
      data => {
        this.statuslist = data[this.payLoad];
      }
    );
  }

  changedDivision() {

    let divisionCode = this.searchModel.division;
    if (divisionCode && divisionCode != '') {
      this.departments2 = this.departments.filter(function (x) {
        return x.divisionCode == divisionCode;
      });
    }
    else {
      this.departments2 = this.departments;
    }
  }

  openModal(lvid, template: TemplateRef<any>) {
    this.lvid = lvid;
    this.modalRef = this.modalService.show(template);
  }

  private getDivisions() {
    this.ssoCommonSvc.getDivisions().subscribe(
      data => {
        this.listDivision = data[this.payLoad];
      }
    );
  } 

  private getSubDepts(sub: string): any {
    this.ssoCommonSvc.getSubDepts(sub).subscribe(
      data => {
        this.departments = data[this.payLoad];
        this.departments2 = this.departments;
        setTimeout(() => {
          this.changedDivision();
        }, 500);
      }
    );
  }

  showContentModal(d) {
    this.offBoardingService.getbyId(d.value,this._global._userinfo.employeeId).subscribe(
      data => {
        this.bsModalRef = this.modalService.show(OffBoardingDetailComponent, { class: 'modal-lg', ignoreBackdropClick: true });
        //this.bsModalRef.content.reloadData.subscribe(this.getOffboardNotice.bind(this));
        this.bsModalRef.content.offBoardNoticeModel = data[this.payLoad];
      }
    );
  }
}

