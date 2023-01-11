import { Component, OnInit, ViewChild, style, state, trigger, animate, transition } from '@angular/core';
import { BaseComponent } from '../../../../_directives/base.component';
import { Router, ActivatedRoute } from '@angular/router';
import { EcontracttemplateService } from '../../../../_services/econtracttemplate.service';
import { environment } from '../../../../../environments/environment';
import { TinyEditorComponent } from '../../../../_directives';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TemplateContractCompareComponent } from '../template-contract-compare/template-contract-compare.component';
declare var AdminLTE: any;
declare var tinymce: any;
import { confirm } from 'devextreme/ui/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-template-contract-detail',
  templateUrl: './template-contract-detail.component.html',
  styleUrls: ['./template-contract-detail.component.css'],
  animations: [
    trigger('toggleHeight', [
        state('hide', style({
            height: '0',
            opacity: '0',
            display:'none'
        })),
        state('show', style({
            height: '*',
            opacity: '1'
        })),
        transition('hide => show', animate('1100ms ease-in')),
        transition('show => hide', animate('1100ms ease-out'))
    ])
]
})
export class TemplateContractDetailComponent extends BaseComponent {
  areacontent: any = {};
  model:any = {};
  isToggle:string = "hide";
  @ViewChild(TinyEditorComponent)
  private myEditor: TinyEditorComponent;
  bsModalRef: BsModalRef;
  oldDocument:string;
  
  constructor(
    router: Router,
    private route: ActivatedRoute,
    public econtracttemplateService: EcontracttemplateService,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { 
    super(router);
    this.route.params["_value"].id;
   
  }

   ngOnInit()  {
    AdminLTE.init();
    this.getById();
  }

  keyupHandlerFunction(event) {
    this.areacontent.contents = event;
  }
   getById()
  {
     this.econtracttemplateService.getById(this.route.params["_value"].id).subscribe(
      data=>{
        this.model.contents =  data["payload"].eContractTemplate;
        this.oldDocument = data["payload"].eContractTemplate;
        this.myEditor.editor.setContent(this.model.contents);
       
      }
    )
  }
  toggle()
  {

  }


  toggleNavigationSub() 
  {
    this.isToggle = (this.isToggle === 'hide' ? 'show' : 'hide');
  }
  openModal()
  {
      // console.log("newDocument",this.model.contents)
   
    let model:any ={};
    var result = confirm("Are you sure update this template?", 'Confirm update');

    model.eContractType = this.route.params["_value"].id;
    model.eContractTemplate = this.model.contents;
    result.done((dialogResult: any) => {
      if (dialogResult) {
        this.econtracttemplateService.update(model).subscribe(data => {
          if (data["payload"] > 0) {
            this.toastr.success("Update Template successfully","Template Contract");

          }

        });
      }
    })
    
    
    // const initialState = {
    //   oldDocument: this.oldDocument,
    //   newDocument: this.model.contents
    // };
    // console.log("oldDocument",this.oldDocument)
    // console.log("newDocument",this.model.contents)
    // this.bsModalRef = this.modalService.show(TemplateContractCompareComponent, {
    //   class: 'modal-lg', backdrop: true,
    //   ignoreBackdropClick: true,initialState
    // });
  }
}
