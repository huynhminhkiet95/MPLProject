import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceStationaryReportComponent } from './service-stationary-report/service-stationary-report.component'
import { ContractComponent } from './contract/contract.component';
import { RequestOnBehalfComponent } from './requestonbehalf/requestonbehalf.component';
import { EContractDetailComponent } from './contract/e-contract-detail/e-contract-detail.component';
import { COWorkLocComponent } from './co-work-loc/co-work-loc.component';
import { OffBoardingReportComponent } from './off-boarding-report/off-boarding-report.component';

const routes: Routes = [
    {
        path: '',
        component: ServiceStationaryReportComponent,
    },
    {
        path: 'stationaryreport',
        component: ServiceStationaryReportComponent,
    },
    {
        path:'contract',
        component:ContractComponent
    }
    ,
    {
        path:'contractreport',
        component:EContractDetailComponent
    },
    {
        path:'requestonbehalf',
        component:RequestOnBehalfComponent
    },
    {
        path: "workinglocation",
        component: COWorkLocComponent
    },
    {
        path: "offboardingreport",
        component: OffBoardingReportComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HrRoutingModule { }
