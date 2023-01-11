import { Component, ViewChild } from '@angular/core';
import { DxTreeListComponent } from 'devextreme-angular';
import { BaseComponent } from '../../../../_directives/base.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GroupPermissionService } from '../../../../_services/group_permission.service';
import { _const } from '../../../../_helpers/constants';
import { Helpers } from '../../../../_helpers/helpers';
import { EnumResponse } from '../../../../_helpers/enums';

declare var AdminLTE: any;
@Component({
  selector: 'app-group-admin',
  templateUrl: './group-admin.component.html',
  styleUrls: ['./group-admin.component.css']
})

export class GroupAdminComponent extends BaseComponent {

  dataSource = [];

  @ViewChild("gridContainer") dataGrid: DxTreeListComponent;

  constructor(
    public router: Router
    , private toastr: ToastrService
    , private grPermissionSvc: GroupPermissionService
  ) {
    super(router);
  }

  /**
   * Page Init
   */
  ngOnInit() {
    this.getListGroupPermisson();
    AdminLTE.init();
  }

  /**
   * Event selected row
   * @param e row selected
   */
  onEditorPreparing(e) {

    if (e.parentType === "dataRow" && e.dataField === "groupId") {
      if (e.row && e.row.inserted)
        e.editorOptions.disabled = false;
      else
        e.editorOptions.disabled = true;
    }
  }

  /**
   * Insert || Update || Delete group permission
   * @param currentRow row selected
   */
  modifyGroupPermission(currentRow: any, action: any) {

    const actionType = action == 2 ? _const.ACTIONS.update : action == 3 ? _const.ACTIONS.delete : _const.ACTIONS.insert;
    // Get params form
    const result = this.getParamsGroup(currentRow, actionType);

    console.log(result);

    // Check error
    if (!result || result.error || !result.params)
      return this.toastr.error(_const.NOTIFICATIONS.get_params_error, 'Get Params Group Permission');

    // Modify data group permission
    if (actionType == _const.ACTIONS.update)
      this.updateDataGroupPermission(result.params);

    else if (actionType == _const.ACTIONS.delete)
      this.deleteDataGroupPermission(result.params);
    
    else
      this.insertDataGroupPermission(result.params);
  }

  /**
   * Get data menu group permisson
   */
  private getListGroupPermisson() {

    this.grPermissionSvc.getListGroupPermission(this.systemId.toString()).subscribe(
      data => {
        if (Helpers.checkObjAPIsReturn(data))
          this.dataSource = data[this.payLoad];
      },
      error => {
        this.toastr.error(error, 'Get List Menu Group Permission');
      }
    );
  }

  /**
   * Add new data group
   * @param params data add new group
   */
  private insertDataGroupPermission(params: any) {

    this.grPermissionSvc.insertGroupPermission(params).subscribe(
      resData => {

        if (resData && resData[this.success] && resData[this.payLoad])
          if (resData[this.payLoad] == 1)
            return this.toastr.success(_const.NOTIFICATIONS.save_success, "Add New Group Permissions");

          if (resData[this.payLoad] == -1)
            return this.toastr.error(_const.NOTIFICATIONS.data_exists, "Add New Group Permissions");

          if (!resData[this.payLoad])
            return this.toastr.error(_const.NOTIFICATIONS.save_fail, "Add New Group Permissions");
      },
      error => {
        this.toastr.error(error[this.message], "Add New Group Permissions");
      }
    )
  }

  /**
   * Update data group
   * @param params data update group
   */
  private updateDataGroupPermission(params: any) {

    this.grPermissionSvc.updateGroupPermission(params).subscribe(
      resData => {
        
        if (resData && resData[this.success] && resData[this.payLoad])
          if (resData[this.payLoad] == 1)
            return this.toastr.success(_const.NOTIFICATIONS.update_success, "Update Group Permissions");

          if (resData[this.payLoad] == -1)
            return this.toastr.error(_const.NOTIFICATIONS.data_not_exists, "Update Group Permissions");

          if (!resData[this.payLoad])
            return this.toastr.error(_const.NOTIFICATIONS.update_fail, "Update Group Permissions");
      },
      error => {
        this.toastr.error(error[this.message], "Update Group Permissions");
      }
    )
  }

  /**
   * Delete group permission
   * @param params Data group
   */
  private deleteDataGroupPermission(params: any) {

    this.grPermissionSvc.deleteGroupPermission(params).subscribe(
      resData => {
        
        if (resData && resData[this.success] && resData[this.payLoad])
          if (resData[this.payLoad] == EnumResponse.SUCCESS)
            return this.toastr.success(_const.NOTIFICATIONS.delete_success, "Delete Group Permissions");

          if (resData[this.payLoad] == EnumResponse.DATA_EXISTS)
            return this.toastr.error(_const.NOTIFICATIONS.data_not_exists, "Delete Group Permissions");

          if (!resData[this.payLoad])
            return this.toastr.error(_const.NOTIFICATIONS.delete_fail, "Delete Group Permissions");
      },
      error => {
        this.toastr.error(error[this.message], "Delete Group Permissions");
      }
    )
  }

  /**
   * Get value param group
   * @param currentRow row selected
   * @param action Insert || Update || Delete
   */
  private getParamsGroup(currentRow: any, action: string): any {
    let objReturn = {
      error: true
      , params: null
    },
    params: any = {};

    switch (action) {

      case _const.ACTIONS.update:
          params = Object.assign({}, currentRow.oldData, currentRow.newData);
        break;

      case _const.ACTIONS.delete:
        params = Object.assign({}, currentRow.data);
        delete params.groupDesc;
        delete params.isUse;
      break;

      default: // Insert
          params = Object.assign({}, currentRow.data);
          delete params['__KEY__'];
        break;
    }

    if (Helpers.isNullOrEmpty(params.systemId))
      params.systemId = this.systemId;

    // console.log('get data ===> ', params);

    if (params && !Helpers.isNullOrEmpty(params.groupId)) {
      objReturn.error = false;
      objReturn.params = params;
    }

    return objReturn;
  }
}
