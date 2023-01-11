import { Component, OnInit, ViewContainerRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { UserService, CommonService, FileService, EmployeeService, SSOCommonService, SSOUserProfileService, AuthenticationService } from '../../../_services/index';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserprofileViewdetailComponent } from '../../user-profile/userprofile-viewdetail/userprofile-viewdetail.component';
import { EmployeePopupPermissionComponent } from '../employee-popup-permission/employee-popup-permission.component';
import * as moment from 'moment';
import { environment } from '../../../../environments/environment';
import { WorkflowPopupComponent } from '../../servicerequest/servicerequest-detail/workflow-popup/workflow-popup.component';
import { BaseComponent } from '../../../_directives/base.component';
import { PagerOption } from '../../../_models/pagerOption';
import { confirm } from 'devextreme/ui/dialog';
import { ToastrService } from 'ngx-toastr';
import { _const } from '../../../_helpers/constants';

declare var AdminLTE: any;

@Component({
    selector: 'app-employee-search',
    templateUrl: './employee-search.component.html',
    styleUrls: ['./employee-search.component.css'],
    moduleId: module.id.toString()
})
export class EmployeeSearchComponent extends BaseComponent {

    @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
    bsModalRef: BsModalRef;
    bsModalRef2: BsModalRef;
    searchModel: any = {};
    model: any = {};
    listusers: any = [];
    genders: any[];
    loading = false;
    title = "Employee";
    listSubsidiary: any = [];
    listSubsidiary2: any = [];
    dataSource: any = {};
    devisions: any = [];
    departments: any = [];
    departments2: any = [];
    isViewMode: any = false;
    IsRoleID: boolean = false;
    bsRangeValue: any = [];
    dateF: any = new Date();
    dateT: any = new Date();
    urlPath = environment.urlFileServer;
    @Output() viewDetailUser: EventEmitter<any> = new EventEmitter();
    listWorkLocs: any = [];
    listDesignation: any = [];
    fullDevisions: any = [];
    listEmpStatus: any;

    constructor(
        public router: Router
        , private route: ActivatedRoute
        , private userService: UserService
        , private commonSvc: CommonService
        , private ssoCommonSvc: SSOCommonService
        , private authenSvc: AuthenticationService
        , public fileSvc: FileService
        , public modalService: BsModalService
        , public empSvc: EmployeeService
        , private toastr: ToastrService
        , private userSSOSer: SSOUserProfileService
    ) {
        super(router);

        if (Object.keys(this.route.snapshot["queryParams"]).length > 0) {
            this.route.queryParams.subscribe(params => {
                if (this._pagerOption == null) this._pagerOption = new PagerOption();
                this._pagerOption.pageSize = Number(params.pageSize);
                this._pagerOption.pageIndex = Number(params.pageIndex);
                this._pagerOption.indexFocus = Number(params.focusIndex);
            })
        }
    }

    ngOnInit() {

        if (this.router.url == '/intranet/employee/view' || this.router.url == '/intranet/intranet/employee/view')
            this.isViewMode = true;

        this.bsRangeValue = [moment().subtract(30, 'days')["_d"], new Date()];
        this.searchModel = {
            employeeName: "",
            mobile: "",
            subsidary: "",
            division: this.currentuser.divisionCode,
            department: "",
            employeecode: "",
            designation: "",
            emplStatus:"WORK"
        }

        this.getSubsidiaries();
        this.getDivisions();
        this.getSubDepts(this.currentuser.subsidiaryId);

        this.commonSvc.getStdcodesByCode('DESGINATION,EMPSTATUS').subscribe(
            data => {
                this.listEmpStatus = data['payload'].filter(function (x) {
                    return x.codeType == _const.CODE_TYPE.emp_status;
                  });
                this.listDesignation = data['payload'].filter(function (x) {
                    return x.codeType == _const.CODE_TYPE.desgination;
                  });
            }
        );

        if (this.searchModel.division == "" && Object.keys(this.route.snapshot["queryParams"]).length == 0)
            this.searchModel.division = this.currentuser.divisionCode;

        this.commonSvc.getWorkLoc().subscribe(
            data => {
                this.listWorkLocs = data[this.payLoad];
            }
        )

        if (Object.keys(this.route.snapshot["queryParams"]).length > 0) {
            this.searchModel.department = this.route.snapshot.queryParams["department"];
            this.searchModel.division = this.route.snapshot.queryParams["division"] || '';
            this.searchModel.employeeName = this.route.snapshot.queryParams["employeeName"];
            this.searchModel.mobile = this.route.snapshot.queryParams["mobile"];
            this.searchModel.subsidary = this.route.snapshot.queryParams["subsidary"];
            this.searchModel.resigndatef = this.route.snapshot.queryParams["resigndatef"];
            this.searchModel.workingLocation = +this.route.snapshot.queryParams["workingLocation"];

            if (this.searchModel.workingLocation == 0) {
                this.searchModel.workingLocation = '';
            }

            if (this.searchModel.resigndatef != null) {
                this.searchModel.CheckisLeftEmployee = true;
                this.bsRangeValue = [new Date(this.route.snapshot.queryParams["resigndatef"]), new Date(this.route.snapshot.queryParams["resigndatet"])];
            }
        }

        if (this.commonSvc.isAdmin(this.currentuser.roleId))
            this.IsRoleID = true;

        this.search();
    }

