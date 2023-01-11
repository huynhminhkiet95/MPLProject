/*********************************************************
 * File Name: Helpers
 * Created By: hau.le
 * Created Date: 20/02/2020
 * Description: All function helpers
 *********************************************************/

import { ToastrService } from 'ngx-toastr';
import { _const } from './constants';
import { EnumMPLSystem } from './enums';

export class Helpers {

  /**
   * Get data local storage by key
   * @param key key local storage
   * @param parseJson Check parse json object true || false
   * @returns {object}
   */
  public static getLocalStorage(key: string, parseJson: boolean = true): any {
    if (key && key != '')
      return parseJson ? JSON.parse(localStorage.getItem(key)) : localStorage.getItem(key);
    else
      return null;
  }

  /**
   * Set data local storage
   * @param key key local storage
   * @param objData object data need save local storage
   * @returns {void}
   */
  public static setLocalStorage(key: string, objData: object): void {
    localStorage.setItem(key, JSON.stringify(objData));
  }

  /**
   * Set multi data local storage by array key
   * @param {[object]} arrData array key local storage
   * @returns {void}
   */
  public static setArrayLocalStorage(arrData: object[]): void {

    if (arrData && arrData.length > 0) {
      // TODO: setArrayLocalStorage
      arrData.forEach((item, index) => {
        if (item) {
          const _key = item[_const.LOCAL_STORAGE.key];
          const _value = item[_const.LOCAL_STORAGE.value];

          if (_key && _value)
            localStorage.setItem(_key, JSON.stringify(_value));
        }
      })
    }
  }

  /**
   * Remove data local storage
   * @param {string} key key local storage
   * @returns {void}
   */
  public static removeLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Remove multi data local storage by array key
   * @param {[string]} arrKey array key local storage
   * @returns {void}
   */
  public static removeArrayLocalStorage(arrKey: string[]): void {

    if (arrKey && arrKey.length > 0) {

      arrKey.forEach(item => {
        // console.log('=====> ', item);
        if (item && item != '')
          localStorage.removeItem(item);
      });
    }
  }
  /**
   * Func check value null || empty
   * @param value param check
   * @returns {boolean}
   */
  public static isNullOrEmpty(value: string): boolean {
    return !value;
  }
  /**
   * Func check value is number
   * @param value param check
   * @returns {boolean}
   */
  public static isNumber(value: any): boolean {
    return !isNaN(value);
  }
  /**
   * Parse string to Int
   * @param value string value
   */
  public static parseInt(value: string): number {
    return +value;
  }

  /**
   * Func convert value from string to boolean
   * @param value value need convert
   * @param valueCompare value compare
   * @returns {boolean}
   */
  public static convertStringToBool(value: any, valueCompare: any): boolean {
    return value == valueCompare;
  }
  /**
   * Func check object API return
   * @param {object} paramObj Object API return need check
   */
  public static checkObjAPIsReturn(paramObj: any): boolean {
    return paramObj && paramObj.success && paramObj.payload;
  }

  public static getUrlImage(image: string, environment: string = 'https://mpi.mplogistics.vn/') {
    if (!image)
      return null;
    return `${environment}${_const.MPI_URLS.uploads}${image}`;
  }

  /**
   * Remove key in object
   * @param {object} thisIsObject my object
   * @param {string} key key remove
   * @returns {object}
   */
  public static deleteKeyObject(thisIsObject: any, key: string): any {
    if (thisIsObject && this.checkLengthObject(thisIsObject) && !this.isNullOrEmpty(key))
      delete thisIsObject[key];

    return thisIsObject;
  }

  /**
   * Remove key in object
   * @param {object} thisIsObject my object
   * @param {string} key key remove
   * @returns {boolean}
   */
  public static checkLengthObject(thisIsObject: object): boolean {
    return thisIsObject && Object.keys(thisIsObject).length > 0;
  }
  /**
   * Remove duplicates from an array.
   * @param {Array} array current array
   * @param {String} keyChild key child
   * @param {String} prop remove by key
   * @returns {Array}
   */
  public static removeDuplicates(array: any, keyChild: string, prop: string): any {
    let resultData: any;

    if (this.checkLengthObject(array)) {

      // Logic remove dupplicate object in array
      let uniqueData = function (currentArray: any, byKey: string) {
        return currentArray.filter((item, index) => {
          return index === currentArray.findIndex(obj => {
            return JSON.stringify(obj[byKey]) === JSON.stringify(item[byKey]);
          });
        });
      }

      // Remove dupplicate in array
      resultData = uniqueData(array, prop);

      // Remove dupplicate in array child
      if (keyChild) {
        resultData.forEach((item, index) => {
          if (this.checkLengthObject(item[keyChild])) {
            item[keyChild] = uniqueData(item[keyChild], prop);
          }
        })
      }
    }

    // Result new array unique object
    return resultData;
  }

