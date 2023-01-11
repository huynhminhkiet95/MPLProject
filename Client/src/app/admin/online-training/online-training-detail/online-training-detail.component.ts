import { Component } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Router, ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { CommonService, FileService } from "../../../_services";
import { OnlineTrainingService } from "../../../_services/onlinetraining.service";
import { BaseComponent } from "../../../_directives/base.component";
import { _const } from "../../../_helpers/constants";
import { environment } from "../../../../environments/environment.prod";
import { BasePopupComponent } from "../../../_directives/base.popup.component";
declare var AdminLTE: any;

@Component({
  selector: "app-online-training-detail",
  templateUrl: "./online-training-detail.component.html",
  styleUrls: ["./online-training-detail.component.css"]
})
export class OnlineTrainingDetailComponent extends BasePopupComponent {
  title = "Online Training";
  newsView: any = {};
  contents: any = "";
  listLogs: any = [];
  commentModel: any = {};
  subject: any = '';
  commentType: any = "ONTRAIN";
  urlFileServer: any = environment.urlFileServer;

  constructor(
    private commonSvc: CommonService,
    public bsModalRef: BsModalRef,
    public router: Router,
    private toastSvr: ToastrService,
    public modalService: BsModalService,
    public fileSvc: FileService,
    public onlineTrainingSrv: OnlineTrainingService
  ) {
    super();
    
    if (modalService.config["initialState"] != null) {
      this.subject = modalService.config["initialState"].subject || '';
      this.contents = modalService.config["initialState"].contents || '';
    }
  }

  ngOnInit() {
    AdminLTE.init();
    this.commentModel.userComment = "";
    AdminLTE.initEmojipicker();
  }

  downloadFile(docNo) {
    this.fileSvc.downloadFile(docNo);
  }

  addComment(id) {
    if (
      this.commentModel.userComment == undefined ||
      this.commentModel.userComment == ""
    )
      return;

    this.commentModel.refNoValue = id;
    this.commentModel.refNoType = this.commentType;
    this.commentModel.CreatedBy = this.currentuser.employeeId;
    this.commentModel.ActionType = "COMMENT";
    this.commentModel.Details = this.commentModel.userComment;
    this.commentModel.CreatedOn = new Date();

    this.commonSvc.generateComment(this.commentModel).subscribe(data => {
      this.toastSvr.success("Add Comment Sucessfull", "Add Comment");
     
      this.commentModel.userComment = "";
      let inputc:any = $('.emoji-wysiwyg-editor');
      $(inputc[0]).html("");
      var avatar = this.currentuser.avartarThumbnail.replace(this.urlFileServer, '');

      let newLog = {
        details: this.commentModel.Details,
        actionType: this.commentModel.ActionType,
        createdOn: moment(this.commentModel.CreatedOn).valueOf(),
        createdBy: this.commentModel.CreatedBy,
        employeeName: this.currentuser.employeeName,
        avartarThumbnail: avatar,
        isUse: true
      };

      this.listLogs.push(newLog);
    });
  }
  like()
  {
      if(!this.newsView.viewCount.liked)
      {
        this.newsView.viewCount.likeCount+=1;
        this.newsView.viewCount.liked=true;
        let dto={
              employeeId:this.currentuser.employeeId,
              reftype:'ONLTR',
              refNovalue:this.newsView.id,
              liked:1
        };
        this.commonSvc.updateViewCount(dto).subscribe();
      }

  }
}
