import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItservicerequestDetailComponent } from './itservicerequest-detail/itservicerequest-detail.component';
import { ItservicerequestComponent } from './itservicerequest.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule, ModalModule, TabsModule, TooltipModule, TimepickerModule } from 'ngx-bootstrap';
import { DxDataGridModule, DxSchedulerModule, DxDateBoxModule, DxSwitchModule, DxPopupModule, DxTreeListModule, DxButtonModule } from 'devextreme-angular';
import { FileuploadModule } from '../../_directives/fileupload/fileupload.module';
import { NgxBarcodeModule } from 'ngx-barcode';
import { ItservicerequestRoutingModule } from './itservicerequest-routing.module';
import { AdminRoutingModule } from '../admin-routing/admin-routing.module';
import { SelectModule } from 'ng2-select';
import { CalendarModule } from 'angular-calendar';
import { TinyEditorModule } from '../../_directives/tiny-editor/tiny-editor.module';
import { SelectMultipleModule } from '../../_directives/select-multiple/select-multiple.module';
import { ShareModulesModule } from '../../_directives/share-modules/share-modules.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule,
    DxDataGridModule,
    ModalModule,
    ItservicerequestRoutingModule,
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
    ShareModulesModule
  ],
  declarations: [
    ItservicerequestComponent,
    ItservicerequestDetailComponent,
  ]
})
export class ItservicerequestModule { }
