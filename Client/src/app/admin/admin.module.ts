import { FormsModule } from '@angular/forms';
import { DxDataGridModule, DxSchedulerModule, DxTreeListModule, DxButtonModule, DxNumberBoxModule, DxValidatorModule, DxTextBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { AdminRoutingModule } from './admin-routing/admin-routing.module';
import { AdminControlSidebarComponent } from './admin-control-sidebar/admin-control-sidebar.component';
import { AdminFooterComponent } from './admin-footer/admin-footer.component';
import { AdminContentComponent } from './admin-content/admin-content.component';
import { AdminLeftSideComponent } from './admin-left-side/admin-left-side.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DepartmentComponent } from './department/department.component';
import { SelectModule } from 'ng2-select';
import { EmployeeComponent } from './employee/employee.component';
import { CountryComponent } from './country/country.component';
import { CountryService, IdRequestService, ItServiceRequest, CommonService, EmpRequisitionService, FacilityBookingService } from '../_services/index';
import { IdrequestComponent } from './idrequest/idrequest.component';
import { IdrequestDetailComponent } from './idrequest/idrequest-detail/idrequest-detail.component';
import { ItservicerequestAddComponent } from './itservicerequest/itservicerequest-add/itservicerequest-add.component';
import { IdrequestAddComponent } from './idrequest/idrequest-add/idrequest-add.component';
import { EqualValidator } from '../_directives/equalvalidator.directive';
import { WindowRef, GroupByPipe, FilterPipe, SanitizeHtmlPipe } from './../_helpers/index';
import { UserProfileComponent } from './user-profile/user-profile.component'
import { ModalModule, TimepickerModule, TabsModule } from 'ngx-bootstrap';
import { Globalconst } from '../_helpers/globalvariable';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarModule } from 'angular-calendar';
import { ApplyleaveaddComponent } from './applyleave/applyleaveadd/applyleaveadd.component';
import { AnnounceComponent } from './announce/announce.component';
import { AnnounceDetailComponent } from './announce/announce-detail/announce-detail.component';
import { ApplicationApprovalComponent } from './application-approval/application-approval.component';
import { UserprofileViewdetailComponent } from './user-profile/userprofile-viewdetail/userprofile-viewdetail.component';
import { ApprovalDetailComponent } from './application-approval/approval-detail/approval-detail.component';
import { ApplyleaveViewComponent } from './applyleave/applyleave-view/applyleave-view.component';
import { TimesheetDetailComponent } from './timesheet/timesheet-detail/timesheet-detail.component';
import { TimesheetApprovalComponent } from './timesheet/timesheet-approval/timesheet-approval.component';
import { EmpployeeRequisitionComponent } from './empployee-requisition/empployee-requisition.component';
import { EmployeeRequisitionDetailComponent } from './empployee-requisition/employee-requisition-detail/employee-requisition-detail.component';
import { EmployeeRequisitionApprovalComponent } from './empployee-requisition/employee-requisition-approval/employee-requisition-approval.component';
import { EmployeeSearchComponent } from './employee/employee-search/employee-search.component';
import { EmployeeDetailComponent } from './employee/employee-detail/employee-detail.component';
import { EmployeeRequisitionApprovalDetailComponent } from './empployee-requisition/employee-requisition-approval/employee-requisition-approval-detail/employee-requisition-approval-detail.component';
import { AssetsmovementComponent } from './assetsmovement/assetsmovement.component';
import { FacilitybookingComponent } from './facilitybooking/facilitybooking.component';
import { FacilityBookingDetailComponent } from './facilitybooking/facility-booking-detail/facility-booking-detail.component';
import { AssetsmovementService } from '../_services/assetsmovement.service';
import { DxDateBoxModule, DxSwitchModule, DxPopupModule, DxCalendarModule, DxTemplateModule } from 'devextreme-angular';
import { ServicerequestComponent } from './servicerequest/servicerequest.component';
import { ServicerequestDetailComponent } from './servicerequest/servicerequest-detail/servicerequest-detail.component';
import { ServiceApprovalComponent } from './service-approval/service-approval.component';
import { ApprovalProcessComponent } from './application-approval/approval-process/approval-process.component';
import { ServicerequestPrintComponent } from './servicerequest/servicerequest-print/servicerequest-print.component'
import { PolicyandformsComponent } from './policyandforms/policyandforms.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { PolicyandformsdetailComponent } from './policyandforms/policyandformsdetail/policyandformsdetail.component';
import { WelcomeBoardComponent } from './welcome-board/welcome-board.component';
import { NumberOnlyDirective } from '../_directives/number.only.directive';
import { MyCurrencyPipe } from '../_directives/myCurrencyPipe.directive';
import { OrgchartComponent } from './orgchart/orgchart.component';
import { EmployeePrivateComponent } from './employee/employee-private/employee-private.component';
import { AnnouncePopupComponent } from './announce/announce-popup/announce-popup.component';
import { GroupassetComponent } from './groupasset/groupasset.component';
import { AssetsPopupComponent } from './assets/assets-popup/assets-popup.component';
import { FileuploadModule } from './../_directives/fileupload/fileupload.module'
import { TinyEditorModule } from '../_directives/tiny-editor/tiny-editor.module';
import { SelectMultipleModule } from '../_directives/select-multiple/select-multiple.module';
import { BaseComponent, INTEGER_TOKEN } from '../_directives/base.component';
import { EmployeePopupPermissionComponent } from './employee/employee-popup-permission/employee-popup-permission.component';
import { AssetcodeComponent } from './assetcode/assetcode.component';
import { ReceptionComponent } from './reception/reception.component';
import { TimesheetapprovalComponent } from './timesheetapproval/timesheetapproval.component';
import { TimesheetapprovalPopupComponent } from './timesheetapproval/timesheetapproval-popup/timesheetapproval-popup.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { ServicerequestPopupComponent } from './servicerequest/servicerequest-popup/servicerequest-popup.component';
import { LeaveentitleComponent } from './leaveentitle/leaveentitle.component';
import { LeaveentitlePopupComponent } from './leaveentitle/leaveentitle-popup/leaveentitle-popup.component';
import { OndeskPopupComponent } from './dashboard/ondesk-popup/ondesk-popup.component';
import { EmployeetimesheetPopupComponent } from './employee/employeetimesheet-popup/employeetimesheet-popup.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { PhotogalleryComponent } from './gallery/photogallery/photogallery.component';
import { ImagemanagementComponent } from './imagemanagement/imagemanagement.component';
import { ImagemanagementPopupComponent } from './imagemanagement/imagemanagement-popup/imagemanagement-popup.component';
import { DetailcategoryComponent } from './gallery/detailcategory/detailcategory.component';
import { DirectivesModule } from '../_directives/directives/directives.module';
import { AssetActivityService } from '../_services/asset-activity.service';
import { AssetActivityDetailComponent } from './assets/asset-activity/asset-activity-detail/asset-activity-detail.component';
import { SubsidiaryHolidayComponent } from './HR/subsidiary-holiday/subsidiary-holiday.component';
import { SubsidiaryHolidayPopupComponent } from './HR/subsidiary-holiday/subsidiary-holiday-popup/subsidiary-holiday-popup.component';
import { HolidaySubsidiary } from '../_services/holiday-subsidiary.service';
import { EmployeeAssetMovementPopupComponent } from './employee/employee-asset-movement-popup/employee-asset-movement-popup.component';
import { ImagemanagementPopupImageDetailComponent } from './imagemanagement/imagemanagement-popup-image-detail/imagemanagement-popup-image-detail.component';
import { WorkflowPopupComponent } from './servicerequest/servicerequest-detail/workflow-popup/workflow-popup.component';
import { WfNameRoleService } from '../_services/wf-name-role.service';
import { ServiceItemsService } from '../_services/service-items.service';
import { ActivityGroupSerivce } from '../_services/activity-group-serivce.service';
import { ActivityGroupModule } from './activity-group/activity-group.module';
import { EmployeeDependentComponent } from './employee/employee-dependent/employee-dependent.component';
import { EmployeeDependentService } from '../_services/employee-dependent.service';
import { HrModule } from './hr/hr.module';
import { TimesheetModule } from './timesheet/timesheet.module';
import { WfUserGroupService } from '../_services/wf-user-group.service';
import { HtsDevicesService } from '../_services/hts-devices.service';
import { ViewLogGateInOutComponent } from './gatehouse/view-log-gate-in-out/view-log-gate-in-out.component';
import { EntryExitLogComponent } from './gatehouse/entry-exit-log/entry-exit-log.component';
import { ViewLogGateInOutService } from '../_services/view-log-gate-in-out.service';

