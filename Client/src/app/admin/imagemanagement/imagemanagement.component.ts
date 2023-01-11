import { Component } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { CommonService } from '../../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { ImagemanagementPopupComponent } from './imagemanagement-popup/imagemanagement-popup.component';
import { ImagemanagementPopupImageDetailComponent } from './imagemanagement-popup-image-detail/imagemanagement-popup-image-detail.component';
import { BaseComponent } from '../../_directives/base.component';
import * as moment from 'moment';
declare var AdminLTE: any;


@Component({
  selector: 'app-imagemanagement',
  templateUrl: './imagemanagement.component.html',
  styleUrls: ['./imagemanagement.component.css']
})
export class ImagemanagementComponent extends BaseComponent {

  title = "Gallerys";
  listTypes: any = [];
  bsModalRef: BsModalRef;
  dataSource: any = [];
  linkImage:string;
  id:number;
  constructor(
    private modalService: BsModalService, 
    private commonSvc: CommonService,
    public router: Router,
    public route: ActivatedRoute,
    public commonsv : CommonService
    ) {
    super(router);    
  }
  searchModel: any = {
    Subject: '',
    Type: '',
    CreatedTo:new Date(),
    CreatedFrom:moment().subtract(3, 'months')
  };
  ngOnInit() {
    AdminLTE.init();

    this.getStdcodes();
    
    this.search();
  }

  getStdcodes() {
    this.commonSvc.getStdcodesByCode('GALLERY').subscribe(
      data => {
        this.listTypes = data["payload"];
      }
    );

  }
  openModalWithComponent() {
    this.bsModalRef = this.modalService.show(ImagemanagementPopupComponent, {
      class: 'modal-lg', backdrop: true,
      ignoreBackdropClick: true,
    });
    this.bsModalRef.content.reloadGrid.take(1).subscribe(this.search.bind(this));



  }
  search() {
    this.searchModel.Subject;
    this.commonSvc.gallerys_get(this.searchModel).subscribe(
      data => {
        this.dataSource = data["payload"];
      }
    )
  }
  showmodal(id: any,title: any)
  {
    const initialState = {
      id: id,
      title:title
    };
    this.bsModalRef = this.modalService.show(ImagemanagementPopupImageDetailComponent, {
      class: 'modal-lg',initialState
    });
  }
  
}
