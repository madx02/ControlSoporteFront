import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';

import { RoutesComponent } from '../../routes/routes.component';
import { CustomersComponent } from '../../customers/customers.component';
import { PlannedComponent } from '../../planned/planned.component';
import { HomeVisitsComponent } from '../../home-visits/home-visits.component';
import { VisitsAttentionComponent } from '../../visits-attention/visits-attention.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    // { path: 'user-profile',   component: UserProfileComponent },
    { path: 'routes',  component: RoutesComponent },
    { path: 'customers',  component: CustomersComponent },
    { path: 'planned',  component: PlannedComponent },
    { path: 'homeVisits',  component: HomeVisitsComponent }, //
    { path: 'visits-attention',  component: VisitsAttentionComponent },
];
