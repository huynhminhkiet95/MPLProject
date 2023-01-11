import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../../_directives/base.component';
import { Globalconst } from '../../../../_helpers';

@Component({
  selector: 'app-template-contract-compare.component',
  templateUrl: './template-contract-compare.component.html',
  styleUrls: ['./template-contract-compare.component.css']
})
export class TemplateContractCompareComponent implements OnInit {
  
  constructor(public router:Router,
    public modalService: BsModalService,
    public _global: Globalconst,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    public bsModalRef: BsModalRef,
    ) {
  }
  model:any={};
  ngOnInit() {
    this.model = this.modalService.config["initialState"];
  }

}
