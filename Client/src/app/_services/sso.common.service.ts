import { Injectable } from '@angular/core';
import { ExecCallApi, ApiSSO } from '../_helpers';
import { EnumMPLSystem } from '../_helpers/enums';

@Injectable()
export class SSOCommonService extends ApiSSO {

  private ssoCommonModule: string = 'api/ssocommonservice';

  constructor(private execCallApi: ExecCallApi) { 
    super();
  }

  /**
   * Get Subsidiaries
   * Method: POST
   * API: SSO/commonservice
   */
  getSubsidiaries() {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoCommonModule}/subsidiaries`;
    return this.execCallApi.getDataApi(endPoint);
  }

  /**
   * Get data divisions
   * Method: GET
   * API: SSO/commonservice/divisions
   */
  getDivisions() {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoCommonModule}/divisions`;
    return this.execCallApi.getDataApi(endPoint);
  }

  /**
   * 
   * Method: GET
   * API: SSO/commonservice/subdepts
   * @param subSidiaryId DB name
   */
  getSubDepts(subSidiaryId: string) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoCommonModule}/subdepts/${subSidiaryId}`;
    return this.execCallApi.getDataApi(endPoint);
  }

  /**
   * Get list data departments
   * Method: GET
   * API: SSO/commonservice/departments
   */
  getDepartments() {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoCommonModule}/departments`;
    return this.execCallApi.getDataApi(endPoint);
  }

  /**
   * Get list department by subsidiaryId and divisionCode
   * Method: GET
   * API: APISSO/commonservice
   * @param subsidiaryId DB name
   * @param divisionCode Code division
   */
  getDepartmentsBydivisionCode(subsidiaryId: string, divisionCode: string) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoCommonModule}/getdeptsbydivision/subsidiaryid/${subsidiaryId}/divisioncode/${divisionCode}`;
    return this.execCallApi.getDataApi(endPoint);
  }

  /**
   * Get data department admin
   * Method: GET
   * API: SSO/commonservice
   */
  getDepartmentAdmin() {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoCommonModule}/departments`;
    return this.execCallApi.getDataApi(endPoint);
  }

  /**
   * Save data department
   * Method: POST
   * API: SSO/commonservice
   * @param model Model info department
   */
  saveDepartmentadmin(model: any) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoCommonModule}/savedepartment`;
    return this.execCallApi.postDataApi(endPoint, model);
  }

  /**
   * Get data division
   * Method: GET
   * API: SSO/commonservice
   */
  getDivision() {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoCommonModule}/divisions`;
    return this.execCallApi.getDataApi(endPoint);
  }

  /**
   * Save data division
   * Method: POST
   * API: SSO/commonservice
   * @param model Model info division
   */
  saveDivision(model: any) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoCommonModule}/savedivision`;
    return this.execCallApi.postDataApi(endPoint, model);
  }

  /**
   * Get list menu
   * Method: POST
   * API: SSO/commonservice
   * @param userId current user
   * @param systemId 
   * @param subsidiary
   */
  getPageMenu(userId: string, systemId: EnumMPLSystem, subsidiary: string, platFormId: string) {
    let model: any = {};
    model.UserID = userId;
    model.SystemId = systemId;
    model.SubsidiaryId = subsidiary;
    model.PlatformId  = platFormId;

    this.isAuthenSSO = true;
    const endPoint = `${this.ssoCommonModule}/menus`;
    return this.execCallApi.postDataApi(endPoint, model);
  }

  getSystemList() {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoCommonModule}/systems`;
    return this.execCallApi.getDataApi(endPoint);
  }
  resetPassword(model: any) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoCommonModule}/resetpassword`;
    return this.execCallApi.postDataApi(endPoint, model);
  }

  confirmResetPassword(model: any) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoCommonModule}/confirmresetpass`;
    return this.execCallApi.postDataApi(endPoint, model);
  }
  getConfiguration(subsidiaryId,type)
  {
      this.isAuthenSSO = true;
      const _endPoint = `${this.ssoCommonModule}/getconfiguration/${subsidiaryId}/${type}`;
      return this.execCallApi.getDataApi(_endPoint);
  }
  saveConfiguration(model)
  {
    this.isAuthenSSO = true;
      const _endPoint = `${this.ssoCommonModule}/updateConfiguration`;
      return this.execCallApi.postDataApi(_endPoint,model);
  }
  async  getConfigurationAsysn(subsidiaryId,type)
  {
      this.isAuthenSSO = true;
      const _endPoint = `${this.ssoCommonModule}/getconfiguration/${subsidiaryId}/${type}`;
      return await this.execCallApi.getDataApi(_endPoint).toPromise();
  }
  getConfigurationForStarpUp()
  {
      this.isAuthenSSO = true;
      const _endPoint = `${this.ssoCommonModule}/getconfiguration/S1/GENERATE`;
      this.execCallApi.getDataApi(_endPoint).toPromise();
  }
  
}