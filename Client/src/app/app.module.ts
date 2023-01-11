import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxSchedulerModule, DxTemplateModule, DxButtonModule } from 'devextreme-angular';
import { fakeBackendProvider, Globalconst } from './_helpers/index';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';
import { AlertComponent } from './_directives/alert/alert.component';
import { AuthGuard } from './_guards/index';
import { AlertService, AuthenticationService, SSOUserProfileService, SSOCommonService, UserService, ModalService, FileService, CommonService, ApplyLeaveService, AnnounceService, TimesheetService, EmployeeService, FacilityBookingService } from './_services/';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CalendarModule } from 'angular-calendar';
import { CookieService } from 'ngx-cookie-service';
import { RecaptchaModule } from 'ng-recaptcha';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { AuthInterceptor } from './_services/_base/auth-interceptor';
import { AuthService } from './_services/_base/auth-service';
import { RequestInterceptor } from './_services/_base/request-interceptor';
import { ApplicationHttpClient, applicationHttpClientCreator } from './_services/_base/http-client';
import { HttpClient } from '@angular/common/http';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { ToastrModule, ToastNoAnimation, ToastNoAnimationModule, } from 'ngx-toastr';
import { ServiceRequestService } from './_services/servicerequest.service';
import { WelcomeBoardAnnounceComponent } from './welcome-board-announce/welcome-board-announce.component';
import { AuthGuardService } from './_guards/auth-guard.service';
import { StdCodeService } from './_services/stdcode.service';
import { AnnouncementSliderComponent } from './announcement-slider/announcement-slider.component';
import { ModalModule, BsModalRef } from 'ngx-bootstrap';
import { GroupPermissionService } from './_services/group_permission.service';
import { AssetGroupService } from './_services/assetgroup.service';
import { WelcomeboardComponent } from './welcomeboard/welcomeboard.component';
import { TodaybookingroomComponent } from './welcomeboard/todaybookingroom/todaybookingroom.component';
import { WfRouteService } from './_services/wf-route.service';
import { NgxSpinnerModule } from "ngx-spinner";
import { FireworkComponent } from './_directives/firework/firework.component';
import { MessageService } from './_services/message.service';
import { SignalRService } from './_services/signalR.Service';
import { PushNotificationsService } from './_services/push.notification.server';
import { ExecCallApi } from './_helpers/exec-call-api';
import { MenuService } from './_services/menu.service';
import { VersionCheckService } from './_helpers/version-check.service';
import { StartupClass } from './_helpers/startup';
// or
export function loadContext(context: StartupClass) {
  return () => context.startup();
}
@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    LoginComponent,
    WelcomeBoardAnnounceComponent,
    AnnouncementSliderComponent,
    WelcomeboardComponent,
    TodaybookingroomComponent,
    FireworkComponent,
  ],
  imports: [
    DxSchedulerModule,
    DxTemplateModule,
    DxButtonModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    DxDataGridModule,
    ToastNoAnimationModule,
    ToastrModule.forRoot({
      toastComponent: ToastNoAnimation,
      closeButton: true,
      preventDuplicates:true
    }),
    CarouselModule.forRoot(),
    AdminModule,
    ModalModule.forRoot(),
    CalendarModule,
    RecaptchaModule.forRoot(),
    SlimLoadingBarModule.forRoot(),
    NgxSpinnerModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    AuthGuardService,
    AlertService,
    ModalService,
    AuthenticationService,
    ApplyLeaveService,
    UserService,
    FileService,
    CommonService,
    AnnounceService,
    TimesheetService,
    EmployeeService,
    FacilityBookingService,
    // providers used to create fake backend
    fakeBackendProvider,
    TimesheetService,
    EmployeeService,
    FacilityBookingService,
    // providers used to create fake backend
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions,
    Globalconst,
    //{provide: ToastOptions, useClass: CustomOption},
    CookieService,
    //Provide the Authentication interceptor
    {
      provide: HTTP_INTERCEPTORS,
      //useClass: AuthInterceptor,  
      useClass: RequestInterceptor,
      //useFactory: applicationHttpClientCreator,
      multi: true
    },

    //Provide the extended HttpClient
    {
      provide: ApplicationHttpClient,
      useFactory: applicationHttpClientCreator,
      deps: [HttpClient],
    },
    ServiceRequestService,
    StdCodeService,
    GroupPermissionService,
    AssetGroupService,
    BsModalRef,
    WfRouteService,
    MessageService,
    SignalRService,
    StartupClass,
    PushNotificationsService
    , SSOUserProfileService
    , SSOCommonService
    , ExecCallApi
    , MenuService,
    VersionCheckService
    ,
    { 
      provide : APP_INITIALIZER, 
      useFactory : loadContext ,
      multi : true, 
      deps : [StartupClass],}

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }