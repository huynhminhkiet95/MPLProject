import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EmployeeService } from '../../../_services';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-check-in-out-detail',
  templateUrl: './check-in-out-detail.component.html',
  styleUrls: ['./check-in-out-detail.component.css']
})
export class CheckInOutDetailComponent implements OnInit {
  dataSource: any = {};
  languages: any = [];
  currentuser: any = {};
  title: any;
  
  constructor(
    public bsModalRef: BsModalRef,
    public employeesv: EmployeeService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
    this.dataSource=modalService.config["initialState"].data;
    this.title=modalService.config["initialState"].title;
  }

  ngOnInit() {
  }
   
}
