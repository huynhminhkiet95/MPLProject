import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { BaseComponent } from '../../../_directives/base.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-check-addnew-popup',
  templateUrl: './employee-check-addnew-popup.component.html',
  styleUrls: ['./employee-check-addnew-popup.component.css']
})
export class EmployeeCheckAddnewPopupComponent extends BaseComponent {
  checkEmpList: any = [];

  constructor(
    public router: Router,
    public bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super(router);
    this.checkEmpList = modalService.config["initialState"].checkEmpList;
   }

  ngOnInit() {
  }

}
