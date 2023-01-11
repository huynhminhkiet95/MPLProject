import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Country } from '../_models/index';
import { environment } from '../../environments/environment';
import { ApplicationHttpClient } from './_base/http-client';
@Injectable()
export class CountryService {
    constructor(private http: Http,private httpclient:ApplicationHttpClient
    
    ) { 
        
    }
    getAll() {
       return this.httpclient.Get(environment.urlAPIService+'/commonservice/countrys').map((
            response: Object) => {
                return response;
            });
    }

    getById(id: number) {
        return this.http.get('/api/country/' + id).map((response: Response) => response);
    }

    create(country: Country) {
        return this.http.post('/api/country', country).map((response: Response) => response);
    }

    update(country: Country) {
        return this.http.put('/api/country/' + country.countryId, country).map((response: Response) => response);
    }

    delete(id: number) {
        return this.http.delete('/api/country/' + id).map((response: Response) => response);
    }
}