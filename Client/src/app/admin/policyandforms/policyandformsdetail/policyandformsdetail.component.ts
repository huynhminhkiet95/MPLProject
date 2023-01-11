import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AnnounceService, FileService } from '../../../_services/index';
import { FileuploadComponent } from '../../../_directives/fileupload/fileupload.component';
import { TinyEditorComponent, SelectMultipleComponent } from '../../../_directives';
import { BaseComponent } from '../../../_directives/base.component';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-policyandformsdetail',
  templateUrl: './policyandformsdetail.component.html',
  styleUrls: ['./policyandformsdetail.component.css']
})
export class PolicyandformsdetailComponent extends BaseComponent {
  @ViewChild(FileuploadComponent)
  private myChild: FileuploadComponent;
  @ViewChild(TinyEditorComponent)
  private myEditor: TinyEditorComponent;
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()
  @ViewChild(SelectMultipleComponent)
  private mymultipleSelect: SelectMultipleComponent;
  model: any = {};
  @Input() AnnId: number;
  public title: string;
  public list: any[] = [];
  annId: number = 0;
  areacontent: any = {};
  listSubsidiaries: any = [];
  listServiceTypes: any = [];
  editlabel: string = "Submit";
  bsValue: Date = new Date();
  minDate = new Date();
  attachments: any = [];
  languages: any = [];
  editMode: any = false;
  currentuser:any = {};
  
  constructor(public bsModalRef: BsModalRef,
    private announceService: AnnounceService,
    public toastr: ToastrService,
    private fileSvc: FileService,
    private modalService: BsModalService,
    public router:Router
  ) {
    super(router);
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
    this.currentuser = JSON.parse(localStorage.getItem('currentUser')) || {};
    if (modalService.config["initialState"]) {
      this.editMode = modalService.config["initialState"].editMode||false;
      this.annId=modalService.config["initialState"].annId||0
    }
  }
  ngOnInit() {
    if(this.editMode)
    {
      this.myChild.autoSave = true;
      this.myChild.refNoValue=this.annId.toString();
      this.myChild.refNoType="ANN";
      this.myChild._userId=this.currentuser.employeeId;
    }
  }
  addnew() {
    this.IsSubmit =true;
   
    this.model.createUser = this.currentuser.employeeId;
    this.model.createUserId = this.currentuser.employeeId;
    this.model.contents = this.areacontent.contents;
    this.model.expireDate = this.bsValue;
    if (this.mymultipleSelect) 
    {
      var arr = new Array;
      this.mymultipleSelect.value.forEach(element => {
        arr.push(element.id);
      });
      this.model.relsubsidiarys = arr.join();
    }
    if(!this.editMode)
    {
      this.announceService.create(this.model).subscribe(
        data => {
          let doc: any = {};
          doc.employeeId = this.currentuser.employeeId;
          doc.refNoValue = data["payload"];
          doc.IDR = "ANN";
          this.myChild.SaveFile(doc).subscribe(
            data => {
            },
            error => {
              alert(error.message);
            }
          );
          this.reloadGrid.emit(null);
          this.bsModalRef.hide();
          this.toastr.success('Save Announcement', 'Success!');
          this.IsSubmit =false;
        },
        error => {
        }
      )
    }
    else
    {
     
      this.model.updateUser = this.currentuser.employeeId;
      this.announceService.update(this.model).subscribe(
        data => {
          let doc: any = {};
          doc.employeeId = this.currentuser.employeeId;
          doc.refNoValue = data["payload"];
          doc.IDR = "ANN";
          this.myChild.SaveFile(doc).subscribe(
            data => {
            },
            error => {
              alert(error.message);
            }
          );
          this.reloadGrid.emit(null);
          this.bsModalRef.hide();
          this.toastr.success('Update Announcement', 'Success!');
          this.IsSubmit =false;
        },
        error => {
        }
      )
    }
  }
  keyupHandlerFunction(event) {
    this.areacontent.contents = event;
  }
  downloadFile(docNo) {
    this.fileSvc.downloadFile(docNo);
  }
}
