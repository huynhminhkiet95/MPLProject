import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DxDataGridModule, DxNumberBoxModule, DxSchedulerModule, DxDateBoxModule, DxButtonModule, DxSwitchModule, DxPopupModule, DxTreeListModule, DxSelectBoxModule, DxValidatorModule, DxValidationSummaryModule } from 'devextreme-angular';
import { ModalModule, TooltipModule, TimepickerModule, TabsModule} from 'ngx-bootstrap';
import { NgxBarcodeModule } from 'ngx-barcode';
import {FileuploadModule} from './../../_directives/fileupload/fileupload.module';
import { SelectModule } from 'ng2-select';
import { CalendarModule } from 'angular-calendar';
import { TinyEditorModule } from '../../_directives/tiny-editor/tiny-editor.module';
import { SelectMultipleModule } from '../../_directives/select-multiple/select-multiple.module';
import { NgxGalleryModule } from 'ngx-gallery';
import { DirectivesModule } from '../../_directives/directives/directives.module';
import { ActivityGroupRoutingModule} from './activity-group-routing.module'
import { ActivityGroupComponent } from './activity-group.component';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { ActivityViewComponent } from './activity-view/activity-view.component';
import { ShareModulesModule } from '../../_directives/share-modules/share-modules.module';
@NgModule({
  imports: [
    TabsModule.forRoot(),
    CommonModule,
    FormsModule,
    DxDataGridModule,
    ModalModule,
    ActivityGroupRoutingModule,
    FileuploadModule,
    NgxBarcodeModule,
    DxNumberBoxModule,
    DxSchedulerModule,
    DxDateBoxModule,
    DxButtonModule,
    TooltipModule.forRoot(),
    SelectModule,
    CalendarModule.forRoot(),
    TimepickerModule.forRoot(),
    DxSwitchModule,
    DxPopupModule,
    DxTreeListModule,
    TinyEditorModule,
    SelectMultipleModule,
    NgxGalleryModule,
    DirectivesModule,
    DxSelectBoxModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    ShareModulesModule,
  ],
  declarations: [
    ActivityGroupComponent,
    ActivityDetailComponent,
    ActivityViewComponent,
  ],entryComponents:[
    ActivityDetailComponent,
    ActivityViewComponent
  ]
})
export class ActivityGroupModule { }
