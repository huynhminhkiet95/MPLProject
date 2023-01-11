import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplyleavesComponent } from './applyleaves.component';
import { ReportComponent } from '../report/report.component';
import { ApplyleaveViewComponent } from '../applyleave-view/applyleave-view.component';

const routes: Routes = [
    {
        path: '',
        component: ApplyleavesComponent
    },
    {
        path: 'leavereport',
        component: ReportComponent
    },
   


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApplyleavesRoutingModule { }
