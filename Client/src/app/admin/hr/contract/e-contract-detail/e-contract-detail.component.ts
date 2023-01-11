import { Component, OnInit, Input, ElementRef, ReflectiveInjector, SystemJsNgModuleLoader, NgModuleFactory } from '@angular/core';
import {ViewChild, ViewContainerRef, ComponentRef, Compiler, ComponentFactory, NgModule, ModuleWithComponentFactories, ComponentFactoryResolver} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ContractService } from '../../../../_services/contract.service';
import { FileService } from '../../../../_services';

// import html2canvas from 'html2canvas'; 
@Component({
  selector: 'app-e-contract-detail',
  template: `
  <div class="modal-header">
      <h4 class="modal-title pull-left">Electronic Contract</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
  </div>
  <div class="modal-body" id="contenttemplate">
       <div [innerHTML]="template"></div>
  </div>

  <div class="modal-footer text-center">
    <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">Close</button>
  </div>

`,
  styleUrls: ['./e-contract-detail.component.css']
})
export class EContractDetailComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;
  template: string ;

  private componentRef: ComponentRef<{}>;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private compiler: Compiler,
    public bsModalRef: BsModalRef,
    public modalService: BsModalService,
    public contractService:ContractService,
    private fileSvc: FileService,
    
    ) {
     
     this.template =  this.modalService.config["initialState"].template;
     

  }
  ngOnInit() {
  
  }
  ngAfterViewInit(): void {

    // this.compileTemplate();
  }
  compileTemplate() {
    let metadata = {
      selector: 'app-e-contract-detail',
      template: this.template
    };

    let factory = this.createComponentFactorySync(this.compiler, metadata, null);

    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    this.componentRef = this.container.createComponent(factory);
    
  }

  private createComponentFactorySync(compiler: Compiler, metadata: Component, componentClass: any): ComponentFactory<any> {
    const cmpClass = componentClass || class RuntimeComponent 
    { 
      name: string = 'Kiet' ;
      old = 18
  
    };
    const decoratedCmp = Component(metadata)(cmpClass);

    @NgModule({ imports: [CommonModule], declarations: [decoratedCmp] })
    class RuntimeComponentModule { }

    let module: ModuleWithComponentFactories<any> = compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule);
    return module.componentFactories.find(f => f.componentType === decoratedCmp);
  }
}
