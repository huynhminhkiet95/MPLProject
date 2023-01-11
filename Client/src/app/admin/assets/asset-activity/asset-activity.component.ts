import { Component, ViewChild, TemplateRef } from '@angular/core';
import { BaseComponent } from '../../../_directives/base.component'
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, ModalDirective, BsModalService } from 'ngx-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import { AssetsmovementService } from '../../../_services/assetsmovement.service';
import { CommonService, EmployeeService, SSOCommonService } from '../../../_services';
import { Globalconst } from '../../../_helpers';
import { AssetActivityService } from '../../../_services/asset-activity.service';
import * as moment from 'moment';
import { AssetActivityDetailComponent } from './asset-activity-detail/asset-activity-detail.component';
import { confirm } from 'devextreme/ui/dialog';
import { _const } from '../../../_helpers/constants';

declare var AdminLTE: any;
@Component({
  selector: 'app-asset-activity',
  templateUrl: './asset-activity.component.html',
  styleUrls: ['./asset-activity.component.css']
})
export class AssetActivityComponent extends BaseComponent {
  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  @ViewChild('childModal') childModal: ModalDirective;
  bsModalRef: BsModalRef;
  template: TemplateRef<any>;
  searchModel: any = {};
  model: any = {};
  listusers: any = [];

  listassetTypes: any = [];
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
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg',
    model: {}
  };
  isExpireDateCheck: boolean = false;

  constructor(public router: Router,
    private modalService: BsModalService,
    public _global: Globalconst,
    private _svcAssetActivity: AssetActivityService,
    private commonSvc: CommonService,
    private ssoCommonSvc: SSOCommonService,
    private assetsMovementSvc: AssetsmovementService,
    private toastr: ToastrService,
    private route: ActivatedRoute

  ) {
    super(router);
  }

  ngOnInit() {
    this.searchModel.SubsidiaryId = this._global._userinfo.subsidiaryId;
    this.searchModel.type = "";
    this.searchModel.group = "";
    this.searchModel.code = "";
    this.searchModel.DivisionId = "";
    this.searchModel.DateT = new Date();
    this.searchModel.DateF = new Date();
    this.searchModel.ExpireDateT = new Date();
    this.searchModel.ExpireDateF = new Date();

    this.getAssetGroups();
    this.getStdcodes();
    this.getDivisions();
    AdminLTE.init();
  }

  getStdcodes() {
    this.commonSvc.getStdcodesByCode(_const.CODE_TYPE.has_activity_type).subscribe(
      data => {
        this.listassetTypes = data[this.payLoad];
      }
    );
  }

  hideChildModal() {
  }

  search() {
    this.searchModel.DateF = moment(this.searchModel.DateF).format('MM/DD/YYYY');
    this.searchModel.DateT = moment(this.searchModel.DateT).format('MM/DD/YYYY');
    this.searchModel.ExpireDateT = moment(this.searchModel.ExpireDateT).format("MM-DD-YYYY");
    this.searchModel.ExpireDateF = moment(this.searchModel.ExpireDateF).format("MM-DD-YYYY");

    if (this.searchModel.isExpireDateCheck == true) {
      this.searchModel.searchByExpDate = 'Y';
    } else {
      this.searchModel.searchByExpDate = '';
    }

    this._svcAssetActivity.Search(this.searchModel).subscribe(
      data => {
        this.dataSource = data[this.payLoad];
      }
    );
  }

  addnew() {
    this.config.model = {};
    this.bsModalRef = this.modalService.show(AssetActivityDetailComponent, this.config);
    this.bsModalRef.content.activityTypes = this.listassetTypes;
    this.bsModalRef.content.editMode = false;
    this.bsModalRef.content.assetGroups = this.assetGroups;
    this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
  }

  viewDetail(data: any) {
    this.config.model = data;
    this.bsModalRef = this.modalService.show(AssetActivityDetailComponent, this.config);
    this.bsModalRef.content.activityTypes = this.listassetTypes;
    this.bsModalRef.content.assetGroups = this.assetGroups;
    this.bsModalRef.content.editMode = true;
    this.bsModalRef.content.model = data;
    this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));
  }

  delete(id) {
    var result = confirm("Are you sure delete this row?", 'Confirm delete');
    result.done((dialogResult: any) => {
      if (dialogResult) {
        this._svcAssetActivity.Delete(id).subscribe(
          data => {
            this.toastr.success("Delete Sucessfull", "Delete Asset Activity");
            this.search();
          }
        );
      }
    })
  }

  private getAssetGroups() {
    this.assetsMovementSvc.getAssetGroups().subscribe(
      data => {
        this.assetGroups = data[this.payLoad];
      },
      error => {
      }
    );
  }

  private getDivisions() {
    this.ssoCommonSvc.getDivisions().subscribe(
      data => {
        this.listDivision = data[this.payLoad];

        if (Object.keys(this.route.snapshot["queryParams"]).length > 0) {
          this.searchModel.division = this.route.snapshot.queryParams["division"];
        }
      }
    );
  }
}