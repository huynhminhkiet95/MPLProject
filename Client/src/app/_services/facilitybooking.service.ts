import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApplicationHttpClient } from './_base/http-client';
import { Appointment,Priority,Resource} from '../_models/index'

@Injectable()
export class FacilityBookingService {
    urlAPI:string;

    constructor(private httpClient:ApplicationHttpClient) { 
        this.urlAPI=httpClient._urlAPI+"/facilitybookingservice";
    }

    search(_models:any) {
        return this.httpClient.Post(this.urlAPI+'/facilitybookings', _models).map((response: Response) => response);
    }
    validate(_models:any) {
        return this.httpClient.Post(this.urlAPI+'/validate', _models).map((response: Response) => response);
    }
    cancle(id : number, userid : number) {
        return this.httpClient.Get(this.urlAPI+'/cancelfacilitybooking/'+id+"/userid/" + userid).map((response: Response) => response);
    }
    insert(_models:any) {
        return this.httpClient.Post(this.urlAPI+'/savefacilitybooking/', _models).map((response: Response) => response);
    }
    getById(id:number, userid:number,sudsidiaryid:string)
    {
        return this.httpClient.Get(this.urlAPI+'/facilitybooking/'+id+"/userid/" + userid+"/subsidiaryid/"+sudsidiaryid).map((response: Response) => response);  
    }

  
}

