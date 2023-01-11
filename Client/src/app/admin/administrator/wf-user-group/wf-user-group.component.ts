import { Component } from '@angular/core';
import { BaseComponent } from '../../../_directives/base.component';
import { Router } from '@angular/router';
import { WfUserGroupService } from '../../../_services/wf-user-group.service';
import { ToastrService } from 'ngx-toastr';
import { _const } from '../../../_helpers/constants';

declare var AdminLTE: any;

@Component({
  selector: 'app-wf-user-group',
  templateUrl: './wf-user-group.component.html',
  styleUrls: ['./wf-user-group.component.css']
})

export class WfUserGroupComponent extends BaseComponent {
  dataSource: any = [];

  constructor(
    public router: Router
    , private toastr: ToastrService
    , public userGrSvc: WfUserGroupService
  ) {
    super(router);
   }

  ngOnInit() {
    AdminLTE.init();
    this.geAlltUserGroup();
  }

  insertUserGroup(e) {
    let model = e.data;

    this.userGrSvc.insert(model).subscribe(
      data => {
        if (data["sucess"] = true) {
          this.toastr.success("Insert successfuly", "Insert User Group");
        } else {
          this.toastr.error("Error: This data already exists !!", "Insert User Group");
        }
      },
      error => {
        this.toastr.error("Insert failed", "Insert User Group");
      }
    )
  }

  deleteUserGroup(e) {
    let model = e.data;
    this.userGrSvc.delete(model).subscribe(
      data => {
        if (data[this.success] = true) {
          this.toastr.success(_const.NOTIFICATIONS.delete_success, "Delete User Group");
        } else {
          this.toastr.error(_const.NOTIFICATIONS.delete_fail, "Delete User Group");
        }
      },
      error => {
        this.toastr.error(error[this.message] ? error[this.message] : error);
      }
    )  
  }

  private geAlltUserGroup() {
    this.userGrSvc.getAllUserGroup().subscribe(
      data => {
        this.dataSource = data[this.payLoad];
    })
  }
}