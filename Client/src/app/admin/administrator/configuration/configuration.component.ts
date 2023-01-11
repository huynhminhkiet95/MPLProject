import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../_directives/base.component';
import { BasePopupComponent } from '../../../_directives/base.popup.component';
declare var AdminLTE: any
@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent extends BasePopupComponent {

  constructor(  public router: Router,) {
    super();
  }

  ngOnInit() {
    AdminLTE.init();
  }

}
