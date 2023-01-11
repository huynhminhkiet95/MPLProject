import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityGroupComponent } from './activity-group.component'

const routes: Routes = [
    {
        path: '',
        component: ActivityGroupComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivityGroupRoutingModule { }
