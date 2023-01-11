import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileuploadModule } from '../../../_directives/fileupload/fileupload.module';
import { FormsModule } from '../../../../../node_modules/@angular/forms';
import { BsDatepickerModule, ModalModule } from '../../../../../node_modules/ngx-bootstrap';
import { DxDataGridModule, DxDateBoxModule } from '../../../../../node_modules/devextreme-angular';
import { NgxBarcodeModule } from '../../../../../node_modules/ngx-barcode';
import { ApplyleavesRoutingModule } from './applyleaves-routing.module';
import { ApplyleavesComponent } from './applyleaves.component';
import { ReportComponent } from '../report/report.component';
import { ShareModulesModule } from '../../../_directives/share-modules/share-modules.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule,
    DxDataGridModule,
    ModalModule,
    ApplyleavesRoutingModule,
    FileuploadModule,
    NgxBarcodeModule,
    DxDateBoxModule,
    ShareModulesModule,
    TooltipModule.forRoot()
  ],
  declarations: [ApplyleavesComponent,ReportComponent,
    ]
})
export class ApplyleavesModule { }
