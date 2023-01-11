import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, tr } from '../../../../../node_modules/ngx-bootstrap';
import { EmployeeService } from '../../../_services/employee.service';
import { DxDataGridComponent } from '../../../../../node_modules/devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import { SSOUserProfileService, SSOCommonService } from '../../../_services';
import { BasePopupComponent } from '../../../_directives/base.popup.component';
import { Router } from '@angular/router';
import { Helpers } from '../../../_helpers/helpers';

@Component({
  selector: 'app-employee-popup-permission',
  templateUrl: './employee-popup-permission.component.html',
  styleUrls: ['./employee-popup-permission.component.css']
})

export class EmployeePopupPermissionComponent extends BasePopupComponent {

  @ViewChild('template') childModal: TemplateRef<any>;
  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  
  private systemSelected: any;
  private employId: any;
  private isAllowExecuteData: boolean;
  private isPageLoad: boolean;

  arrDataSource: any = {};
  selectedRows = [];
  systemList: any = [];
  title = "Employee Permission";

  constructor(
    public modalService: BsModalService
    , public bsModalRef: BsModalRef
    , public empSvc: EmployeeService
    , public userProfileSrv: SSOUserProfileService
    , private ssoCommonSvc: SSOCommonService
    , public toastr: ToastrService
    , public router: Router
  ) {
    super();
    this.isAllowExecuteData = false;
    this.isPageLoad = true;
    this.systemSelected = this.systemId;
    this.employId = modalService.config["initialState"].model;
  }

  ngOnInit() {
    this.getListSystem();
    this.getEmployee2Permission(this.employId, this.systemSelected);
  }

  getEmployee2Permission(employeeId: number, systemId: string) {

    this.arrDataSource = {};
    this.selectedRows = [];

    this.userProfileSrv.getEmployee2Group(employeeId, systemId, this.currentuser.subsidiaryId).subscribe(
      data => {
        setTimeout(() => {
          // getdata
          this.arrDataSource = data[this.payLoad];
          //map data
          this.selectedRows = this.arrDataSource.filter(
              m => m.empPermission == 1
            ).map(x => x.groupId);
          
          //set param allow execution data
          this.isAllowExecuteData = true;
          
        }, 300);
      }
    )
  }

  /**
   * Change selected system event
   * @param val Value system selected
   */
  onChangeSystem(val) {

    //console.log('changeslect =>', this.isAllowExecuteData)
    this.isAllowExecuteData = false;// set param not allow execution data
    //this.setStatusExecuteData();

    if (!Helpers.isNullOrEmpty(val)) {
      this.systemSelected = val.split(' ')[1];
      this.getEmployee2Permission(this.employId, this.systemSelected);
    }
  }

  onSelectionChanged(event) {

    // Check status param execute data
    if (this.isAllowExecuteData && !this.isPageLoad) {
      if (event.currentSelectedRowKeys.length > 0) {
      
        //save
        for (var i = 0; i < event.currentSelectedRowKeys.length; i++) {
          let model: any = {};
          model.GroupId = event.currentSelectedRowKeys[i];//get groupid
          model.EmployeeId = this.employId;
          model.SubsidiaryId = this.currentuser.subsidiaryId;
          model.SystemId = this.systemSelected;
  
          this.userProfileSrv.saveEmployee2Group(model).subscribe(
            data => {
              var rs = data[this.payLoad];
              if (rs == 1) {
                this.toastr.clear();
                this.toastr.success("Successfully inserted GroupID: " + model.GroupId + " ", "Insert Employee Permissions");
              }
            }
          )
        }
      } else if (event.currentDeselectedRowKeys.length > 0) {
        for (var i = 0; i < event.currentDeselectedRowKeys.length; i++) {
          let model: any = {};
          model.GroupId = event.currentDeselectedRowKeys[i];//get groupid
          model.EmployeeId = this.employId;
          model.SubsidiaryId = this.currentuser.subsidiaryId;

          this.userProfileSrv.deleteEmployee2Group(model).subscribe(
            data => {
              var rs = data[this.payLoad];
              if (rs == 1) {
                this.toastr.clear();
                this.toastr.success("Successfully Delete GroupID: " + model.GroupId + "", "Delete Employee Permissions");
              }
            }
          )
        }
        //delete
      }
    }

    if (this.isPageLoad)
      this.isPageLoad = false;
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
}
