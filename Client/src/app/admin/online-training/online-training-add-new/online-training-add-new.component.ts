import {Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter
} from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { CommonService, FileService } from "../../../_services";
import { FileuploadComponent, TinyEditorComponent } from "../../../_directives";
import { ToastrService } from "ngx-toastr";
import { OnlineTrainingService } from "../../../_services/onlinetraining.service";

@Component({
  selector: "app-online-training-add-new",
  templateUrl: "./online-training-add-new.component.html",
  styleUrls: ["./online-training-add-new.component.css"]
})
export class OnlineTrainingAddNewComponent implements OnInit {
  title = "Online Training";
  languages: any = [];
  currentuser: any = {};
  model: any = {};
  listTypes: any = [];
  @ViewChild(FileuploadComponent)
  private myChild: FileuploadComponent;
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter();
  bsExpireDate = new Date();
  areacontent: any = {};
  @ViewChild(TinyEditorComponent)
  private myEditor: TinyEditorComponent;
  attachments: any = [];
  editMode: any = false;

  constructor(
    public bsModalRef: BsModalRef,
    private commonSvc: CommonService,
    private fileSvc: FileService,
    private toastr: ToastrService,
    public onlineTrainingSrv: OnlineTrainingService
  ) {
    this.languages = JSON.parse(localStorage.getItem("languages")) || {};
    this.currentuser = JSON.parse(localStorage.getItem("currentUser")) || {};
  }

  ngOnInit() {
    this.getStdcodes();
  }

  getStdcodes() {
    this.commonSvc.getStdcodesByCode("ONLTRTYPE").subscribe(data => {
      this.listTypes = data["payload"];
    });
  }

  submit() {
    this.model.Expiredate = this.bsExpireDate;
    this.model.CreateUser = this.currentuser.employeeId;

    if (!this.myChild.isValidFiles()) {
      this.toastr.warning(this.myChild.errors[0], "Error");
      return;
    }

    if (!this.editMode) {
      this.onlineTrainingSrv.addNewOnlineTraining(this.model).subscribe(
        data => {
          if (data["payload"] > 0) {
            let doc: any = {};
            doc.employeeId = this.currentuser.employeeId;
            doc.refNoValue = data["payload"];
            doc.IDR = "ONLTR";

            this.myChild.SaveFile(doc).subscribe(
              data => {},
              error => {
                alert(error.message);
              }
            );

            this.toastr.success("Upload File Success", "Success!");
            this.reloadGrid.emit(null);
            this.bsModalRef.hide();
          }
        },
        error => {}
      );
    } else {
      this.model.updateUser = this.currentuser.employeeId;
      this.model.expireDate = this.bsExpireDate;

      this.onlineTrainingSrv.update(this.model).subscribe(
        data => {
          let doc: any = {};
          doc.employeeId = this.currentuser.employeeId;
          doc.refNoValue = this.model.id;
          doc.IDR = "ONLTR";

          this.myChild.SaveFile(doc).subscribe(
            data => {},
            error => {
              alert(error.message);
            }
          );
          
          this.reloadGrid.emit(null);
          this.bsModalRef.hide();
          this.toastr.success("Update Online Training", "Success!");
        },
        error => {}
      );
    }
  }

  keyupHandlerFunction(event) {
    this.areacontent.contents = event;
  }

  downloadFile(docNo) {
    this.fileSvc.downloadFile(docNo);
  }

}
