import { Component, OnInit, ViewChild, Output, EventEmitter, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as moment from 'moment';
import { LeaveModel, ReasonLeave } from '../../../../_models';
import { FileuploadComponent } from '../../../../_directives';
import { ApplyLeaveService, CommonService, FileService, EmployeeService, SSOCommonService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../../_directives/base.component';
import { WorkflowPopupComponent } from '../../../servicerequest/servicerequest-detail/workflow-popup/workflow-popup.component';
import { Globalconst } from '../../../../_helpers';
import { BasePopupComponent } from '../../../../_directives/base.popup.component';

@Component({
  selector: 'app-requestonbehalf-add',
  templateUrl: './requestonbehalf-add.component.html',
  styleUrls: ['./requestonbehalf-add.component.css'],
})
export class RequestOnBehalfAddComponent extends BaseComponent {
  @ViewChild('template') childModal: TemplateRef<any>;
  leavetypes = [];
  statuslist = [];
  lvno: string = "";
  model = new LeaveModel;
  minDateValue: Date = new Date();
  title: string = "";
  areacontent: any = {};
  hide: boolean = false;
  fromDateValue: Date = new Date();
  toDateValue: Date = new Date();
  bsRangeValue: any = [new Date(), new Date()];
  leavesDay: number = 0;
  minFromDate: Date = new Date();
  maxFromDate: Date = new Date();
  minToDate: any = {}
  maxToDate = Date.now;
  mytime: Date = new Date();
  isCancel = false;
  isDraf = false;
  isSubmit = false;
  languages: any = [];
  optionsMarker: any = {
    marker: ["AM", "PM", "FULL"]
  };
  currentuser: any = {}
  lvNo: string;
  leaveList: any = [];
  @ViewChild(FileuploadComponent)
  private myChild: FileuploadComponent;
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()
  self: any;
  modalRef: BsModalRef;
  checkBalance: boolean = false;
  balanceValue: any = {};
  remark2: ReasonLeave = new ReasonLeave();
  listusers: any = [];
  listusers2: any = [];
  listDivision: any = [];
  departments: any = [];
  departments2: any = [];
  devisionCode: string = '';
  selectedEmployee: any = {};

  constructor(
    public leaveService: ApplyLeaveService,
    private modalService: BsModalService,
    private commonSvc: CommonService,
    private ssoCommonSvc: SSOCommonService,
    private fileSvc: FileService,
    public bsModalRef: BsModalRef,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    public router: Router,
    private globals: Globalconst,
    private empSver: EmployeeService
  ) {
    super(router);
    this.languages = globals._resources || {};
    this.currentuser = globals._userinfo || {};

    if (modalService.config["initialState"]) {
      this.bsRangeValue = [modalService.config["initialState"].bsDateRank[0], modalService.config["initialState"].bsDateRank[1]];
      this.model = modalService.config["initialState"].model;
      this.remark2.loadRemark(this.model.remark);
      this.toDateValue = this.model.toDate;
      this.fromDateValue = this.model.fromDate;
    }
  }

  receiveMessage($event) {
    this.lvno = $event;
  }

  ngOnInit() {
    this.getEmployeeAll();
    this.getDivisions();
    this.getStdcodes();
    setTimeout(() => {
      this.toDateValueChange('');
    }, 100);

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {
        class: 'gray modal-lg', backdrop: true,
        ignoreBackdropClick: true, keyboard: false
      })
    );
  }
  close() {
    this.modalService.hide(1);
    this.router.navigate([{ outlets: { modal: null } }]);
  }

  toDateValueChange(e) {
    if (e == 'F') {
      this.toDateValue = this.fromDateValue;
    }
    if (this.toDateValue == null) {
      this.model.leaveDays = null;
      return;
    }
    this.minDateValue = this.fromDateValue;
    this.model.fromDate = this.fromDateValue;
    this.model.toDate = this.toDateValue;
    //this.model.Marker = 'AM'de
    this.getLeaveDays(this.model.fromDate, this.model.toDate);
  };

  markerChange() {
    this.getLeaveDays(this.model.fromDate, this.model.toDate);
  }

  getLeaveDays(fromDate, toDate) {
    this.model.leaveDays = 0;
    var days = this.getBusinessDateCount(fromDate, toDate)

    if (days > 1) {
      this.model.marker = "FULL"
      this.model.leaveDays = days;
    }
    else {
      if (this.model.marker == "FULL") {
        this.model.leaveDays = 1;
      }
      else {
        this.model.leaveDays = 0.5;
      }
    }
  }
  getBusinessDateCount(startDate, endDate) {
    var date1 = new Date(startDate);
    var date2 = new Date(endDate);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    var resultdate = diffDays + 1;
    let leavedate: number = 0;
    let index: number = 0;

    for (let i = 0; i < resultdate; i++) {
      var date = new Date(date1.getTime() + index * 24 * 60 * 60 * 1000);
      if (date.getDay() == 6 && this.devisionCode != 'DNA') // 6 is saturday => + 0.5 day
      {
        leavedate = leavedate + 0.5;
      }
      else if (date.getDay() == 0) //0 is sunday => + 0 day
      {
        leavedate = leavedate + 0;
      }
      else // +1 ngay
      {
        leavedate = leavedate + 1;
      }
      index++;
    }
    return leavedate;
  }

  getStdcodes() {
    this.commonSvc.getStdcodesByCode('HRLEAVETYPE ').subscribe(
      data => {
        this.leavetypes = data["payload"];
      }
    );
  }
  changedDivision() {
    let divisionCode = this.model.division;
    this.listusers2 = this.listusers.filter(c => c.divisionCode == divisionCode);
  }

  refreshImages(event) {

  }

  Delete() {
    this.leaveService.delete(this.currentuser.employeeId, this.model.lvNo).subscribe(
      data => {
        if (data["success"] === true) {
          this.reloadGrid.emit(null);
          this.modalService.hide(1);
          this.toastr.success('Cancel Leave', 'Success!');
        }
      },
      error => {
        this.toastr.error('Cancel Leave', error["message"]);
      }
    );
  }

  downloadFile(docNo) {
    this.fileSvc.downloadFile(docNo);
  }
  getEmployeeAll() {

    let empModel: any = {};
    empModel.EmployeeName = "";
    empModel.Mobile = "";
    empModel.Subsidary = "";
    empModel.Division = "";
    empModel.Department = "";
    empModel.IsLeftEmployee = "";
    this.empSver.getAllEmployee(empModel).subscribe(
      data => {

        this.listusers = data["payload"];
        this.listusers2 = data["payload"];
      }
      , error => {

      }
    );
  }
  Save(Type) {
    this.IsSubmit = true;
    this.model.leaveStatus = Type
    this.model.userId = this.currentuser.employeeId;
    this.model.remark = this.remark2.getRemark();
    if (this.model.lvNo != "") {
      this.leaveService.update(this.model).subscribe(
        data => {

          if (data["success"] === true) {
            //Save document if have
            let doc: any = {};
            doc.employeeId = this.currentuser.employeeId;
            doc.refNoValue = this.model.lvNo;
            doc.IDR = "ALT";
            this.myChild.SaveFile(doc).subscribe(
              data => {


              },
              error => {
                alert(error.message);
              }
            );
            this.reloadGrid.emit(null);
            this.modalService.hide(1);
            //this.close();
            this.toastr.success('Updae Leave', 'Success!');
            this.IsSubmit = false;
          }
        },
        error => {
          this.toastr.error('Updae Leave', error["message"]);
        }
      );
    }
    else {
      if (this.checkBalance) {
        if (this.model.leaveDays > this.balanceValue.balance) {
          this.toastr.info("Leave days can not greater than balance value");
          this.IsSubmit = false;
          return;
        }
      }
      this.leaveService.create(this.model).subscribe(
        data => {
          if (data["success"] === true) {
            let doc: any = {};
            doc.employeeId = this.currentuser.employeeId;
            doc.refNoValue = data["payload"];
            doc.IDR = "ALT";
            this.myChild.SaveFile(doc).subscribe(
              data => {

              },
              error => {
                alert(error.message);
              }
            );
            this.reloadGrid.emit(null);
            this.modalService.hide(1);
            this.toastr.success('Save New Leave', 'Success!');
            this.IsSubmit = false;
          }
        },
        error => {
          this.toastr.error('Add Leave', error["message"]);
        }
      );
    }
  }
  
  changedType() {
    if (this.model.employeeId != null) {
      let selectedType = this.leavetypes.find(x => x.codeId == this.model.leaveType);
      if (selectedType.tagVariant == 'Y') {
        this.checkBalance = true;
        let param: any = {};
        param.leavetype = this.model.leaveType;
        param.employeeId = this.model.employeeId;
        param.lyear = new Date().getFullYear();

        this.leaveService.searchLeaveEntitle(param).subscribe(
          data => {
            this.balanceValue = data["payload"] || { balance: 0 };
          }
        );
      }
      else {
        this.checkBalance = false;
        this.balanceValue = {};
      }
      
      this.selectedEmployee = this.listusers.find(x => x.employeeId == this.model.employeeId);
      if (this.selectedEmployee)
        this.devisionCode = this.selectedEmployee.divisionCode;
      
        this.markerChange();
    }
  }

  popup() {
    const initialState = {
      ApplicationCode: 'HLV',
      LocalAmount: 0,
      Employee: this.selectedEmployee
    }
    this.bsModalRef = this.modalService.show(WorkflowPopupComponent, {
      class: 'modal-lg', initialState
    });
  }

  hidemodal() {
    this.modalService.hide(1);
  }

  private getDivisions() {
    this.ssoCommonSvc.getDivisions().subscribe(
      data => {
        this.listDivision = data[this.payLoad];
      }
    );
  }
}
