import { Injectable } from '@angular/core';
import { IdRequest } from '../_models/index';
import { ApplicationHttpClient } from './_base/http-client';

@Injectable()
export class IdRequestService {
	urlAPI: string;

	constructor(private http: ApplicationHttpClient) {
		this.urlAPI = http._urlAPI + "/requestservice";
	}

	searchPage(idrequest: IdRequest) {
		return this.http.Post(this.urlAPI + '/idrequests', idrequest)
			.map((
				response: Response) => response);
	}
	getById(id: number) {
		return this.http.Get(this.urlAPI + '/idrequest/' + id).map((response: Response) => response);
	}

	create(idrequest: IdRequest) {
		return this.http.Post(this.urlAPI + '/idrequest', idrequest).map((

			response: Response) => response
		);
	}

	update(idrequest: IdRequest) {
		return this.http.Put('/api/idrequest/' + idrequest.id, idrequest).map((response: Response) => response);
	}


	confirmIdRequest(model: any) {
		return this.http.Post(this.urlAPI + '/idrequestreply', model).map((response: Response) => response);
	}

	deleteidrrequest(model: any) {
		return this.http.Put(this.urlAPI + '/idrequest/idrequestdelete', model).map((response: Response) => response);
	}
}