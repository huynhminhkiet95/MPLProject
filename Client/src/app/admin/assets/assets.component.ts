import { Component, OnInit, ViewChild, EventEmitter, Output, TemplateRef } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { CommonService, UserService, EmployeeService, SSOCommonService } from '../../_services/index'
import * as moment from 'moment';
import 'rxjs/add/operator/take';
import { Globalconst } from '../../_helpers';
import { AssetsmovementService } from '../../_services/assetsmovement.service';
import { AssetsPopupComponent } from './assets-popup/assets-popup.component';
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../_directives/base.component';
import { confirm } from 'devextreme/ui/dialog';
import { _const } from '../../_helpers/constants';

declare var AdminLTE: any;
@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent extends BaseComponent {

  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  @ViewChild('childModal') childModal: ModalDirective;

  bsModalRef: BsModalRef;
  template: TemplateRef<any>;
  searchModel: any = {};
  model: any = {};
  listusers: any = [];
  genders: any[];
  modalTitle = "Add new";
  loading = false;
  title = "Assets";
  listServiceTypes: any = [];
  assetGroups: any = [];
  dataSource: any = [];
  bsValue: Date = new Date();
  bsRangeValue: any = [];
  attachments: any = [];
  listDivision: any = [];
  currentDate = new Date();
  listAssets: any = [];
  subsidiaryName: string = '';
  modalRef: BsModalRef;
  EmployeeIdSelected: number;
  config = {
    backdrop: false,
    ignoreBackdropClick: false
  };
  @Output() viewDetailUser: EventEmitter<any> = new EventEmitter();

  constructor(
    public router: Router,
    private modalService: BsModalService,
    public _global: Globalconst,
    private empSver: EmployeeService,
    private ssoCommonSvc: SSOCommonService,
    private assetsMovementSvc: AssetsmovementService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    super(router);
  }

  ngOnInit() {
    AdminLTE.init();
    this.subsidiaryName = this._global._userinfo.subsidiaryName;
    this.bsRangeValue = [new Date(2010, 1, 1), new Date()];
    this.searchModel.status = '';
    this.searchModel.assetGroup = '';
    this.searchModel.assetCode = '';
    this.searchModel.division = '';
    this.searchModel.brand = '';
    this.searchModel.serialNo = '';

    this.getDivisions();
    this.getStdcodes();

    if (Object.keys(this.route.snapshot["queryParams"]).length > 0) {
      this.searchModel.PurchaseDateF = this.route.snapshot.queryParams["PurchaseDateF"];
      this.searchModel.PurchaseDateT = this.route.snapshot.queryParams["PurchaseDateT"];
      this.searchModel.assetCode = this.route.snapshot.queryParams["assetCode"];
      this.searchModel.assetGroup = this.route.snapshot.queryParams["assetGroup"];
      this.searchModel.brand = this.route.snapshot.queryParams["brand"];
      this.searchModel.division = this.route.snapshot.queryParams["division"];
      this.searchModel.serialNo = this.route.snapshot.queryParams["serialNo"];
      this.searchModel.status = this.route.snapshot.queryParams["status"];
      this.searchModel.assignedEmployee = Number(this.route.snapshot.queryParams["assignedEmployee"]);
      this.bsRangeValue = [new Date(this.searchModel.PurchaseDateF), new Date(this.searchModel.PurchaseDateT)];
      this.search();
    }

    this.HideColumn(false);
  }

  search() {
    //this.searchModel.assignedEmployee = this.EmployeeIdSelected == null ? 0 : this.EmployeeIdSelected;
    if (this.bsRangeValue != null && this.bsRangeValue.length == 2) {
      this.searchModel.PurchaseDateF = moment(this.bsRangeValue[0]).format('YYYY/MM/DD');
      this.searchModel.PurchaseDateT = moment(this.bsRangeValue[1]).format('YYYY/MM/DD');
    }
    this.assetsMovementSvc.searchAsesets(this.searchModel).subscribe(
      data => {
        this.dataSource = data[this.payLoad];
        if (this.searchModel.assetGroup == 'DESKTOP' || this.searchModel.assetGroup == 'LAPTOP')
          this.HideColumn(true)
        else {
          this.HideColumn(false);
        }
      }
    );
  }

  getStdcodes() {
    this.assetsMovementSvc.getAssetGroups().subscribe(
      data => {
        this.assetGroups = data[this.payLoad];
      },
      error => {
      }
    );

    let empModel: any = {};
    empModel.EmployeeName = "";
    empModel.Mobile = "";
    empModel.Subsidary = "";
    empModel.Division = "";
    empModel.Department = "";

    this.empSver.search(empModel).subscribe(
      data => {
        this.listusers = data[this.payLoad];
      }
      , error => {
      }
    );

    if (Object.keys(this.route.snapshot["queryParams"]).length > 0)
      this.searchModel.division = this.route.snapshot.queryParams["division"];
  }

  viewDetail(data) {
    this.showChildModal();
  }

  showChildModal(): void {
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  printLabel() {
    if (this.dataSource.length > 0) {

      let popupWinindow;
      let innerContents = document.getElementById("container-print").innerHTML;

      popupWinindow = window.open('', '_blank', 'scrollbars=no,fullscreen=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
      popupWinindow.document.open();
      popupWinindow.document.write('<html><head><style> @page { size: 80mm 24mm } body{margin:0;padding:0;font-family:arial} img{height:16mm}</style></head><body class="receipt" onload="window.print()">' + innerContents + '</body></html>');
      popupWinindow.document.close();
    }
  }

  GetDetail(valueid: any) {
    const initialState = {
      model: valueid,
      title: this.languages.updateworktime
    };
    this.bsModalRef = this.modalService.show(AssetsPopupComponent, {
      class: 'modal-lg', initialState, backdrop: true,
      ignoreBackdropClick: true
    });
    //this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
    this.bsModalRef.content.title = 'Detail Asset';
    this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
  }

  Deleteasset(id: any) {
    var model: any = {};
    model.AssetId = id;
    var result = confirm("Are you sure delete this row?", 'Confirm delete');

    result.done((dialogResult: any) => {
      if (dialogResult) {
        this.assetsMovementSvc.deleteasset(model).subscribe(
          data => {
            var rs = data[this.payLoad];
            if (rs == 1) {
              this.search();
              this.toastr.success("Delete success", "Delete Asset");
            }
            else {
              this.toastr.error("This AssetCode has been registered and cannot be deleted !", "Delete Asset")
            }
          }
        )
      }
    })
  }

  back(id: string) {
    this.router.navigate(['intranet/assets/' + id], { queryParams: this.searchModel })
  }

  HideColumn(isShow: boolean) {
    if (this.dataGrid.instance) {
      this.dataGrid.instance.columnOption("os", "visible", isShow);
      this.dataGrid.instance.columnOption("cpuType", "visible", isShow);
      this.dataGrid.instance.columnOption("cpuModel", "visible", isShow);
      this.dataGrid.instance.columnOption("ramCapacity", "visible", isShow);
      this.dataGrid.instance.columnOption("storageType", "visible", isShow);
      this.dataGrid.instance.columnOption("storageModel", "visible", isShow);
      this.dataGrid.instance.columnOption("storageCapacity", "visible", isShow);
      this.dataGrid.instance.columnOption("screenSize", "visible", isShow);
      this.dataGrid.instance.columnOption("osLicenseValid", "visible", isShow);
    }
  }

  private getDivisions() {
    this.ssoCommonSvc.getDivisions().subscribe(
      data => {
        this.listDivision = data[this.payLoad];
      }
    );
  }
}