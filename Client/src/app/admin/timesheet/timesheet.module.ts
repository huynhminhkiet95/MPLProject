import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileuploadModule } from '../../_directives/fileupload/fileupload.module';
import { NgxBarcodeModule } from '../../../../node_modules/ngx-barcode';
import { DxDataGridModule, DxCheckBoxModule, DxDateBoxModule, DxSelectBoxModule } from '../../../../node_modules/devextreme-angular';
import { ModalModule, BsDatepickerModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { TimesheetRoutingModule } from './timesheet-routing.module';
import { TimesheetComponent } from './timesheet.component';
import { TimesheetReportComponent } from './timesheet-report/timesheet-report.component';
import { CheckInOutDetailComponent } from './check-in-out-detail/check-in-out-detail.component';
import { ShareModulesModule } from '../../_directives/share-modules/share-modules.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule,
    DxDataGridModule,
    ModalModule,
    TimesheetRoutingModule,
    FileuploadModule,
    NgxBarcodeModule,
    DxCheckBoxModule,
    DxDateBoxModule,
    DxSelectBoxModule,
    TooltipModule,
    ShareModulesModule
  ],
  declarations: [
    TimesheetComponent,
    TimesheetReportComponent,
    CheckInOutDetailComponent,
  ],
  entryComponents:[
    CheckInOutDetailComponent
  ]
})
export class TimesheetModule { }
