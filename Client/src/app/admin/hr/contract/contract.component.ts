import { Component, ViewChild, TemplateRef } from '@angular/core';
import { BaseComponent } from '../../../_directives/base.component';
import { Router } from '@angular/router';
import { ContractService } from '../../../_services/contract.service';
import CustomStore from 'devextreme/data/custom_store';
import { Globalconst } from "../../../_helpers/globalvariable";
import { ToastrService } from 'ngx-toastr';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';
import { EmployeeService, CommonService, FileService, SSOCommonService } from '../../../_services';
import { BaseSearchDto } from '../../../_models/baseSearchDto';
import * as moment from 'moment';
import { confirm } from 'devextreme/ui/dialog';
import { _const } from '../../../_helpers/constants';

declare var AdminLTE: any;
@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})

export class ContractComponent extends BaseComponent {

  bsModalRef: BsModalRef;
  template: TemplateRef<any>;
  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  searchModel: BaseSearchDto = new BaseSearchDto();
  dataSource: any = {};
  listusers: any;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg',
    model: {},
    listusers: this.listusers,
    contractTypes: [],
    listEmployer:[]
  };
  contractTypes: any = [];
  devisions: any;
  departments: any;
  departments2: any;
  listusers2: any;
  listEmployer: any=[];

  constructor(
    public router: Router,
    private _sevice: ContractService,
    private toastr: ToastrService,
    private empSver: EmployeeService,
    private modalService: BsModalService,
    private commonSvc: CommonService,
    private ssoCommonSvc: SSOCommonService,
    public globals: Globalconst,
    public fileSvc: FileService,
  ) {
    super(router);
  }

  ngOnInit() {
    let empModel: any = {};
    empModel.EmployeeName = "";
    empModel.Mobile = "";
    empModel.Subsidary = "";
    empModel.Division = "";
    empModel.Department = "";

    this.getDivisions();
    this.getSubDepts(this.currentuser.subsidiaryId)

    this.commonSvc.getStdcodesByCode(_const.CODE_TYPE.contract_type+',EMPLOYER').subscribe(
      data => {
        this.contractTypes = data[this.payLoad];
        let data1 = data["payload"];
        this.contractTypes = data1.filter(x=> x.codeType=="CONTRACTTYPE");
        this.listEmployer = data1.filter(x=> x.codeType=="EMPLOYER");
      }
    );

    this.empSver.search(empModel).subscribe(
      data => {
        this.listusers = data[this.payLoad];
        this.listusers2 = this.listusers;
      }
      , error => {
      }
    );

    this.dataSource.store = new CustomStore({
      load: (loadOptions) => {
        let that = this;
        this.searchModel.SkipRecord = loadOptions.skip || 0;
        this.searchModel.TakeRecord = loadOptions.take || 12;
        this.searchModel.DateF = moment(this.searchModel.dateFrom).format('YYYY-MM-DD');
        this.searchModel.DateT = moment(this.searchModel.dateTo).format('YYYY-MM-DD');
        if (loadOptions.sort) {
          this.searchModel.SortColumn = loadOptions.sort[0].selector;
          if (loadOptions.sort[0].desc) {
            this.searchModel.SortOrder = ' desc';
          }
        }
        return that._sevice.search(this.searchModel)
          .toPromise()
          .then(res => {
            return {
              data: res[this.payLoad],
              totalCount: res[this.payLoad][0] ? res[this.payLoad][0].totalCount : 0
            }
          }).catch(error => { throw 'Data Loading Error' });
      },
      remove: (key) => {
        let that = this;
        return that._sevice.delete(key)
          .toPromise().then(
            data => {
              if (data['success']) {
                that.toastr.success("Delete Leave sucessfull", "Delete Leave")
                that.dataGrid.instance.refresh();
              }
              else {
                that.toastr.warning("Delete Leave unsucessfull, only new request can be deleted", "Delete Leave")
              }

            }
          );
      },
    });

    AdminLTE.init();
  }

  search() {
    this.dataGrid.instance.refresh();
  }

  addnew() {
    this.config.model = {};
    this.config.listusers = this.listusers;
    this.config.contractTypes = this.contractTypes;
    this.config.listEmployer = this.listEmployer;
    this.bsModalRef = this.modalService.show(ContractDetailComponent, this.config);
    //this.bsModalRef.content.activityTypes = this.listassetTypes;
    this.bsModalRef.content.editMode = false;
    //this.bsModalRef.content.assetGroups = this.assetGroups;
    this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
  }

  viewDetail(data: any) {
    this.config.model = data;
    this.config.listusers = this.listusers;
    this.config.contractTypes = this.contractTypes;
    this.config.listEmployer = this.listEmployer;
    this.bsModalRef = this.modalService.show(ContractDetailComponent, this.config);
    //this.bsModalRef.content.activityTypes = this.listassetTypes;
    //this.bsModalRef.content.assetGroups = this.assetGroups;
    this.bsModalRef.content.editMode = true;
    this.bsModalRef.content.model = data;
    this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
  }

  changedDivision() {

    let divisionCode = this.searchModel.DivisionId;
    if (divisionCode && divisionCode != '') {
      this.departments2 = this.departments.filter(function (x) {
        return x.divisionCode == divisionCode;
      });
      this.searchModel.DepartmentId = null;
      this.changedDept();
    }
    else {
      this.departments2 = this.departments;
    }
  }

  changedDept() {
    let deptCode = this.searchModel.DepartmentId;
    if (deptCode && deptCode != '') {
      this.listusers2 = this.listusers.filter(function (x) {
        return x.deptCode == deptCode;
      });
      this.searchModel.EmployeeId = 0;
    }
    else {
      if (this.searchModel.DivisionId && this.searchModel.DivisionId != '') {
        let division = this.searchModel.DivisionId;
        this.listusers2 = this.listusers.filter(function (x) {
          return x.divisionCode == division;
        });
      }
      else {
        this.listusers2 = this.listusers;
      }
    }
  }

  public DownloadEContractReport(data) {
    this.toastr.info("Downloading...");
    this._sevice.exportPdfById(data.id)
      .subscribe(
        rs => {
          this.toastr.clear();
          this.fileSvc.downloadExcel(rs[this.payLoad], data.employeeName + '_' + moment().format("YYYYMMDDHHmmss") + '.pdf');
        }
      );
  }
  public ViewEContractReport(data) {
    this.toastr.info("Downloading...");
    this._sevice.exportPdfById(data.id)
      .subscribe(
        rs => {
          this.toastr.clear();
          const pdfWindow = window.open('');
          pdfWindow.document.write('<iframe width=\'100%\' height=\'100%\' src=\'data:application/pdf;base64, ' + rs[this.payLoad] + '\'></iframe>');

        }
      );
  }
  delete(model) {
    var result = confirm("Are you sure delete this row?", 'Confirm delete');
    result.done((rs) => {

      if (rs) {
        this._sevice.delete(model).subscribe(data => {
          if (data[this.payLoad] > 0) {
            this.toastr.success("Delete Leave sucessfull", "Delete Contract");
            this.search();
          }
          else {
            this.toastr.error("Delete error", "Delete Contract");
          }
        }, error => {
          this.toastr.error(error.error, "Delete Contract");
        })
      }
    })
  }

  private getDivisions() {
    this.ssoCommonSvc.getDivisions().subscribe(
      data => {
        this.devisions = data[this.payLoad];
      }
    );
  }

  private getSubDepts(sub: string): any {
    this.ssoCommonSvc.getSubDepts(sub).subscribe(
      data => {
        this.departments = data[this.payLoad];
        this.departments2 = this.departments;
      }
    );
  }
}