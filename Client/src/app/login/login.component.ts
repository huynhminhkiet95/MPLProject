import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, AlertService, UserService, FileService, CommonService, SSOUserProfileService, SSOCommonService } from '../_services';
import { Globalconst, WindowRef } from '../_helpers';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { Helpers } from '../_helpers/helpers';
import { _const } from '../_helpers/constants';
import { EnumMPLSystem } from '../_helpers/enums';

declare var particlesJS: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  model: any = {};
  resetModel: any = {};
  modalRef: BsModalRef;
  boardisactive:boolean=true;
  loading = false;
  returnUrl: string;
  reactiveForm: FormGroup;
  googleCapcha: any = {};
  config:any={};
  constructor(
    private route: ActivatedRoute
    , private router: Router
    , private authenticationService: AuthenticationService
    , private ssoUserProfileSvc: SSOUserProfileService
    , private ssoCommonSvc: SSOCommonService
    , private alertService: AlertService
    , private fileSvc: FileService
    , public globals: Globalconst
    , private window: WindowRef
    , private cookieService: CookieService
    , private modalService: BsModalService
    , private commonSvc: CommonService
    , private toastr: ToastrService) { }
   
  ngOnInit() {
   
    this.initPage();
    // particlesJS.load('particles-js', 'assets/particles.json', function() {
    //   console.log('callback - particles.js config loaded');
    // });
  }
  ngAfterViewInit(){
    setTimeout(() => {
      this.checkActive();
    }, 100);
      
  }
  checkActive()
  {
    if(this.globals._systemOption)
    {
      this.boardisactive=this.globals._systemOption.boardisactive;
      if(!this.globals._systemOption.boardisactive)
      {
       
        this.alertService.error(this.globals._systemOption.inactivemessage);
      }
    }
  }
  initPage() {

    this.googleCapcha.isvalid = false;
    this.globals._avatar = null;
    this.body.classList.add('hold-transition');
    this.body.classList.add('login-page');

    this.authenticationService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/intranet/dashboard';

    let userid = this.cookieService.get('mpi_userid');
    if (userid) {
      let pwd = this.cookieService.get('mpi_pwd');
      var bytes = CryptoJS.AES.decrypt(pwd, '#base64Key#');
      var plaintext = bytes.toString(CryptoJS.enc.Utf8);
      this.model.password = plaintext;
      this.model.username = userid;
      this.model.Remember = true;
    } else {
      this.model.password = "";
      this.model.userid = "";
    }

    var window = this.window.nativeWindow;
    var ip = window.location.origin
    this.model.iPAddress = ip;

    if (this.route.snapshot.queryParams['resetpassword'] != null) {
      let resetId = this.route.snapshot.queryParams['resetpassword'];
      this.ssoCommonSvc.confirmResetPassword({ 'code': resetId }).subscribe(
        data => {
          if (data[_const.API_KEYS.payload] == '') {
            this.toastr.success("Your's request has been submit sucessfull, please check email to get password!", 'Reset password')
            this.modalRef.hide();
            this.resetModel = {};
          }
          else {
            this.toastr.error(data[_const.API_KEYS.payload], "Reset Password");
          }
        }
      );

      this.router.navigateByUrl(this.router.url, { queryParams: {} });
    }

    this.getUserIP(function (ip) {
      (<HTMLInputElement>document.getElementById("iplocal")).value = ip;
    })
    // this.ssoCommonSvc.getConfiguration("S1","GENERATE").subscribe(
    //   data=>{
    //     this.config = data['payload'];
    //     this.globals._themeOption = this.config;
    //     Helpers.setLocalStorage(_const.LOCAL_STORAGE.theme_option,this.config);
    //   }
    // );
  }

  resolved(captchaResponse: string) {
    this.googleCapcha.isvalid = true;
  }

  login() {
    this.resetModel.loginName = '';
    this.resetModel.mobile = '';
    this.resetModel.ext = '';
    this.loading = true;

    const userName = this.model.username
      , password = this.model.password;

    // Validate params UserName and Password
    if (!this.validateParamsLogin(userName, password)) {
      this.alertService.error('UserName or Password is not null.');
      return;
    }

    if (this.model.Remember) {
      var ciphertext = CryptoJS.AES.encrypt(this.model.password, '#base64Key#');
      this.cookieService.set('mpi_pwd', ciphertext.toString(), moment().add(30, 'days').toDate(), "/");
      this.cookieService.set('mpi_userid', this.model.username, moment().add(30, 'days').toDate(), "/");
    } else {
      this.cookieService.delete('mpi_pwd', "/");
      this.cookieService.delete('mpi_userid', "/");
    }

    this.userLoginProcess(userName, password);
  };

  getCommonData(data: any) {
    // The URLs in this example are dummy
    // let avartar = this.fileSvc.getById(data.docNo);
    const resources = this.commonSvc.getResourcesByLang(data.language);
    // let menus = this.userService.getPageMenu(this.model.username, "", data.subsidiaryId);
    const menus = this.ssoCommonSvc.getPageMenu(this.model.username, EnumMPLSystem.DEFAULT, data.subsidiaryId, _const.APP_CONFIG.plat_form_id);
    return Observable.forkJoin([resources, menus]);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,{ ignoreBackdropClick: true });
  }

  getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var window = this.window.nativeWindow;
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
      iceServers: []
    }),
      noop = function () { },
      localIPs = {},
      ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
      key;

    function iterateIP(ip) {
      if (!localIPs[ip]) onNewIP(ip);
      localIPs[ip] = true;
    }

    pc.createDataChannel("");

    pc.createOffer(function (sdp) {
      sdp.sdp.split('\n').forEach(function (line) {
        if (line.indexOf('candidate') < 0) return;
        line.match(ipRegex).forEach(iterateIP);
      });

      pc.setLocalDescription(sdp, noop, noop);
    }, noop);


    pc.onicecandidate = function (ice) {
      if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
      ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
  }

   resetPassword() {
    
    if (this.resetModel.loginName == '' && this.resetModel.mobile == '' && this.resetModel.ext == '')
      this.toastr.error("Login Name or Mobile or Ext must input data", "Reset Password");
    else {
    this.ssoCommonSvc.resetPassword(this.resetModel)
    .subscribe(
        data => {
          if (data[_const.API_KEYS.payload] != '') {
            this.toastr.success("Your's password was changed, please check email to get password!", 'Reset password')
            this.modalRef.hide();
            this.resetModel = {};
          } else {
            this.toastr.error("Your's email or some info not correct", "Reset Password");
          }
        }
      );
     }
  }

  private async userLoginProcess(userName: string, password: string) {
    // Authentication username, password
    const objAuthen = await this.authenticateLogin(userName, password);
    this.loading = false;
    if(!objAuthen) return ;

    // console.log('objAuthen: ===> ', objAuthen)

    // Check access token
    if (objAuthen && objAuthen[_const.AUTHEN_FIELDS.as_employee_id]) {
      const employeeId = objAuthen[_const.AUTHEN_FIELDS.as_employee_id];

      // Get info
      const objUserInfo = await this.getUserInfo(employeeId);

      // Check object api return
      if (Helpers.checkObjAPIsReturn(objUserInfo)) {

        let userDetail = objUserInfo[_const.API_KEYS.payload].userDetail;
        if (userDetail) {

          userDetail = Object.assign({}, userDetail, objAuthen);
          userDetail.userid = userName;
          userDetail['employeeId'] = employeeId;

          // Get url image
          userDetail.avartarThumbnail = Helpers.getUrlImage(userDetail.avartarThumbnail);
          // Delete key as:employee_id
          userDetail = Helpers.deleteKeyObject(userDetail, _const.AUTHEN_FIELDS.as_employee_id);

          // store user details and jwt token in local storage to keep user logged in between page refreshes
          Helpers.setLocalStorage(_const.LOCAL_STORAGE.current_user, userDetail);
          // Set user common data
          this.setUserCommonData(userDetail);

          this.cookieService.set(_const.APP_CONFIG.mpi_session, moment().add(1, 'days').toDate().toDateString(), moment().add(1, 'days').toDate());
        } else {
          //this.alertService.error('Login Fail');
          this.loading = false;
        }
      }
      else {
        //this.alertService.error('Login Fail');
        this.loading = false;
      }
    } else {
      //this.alertService.error('Login Fail');
      this.loading = false;
    }
  }

  private async authenticateLogin(userName: string, password: string): Promise<any> {
    const result = await this.authenticationService.loginWithParams(userName, password);

    if (result.error) {
      this.alertService.error(result.message);
      // this.loading = false;
    } else {

      if (result.data) {
        const objData = result.data;

        // Set local storage authentication data
        Helpers.setLocalStorage(_const.LOCAL_STORAGE.authen_info, objData);
        return objData;
      }
      else
        this.toastr.error('Data user info null', 'Login');
    }

    return null;
  }

  /**
   * Get user info after authentication ok
   * @param userId number user id
   */
  private async getUserInfo(userId: number): Promise<any> {
    const model = {
      employeeId: userId
      , systemId: EnumMPLSystem.DEFAULT
    }
    // Get user info
    const objUserInfo = await this.ssoUserProfileSvc.getPrivateInfoAsync(model);

    if (Helpers.checkObjAPIsReturn(objUserInfo))
      return objUserInfo;
    
    return null;
  }

  private setUserCommonData(objData: any) {
    // Get data common
    this.getCommonData(objData).subscribe(
      resData => {

        if (resData) {
          let _dataMenus, _dataLang;

          _dataLang = resData[0][_const.API_KEYS.payload];
          //_dataMenus = Helpers.removeDuplicates(resData[1][_const.API_KEYS.payload], 'menuChils', 'menuId');
          _dataMenus = resData[1][_const.API_KEYS.payload];
          // _dataMenus = Helpers.sortBy(_dataMenus, 'seqNo', 'menuName');

          this.setMultiDataLocalStorage(_dataMenus, _dataLang);
          this.globals.reset();

          // Redirect url
          if (!Helpers.isNullOrEmpty(this.returnUrl) && !Helpers.isNullOrEmpty(this.model.password))
            this.redirectUrl(this.returnUrl, this.model.password)

          this.loading = false;
        }
      },
      error => {
        this.toastr.error(error['message'], 'Login');
        this.loading = false;
      }
    );
  }

  /**
   * Set multi data local storage
   * @param objMenus Data menus
   * @param objLang Data language
   */
  private setMultiDataLocalStorage(objMenus: object, objLang: object) {
    const _keyMenu = _const.LOCAL_STORAGE.current_menus
      , _keyLang = _const.LOCAL_STORAGE.languages;

    const _arrData = [
      { key: _keyMenu, value: objMenus }
      , { key: _keyLang, value: objLang }
    ]

    Helpers.setArrayLocalStorage(_arrData);
  }

  private redirectUrl(returnUrl: string, password: string) {
    if (password == _const.APP_CONFIG.default_password)
      this.router.navigate([returnUrl], { queryParams: { updatePass: true } });
    else
      this.router.navigate([returnUrl]);
  }

  /**
   * Func validate params login
   * @param userName string param userName
   * @param password string param password
   */
  private validateParamsLogin(userName: string, password: string): boolean {

    if (!Helpers.isNullOrEmpty(userName) && !Helpers.isNullOrEmpty(password))
      return true;

    return false;
  }
}