import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { } from 'jquery';
import { IdRequestService } from '../../../_services/index'
import { FileuploadComponent } from '../../../_directives/fileupload/fileupload.component';
import { BaseComponent } from '../../../_directives/base.component';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import { Router } from '@angular/router';
import { BasePopupComponent } from '../../../_directives/base.popup.component';
@Component({
  selector: 'app-idrequest-add',
  templateUrl: './idrequest-add.component.html',
  styleUrls: ['./idrequest-add.component.css'],

})
export class IdrequestAddComponent extends BasePopupComponent {
  model: any = {};
  existedUserId = "1";
  title = "";
  listGender = [];
  listIDServices = [];
  listDepartments = [{ id: 'IT-INFRA', name: 'IT Infrastructure' }, { id: 'IT-SW', name: 'IT Software' }, { id: 'IT-PRJ', name: 'IT Project' }];
  minDate:Date = new Date(2017, 5, 10);
  maxDate = new Date(2018, 9, 15);
  bsValue: Date = new Date();
  bsRangeValue: any = [new Date(2017, 7, 4), new Date(2017, 7, 20)];
  languages: any = [];
  @ViewChild(FileuploadComponent)
  private myChild: FileuploadComponent;
  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()
  constructor(
    public bsModalRef: BsModalRef,
    public idrequestService: IdRequestService,
    public toastr: ToastrService,
    public router:Router) {
    super();
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
  }

  ngOnInit() {
    this.model.existedUserId = "1";

  }
  addnew() {
    //
    this.IsSubmit = true;
    var currentuser = JSON.parse(localStorage.getItem('currentUser')) || {};
    this.model.SubsidiaryId = currentuser.subsidiaryId;
    this.model.CreateUser = currentuser.employeeId;
    this.model.DateofJoin = this.bsValue;
    this.model.employeeName = this.model.firstname + '' + this.model.lastName;
    this.idrequestService.create(this.model).subscribe(
      data => {
        if (data["success"] === true) {
          this.toastr.success('Save ID Request', 'Success!');
          //Save document if have
          let doc: any = {};
          doc.employeeId = currentuser.employeeId;
          doc.refNoValue = data["payload"].idrNo;
          doc.IDR = "IDR";
          this.myChild.SaveFile(doc);
          this.reloadGrid.emit(null);
          this.bsModalRef.hide();
          this.IsSubmit = false;
        }
      },
      error => {
        this.toastr.error('Save ID Request', error["message"]);
      }
    );
  }
  refreshImages(event) {

  }

}
