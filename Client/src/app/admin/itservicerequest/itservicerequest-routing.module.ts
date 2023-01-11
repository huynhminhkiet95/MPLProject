import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItservicerequestComponent } from './itservicerequest.component';
import { ItservicerequestDetailComponent } from './itservicerequest-detail/itservicerequest-detail.component';
const routes: Routes = [
    {
        path: '',
        component: ItservicerequestComponent
    },
    {
        path: ':id',
        component: ItservicerequestDetailComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItservicerequestRoutingModule { }
