import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-imagemanagement-popup-image-detail',
  templateUrl: './imagemanagement-popup-image-detail.component.html',
  styleUrls: ['./imagemanagement-popup-image-detail.component.css']
})
export class ImagemanagementPopupImageDetailComponent implements OnInit {
  title:string;
  id:number;
  constructor(
    public bsModalRef : BsModalRef,
     modalService: BsModalService
  ) { 
    this.id = modalService.config["initialState"].id;
    this.title = modalService.config["initialState"].title;
  }

  ngOnInit() {
  }

}
