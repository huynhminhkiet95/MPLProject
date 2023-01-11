import { Component, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../_directives/base.component';
import { DxTreeListComponent } from 'devextreme-angular';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GroupPermissionService } from '../../../_services/group_permission.service';
import { Helpers } from '../../../_helpers/helpers';
import { _const } from '../../../_helpers/constants';
import { MenuService } from '../../../_services/menu.service';

declare var AdminLTE: any;

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.css']
})

export class MenuAdminComponent extends BaseComponent {

  @ViewChild("gridContainer") dataGrid: DxTreeListComponent;

  private MENU_ID: string = 'menuId';
  private PARENT_ID: string = 'parentId';
  private SORT_FIELD: string = 'menuName';

  dataSource: any;
  arrParentData: any;
  disabledMenuId: boolean;

  constructor(
    public router: Router
    , private toastr: ToastrService
    , private grPermissionSvc: GroupPermissionService
    , private menuSvc: MenuService
  ) { 
    super(router);
  }

  ngOnInit() {
    AdminLTE.init();
    this.getListMenu();
  }

  /**
   * Before add new row
   * @param e row selected
   */
  initNewRow(e) {
    // console.log('rowSelecte ===> ', rowSelected);

    if (e && e.data) {
      const data = e.data;

      if (data && !Helpers.isNullOrEmpty(data.parentId)) {
        e.data.isGroup = false;
        e.data.new = true;
        e.data.search = true;
        e.data.sav = true;
        e.data.preview = true;
        e.data.del = true;
        e.data.excel = true;
      }
      else
        e.data.isGroup = true;
    }
  }

  /**
   * A function that is executed before a cell or row switches to the editing state.
   * @param e row selected
   */
  onEditingStart(e: any) {
    // console.log(e);

    if (e && e.data) {
      const data = e.data;

      if (data && data.isGroup) {
        e.data.parentId = 0;
      }
    }
  }

  // Before update
  onEditorPreparing(e: any) {
    
    if(e && e.parentType === "dataRow") {
      const data = e.row.data;
      const isInserted = e.row.inserted;

      if (e.dataField == this.MENU_ID) {
        if (isInserted)
          e.editorOptions.disabled = false;
        else
          e.editorOptions.disabled = true;
      }

      // Disable box select parent
      if (e.dataField == this.PARENT_ID)
        e.editorOptions.disabled = true;

      // Menu parent
      if (data) {

        if (Helpers.isNullOrEmpty(data.parentId)) {
          // Disable
          if (e.dataField == 'pageId' 
          || e.dataField == 'parentId' 
          || e.dataField == 'new' 
          || e.dataField == 'search' 
          || e.dataField == 'sav' 
          || e.dataField == 'preview' 
          || e.dataField == 'del'
          || e.dataField == 'excel') {
            e.cancel = true;
            e.editorElement.style.display = "none";
          }
        }
      }
    }
  }

  modifyMenu(rowSelected, action) {
    // console.log('rowSelecte ===> ', rowSelected);

    const actionType = action == 2 ? _const.ACTIONS.update : action == 3 ? _const.ACTIONS.delete : _const.ACTIONS.insert;
    let result = this.getParamsMenu(rowSelected, actionType);

    // Check error get params
    if (!result || result.error || !result.params)
      return this.toastr.error(_const.NOTIFICATIONS.get_params_error, 'Get Params Menu');

      // Modify data group permission
    if (actionType == _const.ACTIONS.update)
      this.UpdateDataMenu(result.params);
    else if (actionType == _const.ACTIONS.delete)
      this.deleteDataMenu(result.params);
    else
      this.insertDataMenu(result.params);
  }

  /**
   * Insert new menu
   * @param params params insert menu
   */
  private insertDataMenu(params: any) {
    this.menuSvc.insertMenu(params).subscribe(
      resData => {

        if (Helpers.checkObjAPIsReturn(resData)) {
          const result = resData[this.payLoad];

          if (result == -1)
            return this.toastr.error(_const.NOTIFICATIONS.data_exists, "Add New Menu");
          else if (result)
            return this.toastr.success(_const.NOTIFICATIONS.save_success, "Add New Menu");
          else
            return this.toastr.error(_const.NOTIFICATIONS.save_fail, "Add New Menu");
        }

        return this.toastr.error(_const.NOTIFICATIONS.save_fail, "Add New Menu");
      },
      error => {
        this.toastr.error(error[this.message], "Add New Menu");
      }
    )
  }

  /**
   * Update menu
   * @param params Params update  menu
   */
  private UpdateDataMenu(params: any) {
    this.menuSvc.updateMenu(params).subscribe(
      resData => {

        if (Helpers.checkObjAPIsReturn(resData)) {
          const result = resData[this.payLoad];

          if (result)
            return this.toastr.success(_const.NOTIFICATIONS.update_success, "Update Menu");
          else
            return this.toastr.error(_const.NOTIFICATIONS.update_fail, "Update Menu");
        }
          
        return this.toastr.error(_const.NOTIFICATIONS.update_fail, "Update Menu");
      },
      error => {
        this.toastr.error(error[this.message], "Update Menu");
      }
    )
  }

  private deleteDataMenu(params: any) {
    this.menuSvc.deleteMenu(params).subscribe(
      resData => {

        if (Helpers.checkObjAPIsReturn(resData)) {
          const result = resData[this.payLoad];

          if (result)
            return this.toastr.success(_const.NOTIFICATIONS.delete_success, "Delete Menu");
          else
            return this.toastr.error(_const.NOTIFICATIONS.delete_fail, "Delete Menu");
        }
          
        return this.toastr.error(_const.NOTIFICATIONS.delete_fail, "Delete Menu");
      },
      error => {
        this.toastr.error(error[this.message], "Delete Menu");
      }
    )
  }

  /**
   * Get data list Menu
   */
  private getListMenu() {
    this.grPermissionSvc.getListMenuSelected(_const.DEFAULT_GROUPS.wb_mpi, this.systemId.toString()).subscribe(
      data => {

        if (data && Helpers.checkLengthObject(data[this.payLoad]) && data[this.payLoad].menus) {
          this.dataSource = data[this.payLoad].menus;

          var lstParent = this.dataSource.filter(item => {
            return item.isGroup === true;
          });

          this.arrParentData = {
            store: {
                type: "array"
                , data: lstParent
                , sort: this.SORT_FIELD
            }
          };
        }
      },
      error => {
        this.toastr.error(error, 'Get List Group Permission');
      }
    );
  }

  private getParamsMenu(currentRow: any, action: string): any {
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
      break;

      default: // Insert
          params = Object.assign({}, currentRow.data);
          delete params['__KEY__'];
        break;
    }

    // console.log('get data ===> ', params);

    if (params && (params.isGroup 
        || (!params.isGroup 
          && !Helpers.isNullOrEmpty(params.pageId) 
          && !Helpers.isNullOrEmpty(params.parentId)))) {

      params.systemId = this.systemId;
      objReturn.error = false;
      objReturn.params = params;
    }

    return objReturn;
  }
}
