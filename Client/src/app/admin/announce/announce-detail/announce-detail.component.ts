import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AnnounceService, FileService } from '../../../_services/index';
import { FileuploadComponent } from '../../../_directives/fileupload/fileupload.component';
import { TinyEditorComponent, SelectMultipleComponent } from '../../../_directives';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import { Router } from '@angular/router';
import { BasePopupComponent } from '../../../_directives/base.popup.component';

@Component({
  selector: 'app-announce-detail',
  templateUrl: './announce-detail.component.html',
  styleUrls: ['./announce-detail.component.css']
})
export class AnnounceDetailComponent extends BasePopupComponent {
  @ViewChild(FileuploadComponent)
  private myChild: FileuploadComponent;
  @ViewChild(TinyEditorComponent)
  private myEditor: TinyEditorComponent;
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()
  @ViewChild("subsidiary") public mymultipleSelect: SelectMultipleComponent;
  @ViewChild("location") public location: SelectMultipleComponent;
  model: any = {};
  @Input() AnnId: number;
  public title: string;
  public list: any[] = [];
  annId: number = 0;
  areacontent: any = {};
  listSubsidiaries: any = [];
  listServiceTypes: any = [];
  listWorkLocs :any=[];
  listDivision:any=[];
  editlabel: string = "Submit";
  bsValue: any = {};
  minDate = new Date();
  attachments: any = [];
  languages: any = [];
  editMode: any = false;
  currentuser:any={};
  _isAdmin=false;
  constructor(public bsModalRef: BsModalRef,
    private announceService: AnnounceService,
    private fileSvc: FileService,
    public toastr: ToastrService,
    public router:Router
  ) {
    super();
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
    this.currentuser = JSON.parse(localStorage.getItem('currentUser')) || {};
  }
  ngOnInit() {
    this.bsValue=new Date();
    if(this.currentuser.roleId=='5A6869E0-1C3D-11E8-ACCF-0ED5F89F718B')
    {
      this._isAdmin=true;
    }
  }
  addnew() {
    this.IsSubmit =true;
    this.model.createUser = this.currentuser.employeeId;
    this.model.contents = this.areacontent.contents;
    this.model.createUserId = this.currentuser.employeeId;
    this.model.expireDate = this.bsValue;
    

    if (this.mymultipleSelect) 
    {
      var arr = new Array;
      this.mymultipleSelect.value.forEach(element => {
        arr.push(element.id);
      });
      this.model.relsubsidiarys = arr.join();
    }
    if (this.location) 
    {
      var arr = new Array;
      this.location.value.forEach(element => {
        arr.push(element.id);
      });
      this.model.allowlocation = arr.join();
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
          this.IsSubmit = false;
        },
        error => {
        },
      )
    }
    else
    {
      this.model.updateUser = this.currentuser.employeeId;
      this.model.expireDate = this.bsValue;
      this.announceService.update(this.model).subscribe(
        data => {
          let doc: any = {};
          doc.employeeId = this.currentuser.employeeId;
          doc.refNoValue = this.model.annId;
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
          this.IsSubmit = false;
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
