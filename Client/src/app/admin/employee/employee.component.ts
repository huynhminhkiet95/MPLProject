import { Component, ViewChild, EventEmitter, Output, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { SSOCommonService, EmployeeService } from '../../_services/index';
import { BsModalRef, ModalDirective, BsModalService } from 'ngx-bootstrap';
import { _const } from '../../_helpers/constants';
import { BasePopupComponent } from '../../_directives/base.popup.component';
declare var AdminLTE: any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  moduleId: module.id.toString()
})
export class EmployeeComponent extends BasePopupComponent {

  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  @ViewChild('template') childModal: TemplateRef<any>;
  searchModel: any = {};
  model: any = {};
  listusers: any = [];
  genders: any[];
  modalId = "hoplaModal";
  modalTitle = "Add new";
  loading = false;
  title = "Employee Search";
  listServiceTypes: any = [];
  dataSource: any = {};
  modalRef: BsModalRef;

  @Output() viewDetailUser: EventEmitter<any> = new EventEmitter();

  constructor(public bsModalRef: BsModalRef
    , public router: Router
    , public modalService: BsModalService
    , private empSvc: EmployeeService
    , private ssoCommonSvc: SSOCommonService
    , public route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {

    this.openModal(this.childModal);
    this.getSubsidiaries();

    this.searchModel = {
      employeeName: "",
      mobile: "",
      subsidary: "",
      division: "",
      department: ""
    }
    this.searchModel.employeeName = this.route.params['_value'].id == 'undefined' ? "" : this.route.params['_value'].id;
    AdminLTE.init();
    
    if (this.searchModel.employeeName != '')
      this.search();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {
        class: 'gray modal-lg', backdrop: true,
        ignoreBackdropClick: true, keyboard: false
      })
    );
  }

  close() {
    this.modalRef.hide();
    this.router.navigate([{ outlets: { modal: null } }]);
  }

  search() {
    this.empSvc.search(this.searchModel).subscribe(
      data => {
        this.dataSource = data[this.payLoad];
      }
    );
  }

  rowClickEvent(data) {
    this.viewDetailUser.emit(data);
  }

  private getSubsidiaries() {
    this.ssoCommonSvc.getSubsidiaries().subscribe(
      data => {
        this.listServiceTypes = data[this.payLoad];
      }
    );
  }
}