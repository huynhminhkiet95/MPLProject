import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BaseComponent } from '../../../_directives/base.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../_services';
import { AssetsmovementService } from '../../../_services/assetsmovement.service';

@Component({
  selector: 'app-employee-asset-movement-popup',
  templateUrl: './employee-asset-movement-popup.component.html',
  styleUrls: ['./employee-asset-movement-popup.component.css']
})
export class EmployeeAssetMovementPopupComponent extends BaseComponent {
  dataSource:any = [];
  constructor(
    public bsModalRef: BsModalRef,
    router:Router,
    private languageSvc: CommonService,
    private assetsMovementSvc: AssetsmovementService,
    public route:ActivatedRoute,
    private modalService: BsModalService
  ) { 
    super(router);
    modalService.config["initialState"].model
  }

  ngOnInit() {
    let searchModel = {
      PurchaseDateF: "2010/02/01",
      PurchaseDateT: this.languageSvc.getcurrentdate("YYYYMMDD"),
      AssetCode: "",
      AssetGroup: "",
      Division: "",
      assignedEmployee: this.modalService.config["initialState"].EmployeeId,
      dateMode: "handover",
      Brand: "",
      SerialNo: "",
      employeeId: 1,
      status: "",
      userId: 1,
    }
    this.assetsMovementSvc.search(searchModel).subscribe(
      data => {
        this.dataSource = data["payload"].filter(m => m.returnDate == null);
      }
    );
  }

}
