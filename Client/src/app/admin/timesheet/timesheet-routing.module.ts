import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimesheetComponent } from './timesheet.component';
import { TimesheetReportComponent } from './timesheet-report/timesheet-report.component';

const routes: Routes = [
    {
        path: '',
        component: TimesheetComponent
    },
    {
        path: 'report',
        component: TimesheetReportComponent
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TimesheetRoutingModule { }
