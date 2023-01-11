import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../_directives/base.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detailcategory',
  templateUrl: './detailcategory.component.html',
  styleUrls: ['./detailcategory.component.css']
})
export class DetailcategoryComponent extends BaseComponent {
  title="Gallery";
  constructor(public router: Router,
    public route : ActivatedRoute) {
    super(router);
  }

  ngOnInit() {
   
  }

}
