import { Injectable, OnInit, Optional, InjectionToken, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { PagerOption } from '../_models/pagerOption';
import { _const } from '../_helpers/constants';
import { Helpers } from '../_helpers/helpers';
import { EnumMPLSystem } from '../_helpers/enums';

declare var AdminLTE: any;
@Injectable()
export class BaseComponent implements OnInit {

    static subsidiaryId: string;

    IsSubmit: boolean = false;// Disable submit/save/update button after click to void issue double click
    QueryPara: any;
    languages: any;
    currentuser: any;
    menus: any;
    _pagerOption: PagerOption = new PagerOption();
    bsToastr: ToastrService
    payLoad: string;
    message: string;
    success: string;
    systemId: any;
    listCodeType: any = {};

    constructor(
        public router: Router
    ) {
        let isHasPermission = false;
        let currentUrl: string = this.router.url;
        this.systemId = EnumMPLSystem.DEFAULT;
        this.payLoad = _const.API_KEYS.payload;
        this.message = _const.API_KEYS.message;
        this.success = _const.API_KEYS.success;
        this.listCodeType = _const.CODE_TYPE;   

        this.getLocalStorage(); 
        this.checkPagePermission(this.menus, currentUrl, isHasPermission);
    }

    ngOnInit() {
        AdminLTE.init();
    }

    private getLocalStorage() {
        this.languages = Helpers.getLocalStorage(_const.LOCAL_STORAGE.languages) || {};
        this.currentuser = Helpers.getLocalStorage(_const.LOCAL_STORAGE.current_user) || {};
        this.menus = Helpers.getLocalStorage(_const.LOCAL_STORAGE.current_menus);
    }

    private checkPagePermission(listPage: any, currentUrl: string, isHasPermission: boolean) {
        listPage.forEach(element => {
            element.menuChils.forEach(element => {
                if (currentUrl.indexOf(element.component) > 0) {
                    isHasPermission = true;
                    return true;
                }
            });
        });

        if (!isHasPermission) {
            alert("You don't have permisson to access this page!");
            this.router.navigate(['intranet/dashboard']);
        }
    }
}
export const INTEGER_TOKEN = new InjectionToken<boolean>('IntegerToken');
