import { Component, OnInit, ViewChild } from '@angular/core';
import { TinyEditorComponent } from '../../../_directives';
import { EcontracttemplateService } from '../../../_services/econtracttemplate.service';
import { BaseComponent } from '../../../_directives/base.component';
import { Router } from '@angular/router';
declare var AdminLTE: any;

@Component({
  selector: 'app-template-contract',
  templateUrl: './template-contract.component.html',
  styleUrls: ['./template-contract.component.css']
})
export class TemplateContractComponent extends BaseComponent {
  @ViewChild(TinyEditorComponent)
  private myEditor: TinyEditorComponent;

  
  dataSource:any;
  constructor(
    public econtracttemplateService: EcontracttemplateService,
    public router: Router
  ) { 
    super(router);
  }

  ngOnInit() {
    AdminLTE.init();
    this.getAll();
  }
  getAll()
  {
    this.econtracttemplateService.getAll().subscribe(
      data=>{
        this.dataSource = data["payload"];
      }
    );
    
  }

  openTemplate(data)
  {
    this.router.navigate(['intranet/administrator/templatecontract/'+ data.eContractType]);
  }
  
}
