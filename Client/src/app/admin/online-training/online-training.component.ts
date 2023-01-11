import { Component } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { CommonService, FileService } from "../../_services";
import { Router, ActivatedRoute } from "@angular/router";
import { BaseComponent } from "../../_directives/base.component";
import * as moment from "moment";
import { OnlineTrainingAddNewComponent } from "./online-training-add-new/online-training-add-new.component";
import { OnlineTrainingService } from "../../_services/onlinetraining.service";
import { _const } from "../../_helpers/constants";
import { DomSanitizer } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { OnlineTrainingDetailComponent } from "./online-training-detail/online-training-detail.component";
import { confirm } from 'devextreme/ui/dialog';
import { BasePopupComponent } from "../../_directives/base.popup.component";

declare var AdminLTE: any;

@Component({
  selector: "app-online-training",
  templateUrl: "./online-training.component.html",
  styleUrls: ["./online-training.component.css"]
})
export class OnlineTrainingComponent extends BasePopupComponent {
  title = "Online Training";
  listTypes: any = [];
  bsModalRef: BsModalRef;
  dataSource: any = [];
  id: number;
  _isAdmin: any = false;
  newsView: any = {};
  contents: any = "";
  listLogs: any = [];
  commentModel: any = {};
  commentType: any = "ONTRAIN";

  constructor(
    private modalService: BsModalService,
    private commonSvc: CommonService,
    public router: Router,
    public route: ActivatedRoute,
    private toastSvr: ToastrService,
    public fileSvc: FileService,
    private sanitizer: DomSanitizer,
    public onlineTrainingSrv: OnlineTrainingService
  ) {
    super();
  }

  searchModel: any = {
    Subject: "",
    Type: "",
    DateTo: new Date(),
    DateFrom: moment().subtract(2, "weeks")
  };

  ngOnInit() {
    AdminLTE.init();
    this.getStdcodes();
    this.searchOnlineTraining();
    this.currentuser.employeeId = Number.parseInt(this.currentuser.employeeId);
    this.commentModel.userComment = "";

    if (this.commonSvc.isAdmin(this.currentuser.roleId)) this._isAdmin = true;
  }

  getStdcodes() {
    this.commonSvc.getStdcodesByCode("ONLTRTYPE").subscribe(data => {
      this.listTypes = data["payload"];
    });
  }

  openDetailModal() {
    this.bsModalRef = this.modalService.show(OnlineTrainingAddNewComponent, {
      class: "modal-lg",
      backdrop: true,
      ignoreBackdropClick: true
    });

    this.bsModalRef.content.reloadGrid
      .take(1)
      .subscribe(this.searchOnlineTraining.bind(this));
  }

  searchOnlineTraining() {
    this.onlineTrainingSrv.search(this.searchModel).subscribe(data => {
      this.dataSource = data["payload"];
    });
  }

  async showContentModal(news: any) {
    var comments = await this.commonSvc.getGenerateComment(
      news.data.id,
      this.commentType
    );

    this.onlineTrainingSrv.getById(news.data.id, this.currentuser.employeeId).subscribe(data => {
      this.contents = data[this.payLoad].onlineTraining.contents;

      this.listLogs = comments["payload"];

      const initialState = {
        subject: data[this.payLoad].onlineTraining.subject,
        contents: this.contents
      };

      this.bsModalRef = this.modalService.show(OnlineTrainingDetailComponent, {
        class: "modal-lg",
        initialState,
        backdrop: true,
        ignoreBackdropClick: true
      });

      this.newsView = data[this.payLoad].onlineTraining;
      this.newsView.listDocs = data[this.payLoad].listDoc;
      this.newsView.viewCount = data[this.payLoad].viewCount;
      this.bsModalRef.content.newsView = this.newsView;
      this.bsModalRef.content.listLogs = this.listLogs;
    });
  }

  delete(id) {
    var modelDelete: any = {};

    modelDelete.id = id;
    modelDelete.updateUser = this.currentuser.employeeId;

    var result = confirm("Are you sure delete this row?", "Confirm delete");

    result.done((dialogResult: any) => {
      if (dialogResult) {
        this.onlineTrainingSrv
          .delete(modelDelete)
          .subscribe(data => {
            if (data["payload"] > 0) {
              this.toastSvr.success("Delete Sucessfull", "Delete Online Training");
              this.searchOnlineTraining();
            } else {
              this.toastSvr.error("Delete Failed", "Delete Online Training");
            }
          });
      }
    });
  }

  edit(id) {
    this.onlineTrainingSrv.getById(id, this.currentuser.employeeId).subscribe(data => {
      let onlineTraining = data[this.payLoad].onlineTraining;

      this.bsModalRef = this.modalService.show(OnlineTrainingAddNewComponent, {
        class: "modal-lg",
        backdrop: true,
        ignoreBackdropClick: true
      });

      this.bsModalRef.content.model = onlineTraining;
      this.bsModalRef.content.myEditor.editor.setContent(
        data[this.payLoad].onlineTraining.contents
      );

      this.bsModalRef.content.areacontent.contents =
        data[this.payLoad].onlineTraining.contents;
      this.bsModalRef.content.attachments = data[this.payLoad].listDoc;
      this.bsModalRef.content.editMode = true;
      this.bsModalRef.content.reloadGrid
        .take(1)
        .subscribe(this.searchOnlineTraining.bind(this));
    });
  }

  downloadFile(docNo) {
    this.fileSvc.downloadFile(docNo);
  }

  onEditorPreparing(e) {
    if (e.parentType === "dataRow") {
      if (e.row && e.row.inserted == true)
        e.editorOptions.disabled = false;
      else
        e.editorOptions.disabled = true;
    }
  }
}
