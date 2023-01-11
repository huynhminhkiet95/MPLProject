import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetsComponent} from './assets.component'
import {AssetsDetailComponent} from './assets-detail/assets-detail.component'
import { AssetActivityComponent } from './asset-activity/asset-activity.component';
const routes: Routes = [
  {
    path:'search',
    component:AssetsComponent,
  },
 
  {
    path:'activity',
    component:AssetActivityComponent,
  },
  {
    path: ':id',
    component: AssetsDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
