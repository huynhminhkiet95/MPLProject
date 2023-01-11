import { Injectable } from '@angular/core';
import { ExecCallApi, ApiSSO } from '../_helpers/exec-call-api';
import { _const } from '../_helpers/constants';

@Injectable()
export class GroupPermissionService extends ApiSSO {

    private _ssoCommonAPI: string = 'api/ssocommonservice';

    constructor(private execCallApi: ExecCallApi) {
        super();
    }

    /**
     * Get list group permission
     * @param systemId WB_MPI || WB_ENT || ...
     */
    getListGroupPermission(systemId: string) {
        this.isAuthenSSO = true;
        const endPoint = `${this._ssoCommonAPI}/getmenu/${systemId}`;
        return this.execCallApi.getDataApi(endPoint);
    }

    /**
     * Get data group permissions
     * Method: GET
     * API: SSO/commonservice
     * @param idGroup id group permissions
     */
    getListMenuSelected(idGroup: string, systemId: string) {
        this.isAuthenSSO = true;
        const endPoint = `${this._ssoCommonAPI}/grouppermissionstree/${idGroup}/${systemId}`;
        return this.execCallApi.getDataApi(endPoint);
    }

    /**
     * Save data group permission
     * Method: POST
     * API: SSO/commonservice
     * @param model Model info Group permission
     */
    saveEmpGroupPermission(model: any) {
        this.isAuthenSSO = true;
        const endPoint = `${this._ssoCommonAPI}/saveempgrouppermission`;
        return this.execCallApi.postDataApi(endPoint, model);
    }

    /**
     * Delete data group permission
     * Method: POST
     * API: SSO/commonservice
     * @param model Model info Group permission
     */
    deleteEmpGroupPermission(model: any) {
        this.isAuthenSSO = true;
        const endPoint = `${this._ssoCommonAPI}/deleteempgrouppermission`;
        return this.execCallApi.postDataApi(endPoint, model);
    }

    /**
     * Insert data group permission
     * @param model model insert group permission
     */
    insertGroupPermission(model: any) {
        this.isAuthenSSO = true;
        const endPoint = `${this._ssoCommonAPI}/insertgrouppermission`;
        return this.execCallApi.postDataApi(endPoint, model);
    }

    /**
     * Update data group permission
     * @param model model update group permission
     */
    updateGroupPermission(model: any) {
        this.isAuthenSSO = true;
        const endPoint = `${this._ssoCommonAPI}/updategrouppermission`;
        return this.execCallApi.postDataApi(endPoint, model);
    }

    /**
     * Delete data group permission
     * @param model model delete group permission
     */
    deleteGroupPermission(model: any) {
        this.isAuthenSSO = true;
        const endPoint = `${this._ssoCommonAPI}/deletegrouppermission`;
        return this.execCallApi.postDataApi(endPoint, model);
    }
}
