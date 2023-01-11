import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HtsDevicesService } from '../../../_services/hts-devices.service';
import { BaseComponent } from '../../../_directives/base.component';
import { _const } from '../../../_helpers/constants';

declare var AdminLTE: any;

@Component({
  selector: 'app-hts-devices',
  templateUrl: './hts-devices.component.html',
  styleUrls: ['./hts-devices.component.css']
})

export class HtsDevicesComponent extends BaseComponent {

  dataSource: any = [];
  userGroupModel: any = {};

  constructor(
    public router: Router
    , private toastr: ToastrService
    , private deviceSvc: HtsDevicesService
  ) {
    super(router);
  }

  ngOnInit() {
    AdminLTE.init();
    this.getAllDevices();

    this.userGroupModel.groupCode = "";
    this.userGroupModel.EmployeeId = "";
  }

  getAllDevices() {
    this.deviceSvc.getAll().subscribe(
      data => {
        this.dataSource = data[this.payLoad];
      })
  }

  insertDevice(e) {
    let model = e.data;
    this.deviceSvc.insert(model).subscribe(
      data => {
        if (data[this.success] = true)
          this.toastr.success(_const.NOTIFICATIONS.save_success, "Insert Device");
        else
          this.toastr.error(_const.NOTIFICATIONS.save_fail, "Insert Device");
      },
      error => {
        this.toastr.error(_const.NOTIFICATIONS.save_fail, "Insert Device");
      }
    )
  }

  updateDevice(e) {
    let model = Object.assign({}, e.oldData, e.newData);
    this.deviceSvc.update(model).subscribe(
      data => {
        if (data[this.payLoad] > 0)
          this.toastr.success(_const.NOTIFICATIONS.update_success, "Update Device");
      },
      error => {
        this.toastr.error(error[this.message] ? error[this.message] : error);
      }
    )
  }
}
