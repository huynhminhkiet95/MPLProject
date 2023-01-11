import { Component, OnInit } from '@angular/core';
import { VersionCheckService } from './_helpers/version-check.service';
import { environment } from '../environments/environment';
import { Globalconst } from './_helpers';
import { SSOCommonService } from './_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public checkVersion: VersionCheckService,
    public _global: Globalconst,
    public _ssoCommonService: SSOCommonService,
    public router: Router) {

  }
  title = 'app';
  showfloatLogo: any = false;
  async ngOnInit() {

    this.checkVersion.initVersionCheck(environment.versionCheckURL);
    if (this._global._systemOption.boardisactive === false) {
      this.router.navigate(["login"], { queryParams: { inactive: true } });
    }
    
  }
}
