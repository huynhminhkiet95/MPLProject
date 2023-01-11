import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BaseComponent } from '../../../_directives/base.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ContractService } from '../../../_services/contract.service';

@Component({
  selector: 'app-employee-contract',
  templateUrl: './employee-contract.component.html',
  styleUrls: ['./employee-contract.component.css']
})

export class EmployeeContractComponent extends BaseComponent {
  dataSource: any = [];

  constructor(
    public bsModalRef: BsModalRef
    , public router: Router
    , private contractSvc: ContractService
    , public route: ActivatedRoute
    , private modalService: BsModalService
  ) {
    super(router);
    modalService.config["initialState"].model;
  }

  ngOnInit() {
    let searchModel = {
      DateF: "2019-05-29",
      DateT: "2019-06-28",
      EmployeeId: this.modalService.config["initialState"].EmployeeId,
      IsCheckDate: false,
      SkipRecord: 0,
      TakeRecord: 12,
      dateFrom: "2019-05-29T02:13:47.764Z",
      dateTo: "2019-06-28T02:13:47.763Z"
    }

    this.contractSvc.search(searchModel).subscribe(
      data => {
        this.dataSource = data[this.payLoad].filter(m => m.returnDate == null);
      }
    );
  }
}
