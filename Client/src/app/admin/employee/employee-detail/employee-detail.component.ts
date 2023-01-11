import { Component, OnInit, ViewChild, trigger, state, transition, style, animate } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IdRequestService, CommonService, UserService, FileService, EmployeeService, SSOCommonService, SSOUserProfileService, AuthenticationService } from '../../../_services/index';
import { BsModalService, ModalDirective, BsModalRef } from 'ngx-bootstrap/modal';
import { FileuploadComponent } from '../../../_directives/fileupload/fileupload.component';
import { Globalconst } from '../../../_helpers/globalvariable'
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { IdRequest } from '../../../_models/index'
import { EmployeetimesheetPopupComponent } from '../employeetimesheet-popup/employeetimesheet-popup.component';
import { EmployeeAssetMovementPopupComponent } from '../employee-asset-movement-popup/employee-asset-movement-popup.component';
import { EmployeeDependentComponent } from '../employee-dependent/employee-dependent.component';
import { EmployeeContractComponent } from '../employee-contract/employee-contract.component';
import { EmployeeCheckAddnewPopupComponent } from '../employee-check-addnew-popup/employee-check-addnew-popup.component';
import { BaseComponent } from '../../../_directives/base.component';
import { _const } from '../../../_helpers/constants';
import { Helpers } from '../../../_helpers/helpers';
import { EnumLanguage } from '../../../_helpers/enums';
import { BasePopupComponent } from '../../../_directives/base.popup.component';
declare var AdminLTE: any;
@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 2 })),
      state('hidden', style({ opacity: 0 })),
      transition('shown => hidden', animate('200ms')),
      transition('hidden => shown', animate('300ms')),
    ])
  ]
})

export class EmployeeDetailComponent extends BasePopupComponent {

  @ViewChild('uploadfile2') public fileUpload2: FileuploadComponent;
  @ViewChild('innerFileUpload') public fileUpload: FileuploadComponent;
  @ViewChild('staticModal') public modalAvatar: ModalDirective;
  @ViewChild('validateModal') public validateModal: ModalDirective;

  loading = false;
  model: any = {};
  bsDateofJoin: Date = null;
  bsDateofBirth: Date = null;
  bsLeaveDate: any = null;
  id: any = '';
  urlback: string;
  title = "Employee Detail";
  employeeDetail: any = {};
  listDepartment: any = [];
  listDivision: any = [];
  listEmpStatus: any = [];
  listIDType: any = [];
  listRole: any = [];
  listSubdepts = [];
  listEmpType = [];
  listGrade = [];
  attachments: any = [];
  listGender: any = [];
  maxDate = new Date();
  userIdRequest = "";
  modelSendRequest = new IdRequest();
  isUserID: boolean = false;
  ismessagecheckuser: string = 'hidden';
  resultmessage: string;
  bsModalRef: BsModalRef;
  avatar: string = '';
  codeType: any = [];
  vehicles: any = [];
  listWorkLocs: any = [];
  createdDate: any = null;
  updatedDate: any = null;

  constructor(
    public router: Router
    , private route: ActivatedRoute
    , private commonSvc: CommonService
    , private ssoCommonSvc: SSOCommonService
    , private ssoUserProfileSvc: SSOUserProfileService
    , private authenSvc: AuthenticationService
    , private toastr: ToastrService
    , private modalService: BsModalService
    , private fileSvc: FileService
    , public globals: Globalconst
    , public empSvc: EmployeeService
    , public idrequestService: IdRequestService
  ) {
    super();
  }

  ngOnInit() {
    AdminLTE.init();
    this.id = this.route.params["_value"].id;
    
    this.getCommonData().subscribe(
      data => {

        this.listDivision = data[0][this.payLoad];
        this.codeType = data[2][this.payLoad];
        this.listSubdepts = data[3][this.payLoad];
        this.listWorkLocs = data[4][this.payLoad];
        this.listDepartment = this.listSubdepts;

        // filter data std code
        this.filterStdCode(this.codeType);

        if (this.id != null && this.id != 'addnew') {
          this.authenSvc.getUserInfoById(this.id).subscribe(
            data => {

              // Format data emp details
              if (Helpers.checkObjAPIsReturn(data) && data[this.payLoad].userInfo) {
                this.employeeDetail = data[this.payLoad].userInfo;
                const subsidiaryInfo = data[this.payLoad].subsidiaryInfo;
                this.formatDataEmployee(this.employeeDetail, subsidiaryInfo);
              }

              // Get file
              this.fileSvc.getList("EMP", this.id).subscribe(
                data => {
                  this.fileUpload2.files2 = data[this.payLoad];
                },
                error => {
                }
              );

              this.changedDivision();
            },
            error => {
              this.toastr.error(error[this.message] ? error[this.message] : error);
            }
          )
        }
        else //add new 
        {
          this.bsDateofJoin = new Date();
          this.employeeDetail.employeeStatus = 'WORK';
        }
      }
    )
  }

