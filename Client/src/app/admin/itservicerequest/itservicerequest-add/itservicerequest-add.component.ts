import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ItServiceRequest, EmployeeService } from '../../../_services/index';
import { FileuploadComponent } from '../../../_directives/fileupload/fileupload.component';
import { BaseComponent } from '../../../_directives/base.component';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import { SignalRService } from '../../../_services/signalR.Service';
import { BasePopupComponent } from '../../../_directives/base.popup.component';
@Component({
  selector: 'app-itservicerequest-add',
  templateUrl: './itservicerequest-add.component.html',
  styleUrls: ['./itservicerequest-add.component.css']
})
export class ItservicerequestAddComponent extends BasePopupComponent {
  @ViewChild(FileuploadComponent)
  private myChild: FileuploadComponent;
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()
  model: any = {};
  title: string;
  areacontent: any = {};
  listItServices: any = [];
  listServiceTypes: any = [];
  listItStatus: any = [];
  listPrioritys: any = [];
  languages: any = [];
  required: string;
  ItAdmins:any=[];
  constructor(public bsModalRef: BsModalRef,
    private itService: ItServiceRequest,
    public toastr: ToastrService, public _signalRService: SignalRService,private userSvc: EmployeeService,
  ) {
    super();
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
  }

  ngOnInit() {
    //this.getItAdmin('-1');
  }
  keyupHandlerFunction(event) {
    this.areacontent.content = event;
  }
  addnew() {
    this.getItAdmin(this.model.iTService);

    this.IsSubmit = true;
    var currentuser = JSON.parse(localStorage.getItem('currentUser')) || {};
    this.model.SubsidiaryId = currentuser.subsidiaryId;
    this.model.CreateUser = currentuser.employeeId;
    this.model.Details = this.areacontent.content;
    this.itService.create(this.model).subscribe(
      data => {
        this.sendNotifyRequest();
        let doc: any = {};
        doc.employeeId = currentuser.employeeId;
        doc.refNoValue = data["payload"];
        doc.IDR = "ISR";
        this.myChild.SaveFile(doc).subscribe();
        this.reloadGrid.emit(null);
        this.bsModalRef.hide();
        this.toastr.success('Save It Request sucessfull', 'Success!');
        this.IsSubmit = false;
        
      },
      error => {

      }
    )
  }
  sendNotifyRequest() {
      this._signalRService.sendMessageToUser(this.ItAdmins.join(';'),`The new It request ${this.model.Subject} has been created`);
  }
  getItAdmin(itadmin)
  {
    this.userSvc.getItAdmin(itadmin).subscribe(
      data => {
        let items:any = data["payload"];
        items.forEach(element => {
          this.ItAdmins.push(element.itAdmin);
        });
      },
      error => {
      }

    );
  }
}
