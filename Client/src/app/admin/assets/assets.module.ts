import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DxDataGridModule, DxNumberBoxModule, DxSchedulerModule, DxDateBoxModule, DxButtonModule, DxSwitchModule, DxPopupModule, DxTreeListModule, DxSelectBoxModule } from 'devextreme-angular';
import { ModalModule, TooltipModule, TimepickerModule, TabsModule} from 'ngx-bootstrap';
import { NgxBarcodeModule } from 'ngx-barcode';
import { AssetsRoutingModule } from './assets-routing.module';
import { AssetsComponent} from './assets.component';
import {AssetsDetailComponent} from './assets-detail/assets-detail.component';
import {FileuploadModule} from './../../_directives/fileupload/fileupload.module';
import { SelectModule } from 'ng2-select';
import { CalendarModule } from 'angular-calendar';
import { TinyEditorModule } from '../../_directives/tiny-editor/tiny-editor.module';
import { SelectMultipleModule } from '../../_directives/select-multiple/select-multiple.module';
import { NgxGalleryModule } from 'ngx-gallery';
import { DirectivesModule } from '../../_directives/directives/directives.module';
import { AssetActivityComponent } from './asset-activity/asset-activity.component';
import { AssetActivityDetailComponent } from './asset-activity/asset-activity-detail/asset-activity-detail.component';
import { ShareModulesModule } from '../../_directives/share-modules/share-modules.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
@NgModule({
  imports: [
    TabsModule.forRoot(),
    CommonModule,
    FormsModule,
    DxDataGridModule,
    ModalModule,
    AssetsRoutingModule,
    FileuploadModule,
    NgxBarcodeModule,
    DxNumberBoxModule,
    DxSchedulerModule,
    DxDateBoxModule,
    DxButtonModule,
    BsDatepickerModule.forRoot(),
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
    ShareModulesModule,
    NgxQRCodeModule
  ],
  declarations: [
    AssetsComponent,
    AssetsDetailComponent,
    AssetActivityComponent,
    
  ],
  entryComponents:[
     
  ],
  exports:[AssetsComponent]
})
export class AssetsModule { }
