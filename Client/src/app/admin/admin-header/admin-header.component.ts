import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Globalconst } from '../../_helpers/globalvariable'
import { CookieService } from 'ngx-cookie-service/cookie-service/cookie.service';
import { MessageService } from '../../_services/message.service';
import { MessageDto } from '../../_models/messageDto';
import { SignalRService } from '../../_services/signalR.Service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})

export class AdminHeaderComponent implements OnInit {

  currentUser: any = {};
  name: string;
  avatar: any = {};
  languages: any = [];
  messageList: MessageDto[] = [];

  constructor(
    private router: Router
    , public globals: Globalconst
    , private cookieService: CookieService
    ,private data: MessageService,
    public _signalRService: SignalRService
  ) { }

  ngOnInit() {
      this.data.currentMessage.subscribe(message => {
        if(message.userName!='')
            this.messageList.push(message);
      });
    if (!this.cookieService.check("MPI_SESSION"))
      return this.router.navigate(['/login'], { queryParams: { logout: true } });

    this.avatar.src = localStorage.getItem('imgAvatar');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
    this.data.getNotifyMessage("5","MB_MPI","notification").then(data=>{
      let result:any = data;  
      result.forEach(element => {
          this.messageList.push(new MessageDto(element.RequestUser,element.RequestTitle,element.ReqId));
      });
    });
  }

  logOut() {
    this._signalRService.stopConnection();
    this.messageList=[];  
    this.data.reset();
    this.router.navigate(['/login'], { queryParams: { logout: true } });
  }

  userProfile() {
    this.router.navigate(['intranet/userprofile']);
  }

  clearAll() {
    this.messageList = [];
  }

  markRead(item) {
    let index = this.messageList.indexOf(item);
    if (index != null) {
      this.messageList.splice(index, 1);
      this.updateStatus(item);
    }
  }
  updateStatus(item:any)
  {
      let model = {"Username":this.globals._userinfo.employeeId,"ReqIds":item.id.toString(),"FinalStatusMessage":"READ"};
      this.data.updateStatusMessate(model);
  }
}
