import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BaseComponent } from '../../../_directives/base.component';
import { EmployeeService } from '../../../_services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Helpers } from '../../../_helpers/helpers';

@Component({
  selector: 'app-employeetimesheet-popup',
  templateUrl: './employeetimesheet-popup.component.html',
  styleUrls: ['./employeetimesheet-popup.component.css']
})

export class EmployeetimesheetPopupComponent extends BaseComponent {

  dataSource: any = {};
  listIsmain: any = [{
    "ID": 1,
    "Name": "true"
  }, {
    "ID": 0,
    "Name": "false"
  }];

  private employId: string;

  constructor(
    public router: Router
    , public bsModalRef: BsModalRef
    , public employeeSvc: EmployeeService
    , private modalService: BsModalService
    , private toastr: ToastrService
  ) {
    super(router);
    this.employId = modalService.config["initialState"].model;
  }

  ngOnInit() {
    if (!Helpers.isNullOrEmpty(this.employId))
      this.getEmployeeTimeSheet(this.employId);
    else
      this.toastr.error('Can`t not get current employee!', 'Get Timesheet Employee');
  }

  onEditorPreparing(e) {
    if (e.parentType === "dataRow" && e.dataField === "address") {
      if (e.row.inserted == true)
        e.editorOptions.disabled = false;
      else
        e.editorOptions.disabled = true;
    }
  }

  update(eventName) {
    const updatedObject = Object.assign({}, eventName.oldData, eventName.newData);
    updatedObject.employeeid = this.employId;
    this.employeeSvc.saveTimesheetEmployee(updatedObject).subscribe(
      data => {
        if (data[this.payLoad] > 0) {
          this.toastr.success("Update Success", "Employee Timesheet")
        }
        else {
          this.toastr.error("Update Failed", "Employee Timesheet");
        }
      },
      error => {
        this.toastr.error(error[this.message]);
      }
    )
  }

  private getEmployeeTimeSheet(employeeid: string): void {
    this.employeeSvc.getTimesheetByEmployeeId(employeeid).subscribe(
      data => {
        this.dataSource = data[this.payLoad];
      }
    );
  }
}
