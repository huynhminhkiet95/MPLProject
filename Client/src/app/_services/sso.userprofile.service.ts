/*********************************************************
 * File Name: SSOUserProfileService
 * Created By: hau.le
 * Created Date: 20/02/2020
 * Description: All service user profile SSO API
 *********************************************************/

import { Injectable } from '@angular/core';
import { ExecCallApi, ApiSSO } from '../_helpers';

@Injectable()
export class SSOUserProfileService extends ApiSSO {

  private ssoUserModule: string = 'api/userprofile';

  constructor(private execCallApi: ExecCallApi) {
    super();
  }

  /**
   * Get user login
   * Method: GET
   * API: SSO/userprofile
   * @param userid user id
   */
  getUserLogin(userid: number) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoUserModule}/employee/userlogin/${userid}`;
    return this.execCallApi.getDataApi(endPoint);
  }
  
  /**
   * Async Get data private info employee by id
   * Method: GET
   * API: SSO/userprofile
   * @param 
   */
  async getPrivateInfoAsync(model: any) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoUserModule}/getemployeeprivate`;
    return await this.execCallApi.postAsyncDataApi(endPoint, model);
  }

  /**
   * Get data private info employee by id
   * Method: GET
   * API: SSO/userprofile
   * @param id Employee id
   */
  getPrivateInfo(model: any) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoUserModule}/getemployeeprivate`;
    return this.execCallApi.postDataApi(endPoint, model);
  }

  /**
     * Add new employee data
     * Method: POST
     * API: SSO/employeeservice
     * @param model Model info employee
     */
  createEmployee(model: any) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoUserModule}/addnewemployee`;
    return this.execCallApi.postDataApi(endPoint, model);
  }

  /**
   * Update data info employee
   * Method: PUT
   * API: SSO/employeeservice
   * @param model Model info employee
   */
  updateEmployee(model: any) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoUserModule}/updateemployee`;
    return this.execCallApi.postDataApi(endPoint, model);
  }

  /**
   * Update info profile user
   * Method: POST
   * API: SSO/userprofile
   * @param user info model user
   */
  updateUserInfo(objUser: any) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoUserModule}/updateuserprofile`;
    return this.execCallApi.postDataApi(endPoint, objUser);
  }

  /**
   * Add new info private employee
   * Method: POST
   * API: SSO/userprofile
   * @param model Model info employee
   */
  insertPrivateInfo(model: any) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoUserModule}/saveemployeeprivate`;
    return this.execCallApi.postDataApi(endPoint, model);
  }

  /**
   * Update info private employee
   * Method: PUT
   * API: SSO/userprofile
   * @param model Model info employee
   */
  updatePrivateInfo(model: any) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoUserModule}/updateemployeeprivate`;
    return this.execCallApi.putDataApi(endPoint, model);
  }

  /**
   * Update data department
   * Method: POST
   * API: SSO/userprofile
   * @param model sub dept info
   */
  updateSubDept(model: any) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoUserModule}/department/subdept`;
    return this.execCallApi.postDataApi(endPoint, model);
  }

  resetPassword(model: any) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoUserModule}/resetpass`;
    return this.execCallApi.postDataApi(endPoint, model);
  }

  confirmResetPassword(model: any) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoUserModule}/confirmresetpass`;
    return this.execCallApi.postDataApi(endPoint, model);
  }

  getUserProfile(employeeId: number) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoUserModule}/${employeeId}`;
    return this.execCallApi.getDataApi(endPoint);
  }

  /**
   * Employee permission   
   * API: SSO/ 
   */
  getEmployee2Group(employeeId: number, systemId: any, subsidiaryId: any) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoUserModule}/employee2group/get/${employeeId}/${systemId}/${subsidiaryId}`;
    return this.execCallApi.getDataApi(endPoint);
  }

  saveEmployee2Group(model: any) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoUserModule}/employee2group/save`;
    return this.execCallApi.postDataApi(endPoint, model);
  }

  deleteEmployee2Group(model: any) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoUserModule}/employee2group/delete`;
    return this.execCallApi.postDataApi(endPoint, model);
  }

  resetPasswordEmployeeeSearch(employeeId: number) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoUserModule}/resetpassemployee/${employeeId}`;
    return this.execCallApi.getDataApi(endPoint);
  }

  resetUserDevice(employeeId: number) {
    this.isAuthenSSO = true;
    const endPoint = `${this.ssoUserModule}/resetuserdevice/${employeeId}`;
    return this.execCallApi.getDataApi(endPoint);
  }
}