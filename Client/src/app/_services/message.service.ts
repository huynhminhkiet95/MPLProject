import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageDto } from '../_models/messageDto';
import { environment } from '../../environments/environment';
import { ApplicationHttpClient } from './_base/http-client';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Injectable()
export class MessageService {

  private messageSource = new BehaviorSubject(new MessageDto('',''));
  currentMessage = this.messageSource.asObservable();

  constructor(private _http: ApplicationHttpClient,public http: HttpClient) { }

  changeMessage(message: MessageDto) {
   
    this.messageSource.next(message)
  }
  reset()
  {
    this.messageSource.next(new MessageDto() );
  }
  getNotifyMessage(employeeId,sourceType,messageType)
  {
      return this._http.GetAsync(environment.urlNotifyServer+`/api/GetMessage/${employeeId}/${sourceType}/${messageType}`) ;
  }
  updateStatusMessate(model:any)
  {
      return this._http.PostAsync(environment.urlNotifyServer+`/api/UpdateMsgStatus/MB_MPI`,model);
  }
}