import { Component, OnInit, ElementRef, Renderer, Injector, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { CommonService, EmployeeService, SSOCommonService } from '../../_services';
import { Globalconst } from '../../_helpers';
import { environment } from '../../../environments/environment';
import { ModalDirective } from '../../../../node_modules/ngx-bootstrap/modal/modal.directive';
import { _const } from '../../_helpers/constants';
import { BaseComponent } from '../../_directives/base.component';
import { Router } from '@angular/router';
import { isThisSecond } from 'date-fns';

declare var $: any;
declare var AdminLTE: any;
@Component({
  selector: 'app-orgchart',
  templateUrl: './orgchart.component.html',
  styleUrls: ['./orgchart.component.css']
})

export class OrgchartComponent extends BaseComponent {

  @ViewChild('childModal') childModal: ModalDirective;
  loadAPI: Promise<any>;
  searchModel: any = {};
  listSubsidiary = [];
  listEmployee = [];

  constructor(
    public router: Router
    , public elementRef: ElementRef
    , public renderer: Renderer
    , private commonSvc: CommonService
    , public globals: Globalconst
    , private ssoCommonSvc: SSOCommonService
    , private empSvc: EmployeeService
  ) {
    super(router);
  }

  ngAfterContentInit() {
    this.loadAPI = new Promise((resolve) => {
      console.log('resolving promise...');
      this.loadScript();
    });
  }

  ngOnInit() {

    this.getSubsidiaries();
    this.searchModel.subsidary = this.currentuser.subsidiaryId;
    this.search();

    let global = this.renderer.listen(this.elementRef.nativeElement, 'dblclick', (evt) => {
      this.showChildModal();
      let elment = evt.toElement;
      let dataInfo: any = {};
      let value = $(elment).parent('.node').find("input");
      //console.log('Clicking the document', evt);

      if (value.length > 0) {
        dataInfo = JSON.parse(decodeURIComponent(value[0].defaultValue));
        dataInfo.subsidary = this.searchModel.subsidary;
        dataInfo.employeeName = '';
        dataInfo.mobile = '';
        dataInfo.emplStatus= "WORK";
        this.searchModel.devisionDesc = dataInfo.divisionDesc;
        this.searchModel.departmentDesc = dataInfo.departmentDesc;

        this.empSvc.search(dataInfo).subscribe(
          data => {
            this.listEmployee = data[this.payLoad];
          },
          error => {
          }
        );
      }
    })

    AdminLTE.init();
  }

  showChildModal(): void {
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  Show() {
    alert();
  }

  search() {
    let that = this;
    var nodeTemplate = function (data) {
      let info: any = {};
      info.department = data.departmentCode;
      info.division = data.divisionCode;
      info.departmentDesc = data.departmentDesc;
      info.divisionDesc = data.divisionDesc;
      info.name = data.name;
      info.title = data.title;
      info.level = data.level;
      let datajson = encodeURIComponent(JSON.stringify(info));
      var html = '<div  class="title"><i></i>' + data.name + '</div><div class="content">' + data.title + '</div>' + '<input type="hidden" value="' + datajson + '"/>';
      return html;
    };

    this.commonSvc.getOrgChart(this.searchModel.subsidary,this.globals._userinfo.employeeId).subscribe(
      data => {
        let levelshow = 4;
        if(data[this.payLoad].children.length>1)
          levelshow = 2

        $('#chart-container').html('');
        $('#chart-container').orgchart({
          'data': data[this.payLoad],
          'visibleLevel': levelshow,
          'nodeContent': 'title',
          'parentNodeSymbol': '',
          'nodeTemplate': nodeTemplate,
          //    'direction': 'l2r'
        });
      },
      error => {
      }
    );
  }
  public loadScript() {
    console.log('preparing to load...')
    let node = document.createElement('script');
    node.src = environment.UrlWebsite + "/assets/js/jquery.orgchart.min.js";
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  private getSubsidiaries() {
    this.ssoCommonSvc.getSubsidiaries().subscribe(
      data => {
        this.listSubsidiary = data[this.payLoad];
      }
    );
  }
}