  /**
   * Func check string ending with target value
   * @param {string} string value string check ending
   * @param {string} target value target ending
   * @returns {boolean}
   */
  public static confirmEnding(string: string, target: string): boolean {
    return string.substr(-target.length) === target;
  }

  public static setDefaultGroupBySystem(systemId: string) {
    return !systemId || systemId == EnumMPLSystem.DEFAULT.toString() ? _const.DEFAULT_GROUPS.wb_mpi : _const.DEFAULT_GROUPS.wb_ent;
  }

  /**
  * Setup sample data
  var arrObj = [
    {FirstName: "Zach", LastName: "Emergency", Age: 35},
    {FirstName: "Nancy", LastName: "Nurse", Age: 27},
    {FirstName: "Ethel", LastName: "Emergency", Age: 42},
    {FirstName: "Nina", LastName: "Nurse", Age: 48},
    {FirstName: "Anthony", LastName: "Emergency", Age: 44},
    {FirstName: "Nina", LastName: "Nurse", Age: 32}
  ];

  //Unit Tests
  Helpers.sortBy(arrObj, "LastName");
  Helpers.sortBy(arrObj, "-LastName");
  Helpers.sortBy(arrObj, "LastName", "FirstName", "-Age");
  Helpers.sortBy(arrObj, "-FirstName", "Age");
  Helpers.sortBy(arrObj, "-Age");
  * @returns {Array}
  */
  public static sortBy(myArr: any, ...args: string[]): any {

    function sortComparer(a, b) {
      return a.localeCompare(b)
    };

    function _sortByAttr(attr) {

      let sortOrder = 1;

      if (attr[0] == "-") {
        sortOrder = -1;
        attr = attr.substr(1);
      }

      return function (a, b) {
        var result;

        if (typeof a[attr] == 'string' && typeof b[attr] == 'string')
          result = sortComparer(a[attr], b[attr]); // sort by alpha a - z

        else
          result = (a[attr] < b[attr]) ? -1 : (a[attr] > b[attr]) ? 1 : 0;

        return result * sortOrder;
      }
    }

    function _getSortFunc() {

      if (args.length == 0)
        throw "Zero length arguments not allowed for Array.sortBy()";

      return function (a, b) {
        for (var result = 0, i = 0; result == 0 && i < args.length; i++) {
          result = _sortByAttr(args[i])(a, b);
        }

        return result;
      }
    }

    return myArr.sort(_getSortFunc.apply(null, args));
  }

  /**
   * Group array data by column
   * @param myArray array data source
   * @param field field group
   */
  public static groupBy(myArray: Array<any>, field: string) {

    var group_to_values = myArray.reduce(function (obj, item) {

      if (!obj[item[field]])
        obj[item[field]] = [item];
      else
        obj[item[field]].push(item);

      return obj;
    }, {});

    return Object.keys(group_to_values)
      .map(key => {
        return { key, value: group_to_values[key] }
      });
  }

  /**
   * Function show message by value and action
   * @param toastr library show message
   * @param value value get from store return
   * @param action inert || update || delete
   */
  public static showMessage(toastr: ToastrService, value: number, action: string): void {
    let message: string, success: boolean = false;
    
    switch (value) {
      case 0:
      case -1:
        message = action === _const.ACTIONS.update
                            ? _const.NOTIFICATIONS.update_fail
                            : action === _const.ACTIONS.insert
                            ? _const.NOTIFICATIONS.save_fail
                            : _const.NOTIFICATIONS.delete_fail
        break;

      default:
        success = true;
        message = action === _const.ACTIONS.update
                            ? _const.NOTIFICATIONS.update_success
                            : action === _const.ACTIONS.insert
                            ? _const.NOTIFICATIONS.save_success
                            : _const.NOTIFICATIONS.delete_success;
        break;
    }

    if (success)
      toastr.success(message, action);
    else
      toastr.error(message, action);
  }
}