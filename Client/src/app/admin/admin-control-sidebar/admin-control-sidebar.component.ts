import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../_services/message.service';
import { MessageDto } from '../../_models/messageDto';
import { SignalRService } from '../../_services/signalR.Service';
import { Globalconst } from '../../_helpers';
import { PushNotificationsService } from '../../_services/push.notification.server';

@Component({
  selector: 'app-admin-control-sidebar',
  templateUrl: './admin-control-sidebar.component.html',
  styleUrls: ['./admin-control-sidebar.component.css']
})

export class AdminControlSidebarComponent implements OnInit {

  constructor(
    private data: MessageService
    , public _signalRService: SignalRService
    , public global: Globalconst
    , private _notificationService: PushNotificationsService
  ) {
    this._notificationService.requestPermission();
  }

  messageList: MessageDto[] = [];
  msgModel: MessageDto = new MessageDto('', '');

  ngOnInit() {
    this._signalRService.startConnection()
    this.data.currentMessage.subscribe(
      message => {
        if (message.userName != '') {
          if (message.type != "login") {

            this.messageList.push(message);
            this._notificationService.generateNotification([{
              'title': 'Alert from MPi',
              'alertContent': message.content
            }]);
          }
        }
      })
  }

  sendMessage() {
    this._signalRService.sendMesageToAll(this.msgModel.content);
  }
}