  viewDetail() {
    this.router.navigate(['intranet/employeeprivate/' + this.id]);
  }

  getCommonData() {
    const listCodeType = `${_const.CODE_TYPE.gender},${_const.CODE_TYPE.emp_status},${_const.CODE_TYPE.id_type},${_const.CODE_TYPE.desgination},${_const.CODE_TYPE.grade},${_const.CODE_TYPE.emp_type},${_const.CODE_TYPE.vehicle_type}`;
    // The URLs in this example are dummy
    let devisions = this.ssoCommonSvc.getDivisions();
    let departments = this.ssoCommonSvc.getDepartments();
    let stdCodes = this.commonSvc.getStdcodesByCode(listCodeType);
    let subdept = this.ssoCommonSvc.getSubDepts(this.currentuser.subsidiaryId);
    let workLocs = this.commonSvc.getWorkLoc();
    return Observable.forkJoin([devisions, departments, stdCodes, subdept, workLocs]);
  }

  changedDivision() {
    //this.employeeDetail.deptCode="";
    let divisionCode = this.employeeDetail.divisionCode;
    this.listDepartment = this.listSubdepts.filter(function (x) {
      return x.divisionCode == divisionCode;
    });
  }

  async saveEmp() {
    if (this.bsDateofBirth == null) {
      this.validateModal.show();
      return;
    }

    var checkNewEmpModel: any = {};
    var checkEmpList: any = [];

    checkNewEmpModel.IDNumber = this.employeeDetail.idNo;

    this.employeeDetail.language = EnumLanguage.DEFAULT;
    this.employeeDetail.dob = this.bsDateofBirth;
    this.employeeDetail.dateofJoin = this.bsDateofJoin;
    this.employeeDetail.LeaveDate = this.bsLeaveDate;
    this.employeeDetail.createUser = this.globals._userinfo.employeeId;

    if (!this.id) {
      checkEmpList = await this.empSvc.getEmployeeForAddNew(checkNewEmpModel);

      if (checkEmpList[this.payLoad].length > 0) {
        this.showPopupCheckNewEmployee(checkEmpList[this.payLoad]);
        return;
      }

      this.createdEmployee();
    }else {
      this.employeeDetail.employeeId = this.id;
      this.employeeDetail.createDate = null;
      this.employeeDetail.updateDate = null;
      this.employeeDetail.updateUser = this.globals._userinfo.employeeId;

      this.updateEmployee();
    }
  }

  attachedFile(empId: any) {
    if (this.fileUpload2.files.length > 0) {

      if (!this.fileUpload2.isValidFiles()) {
        this.toastr.error(this.fileUpload.errors[0]);
        return;
      }

      let doc: any = {};
      doc.employeeId = this.currentuser.employeeId;
      doc.refNoValue = empId;
      doc.IDR = "EMP";

      this.fileUpload2.SaveFile(doc).subscribe(
        data => {
          this.toastr.success("Update Success");
        },
        error => {
          this.toastr.error(error.message);
        }
      );
    }
    else {
      this.toastr.success("Save success", "Save employee");
    }
  }

  convertLocalTimeDate(localtime) {
    var localTime1 = moment.utc(localtime);
    return moment(localTime1).local(true)["_d"];
  }

  sendEmailRequest() {
    this.modelSendRequest.existedUserId = 1;
    this.modelSendRequest.idservice = 'EMAIL';
    this.modelSendRequest.lastName = this.employeeDetail.lastName
    this.modelSendRequest.firstName = this.employeeDetail.firstName
    this.modelSendRequest.createUser = this.currentuser.employeeId;
    this.modelSendRequest.subsidiaryId = this.currentuser.subsidiaryId;
    this.modelSendRequest.remark = (this.languages.createanewemailforusername || "Create an email accoun for ") + " : " + this.employeeDetail.firstName + ' ' + this.employeeDetail.lastName;
    this.modelSendRequest.department = this.employeeDetail.deptCode;
    this.modelSendRequest.employeeName = this.employeeDetail.firstName + '' + this.employeeDetail.lastName;
    this.modelSendRequest.DateofJoin = this.convertLocalTimeDate(this.employeeDetail.dateofJoin);

    this.idrequestService.create(this.modelSendRequest).subscribe(
      data => {
        if (data[this.success] === true) {
          this.toastr.success('Sent email request', 'Success!');
        }
      },
      error => {
        this.toastr.error('Sent email request', error[this.message]);
      }
    );
  }

