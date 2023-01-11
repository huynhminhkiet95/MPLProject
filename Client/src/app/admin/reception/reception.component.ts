import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.css']
})
export class ReceptionComponent implements OnInit {

  @Output() reloadGrid: EventEmitter<any> = new EventEmitter()

  modalRef: BsModalRef;

  constructor(private modalService: BsModalService,public bsModalRef: BsModalRef,) { }

  ngOnInit() {
    

  }


}
