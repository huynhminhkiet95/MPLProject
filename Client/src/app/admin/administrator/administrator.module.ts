import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministratorRoutingModule } from './administrator-routing.module';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule, ModalModule, TabsModule, TooltipModule, TimepickerModule } from 'ngx-bootstrap';
import { DxDataGridModule, DxSchedulerModule, DxDateBoxModule, DxSwitchModule, DxPopupModule, DxTreeListModule, DxButtonModule, DxColorBoxModule, DxSelectBoxModule, DxTextBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import { FileuploadModule } from '../../_directives/fileupload/fileupload.module';
import { NgxBarcodeModule } from 'ngx-barcode';
import { TinyEditorModule } from '../../_directives/tiny-editor/tiny-editor.module';
import { SelectMultipleModule } from '../../_directives/select-multiple/select-multiple.module';
import { SelectModule } from 'ng2-select';
import { CalendarModule } from 'angular-calendar';
import { StdcodeComponent } from './stdcode/stdcode.component';
import { GroupPermissionComponent } from './group-permission/group-permission.component';
import { DepartmentAdminComponent } from './departmentadmin/departmentadmin.component';
import { DivisionAdminComponent } from './division-admin/division-admin.component';
import { WfRouteComponent } from './wf-route/wf-route.component';
import { WfNameRoleComponent } from './wf-name-role/wf-name-role.component';
import { WfUserGroupComponent } from './wf-user-group/wf-user-group.component';
import { HtsDevicesComponent } from './hts-devices/hts-devices.component';
import { TemplateContractComponent } from './template-contract/template-contract.component';
import { EcontracttemplateService } from '../../_services/econtracttemplate.service';
import { TemplateContractDetailComponent } from './template-contract/template-contract-detail/template-contract-detail.component';
import { NgxDiffModule } from 'ngx-diff';
import { TemplateContractCompareComponent } from './template-contract/template-contract-compare/template-contract-compare.component';
import { ItAdminComponent } from './it-admin/it-admin.component';
import { GroupAdminComponent } from './group-permission/group-admin/group-admin.component';
import { MenuAdminComponent } from './menu-admin/menu-admin.component';
import { VendorComponent } from './vendor/vendor.component';
import { VendorPopupComponent } from './vendor/vendor-popup/vendor-popup.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ConfigurationGenerateComponent } from './configuration/configuration-generate/configuration-generate.component';
import { ConfigurationSystemComponent } from './configuration/configuration-system/configuration-system.component';
import { ConfigurationLoginComponent } from './configuration/configuration-login/configuration-login.component';
import { ConfigurationHrComponent } from './configuration/configuration-hr/configuration-hr.component';

@NgModule({
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    FormsModule,
    BsDatepickerModule,
    DxDataGridModule,
    ModalModule,
    FileuploadModule,
    NgxBarcodeModule,
    TinyEditorModule,
    SelectMultipleModule,
    TabsModule.forRoot(),
    DxSchedulerModule,
    DxDateBoxModule,
    TooltipModule.forRoot(),
    SelectModule,
    CalendarModule.forRoot(),
    TimepickerModule.forRoot(),
    DxSwitchModule,
    DxPopupModule,
    DxTreeListModule,
    DxButtonModule,
    NgxDiffModule,
    DxColorBoxModule,DxSelectBoxModule,DxTextBoxModule,DxCheckBoxModule
  ],
  declarations: [
    StdcodeComponent,
    GroupPermissionComponent,
    DepartmentAdminComponent,
    DivisionAdminComponent,
    WfRouteComponent,
    WfNameRoleComponent,
    WfUserGroupComponent,
    HtsDevicesComponent,
    TemplateContractComponent,
    TemplateContractDetailComponent ,
    TemplateContractCompareComponent,
    ItAdminComponent,
    GroupAdminComponent,
    MenuAdminComponent,
    VendorComponent,
    VendorPopupComponent,
    ConfigurationComponent,
    ConfigurationGenerateComponent,
    ConfigurationSystemComponent,
    ConfigurationLoginComponent,
    ConfigurationHrComponent,
  ],
  entryComponents:[
    TemplateContractCompareComponent,
    VendorPopupComponent
  ],
 
})
export class AdministratorModule { }
