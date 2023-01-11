import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService, UserService, FileService, EmployeeService, AuthenticationService, SSOUserProfileService } from '../../_services/index';
import { BsModalService, ModalDirective, BsModalRef } from 'ngx-bootstrap/modal';
import { FileuploadComponent } from '../../_directives/fileupload/fileupload.component';
import { Globalconst } from '../../_helpers/globalvariable'
import { WindowRef } from '../../_helpers/windowRef';
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import { AssetsmovementService } from '../../_services/assetsmovement.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { ExternalAccount } from '../../_models/externalAccount';
import { Helpers } from '../../_helpers/helpers';
import { _const } from '../../_helpers/constants';
import { OffBoardNoticeComponent } from './off-board-notice/off-board-notice.component';
import { OffboardnoticeServiceService } from '../../_services/offboardnotice.service.service';

declare var AdminLTE: any;
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;

  @ViewChild("video") videoElement: any;
  public video: any;

  @ViewChild("canvas")
  public canvas: ElementRef;

  public captures: Array<any>;
  @ViewChild(FileuploadComponent)
  private fileUpload: FileuploadComponent;

  @ViewChild('staticModal') public modalAvatar: ModalDirective;
  @ViewChild('staticModal2') public modalAvatar2: ModalDirective;
  @ViewChild('staticModal3') public modalAvatar3: ModalDirective;

  loading = false;
  model: any = {};
  modelChangePass: any = {};
  avatar: any = {};
  currentUser: any = {};
  languages: any = [];
  languages1: any = [];
  localstream;
  isUseSSL = false;
  dataSource: any = {};
  dataSourceUserLogin: any = {};
  listExternalAccount: ExternalAccount[] = [];
  selectedAccount: ExternalAccount;
  imageUrl: string;
  vehicles: any = [];
  offBoardNotice:any={}
  bsModalRef: BsModalRef;
  constructor(
    public router: Router
    , private commonSvc: CommonService
    , private ssoAuthenSvc: AuthenticationService
    , private ssoUserProfile: SSOUserProfileService
    , private toastr: ToastrService
    , private fileSvc: FileService
    , public globals: Globalconst
    , public winRef: WindowRef
    , private assetsMovementSvc: AssetsmovementService
    , private empsv: EmployeeService
    , private modalService: BsModalService
    , private offboardService: OffboardnoticeServiceService
  ) {
    this.captures = [];
    this.languages = this.globals._resources;
    this.currentUser = this.globals._userinfo;
    this.avatar.src = this.globals._avatar;
  }

  public ngAfterViewInit() {
  }

  openTakePhoto() {
    this.modalAvatar2.show();
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.localstream = stream;
        this.video.srcObject = stream;
        this.video.play();
      });
    }
  }

  closeTakePhoto() {
    this.modalAvatar2.hide();
    this.video.pause();
    this.video.src = "";
    this.localstream.getTracks()[0].stop();
  }

  openQCodeDownload() {
    this.modalAvatar3.show();
  }

  closeQCodeDownload() {
    this.modalAvatar3.hide();
  }

  DownloadQcode() {
    let canvas = document.getElementsByClassName("qrcode")[0];
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = canvas.children[0].getAttribute('src');
    a.download = "image.jpg";
    a.click();
  }

  public capture() {
    this.canvas.nativeElement.getContext("2d").drawImage(this.video, 0, 0, 640, 480);
    this.captures = [];
    this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
  }

  ngOnInit() {
    AdminLTE.init();
    this.video = this.videoElement.nativeElement;
    let protocal = this.winRef.nativeWindow.location;

    if (protocal.hostname == "localhost" || protocal.protocol == "https")
      this.isUseSSL = true;

    this.getLanguages();
    this.getStdCode();
    this.searchAssetMovements();
   

    const employeeId = this.currentUser.employeeId;
    if (employeeId) {
      this.getUserLogin(employeeId);
      this.getInfoById(employeeId);
      this.getOffboardNotice();
    }
  }
  getOffboardNotice()
  {
    this.offboardService.getbyEmpId(this.currentUser.employeeId).subscribe(
      data => {
          this.offBoardNotice = data['payload'];
      });
  }
  updateProfile() {
    this.loading = true;
    this.model.updateDate = null;
    this.model.createDate = null;

    this.ssoUserProfile.updateUserInfo(this.model).subscribe(
      data => {
        this.toastr.success(_const.NOTIFICATIONS.update_success, "info");
      },
      error => {
        this.toastr.error(error['message']);
      },
      () => {
        this.loading = false;
      }
    )
  }

  updatePassword(fForm: any) {
    this.modelChangePass.EmployeeId = this.model.employeeId;
    this.modelChangePass.UpdateUser = this.currentUser.employeeId;

    this.ssoAuthenSvc.changePassword(this.modelChangePass).subscribe(
      data => {
        this.toastr.success(_const.NOTIFICATIONS.update_success);
        this.modelChangePass = {};
        fForm.resetForm();
      },
      error => {
        this.toastr.error(_const.NOTIFICATIONS.update_fail, "Error");
      }
    )
  }

  updateFile() {

    if (this.captures.length > 0) {
      let file = this.fileSvc.dataURLtoFile(this.captures[0], "vatar.png")
      this.fileUpload.files.push(file);
      this.captures = [];

      this.updateAvatar();
      this.closeTakePhoto();
    }
  }

  updateAvatar() {
    if (this.fileUpload.files.length > 0) {

      if (!this.fileUpload.isValidFiles()) {
        this.toastr.error(this.fileUpload.errors[0]);
        return;
      }

      let doc: any = {};
      doc.employeeId = this.currentUser.employeeId;
      doc.refNoValue = this.currentUser.employeeId;
      doc.IDR = "PAT";

      this.fileUpload.SaveFile(doc).subscribe(
        data => {
          this.toastr.success("Update Success");
          this.modalAvatar.hide();

          this.fileSvc.getById(this.model.docNo).subscribe(
            data => {

              localStorage.setItem(_const.LOCAL_STORAGE.img_avatar, 'data:' + data['payload'].dSGetDocumentResult.fileType + ';base64,' + data['payload'].filestream);
              const dataAvartar = Helpers.getLocalStorage(_const.LOCAL_STORAGE.img_avatar, false);
              this.avatar.src = dataAvartar;
              this.globals._avatar = dataAvartar;
            },
            error => {
              //this.toastr.success(error["message"], "Update Failed");
            }
          );
        },
        error => {
          //this.toastr.error(error.message);
        }
      );
    }
  }

  getUserLogin(employeeId: number) {
    if (!employeeId) {
      this.toastr.error('error', 'Get user login failed !');
      return;
    }

    this.ssoUserProfile.getUserLogin(employeeId).subscribe(
      data => {
        this.dataSourceUserLogin = data['payload'];
      }
    )

    this.getDataExtenalAccount(employeeId);
  }

  onEditorPreparing(e) {
    if (e.parentType === "dataRow" && e.dataField === "accountType") {
      if (e.row.inserted == true)
        e.editorOptions.disabled = false;
      else
        e.editorOptions.disabled = true;
    }
  }

  updateAccountType(eventName) {
    const updatedObject = Object.assign({}, eventName.oldData, eventName.newData);

    this.empsv.saveExternalAccount(updatedObject).subscribe(
      data => {
        if (data['payload'] == 1) {
          this.toastr.success("Update success", "Update Account");
          this.dataGrid.instance.refresh();
        }
        else if (data['payload'] == -1) {
          this.toastr.error("Update failed !", "Update Account");
        }
      },
      error => {
        this.toastr.error(error['message'] ? error['message'] : error);
      }
    );
  }

  private getInfoById(employeeId: number) {
    this.ssoAuthenSvc.getUserInfoById(employeeId).subscribe(
      resData => {

        // Payload table[0]: info user
        if (Helpers.checkObjAPIsReturn(resData) && resData['payload'].userInfo) {
          let userInfo = resData['payload'].userInfo;
          // console.log('===> ', userInfo)
          userInfo.avartarThumbnail = userInfo.avartarThumbnail ? Helpers.getUrlImage(userInfo.avartarThumbnail) : this.globals._noAvatar;
          this.model = userInfo;
        }
      },
      error => {
        this.toastr.error(error['message'] ? error['message'] : error);
      }
    )
  }

  private getDataExtenalAccount(userId: number) {
    this.empsv.getExtenalAccount(userId).subscribe(
      data => {
        this.listExternalAccount = data['payload'];
      }
    )
  }

  private getStdCode() {
    this.commonSvc.getStdcodesByCode('VEHICLETYPE').subscribe(
      data => {
        this.vehicles = data['payload'];
      }
    )
  }

  private getLanguages() {
    this.commonSvc.getLanguages().subscribe(
      data => {
        this.languages1 = data['payload'];
      }
    )
  }

  private searchAssetMovements() {
    const searchModel = {
      PurchaseDateF: _const.APP_CONFIG.min_date,
      PurchaseDateT: this.commonSvc.getcurrentdate('YYYYMMDD'),
      AssetCode: "",
      AssetGroup: "",
      Division: "",
      assignedEmployee: this.currentUser.employeeId,
      dateMode: "handover",
      Brand: "",
      SerialNo: "",
      employeeId: this.currentUser.employeeId,
      status: "",
      userId: this.currentUser.employeeId,
    }

    this.assetsMovementSvc.search(searchModel).subscribe(
      data => {
        this.dataSource = data['payload'].filter(m => m.returnDate == null);
      }
    );
  }
  openModalWithComponent() {
    this.bsModalRef = this.modalService.show(OffBoardNoticeComponent, { class: 'modal-lg', ignoreBackdropClick: true });
    this.bsModalRef.content.reloadData.subscribe(this.getOffboardNotice.bind(this));
  }
  ViewDetail()
  {
    const initialState = {
      model: this.offBoardNotice
    };
    this.bsModalRef = this.modalService.show(OffBoardNoticeComponent, Object.assign({}, { initialState, class: 'modal-lg', ignoreBackdropClick: true, keyboard: false }));
    this.bsModalRef.content.reloadData.subscribe(this.getOffboardNotice.bind(this));
  }
}
