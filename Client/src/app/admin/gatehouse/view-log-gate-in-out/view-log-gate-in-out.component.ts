import { Component } from '@angular/core';
import { ViewLogGateInOutService } from '../../../_services/view-log-gate-in-out.service';
import { ViewLogGateModel } from '../../../_models/baoVeScanDto';
import * as moment from 'moment';
import { BaseComponent } from '../../../_directives/base.component';
import { Router } from '@angular/router';
declare var AdminLTE: any;
@Component({
  selector: 'app-view-log-gate-in-out',
  templateUrl: './view-log-gate-in-out.component.html',
  styleUrls: ['./view-log-gate-in-out.component.css']
})
export class ViewLogGateInOutComponent extends BaseComponent {
  dataSource: any = [];
  searchModel: ViewLogGateModel = new ViewLogGateModel();
  bsRangeValue: any = [];

  types: any = ["In", "Out"];
  
  constructor(private _viewLogService: ViewLogGateInOutService,
              public router: Router) {
    super(router);
   }

  ngOnInit() {
    AdminLTE.init()
  }

  search() {
    this.searchModel.dateF = moment(this.searchModel.dateF).format("MM-DD-YYYY");
    this.searchModel.dateT = moment(this.searchModel.dateT).format("MM-DD-YYYY");

    this._viewLogService.search(this.searchModel).subscribe(
      data => {
        this.dataSource = data["payload"];
      console.log(this.dataSource);
      
    });
  }
}
