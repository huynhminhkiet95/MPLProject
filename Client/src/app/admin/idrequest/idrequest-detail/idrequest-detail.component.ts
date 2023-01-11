import { Component, OnInit ,TemplateRef,Input, Output, EventEmitter, HostListener } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { debuglog, error } from 'util';
import { window } from 'rxjs/operator/window';
import { Window } from 'selenium-webdriver';
import { IdRequestService, FileService, CommonService} from '../../../_services/index'
import { IdRequest} from '../../../_models/index'
import * as moment from 'moment';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
declare var AdminLTE: any; 

@Component({
  selector: 'app-idrequest-detail',
  templateUrl: './idrequest-detail.component.html',
  styleUrls: ['./idrequest-detail.component.css']
})

export class IdrequestDetailComponent implements OnInit{
  
  id: string;
  private sub: any;
  title: string;
  model: any = {};
  attachFiles:any=[];
  confirmModel:any={};
  listStatuss:any[]=[{id:'REQU',name:'Reply For Question'},{id:'REPLY',name:'Replied'},{id:'CLOSED',name:'Closed'}];
  languages:any = [];
  constructor(private route: ActivatedRoute,
              private idRequestSvc:IdRequestService,
              private fileSvc:FileService,
              private toastr: ToastrService,
              public commonsvc:CommonService) {
                this.languages = JSON.parse(localStorage.getItem('languages')) || {};
              }
  ngOnInit() {

      AdminLTE.init();
      this.sub = this.route.params.subscribe(params => {
      this.id = params['id']; // (+) converts string 'id' to a number
      
      if(this.id!=null && this.id!=undefined){
          this.getById(this.id);
          this.getFileAttach(this.id);
      }
          
   });
  }
  getById(id)
  {
      this.idRequestSvc.getById(id).subscribe(
        data=>{
          this.model=data["payload"];
          this.model.updateDate = this.commonsvc.convertMilisecondToUTCDateTime(this.model.updateDate);
          this.model.createDate = this.commonsvc.convertMilisecondToUTCDateTime(this.model.createDate);
        },
        error=>
        {

        }
      )
  }
   
  getFileAttach(id)
  {
    this.fileSvc.getByRefNoValue(id).subscribe(
      data=>{
        //
        this.attachFiles=data["payload"];
      },
      error=>
      {

      }
    )
  }
  ReplyIdRequest()
  {
    var currentuser =JSON.parse(localStorage.getItem('currentUser')) || {};
    this.confirmModel.updateUser=currentuser.employeeId;
    this.confirmModel.iDRNo=this.id;
    this.idRequestSvc.confirmIdRequest(this.confirmModel).subscribe(
      data=>{
        this.confirmModel.loginName="";
        this.confirmModel.password="";
        this.getById(this.id);
        this.toastr.success('Save ID Request', 'Success!');
      },
      error=>{
        this.toastr.error('Save ID Request', error["message"]);
      }
    )
  }
}
