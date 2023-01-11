import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from '../../../_services';
import { FileuploadComponent } from '../../../_directives';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-imagemanagement-popup',
  templateUrl: './imagemanagement-popup.component.html',
  styleUrls: ['./imagemanagement-popup.component.css']
})
export class ImagemanagementPopupComponent implements OnInit {
  title = "";
  languages: any = [];
  currentuser: any = {};
  model: any = {};
  listTypes: any = [];
  @ViewChild(FileuploadComponent)
  private myChild: FileuploadComponent;
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()
  bsValue  = new Date();
  bsExpiredate = new Date();
  files: File[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    private commonSvc: CommonService,
    private toastr: ToastrService,

  ) {
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
    this.currentuser = JSON.parse(localStorage.getItem('currentUser')) || {};
  }

  ngOnInit() {
    this.getStdcodes();
  }
  getStdcodes() {
    this.commonSvc.getStdcodesByCode('GALLERY').subscribe(
      data => {
        this.listTypes = data["payload"];
      }
    );

  }
  addnew() 
  {
    this.model.Expiredate = this.bsExpiredate;
    this.model.CreateUser = this.currentuser.employeeId;
    if(!this.myChild.isValidFiles())
    {
      this.toastr.warning(this.myChild.errors[0],"Error");
      return;
    }
    this.commonSvc.gallerys_save(this.model).subscribe(
      data => {
        if (data["payload"] > 0) {

          let doc: any = {};
          doc.employeeId = this.currentuser.employeeId;
          doc.refNoValue = data["payload"];
          doc.IDR = "GAL";
          this.myChild.SaveFile(doc).subscribe(
            data => {

            },
            error => {
              alert(error.message);
            }
          );

          this.toastr.success('Upload File Success', 'Success!');
          this.reloadGrid.emit(null);
          this.bsModalRef.hide();
        }
      },
      error => {

      }
    )
  }
}
