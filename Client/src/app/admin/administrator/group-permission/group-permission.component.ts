import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DxTreeListComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../_directives/base.component';
import { GroupPermissionService } from '../../../_services/group_permission.service';
import { SSOCommonService } from '../../../_services';
import { Helpers } from '../../../_helpers/helpers';
import { _const } from '../../../_helpers/constants';

declare var AdminLTE: any;
@Component({
  selector: 'app-group-permission',
  templateUrl: './group-permission.component.html',
  styleUrls: ['./group-permission.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class GroupPermissionComponent extends BaseComponent {

  @ViewChild("gridContainer") dataGrid: DxTreeListComponent;

  private countReload: number = 0;
  private isSaveData: boolean;
  private isSelectTab: boolean;
  private isPageLoad: boolean;

  listGroup: any = [];
  dataSource: any = [];
  selectedRowKeys = [];
  groupId: any;
  systemList: any = [];

  constructor(
    public router: Router
    , private toastr: ToastrService
    , private grPermissionSvc: GroupPermissionService
    , private ssoCommonSvc: SSOCommonService
  ) {
    super(router);
    this.groupId = _const.DEFAULT_GROUPS.wb_mpi;
    this.isSaveData = false;
    this.isSelectTab = false;
    this.isPageLoad = true;
  }

  ngOnInit() {
    this.getListSystem();
    this.getListGroupPermisson(this.systemId.toString());
    this.getDataGroupPermission(this.groupId, this.systemId.toString());

    AdminLTE.init();
  }

  /**
   * Change selected system event
   * @param val Value system selected
   */
  onChangeSystem(val) {

    if (!Helpers.isNullOrEmpty(val)) {
      this.systemId = val.split(' ')[1];

      this.groupId = Helpers.setDefaultGroupBySystem(this.systemId.toString());
      // Get menu permisson
      this.getListGroupPermisson(this.systemId.toString());
      // Get data group permission
      this.getDataGroupPermission(this.groupId, this.systemId.toString());
    }
  }

  // Tab group event click
  selectTabGroup(e) {

    // Reset all param check logic save data
    this.resetParamCheckSave();

    this.dataGrid.selectedRowKeys = null;
    this.dataGrid.instance.clearSelection();
    this.dataGrid.instance.deselectAll();
    this.dataGrid.instance.refresh();
    this.groupId = e.id;

    // Load data
    this.getDataGroupPermission(this.groupId, this.systemId.toString());
  }

  // doThisOnSelectPermisson(e) {
  //   this.isLoadTab = true;
  //   this.dataGrid.instance.deselectAll();
  //   this.dataGrid.instance.refresh();
  //   this.groupId = e.id;
  //   this.selectedRowKeys = [];
  //   this.dataSource = [];
  //   this.grPermissionSvc.grouppermissions(e.id).subscribe(
  //     data => {
  //       this.dataSource = data["this.payLoad"];
  //       for (var i = 0; i < data["this.payLoad"].length; i++) {
  //         if (data["this.payLoad"][i].isActive == 1) {
  //           this.selectedRowKeys.push(data["this.payLoad"][i].menuID);
  //         }
  //       }
  //     }
  //   );
  // }

  /**
   * Row selected event click
   * @param e event
   */
  selectRowMenu(e) {
    
    const strGroupId = this.groupId;
    let objModel: any = {}, isDelete: boolean;

    // Check data selected
    if (!isDelete && this.checkSaveData(e)) {
      isDelete = e.currentDeselectedRowKeys.length == 1;

      // Get params form control
      objModel = this.getParamValue(strGroupId, e, isDelete);

      if (objModel.error)
        return this.toastr.error(_const.NOTIFICATIONS.get_params_error, 'Save Group Permission');

      // Save Or Delete group permission
      if (!isDelete)
        this.saveDataGroupPermission(objModel.params);
      else
        this.delDataGroupPermission(objModel.params);
    }
  }

  addNewGroup() {
    this.router.navigate([_const.MPI_URLS.group_permissions_admin]);
  }

  /**
   * Get list system
   */
  private getListSystem(): void {
    this.ssoCommonSvc.getSystemList().subscribe(
      data => {
        this.systemList = data[this.payLoad];
        // console.log(this.listGroup)
      },
      error => {
        this.toastr.error(error[this.message], 'Get List System');
      }
    );
  }

  /**
   * Get data menu group permisson
   */
  private getListGroupPermisson(systemId: string) {

    this.grPermissionSvc.getListGroupPermission(systemId).subscribe(
      data => {
        this.listGroup = data[this.payLoad];
        // console.log(this.listGroup)
      },
      error => {
        this.toastr.error(error[this.message], 'Get List Menu Group Permission');
      }
    );
  }

  /**
   * Get data group permission by systenId and groupId
   */
  private getDataGroupPermission(groupId: string, systemId: string): void {
    this.dataSource = [];
    this.selectedRowKeys = [];
    let arrRowParent = [];

    this.grPermissionSvc.getListMenuSelected(groupId, systemId).subscribe(
      data => {

        if (Helpers.checkObjAPIsReturn(data) && data[this.payLoad].menus) {
          this.dataSource = data[this.payLoad].menus;
          // console.log('this.dataSource ===> ', this.dataSource);

          for (var i = 0; i < this.dataSource.length; i++) {
            const objData = this.dataSource[i];

            // Get row parent
            if (objData.isGroup)
              arrRowParent.push(objData.menuId);

            // Get row selected
            if (objData.isActive)
              this.selectedRowKeys.push(objData.menuId);

            // if (i == this.dataSource.length - 1)
            //   console.log('this.selectedRowKeys ===> ', this.selectedRowKeys)
          }
        }

        // Render row selected by data
        this.renderDataSelected(arrRowParent, this.selectedRowKeys);
      },
      error => {
        this.toastr.error(error[this.message], 'Get List Group Permission');
      }
    );
  }

  private renderDataSelected(arrRow: any, arrKeySelected: any): void {
    let length = 0;
    this.dataGrid.selectedRowKeys = arrKeySelected;
    this.dataGrid.instance.deselectAll();
    this.dataGrid.instance.refresh();

    // if (Helpers.checkLengthObject(arrRow)) {
    //   length = arrRow.length;

    //   for (let i = 0; i < length; i++) {
    //     Helpers.toggleExpandedRow(this.treeList, arrRow[i]);
    //   }
    // }
  }

  private resetParamCheckSave(): void {
    this.countReload = 0;
    this.isSelectTab = true;
    this.isPageLoad = false;
    this.isSaveData = false;
  }

  /**
   * Check data and logic save data
   * @param rowSelected current row selected
   */
  private checkSaveData(rowSelected: any): boolean {

    // Check page load || select tab
    if ((this.isSelectTab && this.countReload <= 1) || this.isPageLoad) {
      this.countReload += 1;

      if (this.countReload == 2 || this.isPageLoad)
        this.isSaveData = true;

      this.isPageLoad = false;
      return false;
    }

    // Check data row selected
    if (this.isSaveData && (rowSelected.currentSelectedRowKeys.length == 1 || rowSelected.currentDeselectedRowKeys.length == 1))
      return true;

    return false;
  }

  /**
   * Get params
   * @param {string} groupId
   * @param {object} objCtr page selected
   * @param {boolean} isDelete delete || add new
   */
  private getParamValue(groupId: string, objCtr: any, isDelete: boolean): any {
    let objReturn: any = { error: true, params: {} };
    let valSelected: any, objSelected: any;

    if (!isDelete) {
      valSelected = objCtr.currentSelectedRowKeys[0];
      objSelected = Object.assign({}, objCtr.selectedRowsData.find(x => x.menuId == valSelected));
    } else {
      valSelected = objCtr.currentDeselectedRowKeys[0];
      objSelected = Object.assign({}, this.dataSource.find(x => x.menuId == valSelected));
    }

    if (Helpers.checkLengthObject(objSelected) && !Helpers.isNullOrEmpty(groupId)) {
      const isGroup = objSelected.isGroup;
      objReturn.params.groupId = groupId;
      objReturn.params.pageId = !isGroup ? objSelected.pageId : valSelected;
      objReturn.params.systemId = objSelected.systemId ? objSelected.systemId : this.systemId;
      objReturn.params.isGroup = isGroup;
      objReturn.error = false;
    }

    // objReturn.error = true; it has assigned to default true as above
    // console.log('objReturn ===> ', objReturn);
    return objReturn;
  }

  /**
   * Save data emp group permission
   * @param params params save permission
   */
  private saveDataGroupPermission(params: any) {
    this.grPermissionSvc.saveEmpGroupPermission(params).subscribe(
      result => {
        // console.log('data save result ===> ', result);
        this.toastr.success(_const.NOTIFICATIONS.save_success, "Insert Group Permissions");
      },
      error => {
        // console.log(error)
        this.toastr.error(error[this.message], 'Save Group Permission');
      }
    )
  }

  /**
   * Delete data emp group permission
   * @param params params delete emp group permission
   */
  private delDataGroupPermission(params: any) {
    this.grPermissionSvc.deleteEmpGroupPermission(params).subscribe(
      data => {
        this.toastr.success(_const.NOTIFICATIONS.delete_success, "Delete Group Permissions");
      },
      error => {
        this.toastr.error(error, 'Delete Group Permission');
      }
    )
  }
}
