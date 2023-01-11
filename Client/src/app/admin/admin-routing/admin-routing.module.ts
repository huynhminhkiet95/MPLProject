import { AdminComponent } from './../admin.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../_guards/index';
import { DepartmentComponent } from './../department/department.component';
import { CountryComponent } from './../country/country.component';
import { IdrequestComponent } from './../idrequest/idrequest.component';
import { IdrequestDetailComponent } from './../idrequest/idrequest-detail/idrequest-detail.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { DashboardComponent } from '../dashboard/dashboard.component'
import { AnnounceComponent } from '../announce/announce.component'
import { ApplicationApprovalComponent } from '../application-approval/application-approval.component';
import { ApprovalDetailComponent } from '../application-approval/approval-detail/approval-detail.component';
import { EmpployeeRequisitionComponent } from '../empployee-requisition/empployee-requisition.component'
import { EmployeeRequisitionApprovalComponent } from '../empployee-requisition/employee-requisition-approval/employee-requisition-approval.component'
import { EmployeeSearchComponent } from '../employee/employee-search/employee-search.component';
import { EmployeeDetailComponent } from '../employee/employee-detail/employee-detail.component';
import { EmployeeRequisitionApprovalDetailComponent } from '../empployee-requisition/employee-requisition-approval/employee-requisition-approval-detail/employee-requisition-approval-detail.component'
import { AssetsmovementComponent } from '../assetsmovement/assetsmovement.component';
import { FacilitybookingComponent } from '../facilitybooking/facilitybooking.component';
import { FacilityBookingDetailComponent } from '../facilitybooking/facility-booking-detail/facility-booking-detail.component';
import { ServicerequestComponent } from '../servicerequest/servicerequest.component';
import { ServicerequestDetailComponent } from '../servicerequest/servicerequest-detail/servicerequest-detail.component';
import { ServiceApprovalComponent } from './../service-approval/service-approval.component';
import { ApprovalProcessComponent } from '../application-approval/approval-process/approval-process.component';
import { PolicyandformsComponent } from '../policyandforms/policyandforms.component';
import { EmployeePrivateComponent } from '../employee/employee-private/employee-private.component';
import { OrgchartComponent } from '../orgchart/orgchart.component';
import { AuthGuardService } from '../../_guards/auth-guard.service';
import { GroupassetComponent } from '../groupasset/groupasset.component';
import { EmployeeComponent } from '../employee/employee.component';
import { AnnouncePopupComponent } from '../announce/announce-popup/announce-popup.component';
import { TimesheetDetailComponent } from '../timesheet/timesheet-detail/timesheet-detail.component';
import { ApplyleaveViewComponent } from '../applyleave/applyleave-view/applyleave-view.component';
import { ApplyleaveaddComponent } from '../applyleave/applyleaveadd/applyleaveadd.component';
import { AssetcodeComponent } from '../assetcode/assetcode.component';
import { TimesheetapprovalComponent } from '../timesheetapproval/timesheetapproval.component';
import {FileManagerComponent} from '../file-manager/file-manager.component'
import { LeaveentitleComponent } from '../leaveentitle/leaveentitle.component';
import { OndeskPopupComponent } from '../dashboard/ondesk-popup/ondesk-popup.component';
import { ImagemanagementComponent } from '../imagemanagement/imagemanagement.component';
import { DetailcategoryComponent } from '../gallery/detailcategory/detailcategory.component';
import { SubsidiaryHolidayComponent } from '../HR/subsidiary-holiday/subsidiary-holiday.component';
import { EntryExitLogComponent } from '../gatehouse/entry-exit-log/entry-exit-log.component';
import { ViewLogGateInOutComponent } from '../gatehouse/view-log-gate-in-out/view-log-gate-in-out.component';
import { LeaveEntitleReportComponent } from '../applyleave/leave-entitle-report/leave-entitle-report.component';
import { OnlineTrainingComponent } from '../online-training/online-training.component';
import { OffBoardingApprovalComponent } from '../off-boarding-approval/off-boarding-approval.component';
@NgModule({
  imports: [
    
    RouterModule.forChild([
      {
        
        path: 'intranet',
        component: AdminComponent, canActivate: [AuthGuard],
        canLoad: [AuthGuardService],
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          },
          {
            path: 'department',
            component: DepartmentComponent
          },

          {
            path: 'country',
            component: CountryComponent
          },
          {
            path: 'idrequest',
            component: IdrequestComponent
          }
          ,
          {
            path: 'itservicerequest',
            loadChildren: 'app/admin/itservicerequest/itservicerequest.module#ItservicerequestModule'
          }
          ,
          {
            path: 'administrator',
            loadChildren: 'app/admin/administrator/administrator.module#AdministratorModule'
          }
          ,
          {
            path: 'idrequestdetail/:id',
            component: IdrequestDetailComponent
          },
          {
            path: 'userprofile',
            component: UserProfileComponent
          },
          {
            path: 'dashboard',
            component: DashboardComponent
          },
          {
            path: 'leaves',
            loadChildren: 'app/admin/applyleave/applyleaves/applyleaves.module#ApplyleavesModule'
          },
         
          {
            path: 'announce',
            component: AnnounceComponent
          },
          {
            path: 'applicationapproval',
            component: ApplicationApprovalComponent
          },
          {
            path: 'applicationapproval/:id',
            component: ApprovalDetailComponent
          },
          {
            path: 'timesheet',
            loadChildren: 'app/admin/timesheet/timesheet.module#TimesheetModule'

          },
          {
            path: 'empployee-requisition',
            component: EmpployeeRequisitionComponent
          },
          {
            path: 'employee-requisition-approval',
            component: EmployeeRequisitionApprovalComponent
          },
          {
            path: 'requisitionapprovaldetail/:id',
            component: EmployeeRequisitionApprovalDetailComponent
          },
          {
            path: 'employee/search',
            component: EmployeeSearchComponent
          },
          {
            path: 'employeedetail/:id',
            component: EmployeeDetailComponent
          },
          {
            path: 'employee/addnew',
            component: EmployeeDetailComponent
          },
          {
            path: 'employee/view',
            component: EmployeeSearchComponent
          },
          {
            path: 'assetsmovement',
            component: AssetsmovementComponent
          },
          {
            path: 'assets',
            loadChildren: 'app/admin/assets/assets.module#AssetsModule'
          },
          {
            path: 'facilitybooking',
            component: FacilitybookingComponent
          },
          {
            path: 'booktransportation',
            component: FacilitybookingComponent
          },
          {
            path: 'facilitybookingDetail/:id',
            component: FacilityBookingDetailComponent
          },
          {
            path: 'servicerequest',
            component: ServicerequestComponent
          },
          {
            path: 'servicerequest/addnew',
            component: ServicerequestDetailComponent
          }
          ,
          {
            path: 'servicerequest/:id',
            component: ServicerequestDetailComponent
          },
          {
            path: 'serviceapproval',
            component: ServiceApprovalComponent
          },
          {
            path: 'serviceapproval/:id',
            component: ApprovalDetailComponent
          },
          {
            path: 'application/approval/:id',
            component: ApprovalProcessComponent
          },
          {
            path: 'policyandforms',
            component: PolicyandformsComponent
          },
          {
            path: 'onlinetraining',
            component: OnlineTrainingComponent
          },
          {
            path: 'employeeprivate/:id',
            component: EmployeePrivateComponent
          },
          {
            path: 'orgchart',
            component: OrgchartComponent
          },
          {
            path: 'assetgroup',
            component: GroupassetComponent
          },
          {
            path: 'assetcode',
            component:AssetcodeComponent
          },
          {
            path: 'timesheetapporoval',
            component:TimesheetapprovalComponent
          },
          {
            path:'file-manager',
            component:FileManagerComponent
          }
          ,
          {
            path:'leaveentitle',
            component:LeaveentitleComponent
          }
          ,
          {
            path:'gallery',
            component:ImagemanagementComponent
          }
          ,
          {
            path:'gallerydetail',
            component:DetailcategoryComponent
          },
          {
            path:'subsidiaryholiday',
            component:SubsidiaryHolidayComponent
          },
          {
            path: 'hr',
            loadChildren: 'app/admin/hr/hr.module#HrModule'
          },
          {
            path: 'activity',
            loadChildren: 'app/admin/activity-group/activity-group.module#ActivityGroupModule'
          },
          {
            path: 'sg/entryexitlog',
            component: EntryExitLogComponent
          },
          {
            path: 'sg/viewloggate',
            component: ViewLogGateInOutComponent
          },
          {
            path: 'leaveentitlereport',
            component: LeaveEntitleReportComponent
          },
          {
            path:'off-boarding-approval',
            component:OffBoardingApprovalComponent
          }
        ]
      },
      {
        path: '#', redirectTo: 'intranet', pathMatch: 'full'
      },
      {
        path: '', redirectTo: 'intranet', pathMatch: 'full'
      }
      ,
      {
        path: 'employeesearch',
        component: EmployeeComponent,
        outlet:'modal'
      },
      {
        path: 'employeesearch/:id',
        component: EmployeeComponent,
        outlet:'modal'
      },
      {
        path: 'announcementsearch',
        component: AnnouncePopupComponent,
        outlet:'modal'
      },
      {
        path: 'timesheetdetail',
        component: TimesheetDetailComponent,
        outlet:'modal'
      },
     
      {
        path: 'applyleaveadd/:id',
        component: ApplyleaveaddComponent,
        outlet:'modal'
      },
      {
        path: 'applyleaveview/:id',
        component: ApplyleaveViewComponent,
        outlet: 'modal'
      },
      {
        path:'ondesk/:id',
        component:OndeskPopupComponent,
        outlet: 'modal'

      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