  sendUserIdRequest() {
    this.modelSendRequest.existedUserId = 0;
    this.modelSendRequest.idservice = 'INTRA';
    this.modelSendRequest.username = this.employeeDetail.userId;
    this.modelSendRequest.lastName = this.employeeDetail.lastName;
    this.modelSendRequest.loginName = this.employeeDetail.userId;
    this.modelSendRequest.firstName = this.employeeDetail.firstName;
    this.modelSendRequest.createUser = this.currentuser.employeeId;
    this.modelSendRequest.subsidiaryId = this.currentuser.subsidiaryId;
    this.modelSendRequest.remark = (this.languages.createanewuseridforusername || "Create user login for") + " : " + this.employeeDetail.firstName + ' ' + this.employeeDetail.lastName;
    this.modelSendRequest.department = this.employeeDetail.deptCode;
    this.modelSendRequest.employeeName = this.employeeDetail.firstName + '' + this.employeeDetail.lastName;
    this.modelSendRequest.DateofJoin = this.convertLocalTimeDate(this.employeeDetail.dateofJoin);

    this.idrequestService.create(this.modelSendRequest).subscribe(
      data => {
        if (data[this.success] === true) {
          this.toastr.success('Sent user id request', 'Success!');

          var updateUserId: any = {};
          updateUserId.employeeId = this.id;
          updateUserId.userId = this.employeeDetail.userId;

          this.empSvc.updateUserId(updateUserId).subscribe(
            data => {
              if (data[this.success] === true) {
                this.router.navigate(['intranet/employeedetail/' + data[this.payLoad]]);
              }
            },
            error => {
              this.toastr.error('Update user id to employee information', error[this.message]);
            }
          );
        }
      },
      error => {
        this.toastr.error('Sent user id request', error[this.message]);
      }
    );
  }

  backemployee() {
    this.router.navigate(['intranet/employee/search'], { queryParams: this.route.snapshot.queryParams });
  }

  checkuser() {
    //$(".checkuser").fadeOut(300);
    if (this.employeeDetail.userId == undefined || this.employeeDetail.userId == "") {
      this.resultmessage = "Please enter value for UserID";
      this.ismessagecheckuser = 'shown';
      return;
    }

    // this.empSvc.checkuserid(this.employeeDetail.userId).subscribe(
    //   data => {
    //     var rs = data[this.payLoad][0];
    //     setTimeout(() => {
    //       this.ismessagecheckuser = 'shown';
    //       if (rs > 0) {
    //         this.resultmessage = 'This User ID already exists !';
    //       }
    //       else {
    //         this.resultmessage = 'You can use this User ID  !';
    //       }
    //     }, 600);
    //   },
    //   error => {
    //     this.toastr.error(error[this.message]);
    //   }
    // )
  }

  keyupcheckuser() {
    $(".checkuser").fadeIn(300);
    this.resultmessage = "";
    this.ismessagecheckuser = 'hidden';
  }

  showPopupEmployeeTimesheet() {
    const initialState = {
      model: this.id,
      title: this.languages.updateworktime
    };

    this.bsModalRef = this.modalService.show(EmployeetimesheetPopupComponent, {
      class: 'modal-lg', initialState, backdrop: true,
      ignoreBackdropClick: true,
    });
  }

  showPopupAssetMovement() {
    const initialState = {
      EmployeeId: this.route.params["_value"].id
    };
    this.bsModalRef = this.modalService.show(EmployeeAssetMovementPopupComponent, {
      class: 'modal-lg', initialState, backdrop: true,
      ignoreBackdropClick: true,
    });
  }

  showPopupContract() {
    const initialState = {
      EmployeeId: this.route.params["_value"].id
    };
    this.bsModalRef = this.modalService.show(EmployeeContractComponent, {
      class: 'modal-lg', initialState, backdrop: true,
      ignoreBackdropClick: true,
    });
  }

  updateAvatar() {
    if (this.fileUpload.files.length > 0) {

      if (!this.fileUpload.isValidFiles()) {
        this.toastr.error(this.fileUpload.errors[0]);
        return;
      }

      let doc: any = {};
      doc.employeeId = this.id;
      doc.refNoValue = this.id;
      doc.IDR = "PAT";
      doc.userId = this.id;

      this.fileUpload.SaveFile(doc).subscribe(
        data => {
          this.toastr.success("Update Success");
          this.modalAvatar.hide();
          this.fileSvc.getById(data[this.payLoad]).subscribe(
            data => {
              let imgTemp = 'data:' + data[this.payLoad].dS_GetDocument_Result.fileType + ';base64,' + data[this.payLoad].filestream;
              this.avatar = imgTemp;
              if (this.id == this.currentuser.employeeId)
                this.globals._avatar = imgTemp;
            },
            error => {
              this.toastr.success(error[this.message], "Update Failed");
            }
          );
        },
        error => {
          this.toastr.error(error.message);
        }
      );
    }
  }

