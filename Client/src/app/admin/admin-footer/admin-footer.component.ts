import { Component, OnInit } from '@angular/core';
import { Globalconst } from '../../_helpers';

@Component({
  selector: 'app-admin-footer',
  templateUrl: './admin-footer.component.html',
  styleUrls: ['./admin-footer.component.css']
})
export class AdminFooterComponent implements OnInit {

  constructor(
    public _global:Globalconst
  ) { }

  ngOnInit() {
  }

}
