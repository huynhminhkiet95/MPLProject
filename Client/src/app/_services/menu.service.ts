import { Injectable } from '@angular/core';
import { ExecCallApi } from '../_helpers/index';

@Injectable()
export class MenuService {

  private urlAPI: string;

    constructor(
      private execAPI: ExecCallApi
    ) {
      this.urlAPI = 'ssocommonservice';
    }

    /**
     * Insert data menu
     * @param model model insert menu
     */
    insertMenu(model: any) {
        const endPoint = `${this.urlAPI}/insertmenu`;
        return this.execAPI.postDataApi(endPoint, model);
    }

    /**
     * Update data menu
     * @param model model update menu
     */
    updateMenu(model: any) {
        const endPoint = `${this.urlAPI}/updatemenu`;
        return this.execAPI.postDataApi(endPoint, model);
    }

    /**
     * Delete data menu
     * @param model model delete menu
     */
    deleteMenu(model: any) {
        const endPoint = `${this.urlAPI}/deletemenu`;
        return this.execAPI.postDataApi(endPoint, model);
    }
}
