import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DxDataGridModule, DxNumberBoxModule, DxSchedulerModule, DxDateBoxModule, DxButtonModule, DxSwitchModule, DxPopupModule, DxTreeListModule, DxSelectBoxModule, DxValidatorModule,DxTextBoxModule } from 'devextreme-angular';
import { ModalModule, TooltipModule, TimepickerModule, TabsModule} from 'ngx-bootstrap';
import { NgxBarcodeModule } from 'ngx-barcode';
import { ServiceStationaryReportComponent } from './service-stationary-report/service-stationary-report.component';
import { HrRoutingModule } from './hr-routing.module';
import { ContractComponent } from './contract/contract.component';
import { ContractService } from '../../_services/contract.service';
import { ContractDetailComponent } from './contract/contract-detail/contract-detail.component';
import { FileuploadModule } from '../../_directives/fileupload/fileupload.module';
import { RequestOnBehalfComponent } from './requestonbehalf/requestonbehalf.component';
import { RequestOnBehalfAddComponent } from './requestonbehalf/requestonbehalf-add/requestonbehalf-add.component';
import { ShareModulesModule } from '../../_directives/share-modules/share-modules.module';
import { EContractDetailComponent } from './contract/e-contract-detail/e-contract-detail.component';
import { COWorkLocComponent } from './co-work-loc/co-work-loc.component';
import { CoWorkLocPopupComponent } from './co-work-loc/co-work-loc-popup/co-work-loc-popup.component';
import { OffBoardingReportComponent } from './off-boarding-report/off-boarding-report.component';
@NgModule({
  imports: [
    HrRoutingModule,
    TabsModule.forRoot(),
    CommonModule,
    FormsModule,
    DxDataGridModule,
    ModalModule,
    NgxBarcodeModule,
    DxNumberBoxModule,
    DxSchedulerModule,
    DxDateBoxModule,
    DxButtonModule,
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    TimepickerModule.forRoot(),
    DxSwitchModule,
    DxPopupModule,
    DxTreeListModule,
    DxSelectBoxModule,
    FileuploadModule,
    DxValidatorModule,
    ShareModulesModule,
    DxTextBoxModule
    
  ],
  declarations: [
    ServiceStationaryReportComponent,
    ContractComponent,
    ContractDetailComponent,
    RequestOnBehalfComponent ,
    RequestOnBehalfAddComponent,
    EContractDetailComponent,
    COWorkLocComponent,
    CoWorkLocPopupComponent,
    OffBoardingReportComponent
  ] ,
  providers:[
    ContractService
  ],
  entryComponents:[
    ContractDetailComponent,
    RequestOnBehalfAddComponent,
    EContractDetailComponent,
    CoWorkLocPopupComponent
    
  ],
   exports:[ServiceStationaryReportComponent]
})
 
export class HrModule { }