import { NgxQRCodeModule } from 'ngx-qrcode2';
import { EntryExitLogService } from '../_services/entry-exit-log.service';
import { ShareModulesModule } from '../_directives/share-modules/share-modules.module';
import { EmployeeContractComponent } from './employee/employee-contract/employee-contract.component';
import { LeaveEntitleReportComponent } from './applyleave/leave-entitle-report/leave-entitle-report.component';
import { DateformatPipe } from '../_helpers/dateformat.pipe';
import { COWorkLocService } from '../_services/co-work-loc.service';
import { TemplateContractCompareComponent } from './administrator/template-contract/template-contract-compare/template-contract-compare.component';
import { EcontracttemplateService } from '../_services/econtracttemplate.service';
import { AdministratorModule } from './administrator/administrator.module';
import { ApprovalProcessPopupComponent } from './application-approval/approval-process/approval-process-popup/approval-process-popup.component';
import { ViewImageComponent } from '../_directives/view-image/view-image.component';
import { EmployeeCheckAddnewPopupComponent } from './employee/employee-check-addnew-popup/employee-check-addnew-popup.component';
import { ISRITAdminService } from '../_services/isr-itadmin.service';
import { GroupPermissionComponent } from './administrator/group-permission/group-permission.component';
import { BasePopupComponent } from '../_directives/base.popup.component';
import { OnlineTrainingComponent } from './online-training/online-training.component';
import { OnlineTrainingAddNewComponent } from './online-training/online-training-add-new/online-training-add-new.component';
import { OnlineTrainingService } from '../_services/onlinetraining.service';
import { OnlineTrainingDetailComponent } from './online-training/online-training-detail/online-training-detail.component';
import { TrustedHtmlPipe } from '../_helpers/trustedhtml.pipe';
import { SubjectFormatPipe } from '../_helpers/subjectformat.pipe';
import { VendorService } from '../_services/vendor.service';
import { ThemeModule } from '../_theme/theme.module';
import { lightTheme } from '../_theme/primary-theme';
import { OffBoardNoticeComponent } from './user-profile/off-board-notice/off-board-notice.component';
import { OffboardnoticeServiceService } from '../_services/offboardnotice.service.service';
import { OffBoardingApprovalComponent } from './off-boarding-approval/off-boarding-approval.component';
import { OffBoardingDetailComponent } from './off-boarding-approval/off-boarding-detail/off-boarding-detail.component';
export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    dateInputFormat: 'DD/MM/YYYY',
    rangeInputFormat: 'DD/MM/YYYY'
  });
}
@NgModule({
  imports: [
    ThemeModule.forRoot({
      themes: [lightTheme],
      active: 'light'
    }),
    TabsModule.forRoot(),
    CommonModule,
    FormsModule,
    DxDataGridModule,
    DxSchedulerModule,
    AdminRoutingModule,
    DxDateBoxModule,
    DxNumberBoxModule,
    DxButtonModule,
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    SelectModule,
    CalendarModule.forRoot(),
    TimepickerModule.forRoot(),
    DxSwitchModule,
    DxPopupModule,
    NgxBarcodeModule,
    DxTreeListModule,
    FileuploadModule,
    TinyEditorModule,
    SelectMultipleModule,
    NgxGalleryModule,
    DirectivesModule,
    DxValidatorModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    ActivityGroupModule,
    HrModule,
    TimesheetModule,
    NgxQRCodeModule,
    ShareModulesModule,
    DxCalendarModule,
    DxTemplateModule,
    AdministratorModule

  ],
  declarations: [
    AdminComponent,
    AdminHeaderComponent,
    AdminLeftSideComponent,
    AdminContentComponent,
    AdminFooterComponent,
    AdminControlSidebarComponent,
    DepartmentComponent,
    EmployeeComponent,
    CountryComponent,
    IdrequestComponent,
    IdrequestDetailComponent,
    ItservicerequestAddComponent,
    IdrequestAddComponent,
    EqualValidator,
    UserProfileComponent,
    DashboardComponent,
    GroupByPipe,
    FilterPipe,
    SanitizeHtmlPipe,
    ApplyleaveaddComponent,
    AnnounceComponent,
    AnnounceDetailComponent,
    ApplicationApprovalComponent,
    UserprofileViewdetailComponent,
    ApprovalDetailComponent,
    ApplyleaveViewComponent,
    TimesheetDetailComponent,
    TimesheetApprovalComponent,
    EmpployeeRequisitionComponent,
    EmployeeRequisitionDetailComponent,
    EmployeeRequisitionApprovalComponent,
    EmployeeSearchComponent,
    EmployeeDetailComponent,
    EmployeeRequisitionApprovalDetailComponent,
    AssetsmovementComponent,
    FacilitybookingComponent,
    FacilityBookingDetailComponent,
    ServicerequestComponent,
    ServicerequestDetailComponent,
    ServiceApprovalComponent,
    ApprovalProcessComponent,
    ServicerequestPrintComponent,
    PolicyandformsComponent,
    PolicyandformsdetailComponent,
    WelcomeBoardComponent,
    NumberOnlyDirective,
    MyCurrencyPipe,
    EmployeePrivateComponent,
    OrgchartComponent,
    AnnouncePopupComponent,
    GroupassetComponent,
    AssetsPopupComponent,
    EmployeePopupPermissionComponent,
    AssetcodeComponent,
    ReceptionComponent,
    TimesheetapprovalComponent,
    TimesheetapprovalPopupComponent,
    FileManagerComponent,
    ServicerequestPopupComponent,
    LeaveentitleComponent,
    LeaveentitlePopupComponent,
    OndeskPopupComponent,
    EmployeetimesheetPopupComponent,
    PhotogalleryComponent,
    ImagemanagementComponent,
    ImagemanagementPopupComponent,
    DetailcategoryComponent,
    AssetActivityDetailComponent,
    SubsidiaryHolidayComponent,
    SubsidiaryHolidayPopupComponent,
    EmployeeAssetMovementPopupComponent,
    ImagemanagementPopupImageDetailComponent,
    WorkflowPopupComponent,
    EmployeeDependentComponent,
    ViewLogGateInOutComponent,
    EntryExitLogComponent,
    EmployeeContractComponent,
    EntryExitLogComponent,
    LeaveEntitleReportComponent,
    DateformatPipe,
    ApprovalProcessPopupComponent,
    ViewImageComponent,
    EmployeeCheckAddnewPopupComponent,
    OnlineTrainingComponent,
    OnlineTrainingAddNewComponent,
    OnlineTrainingDetailComponent,
    TrustedHtmlPipe,
    SubjectFormatPipe,
    OffBoardNoticeComponent,
    OffBoardingApprovalComponent,
    OffBoardingDetailComponent
  ],
  entryComponents: [
    EmployeePopupPermissionComponent,
    IdrequestDetailComponent,
    IdrequestAddComponent,
    ItservicerequestAddComponent,
    ApplyleaveaddComponent,
    AnnounceDetailComponent,
    EmployeeComponent,
    UserprofileViewdetailComponent,
    ApplyleaveViewComponent,
    TimesheetDetailComponent,
    TimesheetApprovalComponent,
    EmpployeeRequisitionComponent,
    EmployeeRequisitionDetailComponent,
    FacilityBookingDetailComponent,
    FacilitybookingComponent,
    PolicyandformsdetailComponent,
    ServicerequestPrintComponent,
    WelcomeBoardComponent,
    AnnouncePopupComponent,
    AssetsPopupComponent,
    ReceptionComponent,
    TimesheetapprovalPopupComponent,
    ServicerequestPopupComponent,
    LeaveentitlePopupComponent,
    OndeskPopupComponent,
    EmployeetimesheetPopupComponent,
    ImagemanagementPopupComponent,
    AssetActivityDetailComponent,
    SubsidiaryHolidayPopupComponent,
    EmployeeAssetMovementPopupComponent,
    ImagemanagementPopupImageDetailComponent,
    WorkflowPopupComponent,
    EmployeeDependentComponent,
    EmployeeContractComponent,
    ApprovalProcessPopupComponent,
    ViewImageComponent,
    EmployeeCheckAddnewPopupComponent,
    OnlineTrainingAddNewComponent,
    OnlineTrainingDetailComponent,
    OffBoardNoticeComponent,
    OffBoardingDetailComponent
  ],
  providers: [
    CountryService,
    IdRequestService,
    ItServiceRequest,
    CommonService,
    WindowRef,
    Globalconst,
    EmpRequisitionService,
    AssetsmovementService,
    FacilityBookingService,
    MyCurrencyPipe,
    BaseComponent,
    BasePopupComponent,
    AssetActivityService,
    HolidaySubsidiary,
    WfNameRoleService,
    ServiceItemsService,
    ActivityGroupSerivce,
    EmployeeDependentService,
    { provide: BsDatepickerConfig, useFactory: getDatepickerConfig },
    WfUserGroupService,
    HtsDevicesService,
    ViewLogGateInOutService,
    EntryExitLogService,
    COWorkLocService,
    EcontracttemplateService,
    ISRITAdminService,
    GroupPermissionComponent,
    {
      provide: INTEGER_TOKEN,
      useValue: false //Or factory if you need one
    },
    OnlineTrainingService,
    VendorService,
    OffboardnoticeServiceService
  ],
  exports: [AdminComponent]
})
export class AdminModule { }
