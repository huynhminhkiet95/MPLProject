import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { WindowRef } from '../_helpers/windowRef'
import { ApplicationHttpClient } from './_base/http-client';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { ExecCallApi } from '../_helpers/exec-call-api';
import { _const } from '../_helpers/constants';
import { Helpers } from '../_helpers/helpers';
import { Globalconst } from '../_helpers';


@Injectable()
export class CommonService {

    static StdCodeGetCombobox(): any {
        throw new Error("Method not implemented.");
    }

    private urlCommonAPI: string;

    constructor(private http: ApplicationHttpClient
        , private window: WindowRef
        , private route: ActivatedRoute
        , private router: Router
        , private _http: Http
        , private execCallApi: ExecCallApi
        ,private _global:Globalconst
    ) {
        this.urlCommonAPI = 'commonservice';
    }

    getStdcodesByCode(id: string) {
        const _endPoint = `${this.urlCommonAPI}/stdcodes/${id}`;
        return this.execCallApi.getDataApi(_endPoint);
    }

    getLanguages() {
        const _endPoint = `${this.urlCommonAPI}/languages`;
        return this.execCallApi.getDataApi(_endPoint);
    }

    getApplications() {
        const _endPoint = `${this.urlCommonAPI}/applications`;
        return this.execCallApi.getDataApi(_endPoint);
    }

    /**
     * Get language resources
     * Method: GET
     * @param lang language
     */
    getResourcesByLang(lang: string = 'EN') {
        const _endPoint = `${this.urlCommonAPI}/resources/${lang}`;
        return this.execCallApi.getDataApi(_endPoint);
    }

    gallerys_save(model: any) {
        const _endPoint = `${this.urlCommonAPI}/gallerys_save`;
        return this.execCallApi.postDataApi(_endPoint, model);
    }

    gallerys_get(model: any) {
        const _endPoint = `${this.urlCommonAPI}/gallerys_get`;
        return this.execCallApi.postDataApi(_endPoint, model);
    }

    generateComment(model: any) {
        const _endPoint = `${this.urlCommonAPI}/generatecomment`;
        return this.execCallApi.postDataApi(_endPoint, model);
    }
    updateViewCount(model: any) {
        const _endPoint = `${this.urlCommonAPI}/likeview`;
        return this.execCallApi.postDataApi(_endPoint, model);
    }
    async getGenerateComment(refValue: any, refType: any) {
        const _endPoint = `${this.http._urlAPI}/commonservice/generatecomment/${refValue}/${refType}`;
        return await this.http.Get(_endPoint).toPromise<{}>();
    }

    getFacilities(subsidiaryId: string) {
        const _endPoint = `${this.urlCommonAPI}/facilities/subsidiaryid/${subsidiaryId}`;
        return this.execCallApi.getDataApi(_endPoint);
    }

    async getFacilitiesAsyncData(subsidiaryId: string) {
        return await this.searchFacilities(subsidiaryId).toPromise<{}>();
    }

    searchFacilities(subsidiaryId: string) {
        const _endPoint = `${this.http._urlAPI}/commonservice/facilities/subsidiaryid/${subsidiaryId}`;
        return this.http.Get(_endPoint);
    }

    getPendingRequest(subsidiaryId: string, userId: string) {
        const _endPoint = `${this.urlCommonAPI}/requestservice/pendding/${subsidiaryId}/${userId}`;
        return this.execCallApi.getDataApi(_endPoint);
    }

    /**
     * API get orgchart: OrgChartModule
     * @param subsidiaryId 
     */
    getOrgChart(subsidiaryId: any,empId:any) {
        const _endPoint = `/orgchartservice/orgchart/${subsidiaryId}/${empId}`;
        return this.execCallApi.getDataApi(_endPoint);
    }

    getIPLocal() {
        return this.http.Get("https://api.ipify.org?format=json").map(
            (response: Response) => response);
    }

    getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
        //compatibility for firefox and chrome

        var window = this.window.nativeWindow;
        var ip = window.location.origin
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

        //create a bogus data channel
        pc.createDataChannel("");

        // create offer and set local description
        pc.createOffer(function (sdp) {
            sdp.sdp.split('\n').forEach(function (line) {
                if (line.indexOf('candidate') < 0) return;
                line.match(ipRegex).forEach(iterateIP);
            });

            pc.setLocalDescription(sdp, noop, noop);
        }, noop);

        //listen for candidate events
        pc.onicecandidate = function (ice) {
            if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
            ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
        };
    }

    convertMilisecondToUTCDateTime(params: any, format = "DD/MM/YYYY hh:mm A") {
        if (params != "" && params != " ") {
            var tempDate = new Date(params);
            let dateTime = new Date(tempDate.getUTCFullYear(), tempDate.getUTCMonth(), tempDate.getUTCDate(), tempDate.getUTCHours(), tempDate.getUTCMinutes(), tempDate.getUTCSeconds());
            return moment(dateTime).format(format);
        }
        else {
            return params;
        }
    }

    convertMilisecondToUTCDateTime2(params: any, format = "DD/MM/YYYY hh:mm A") {
        if(this._global._systemOption && this._global._systemOption.datetimeformat)
        {
            format = this._global._systemOption.datetimeformat||"DD/MM/YYYY hh:mm A";
        }
        if (params && params != "" && params != " ") {
            var tempDate = new Date(params);
            let dateTime = new Date(tempDate.getUTCFullYear(), tempDate.getUTCMonth(), tempDate.getUTCDate(), tempDate.getUTCHours(), tempDate.getUTCMinutes(), tempDate.getUTCSeconds());
            return moment(dateTime).format(format);
        }
        else {
            return params;
        }
    }

    convertMilisecondToUTCDate(params: any, format = "DD/MM/YYYY") {

        if (params.trim() != "") {
            var tempDate = new Date(params);
            let dateTime = new Date(tempDate.getUTCFullYear(), tempDate.getUTCMonth(), tempDate.getUTCDate() + 1);
            return moment(dateTime).format(format);
        }
        else {
            return params;
        }
    }

    convertMilisecondToUTCDate2(params: any, format = "DD/MM/YYYY") {
        if(this._global._systemOption && this._global._systemOption.datetimeformat)
        {
            format = this._global._systemOption.datetimeformat.split(' ')[0];
        }
        if (params != null) {
            var tempDate = new Date(params);
            let dateTime = new Date(tempDate.getUTCFullYear(), tempDate.getUTCMonth(), tempDate.getUTCDate());
            return moment(dateTime).format(format);
        }
        else {
            return params;
        }
    }

    isAdmin(roleId: string) {
        let currentUser: any;

        if (!Helpers.isNullOrEmpty(roleId))
            currentUser = Helpers.getLocalStorage(_const.LOCAL_STORAGE.current_user);

        return (roleId && roleId == _const.APP_CONFIG.default_role_id)
            || (currentUser && currentUser.roleId == _const.APP_CONFIG.default_role_id);
    }

    openTheDoor(deviceId: string) {
        let url = "http://118.69.36.34/form/Device?act=" + deviceId;//9

        const headers = new Headers();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this._http.get(url, { headers: headers })
            .map(response => response.json());
    }

    urlback(url: string) {
        this.route.queryParams.subscribe(params => {
            this.router.navigate([url], { queryParams: params })
            params = [];
        });

    }

    urlnext(url: string, modelpara: any) {
        this.router.navigate([url], { queryParams: modelpara })
    }

    getDate(datestring: any) {
        var date = new Date(datestring),
            year = date.getFullYear(),
            month = (date.getMonth() + 1).toString(),
            formatedMonth = (month.length === 1) ? ("0" + month) : month,
            day = date.getDate().toString(),
            formatedDay = (day.length === 1) ? ("0" + day) : day,
            hour = (date.getHours() - 7).toString(),
            formatedHour = (hour.length === 1) ? ("0" + hour) : hour,
            minute = date.getMinutes().toString(),
            formatedMinute = (minute.length === 1) ? ("0" + minute) : minute,
            second = date.getSeconds().toString(),
            formatedSecond = (second.length === 1) ? ("0" + second) : second;
        return formatedDay + "-" + formatedMonth + "-" + year + " " + formatedHour + ':' + formatedMinute;
    };

    getpendingapproval(userId: any) {
        const _endPoint = `${this.urlCommonAPI}/pendingapproval/${userId}`;
        return this.execCallApi.getDataApi(_endPoint);
    }

    getcurrentdate(stringformat: string) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var rs = "";
        if (stringformat == "YYYYMMDD") {
            rs = yyyy + '/' + mm + '/' + dd;
        }
        else if (stringformat == "DDMMYYYY") {
            rs = dd + '/' + mm + '/' + yyyy;
        }
        return rs;
    }

    moneyFormat(price, sign = '$') {
        if (price == null) {
            return "";
        }
        var rs;
        const pieces = parseFloat(price).toFixed(2).split('')
        let ii = pieces.length - 3
        while ((ii -= 3) > 0) {
            pieces.splice(ii, 0, ',')
        }
        rs = sign + pieces.join('')
        rs = rs.substring(0, rs.indexOf("."))
        return rs;
    }

    getGalleryByID(id: number) {
        const _endPoint = `${this.urlCommonAPI}/getgallerybyid/${id}`;
        return this.execCallApi.getDataApi(_endPoint);
    }

    convertDateTime(localtime) {

        if (localtime == null) {
            return null;
        }
        return moment(localtime).format('DD/MM/YYYY HH:mm');
    }

    convertDate(localtime) {

        if (localtime == null) {
            return null;
        }

        return moment(localtime).format('DD/MM/YYYY');
    }

    convertTime(localtime) {
        let format="HH:mm";
        if(this._global._systemOption.datetimeformat)
        {
            format = this._global._systemOption.datetimeformat.split(' ')[1];
        }
        if (localtime == null) {
            return null;
        }
        localtime = localtime - 7 * 3600 * 1000;
        return moment(localtime).format(format);
    }

    // Convert time (HH:mm) in UTC to local time (TimeZone +7)
    convertRealTime(realtime, formatString) {
        formatString == null || formatString == '' ? formatString = 'HH:mm' : '';
        if (realtime == null) {
            return null;
        }

        return moment(realtime).zone(moment().zone()).format(formatString);
    }

    geteContractType(type: string) {
        const _endPoint = `${this.urlCommonAPI}/getecontracttype/${type}`;
        return this.execCallApi.getDataApi(_endPoint);
    }

    getWorkLoc() {
        const _endPoint = `${this.urlCommonAPI}/getworkLocs`;
        return this.execCallApi.getDataApi(_endPoint);
    }
}