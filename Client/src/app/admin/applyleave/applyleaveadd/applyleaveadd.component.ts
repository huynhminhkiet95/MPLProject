import { Component, OnInit, ViewChild, Output, EventEmitter, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ApplyLeaveService, CommonService, FileService } from '../../../_services/index';
import { FileuploadComponent } from '../../../_directives/fileupload/fileupload.component';
import { LeaveModel, ReasonLeave } from '../../../_models/index';
import { Router } from '../../../../../node_modules/@angular/router';
import { BaseComponent } from '../../../_directives/base.component';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import { WorkflowPopupComponent } from '../../servicerequest/servicerequest-detail/workflow-popup/workflow-popup.component';
import { SignalRService } from '../../../_services/signalR.Service';

@Component({
  selector: 'app-applyleaveadd',
  templateUrl: './applyleaveadd.component.html',
  styleUrls: ['./applyleaveadd.component.css'],
})

export class ApplyleaveaddComponent extends BaseComponent {

  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()

  @ViewChild('template') childModal: TemplateRef<any>;
  @ViewChild(FileuploadComponent)

  private myChild: FileuploadComponent;

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
  optionsMarker: any = {
    marker: ["AM", "PM", "FULL"]
  };
  lvNo: string;
  leaveList: any = [];
  self: any;
  modalRef: BsModalRef;
  checkBalance: boolean = false;
  balanceValue: any = {};
  remark2: ReasonLeave = new ReasonLeave();

  constructor(
    public router: Router
    , public bsModalRef: BsModalRef
    , public signalRService: SignalRService
    , private appLeaveSvc: ApplyLeaveService
    , private bsModalSvc: BsModalService
    , private commonSvc: CommonService
    , private fileSvc: FileService
    , private toastr: ToastrService
  ) {
    super(router);

    if (bsModalSvc.config["initialState"]) {
      this.bsRangeValue = [bsModalSvc.config["initialState"].bsDateRank[0], bsModalSvc.config["initialState"].bsDateRank[1]];
      this.model = bsModalSvc.config["initialState"].model;
      this.remark2.loadRemark(this.model.remark);
      this.toDateValue = this.model.toDate;
      this.fromDateValue = this.model.fromDate;
    }
  }

  receiveMessage($event) {
    this.lvno = $event;
  }

  ngOnInit() {
    this.getStdcodes();

    setTimeout(() => {
      this.toDateValueChange('');
    }, 100);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.bsModalSvc.show(
      template,
      Object.assign({}, {
        class: 'gray modal-lg', backdrop: true,
        ignoreBackdropClick: true, keyboard: false
      })
    );
  }

  close() {
    this.bsModalSvc.hide(1);
    this.router.navigate([{ outlets: { modal: null } }]);
  }

  toDateValueChange(e) {
    if (e == 'F')
      this.toDateValue = this.fromDateValue;

    if (this.toDateValue == null) {
      this.model.leaveDays = null;
      return;
    }
    this.minDateValue = this.fromDateValue;
    this.model.fromDate = this.fromDateValue;
    this.model.toDate = this.toDateValue;
    this.getLeaveDays(this.model.fromDate, this.model.toDate);
  };

  markerChange() {
    this.getLeaveDays(this.model.fromDate, this.model.toDate);
  }