    search() {
        if (this.searchModel.CheckisLeftEmployee == true) {
            this.searchModel.resigndatef = moment(this.bsRangeValue[0]).format("MM-DD-YYYY");
            this.searchModel.resigndatet = moment(this.bsRangeValue[1]).format("MM-DD-YYYY");
        };

        if (this.searchModel.CheckisLeftEmployee == true)
            this.searchModel.isLeftEmployee = 'Y';
        else
            this.searchModel.isLeftEmployee = '';

        // console.log('data Search: ', this.searchModel)
        this.empSvc.search(this.searchModel).subscribe(
            data => {
                this.dataSource = data[this.payLoad];
                AdminLTE.init();
            }
        );
    }

    rowClickEvent(data) {
        this.viewDetailUser.emit(data);
    }

    changedDivision() {

        let divisionCode = this.searchModel.division;
        if (divisionCode && divisionCode != '') {
            this.departments2 = this.departments.filter(function (x) {
                return x.divisionCode == divisionCode;
            });
        }
        else {
            this.departments2 = this.departments;
        }
    }

    changedSudidiary() {
        let subsidiaryId = this.searchModel.division;
        if (subsidiaryId && subsidiaryId != '') {
            this.listSubsidiary2 = this.listSubsidiary.filter(function (x) {
                return x.subsidiaryId == subsidiaryId;
            });
        } else
            this.listSubsidiary2 = this.listSubsidiary;

        // Change list of divisions 
        let subID = this.searchModel.subsidary;
        if (subID) {
            this.devisions = this.fullDevisions.filter(function (x) {
                return x.subsidiaryId == subID;
            });
        } else
            this.devisions = this.fullDevisions;
    }

    viewDetail(id: any) {
        if (!this.isViewMode) {
            this._pagerOption.extract(this.dataGrid);
            let url: any = Object.assign(this.searchModel, this._pagerOption);
            this.router.navigate(['intranet/employeedetail/' + id], {
                queryParams: url
            });
        } else {
            this.authenSvc.getUserInfoById(id).subscribe(
                data => {
                    this.bsModalRef2 = this.modalService.show(UserprofileViewdetailComponent, { class: 'modal-lg second' });
                    this.bsModalRef2.content.model = data[this.payLoad].userInfo;
                    this.bsModalRef2.content.listAccount = data[this.payLoad].listAccount;
                    this.bsModalRef2.content.subsidiary = data[this.payLoad].subsidiaryInfo;
                    this.bsModalRef2.content.avatar = environment.urlFileServer + data[this.payLoad].userInfo.avartarThumbnail;
                },
                error => {
                }
            )
        }
    }

    showpopup(id: any) {
        
        const initialState = {
            model: id,
            title: this.languages.updateworktime
        };

        this.bsModalRef = this.modalService.show(EmployeePopupPermissionComponent, {
            class: 'modal-lg', initialState, backdrop: true,
            ignoreBackdropClick: true
        });

        // this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
        this.bsModalRef.content.title = 'Employee Permission';
        //this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
    }

    exportExcel() {
        this.empSvc.exportEmployees(this.searchModel).subscribe(
            data => {
                this.fileSvc.downloadExcel(data[this.payLoad], "Employee_Export.xlsx");
            }
        )
    }

    viewLeaveWorkFlow(data: any) {
        const initialState = {
            ApplicationCode: 'HLV',
            LocalAmount: 0,
            Employee: data
        }

        this.bsModalRef = this.modalService.show(WorkflowPopupComponent, {
            class: 'modal-lg', initialState
        });
    }

    showResetDevicePopup(id: any) {
        var result = confirm("Are you sure to reset device for this user?", 'Confirm Reset User Device');
        result.done((dialogResult: any) => {
            if (dialogResult) {
                this.userSSOSer.resetUserDevice(id).subscribe(
                    data => {
                        if (data[this.payLoad] > 0) {
                            this.toastr.success("Reset Sucessfully", "Reset User Device");
                            this.search();
                        }
                        else {
                            this.toastr.error("Reset Unsucessfully", "Reset User Device");
                        }
                    }
                );
            }
        })
    }

    private getSubsidiaries() {
        this.ssoCommonSvc.getSubsidiaries().subscribe(
            data => {
                this.listSubsidiary = data[this.payLoad];
                this.listSubsidiary2 = data[this.payLoad];
                this.searchModel.subsidary = this.currentuser.subsidiaryId;
            }
        );
    }

    private getDivisions() {
        this.ssoCommonSvc.getDivisions().subscribe(
            data => {
                this.devisions = data[this.payLoad];
                this.fullDevisions = data[this.payLoad];
            }
        );
    }

    private getSubDepts(sub: string): any {
        this.ssoCommonSvc.getSubDepts(sub).subscribe(
            data => {
                this.departments = data[this.payLoad];
                this.departments2 = this.departments;
                setTimeout(() => {
                    this.changedDivision();
                }, 500);
            }
        );
    }

    showResetPasswordPopup(id: any) {
        var result = confirm("Are you sure to reset password for this user?", 'Confirm Reset Password');
        result.done((dialogResult: any) => {
            if (dialogResult) {
                this.userSSOSer.resetPasswordEmployeeeSearch(id).subscribe(
                    data => {
                        if (data[this.payLoad] > 0) {
                            this.toastr.success("Reset password sucessfully", "Reset Password");
                            this.search();
                        }
                        else {
                            this.toastr.error("Reset password Unsucessfully", "Reset Password");
                        }
                    }
                );
            }
        })
    }
}