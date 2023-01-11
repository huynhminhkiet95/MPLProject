import { Component, OnInit } from '@angular/core';
import { UserService, CommonService, EmployeeService } from '../../_services/index'
import { Globalconst } from '../../_helpers/globalvariable'
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { environment } from '../../../environments/environment';
import { BaseComponent } from '../../_directives/base.component';
import { } from 'jquery';
import { WindowRef } from '../../_helpers/windowRef';
import { Router } from '@angular/router';
import { BasePopupComponent } from '../../_directives/base.popup.component';

@Component({
  selector: 'app-admin-left-side',
  templateUrl: './admin-left-side.component.html',
  styleUrls: ['./admin-left-side.component.css']
})

export class AdminLeftSideComponent extends BasePopupComponent {

  bsModalRef: BsModalRef;
  avatar: any = {};

  constructor(
    public router: Router,
    public userService: UserService,
    public global: Globalconst,
    public cmservice: CommonService,
    private modalService: BsModalService,
    private empSvc: EmployeeService,
    private window: WindowRef
  ) { 
    super();
  }

  ngOnInit() {
  }

  show() {
    if (this.detectmob()) {
      $('body').addClass('sidebar-collapse');

      $('body').removeClass('sidebar-open');
    }
  }

  detectmob() {
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      return true;
    }
    else {
      return false;
    }
  }

  openTheDoor() {
    let newWindow = open('http://118.69.36.34/form/Device?act=9', 'example', 'width=300,height=300,fullscreen=yes')
    setTimeout(() => {
      newWindow.close();
    }, 2000);
  }

  openTheNextCloud() {

    this.empSvc.getExtenalAccountByEmpIdType(this.currentuser.employeeId, 'nextcloud').subscribe(
      data => {
        let userid = btoa(data["payload"].accountId);
        let tokenId = btoa(data["payload"].pwd);
        let url = new String('https://cloud.mplogistics.vn:9090/nextcloud/index.php/login?direct=1&redirect_url=&userid=');

        let urlNc = url.concat(userid, "&pass=", tokenId);

        let newWindow = open(urlNc, 'example', 'width=800,height=600')
      }
    );
  }

  openwelcomeboard() {
    let newWindow = open(environment.UrlWebsite + '/welcomeboard', 'welcomeboard', 'width=1200,height=1000,toolbar=no,scrollbars=no,resizable=yes')
  }
}
