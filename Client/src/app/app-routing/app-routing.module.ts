import { LoginComponent } from './../login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WelcomeBoardAnnounceComponent } from '../welcome-board-announce/welcome-board-announce.component';
import { AuthGuardService } from '../_guards/auth-guard.service';
import { AnnouncementSliderComponent } from '../announcement-slider/announcement-slider.component';
import { WelcomeboardComponent } from '../welcomeboard/welcomeboard.component'
@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: 'intranet', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path:'webcomeboard/:id/:theme',component:WelcomeBoardAnnounceComponent},
      {
        path: 'intranet',
        loadChildren: 'app/admin/admin.module#AdminModule',
        canLoad: [ AuthGuardService ]
      },
      { 
        path:'announcement-board/:id/:theme',
        component:AnnouncementSliderComponent
      },
      {
        path:'welcomeboard',
        component:WelcomeboardComponent
      }
     
     
   
    ])
  ],
  declarations: [],
  exports: [ RouterModule]
})
export class AppRoutingModule { }
