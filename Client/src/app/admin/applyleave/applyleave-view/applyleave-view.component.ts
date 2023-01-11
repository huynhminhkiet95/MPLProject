import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router, Route, ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { ApplyLeaveService } from '../../../_services';
@Component({
  selector: 'app-applyleave-view',
  templateUrl: './applyleave-view.component.html',
  styleUrls: ['./applyleave-view.component.css']
})
export class ApplyleaveViewComponent implements OnInit {
  @ViewChild('template') childModal: TemplateRef<any>;
  languages: any = [];
  model: any = {};
  title = "Application Leave";
  dataSource: any = [];
  modalRef: BsModalRef;
  lvNo: string;
  constructor(
    private modalService: BsModalService,
     public bsModalRef: BsModalRef,
     public router: Router, public leaveService: ApplyLeaveService
    ,private route: ActivatedRoute) {
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
  }

  ngOnInit() {
    var currentuser =JSON.parse(localStorage.getItem('currentUser')) || {};
    this.lvNo = this.route.params['_value'].id;
    this.openModal(this.childModal);
    this.leaveService.getById(currentuser.employeeId, this.lvNo).subscribe(
      data => {
        var result = data["payload"];
       this.model=result;
       this.dataSource=result.hlvLeaveDetails;
      }
    )
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {
        class: 'gray modal-lg', backdrop: true,
        ignoreBackdropClick: true,keyboard:false 
      })
    );
  }
  close() {
    this.modalRef.hide();
    this.router.navigate([{ outlets: { modal: null } }]);
    //this.router.navigate(['intranet/leaves/']);
  }
}
