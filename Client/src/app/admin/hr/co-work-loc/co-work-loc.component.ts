import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../_directives/base.component';
import { COWorkLocService } from '../../../_services/co-work-loc.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CoWorkLocPopupComponent } from './co-work-loc-popup/co-work-loc-popup.component';
import { CoWorkLocModel } from '../../../_models/coWorkLocModel';

declare var AdminLTE: any;

@Component({
  selector: 'app-co-work-loc',
  templateUrl: './co-work-loc.component.html',
  styleUrls: ['./co-work-loc.component.css']
})
export class COWorkLocComponent extends BaseComponent {
  dataSource: any = [];
  userGroupModel: any = {};

  @ViewChild("gridContainer") dataGrid: DxDataGridComponent;
  model = new CoWorkLocModel;
  bsRangeValue: any = [];
  bsModalRef: BsModalRef;

  constructor(
    public router: Router,
    public _coWorkLocService: COWorkLocService,
    private toastr: ToastrService,
    private modalService: BsModalService) {
    super(router);
  }

  ngOnInit() {
    AdminLTE.init();
    this.getCoWorkLocs();
  }

  getCoWorkLocs() {
    this._coWorkLocService.getAllCoWorkLoc("").subscribe(
      data => {
        this.dataSource = data["payload"];
      })
  }

  openCOWorkLocPopup(model, title) {
    let data = Object.assign({}, model);

    const initialState = {
      model: data,
      title: title
    };

    this.bsModalRef = this.modalService.show(CoWorkLocPopupComponent, Object.assign({}, { initialState, class: 'modal-lg', ignoreBackdropClick: true }));
    this.bsModalRef.content.reloadGrid.subscribe(this.getCoWorkLocs.bind(this));
  }

  delete(event){
    let deleteModel = {
      "Id" : 0
    }
    if (event.data && event.data.id){
      deleteModel.Id = event.data.id;
    }
    this._coWorkLocService.deleteCoWorkLoc(deleteModel).subscribe(
      data => {
        if (data["sucess"] = true) {
          this.toastr.success("Delete successfuly", "Delete CO_Work Loc");
          this.getCoWorkLocs();
        }
        else{
          this.toastr.error("Error: Cannot delete this working location", "Delete CO_Work Loc");
        }       
      }, error => {
        this.toastr.error(error["message"] ? error["message"] : error);
      })
  }

}
