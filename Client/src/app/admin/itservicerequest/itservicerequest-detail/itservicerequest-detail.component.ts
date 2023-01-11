import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ItServiceRequest, FileService, CommonService, EmployeeService } from '../../../_services/index'
import { WindowRef, Globalconst } from '../../../_helpers/index';
import { TinyEditorComponent, SelectMultipleComponent, FileuploadComponent } from '../../../_directives/index';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../_directives/base.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ViewImageComponent } from '../../../_directives/view-image/view-image.component';
import { SignalRService } from '../../../_services/signalR.Service';
import { MessageDto } from '../../../_models/messageDto';
import { BasePopupComponent } from '../../../_directives/base.popup.component';
declare var AdminLTE: any;
@Component({
  selector: 'app-itservicerequest-detail',
  templateUrl: './itservicerequest-detail.component.html',
  styleUrls: ['./itservicerequest-detail.component.css']
})
export class ItservicerequestDetailComponent extends BasePopupComponent {
  @ViewChild(FileuploadComponent)
  private myuploadFile: FileuploadComponent;

  @ViewChild(TinyEditorComponent)
  private myEditor: TinyEditorComponent;

  @ViewChild(SelectMultipleComponent)
  private mymultipleSelect: SelectMultipleComponent;

  ItAdmins: any = [];
  ItAdmins2: any = [];
  title: string;
  replyModel: any = {};
  listDetail: any = [];
  model: any = {};
  id: string;
  attachFiles: any = [];
  languages: any = [];
  areacontent: any = {};
  listIDStatus: any = [];
  userProfile: any = {};
  listparameter: any = {};
  listITAdmin: any = {};
  paras: any;
  bsModalRef: BsModalRef;
  constructor(private route: ActivatedRoute,
    public router: Router,
    private itRequestSvc: ItServiceRequest,
    private fileSvc: FileService,
    private toastr: ToastrService,
    private userSvc: EmployeeService,
    private commonSvc: CommonService,
    private winRef: WindowRef,
    private global: Globalconst,
    private modalService: BsModalService,
    private signalRService: SignalRService,
     
  ) {
    super();
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
  }

  ngOnInit() {
    //this.signalRService.startConnection();
    var role = this.global._userinfo["roleId"];
    if (role != '5A686DBE-1C3D-11E8-ACCF-0ED5F89F718B') {
      this.userProfile.isEndUser = true;
    }
    else {
      this.userProfile.isEndUser = false;
    }

    this.userSvc.getItAdmin("-1").subscribe(
      data => {
        this.ItAdmins = data["payload"];
        let items: any = [];
        this.ItAdmins.forEach(element => {
          items.push({ id: element.itAdmin, text: element.employeeName });
          this.ItAdmins2.push( element.itAdmin);
        });

        if (this.mymultipleSelect) {
          this.mymultipleSelect.items = items;
        }
      },
      error => {
      }

    );

    this.commonSvc.getStdcodesByCode("SRSTATUS").subscribe(
      data => {
        var list = data["payload"];
        this.listIDStatus = list.filter(function (x) {
          return x.codeId != 'NEW';
        });

        // if (role == '5A687066-1C3D-11E8-ACCF-0ED5F89F718B') {
        //   this.listIDStatus = this.listIDStatus.filter(function (x) {
        //     return x.codeId != 'CLOSED' && x.codeId != 'CANCEL' && x.codeId != 'REOP';
        //   });
        // }

      },
      error => { }
    )
    this.areacontent.content1 = "";
    this.id = this.route.params["_value"].id;
    this.getById(this.id);

    this.route.queryParams.subscribe(params => {
      this.QueryPara = params;
    });
    AdminLTE.init();
  }

  keyupHandlerFunction(event) {
    this.areacontent.content1 = event;
  }
  getById(id) {
    this.itRequestSvc.getById(id).subscribe(
      data => {
        if(data["payload"].svcRequest!=null)
        {
          this.model = data["payload"].svcRequest;
          this.model.createDate = this.commonSvc.convertMilisecondToUTCDateTime(this.model.createDate);
          this.attachFiles = data["payload"].attachments
          this.listDetail = data["payload"].svcRequestDetails;
        }
        else
        {
          this.toastr.info("This request already removed.","Information");
        }
      },
      error => {
        this.toastr.error(error.message);
      }
    )
  }

  replyItRequest(fForm: any) {

    if (!this.myuploadFile.isValidFiles()) {
      this.toastr.error(this.myuploadFile.errors[0], "File");
      return;
    }
    var currentuser = JSON.parse(localStorage.getItem('currentUser')) || {};
    this.replyModel.createuser = currentuser.employeeId;
    this.replyModel.iSRNo = this.id;

    if (this.mymultipleSelect) {
      var arr = new Array;
      this.mymultipleSelect.value.forEach(element => {
        arr.push(element.id);
      });
      this.replyModel.assignTo = arr.join();
    }
    this.itRequestSvc.replyItRequest(this.replyModel).subscribe(
      data => {

        if (data["success"]) {
          this.sendNotifyRequest();
          if (this.myuploadFile.files.length > 0) {
            let doc: any = {};
            doc.employeeId = currentuser.employeeId;
            doc.refNoValue = data["payload"];
            doc.IDR = "ISR";
            this.myuploadFile.SaveFile(doc).subscribe(
              data => {
                this.itRequestSvc.getById(this.id).subscribe(
                  data => {
                    this.model = data["payload"].svcRequest;
                    this.attachFiles = data["payload"].attachments
                    this.listDetail = data["payload"].svcRequestDetails;
                    this.myuploadFile.files = [];
                    this.toastr.success('Reply Service Request Success', 'Success!');
                  },
                  error => {
                    this.toastr.error(error.message);
                  }
                )
              },
              error => {
                this.toastr.error(error.message);
              }
            );
          }
          else {
            this.itRequestSvc.getById(this.id).subscribe(
              data => {
                this.model = data["payload"].svcRequest;
                this.attachFiles = data["payload"].attachments
                this.listDetail = data["payload"].svcRequestDetails;
                this.toastr.success('Reply Service Request Success', 'Success!');
              },
              error => {
                this.toastr.error(error.message);
              }
            )
          }
          this.replyModel.details = "";
          this.replyModel.sRStatus = "";
          this.replyModel.assignTo = "";
          this.myEditor.tinymceModel = "";
          this.myEditor.resetContent();
          this.areacontent.content1 = '';
          this.mymultipleSelect.refreshValue([]);
        }
        fForm.resetForm();
      },
      error => {
        this.toastr.error(error["message"], 'Success!');
      }
    );
  }

  downloadFile(docNo) {
    this.fileSvc.downloadFile(docNo);
  }
  back() {
    //this.commonSvc.urlback('intranet/itservicerequest');
      this.route.queryParams.subscribe(params => {
      this.router.navigate(['intranet/itservicerequest'], { queryParams: params })
      params = [];
    });
  }
  viewImage(docNo)
  {
    const initialState = {
      docNo:docNo
    };
    this.bsModalRef = this.modalService.show(ViewImageComponent, Object.assign({}, { class: 'modal-lg', initialState }));
  }
  sendNotifyRequest() 
  {
    var currentuser = JSON.parse(localStorage.getItem('currentUser')) || {};
    let message = new MessageDto();
    message.userName=currentuser.employeeName;
    message.content=`${currentuser.employeeName} reply on It request ${this.model.isrNo} - ${this.model.srSubject}`;
    message.type="itrequest";
    this.signalRService.sendMessageToUser(this.ItAdmins2.join(';'),message);
  }
}