  changeGrade() {
    let datarole = this.codeType.filter(m => m.codeType == _const.CODE_TYPE.desgination && m.codeId == this.employeeDetail.designation)
    this.employeeDetail.grade = datarole[0].tagVariant;
  }

  viewDependent() {
    const initialState = {
      employeeId: this.id,
      title: this.languages.updateworktime,
    };
    this.bsModalRef = this.modalService.show(EmployeeDependentComponent, {
      class: 'modal-lg', initialState, backdrop: true,
      ignoreBackdropClick: true,
    });
  }

  showPopupCheckNewEmployee(dataSource) {
    const initialState = {
      checkEmpList: dataSource
    };

    this.bsModalRef = this.modalService.show(EmployeeCheckAddnewPopupComponent, {
      class: 'modal-lg', initialState, backdrop: true,
      ignoreBackdropClick: true,
    });
  }

  private filterStdCode(arrCode: any) {
    this.listEmpStatus = arrCode.filter(function (x) {
      return x.codeType == _const.CODE_TYPE.emp_status;
    });

    this.listIDType = arrCode.filter(function (x) {
      return x.codeType == _const.CODE_TYPE.id_type;
    });

    this.listRole = arrCode.filter(function (x) {
      return x.codeType == _const.CODE_TYPE.desgination;
    });

    this.listGrade = arrCode.filter(function (x) {
      return x.codeType == _const.CODE_TYPE.grade;
    });

    this.listEmpType = arrCode.filter(function (x) {
      return x.codeType == _const.CODE_TYPE.emp_type;
    });

    // filter GENDER
    this.listGender = this.codeType.filter(function (x) {
      return x.codeType == _const.CODE_TYPE.gender;
    });

    // filter VEHICLE_TYPE
    this.vehicles = this.codeType.filter(function (x) {
      return x.codeType == _const.CODE_TYPE.vehicle_type;
    });
  }

  private formatDataEmployee(empInfo: any, subsidiaryInfo: any) {

    if (Helpers.checkLengthObject(subsidiaryInfo)) {
      if (Helpers.isNullOrEmpty(empInfo.divisionCode)) {
        empInfo.divisionCode = subsidiaryInfo.divisionCode;
        empInfo.divisionDesc = subsidiaryInfo.divisionDesc;
      }

      if (Helpers.isNullOrEmpty(empInfo.deptCode)) {
        empInfo.deptCode = subsidiaryInfo.deptCode;
        empInfo.deptDesc = subsidiaryInfo.deptDesc;
      }
    }

    if (empInfo.dateofJoin != null)
      this.bsDateofJoin = new Date(empInfo.dateofJoin);

    if (empInfo.dob != null)
      this.bsDateofBirth = new Date(empInfo.dob);

    if (empInfo.leaveDate != null)
      this.bsLeaveDate = new Date(empInfo.leaveDate);

    if (empInfo.createDate != null)
      this.createdDate = this.commonSvc.convertMilisecondToUTCDate2(empInfo.createDate);

    if (empInfo.updateDate != null)
      this.updatedDate = this.commonSvc.convertMilisecondToUTCDate2(empInfo.updateDate);

    // this.avatar = this.avatar.concat(environment.UrlWebsite, '/uploads/', empInfo.avartarThumbnail);
    this.avatar = empInfo.avartarThumbnail ? Helpers.getUrlImage(this.employeeDetail.avartarThumbnail) : this.globals._noAvatar;

    if (empInfo.loginName != null) {
      empInfo.userId = empInfo.loginName;
      this.isUserID = true;
      $("#userId").css({ "width": "100%" });
    }
  }

  private createdEmployee() {

    // Add new employee
    this.ssoUserProfileSvc.createEmployee(this.employeeDetail).subscribe(
      data => {
        const _data = data[this.payLoad];

        if (_data > 0) {
          this.attachedFile(_data);
          this.router.navigate(['intranet/employeedetail/' + _data]);
        }
        else {
          this.toastr.error("Save Failed", "This UserId already exists !");
        }
      },
      error => {
        this.toastr.error(error[this.message]);
      }
    );
  }

  private updateEmployee() {
    this.employeeDetail.employeeId = this.id;
    this.employeeDetail.createDate = null;
    this.employeeDetail.updateUser = this.globals._userinfo.employeeId;

    // Update data employee
    this.ssoUserProfileSvc.updateEmployee(this.employeeDetail).subscribe(
      data => {
        // Save files
        this.attachedFile(this.id);
      },
      error => {
        this.toastr.error(error[this.message]);
      }
    );
  }
}