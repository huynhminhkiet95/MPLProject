import { Injectable } from '@angular/core';
import { ApplicationHttpClient } from './_base/http-client';

@Injectable()
export class VendorService {

    private urlAPI: string;

    constructor(private http: ApplicationHttpClient) {
        this.urlAPI = http._urlAPI + "/vendorservice";
    }

    getAllVendor() {
        return this.http.Post(this.urlAPI + '/vendors', '').map((response: Response) => response);
    }

    insertVendor(model: any) {
        return this.http.Post(this.urlAPI + '/vendor', model).map((response: Response) => response);
    }

    updateVendor(model: any) {
        return this.http.Put(this.urlAPI + '/vendor', model).map((response: Response) => response);
    }

    deleteVendor(model: any) {
        return this.http.Post(this.urlAPI + '/deletevendor', model).map((response: Response) => response);
    }

    getById(id: any) {
        return this.http.Get(this.urlAPI + '/vendor/' + id).map((response: Response) => response);
    }


}