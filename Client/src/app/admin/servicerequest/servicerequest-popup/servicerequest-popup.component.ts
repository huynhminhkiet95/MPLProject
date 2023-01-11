import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ServiceRequestService, FileService } from '../../../_services';
import { Globalconst } from '../../../_helpers/globalvariable';
declare var AdminLTE: any;
@Component({
  selector: 'app-servicerequest-popup',
  templateUrl: './servicerequest-popup.component.html',
  styleUrls: ['./servicerequest-popup.component.css']
})
export class ServicerequestPopupComponent implements OnInit {
  title="Application Service Request";
  modalRef: BsModalRef;
  languages:any = [];
  model :any={};
  dataSource: any = [];
  showRadioApproval:any={};
  documents:any=[]
  hlvId:string ='';


  constructor(public bsModalRef: BsModalRef,
    private serviceSvc:ServiceRequestService,
    public globals:Globalconst,
    public fileSvc:FileService,
    private modalService: BsModalService,


    ) { 
     this.languages = JSON.parse(localStorage.getItem('languages')) || {};
    }

  ngOnInit() {
    this.hlvId= this.modalService.config["initialState"].model;
    this.getById(this.hlvId);
  }
  getById(id)
  {
      this.serviceSvc.getByIdForApproval(id,this.globals._userinfo.employeeId).subscribe(
        data=>{
            this.dataSource = data["payload"].details;
            this.model = data["payload"].info;
            
            if(this.model.replyType=='APPO')
            {
              this.showRadioApproval=true;
            }
            else
            {
              this.showRadioApproval = false;
            }
          },
        error=>{
          
        });
        this.fileSvc.getList('SVR', this.hlvId).subscribe(
          data=>{
            this.documents =data["payload"];
          },
          error=>{

          }
        );
  }
}
