import { Component, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { CommonService, ApplyLeaveService } from '../../../_services';
import { ToastrService } from 'ngx-toastr';
import { BasePopupComponent } from '../../../_directives/base.popup.component';
import { Router } from '@angular/router';
import { _const } from '../../../_helpers/constants';

@Component({
  selector: 'app-leaveentitle-popup',
  templateUrl: './leaveentitle-popup.component.html',
  styleUrls: ['./leaveentitle-popup.component.css']
})
export class LeaveentitlePopupComponent extends BasePopupComponent {

  // modalRef: BsModalRef;
  listleavetype: any = [];
  listmonth: any = [];
  listadjusttype: any = [];
  employeeId = "";
  year: any;
  searchModel: any = {};
  title = '';
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()

  constructor(
    public router: Router
    , public bsModalRef: BsModalRef
    , private appLeaveSvc: ApplyLeaveService
    , private commonSvc: CommonService
    , private toarSvc: ToastrService
  ) {
    super();
  }

  ngOnInit() {
    this.commonSvc.getStdcodesByCode(`${_const.CODE_TYPE.hrleave_type},${_const.CODE_TYPE.month},${_const.CODE_TYPE.hrleaveadj_type}`).subscribe(
      data => {
        let data1 = data[this.payLoad];
        this.listleavetype = data1.filter(x => x.codeType == _const.CODE_TYPE.hrleave_type);
        this.listmonth = data1.filter(x => x.codeType == _const.CODE_TYPE.month);
        this.listadjusttype = data1.filter(x => x.codeType == _const.CODE_TYPE.hrleaveadj_type);
      }
    )
    var date = new Date();
    this.searchModel.LMonth = (date.getMonth() + 1).toString();
  }

  saveLeaveenTitles() {
    let model = this.searchModel;
    model.employeeId = this.employeeId;
    model.LYear = this.year;
    model.userId = this.currentuser.employeeId;

    console.log('save ===> ', model);
    this.appLeaveSvc.saveLeaveEntitle(model).subscribe(
      data => {
        if (data[this.payLoad] > 0) {
          this.reloadGrid.emit(null);
          this.bsModalRef.hide();
          this.toarSvc.success('Cancel Leave', 'Success!');
        }
      }
    )
  }
}