  getLeaveDays(fromDate, toDate) {
    this.model.leaveDays = 0;
    var days = this.getBusinessDateCount(fromDate, toDate)

    // Call holidays service to subtract leave days during holidays 
    let searchHolidaysModel = {
      FromDate: fromDate,
      ToDate: toDate,
      Sub: this.currentuser.subsidiaryId,
      divisionCode: this.currentuser['divisionCode']
    }

    this.appLeaveSvc.searchHolidays(searchHolidaysModel).subscribe(
      data => {
        if (data[this.success] === true) {

          var holidays = data[this.payLoad].holidays;
          days = days - holidays;

          if (days > 1) {
            this.model.marker = "FULL"
            this.model.leaveDays = days;
          }
          else if (days >= 0.5) {
            if (this.model.marker == "FULL") {
              this.model.leaveDays = 1;
            }
            else {
              this.model.leaveDays = 0.5;
            }
          }
        }
      },
      error => {
        this.toastr.error('Cannot get Subisdiary Holidays', error[this.message]);
      }
    );
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
      if (date.getDay() == 6 && this.currentuser['divisionCode'] != 'DNA') // 6 is saturday => + 0.5 day
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
        this.leavetypes = data[this.payLoad];
      }
    );
  }

  refreshImages(event) {

  }

  Delete() {
    this.appLeaveSvc.delete(this.currentuser.employeeId, this.model.lvNo).subscribe(
      data => {
        if (data[this.success] === true) {
          this.reloadGrid.emit(null);
          this.bsModalSvc.hide(1);
          this.toastr.success('Cancel Leave', 'Success!');
        }
      },
      error => {
        this.toastr.error('Cancel Leave', error[this.message]);
      }
    );
  }

  downloadFile(docNo) {
    this.fileSvc.downloadFile(docNo);
  }

  Save(Type) {

    this.IsSubmit = true;
    this.model.leaveStatus = Type
    this.model.employeeId = this.currentuser.employeeId;
    this.model.userId = this.currentuser.employeeId;
    this.model.remark = this.remark2.getRemark();
    this.model.convertDate();
    if (this.model.lvNo != "") {
      this.appLeaveSvc.update(this.model).subscribe(
        data => {

          if (data[this.success] === true) {
            //Save document if have
            this.SendNotifyForApproval();

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
            this.bsModalSvc.hide(1);
            //this.close();
            this.toastr.success('Updae Leave', 'Success!');
            this.IsSubmit = false;
          }
        },
        error => {
          this.toastr.error('Updae Leave', error[this.message]);
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
      this.appLeaveSvc.create(this.model).subscribe(
        data => {
          if (data[this.success] === true) {
            if (Type == 'NEW') {
              this.SendNotifyForApproval();
            }

            let doc: any = {};
            doc.employeeId = this.currentuser.employeeId;
            doc.refNoValue = data[this.payLoad];
            doc.IDR = "ALT";

            this.myChild.SaveFile(doc).subscribe(
              data => {
              },
              error => {
                alert(error.message);
              }
            );

            this.reloadGrid.emit(null);
            this.bsModalSvc.hide(1);
            this.toastr.success('Save New Leave', 'Success!');
            this.IsSubmit = false;
          }
        },
        error => {
          this.toastr.error('Add Leave', error[this.message]);
        }
      );
    }
  }

  changedType() {
    let selectedType = this.leavetypes.find(x => x.codeId == this.model.leaveType);
    
    if (selectedType.tagVariant == 'Y') {
      this.checkBalance = true;
      let param: any = {};
      param.leavetype = this.model.leaveType;
      param.employeeId = this.currentuser.employeeId;
      param.lyear = new Date().getFullYear();

      this.appLeaveSvc.searchLeaveEntitle(param).subscribe(
        data => {
          this.balanceValue = data[this.payLoad] || { balance: 0 };
        }
      );
    } else {
      this.checkBalance = false;
      this.balanceValue = {};
    }
  }

  popup() {
    const initialState = {
      ApplicationCode: 'HLV',
      LocalAmount: 0
    }
    this.bsModalRef = this.bsModalSvc.show(WorkflowPopupComponent, {
      class: 'modal-lg', initialState

    });
  }

  hidemodal() {
    this.bsModalSvc.hide(1);
  }

  getRemark() {
  }

  SendNotifyForApproval() {
    const _userObj = this.currentuser;
    let model: any = {
      "EmpId": _userObj.employeeId,
      "SubsidiryID": _userObj.subsidiaryId,
      "DivisionCode": _userObj.divisionCode,
      "DeptCode": _userObj.deptCode,
      "ApplicationCode": 'HLV',
      "LocalAmount": 0,
    }

    this.fileSvc.getDocumentWorkflow(model).subscribe(
      data => {
        let roles = data[this.payLoad];
        let roleId: number = roles[0].namedRoleID;
        this.signalRService.sendMessageToUser(roleId.toString(), `You have a leave request from ${this.currentuser.employeeName}`);
      }
    )
  }
}
