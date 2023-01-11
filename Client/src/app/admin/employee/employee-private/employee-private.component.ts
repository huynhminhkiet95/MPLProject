import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IdRequestService, CommonService, UserService, FileService, EmployeeService, SSOUserProfileService } from '../../../_services/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Globalconst } from '../../../_helpers/globalvariable'
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../_directives/base.component';
import { Helpers } from '../../../_helpers/helpers';
import { _const } from '../../../_helpers/constants';
import { BasePopupComponent } from '../../../_directives/base.popup.component';

declare var AdminLTE: any;
@Component({
  selector: 'app-employee-private',
  templateUrl: './employee-private.component.html',
  styleUrls: ['./employee-private.component.css']
})
export class EmployeePrivateComponent extends BasePopupComponent {

  listnationality: any = [];
  checkupdate: any = null;
  listeducationLevel: any = [];
  listmarrageStatus: any = [];
  loading = false;
  model: any = {};
  bsiDIssueDate: any = null;
  bshouseHolderDOB: any = null;
  id: any = '';
  title = "Employee Private";
  employeePrivate: any = {};

  constructor(
    private languageSvc: CommonService
    , public router: Router
    , private route: ActivatedRoute
    , private ssoUserProfileSvc: SSOUserProfileService
    , private toastr: ToastrService
    , private globals: Globalconst
    , public empSvc: EmployeeService
    , public idrequestService: IdRequestService
  ) {
    super();
  }

  ngOnInit() {
    this.id = this.route.params["_value"].id;
    this.bsiDIssueDate = new Date();
    this.bshouseHolderDOB = new Date();

    this.languageSvc.getStdcodesByCode("NATIONALITY").subscribe( ///Get Nationality
      data => {
        this.listnationality = data[this.payLoad];
      }
    )

    this.languageSvc.getStdcodesByCode("HREDULEVEL").subscribe(/// Get Education Level
      data => {
        this.listeducationLevel = data[this.payLoad];
      }
    )

    this.languageSvc.getStdcodesByCode("MARRSTATUS").subscribe(/// Get Marrage Status
      data => {
        this.listmarrageStatus = data[this.payLoad];
      }
    )

    const model = {
      employeeId: this.id
      , systemId: this.systemId
    }

    this.getDataPrivateEmployee(model);
     AdminLTE.init();
  }

  Save() {
    this.employeePrivate.employeeId = this.id;

    if (this.employeePrivate.isUpdatePrivate) {
      // Get info current employee
      var currentuser = this.globals._userinfo;
      this.employeePrivate.updateUser = currentuser.employeeId;

      // Update private info employee by id
      this.ssoUserProfileSvc.updatePrivateInfo(this.employeePrivate).subscribe(
        data => {
          this.toastr.success(_const.NOTIFICATIONS.update_success, "Update employee");
        },
        error => {
          this.toastr.error(error[this.message] ? error[this.message] : error);
        }
      )
    } else {
      // Add new data info private employee
      this.ssoUserProfileSvc.insertPrivateInfo(this.employeePrivate).subscribe(
        data => {
          this.toastr.success(_const.NOTIFICATIONS.save_success, "Save employee");
        },
        error => {
          this.toastr.error(error[this.message] ? error[this.message] : error);
        }
      )
    }
  }

  Viewemployeedetail() {
    this.router.navigate(['intranet/employeedetail/' + this.id]);
  }

  /**
   * Get data private employee
   * @param empId employee id
   */
  private getDataPrivateEmployee(model: any) {

    // Get private info employee by id
    this.ssoUserProfileSvc.getPrivateInfo(model).subscribe(
      resData => {
        if (Helpers.checkObjAPIsReturn(resData) && resData[this.payLoad].userDetail) {

          this.employeePrivate = resData[this.payLoad].userDetail;

          if (this.employeePrivate.houseHolderDOB != null)
            this.bshouseHolderDOB = new Date(this.employeePrivate.houseHolderDOB)

          if (this.employeePrivate.idIssueDate != null)
            this.bsiDIssueDate = new Date(this.employeePrivate.idIssueDate);
        }
        else
          // Set update private info employee false
          this.employeePrivate.isUpdatePrivate = false
      },
      error => {
        this.toastr.error(error[this.message] ? error[this.message] : error);
      }
    )
  }
}
