import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StdcodeComponent } from './stdcode/stdcode.component';
import { GroupPermissionComponent } from './group-permission/group-permission.component';
import { DepartmentAdminComponent } from './departmentadmin/departmentadmin.component';
import { DivisionAdminComponent } from './division-admin/division-admin.component';
import { WfRouteComponent } from './wf-route/wf-route.component';
import { WfNameRoleComponent } from './wf-name-role/wf-name-role.component';
import { WfUserGroupComponent } from './wf-user-group/wf-user-group.component';
import { HtsDevicesComponent } from './hts-devices/hts-devices.component';
import { TemplateContractComponent } from './template-contract/template-contract.component';
import { TemplateContractDetailComponent } from './template-contract/template-contract-detail/template-contract-detail.component';
import { ItAdminComponent } from './it-admin/it-admin.component';
import { GroupAdminComponent } from './group-permission/group-admin/group-admin.component';
import { MenuAdminComponent } from './menu-admin/menu-admin.component';
import { VendorComponent } from './vendor/vendor.component';
import { ConfigurationComponent } from './configuration/configuration.component';

const routes: Routes = [
    {
        path: 'stdcode',
        component:  StdcodeComponent
    },
    {
        path: 'grouppermissions',
        component:  GroupPermissionComponent
    },
    {
        path: 'group-permissions-admin',
        component:  GroupAdminComponent
    },
    {
        path: 'departmentadmin',
        component:  DepartmentAdminComponent
    },
    {
        path: 'divisionadmin',
        component:  DivisionAdminComponent
    },
    {
        path:'wfroute',
        component: WfRouteComponent
    },
    {
        path:'wfnamerole',
        component: WfNameRoleComponent
    },
    {
        path: 'wfusergroup',
        component: WfUserGroupComponent
    },
    {
        path: "htsdevices",
        component: HtsDevicesComponent
    },
    {
        path: "templatecontract",
        component: TemplateContractComponent
    },
    {
        path: "templatecontract/:id",
        component: TemplateContractDetailComponent
    },
    {
        path: "isritadmin",
        component: ItAdminComponent
    },
    {
        path: "menus-admin",
        component: MenuAdminComponent
    },
    {
        path: 'vendor',
        component:  VendorComponent
    },
    {
        path: 'configuration',
        component:  ConfigurationComponent
    },
    
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministratorRoutingModule { }