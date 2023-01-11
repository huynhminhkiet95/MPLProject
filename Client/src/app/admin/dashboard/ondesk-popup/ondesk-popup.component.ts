import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService, ApplyLeaveService } from '../../../_services';
import * as moment from 'moment';
@Component({
  selector: 'app-ondesk-popup',
  templateUrl: './ondesk-popup.component.html',
  styleUrls: ['./ondesk-popup.component.css']
})
export class OndeskPopupComponent implements OnInit {
  @ViewChild('template') childModal: TemplateRef<any>;

  title = "On Desk";
  languages: any = [];
  currentUser: any = [];
  searchModel: any = {};
  modalRef: BsModalRef;
  dataSource: any = {};
  isTotal:boolean = false;
  isOn:boolean = false;
  isOff:boolean = false;
  leaveOndesk:any = {};
  constructor(
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private router: Router,
    private employsv: EmployeeService,
    public route: ActivatedRoute,
    private svleave :ApplyLeaveService
  ) {
    this.languages = JSON.parse(localStorage.getItem('languages')) || {};
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  }

  ngOnInit() {
    this.openModal(this.childModal);
    this.title = (this.route.params['_value'].id).toUpperCase();
    this.searchOndesk(this.currentUser.divisionCode, this.route.params['_value'].id);
    this.getOndesk();
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
  }

  checked(event) {
    var filterType = (event.currentTarget.nextSibling.data).split('(')[0];;
    this.searchOndesk(this.currentUser.divisionCode, filterType)
  }

  searchOndesk(division: string, filterType: string) {
    this.title = (filterType).toUpperCase();
    this.isTotal = filterType == 'total' ? true: false;
    this.isOn = filterType == 'on' ? true: false;
    this.isOff = filterType == 'off' ? true: false;
    this.employsv.searchOndesk(division, filterType).subscribe(
      data => {
        this.dataSource = data["payload"];
      }
    )
  }
  getOndesk()
  {
    let model = {
      "LDateF": moment().startOf('week').format('YYYY/MM/DD'),
      "LDateT": moment().endOf('week').format('YYYY/MM/DD'),
      "Division": this.currentUser.divisionCode,
    }
    this.svleave.getDivisionleave(model).subscribe(
      data => {
      
        this.leaveOndesk=data["payload"].leaveDesk;
      },
      error => {
      }
    )
  }
}

