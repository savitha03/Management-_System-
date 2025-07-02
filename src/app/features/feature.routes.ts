import { Routes } from '@angular/router';
import { FeatureContainer } from './components/feature-container/feature-container';
import { Dashboard } from './components/dashboard/dashboard';

import { Settings } from './components/settings/settings';
import { Notifications } from './components/notifications/notifications';
import { Announcements } from './components/announcements/announcements';
import { MyLeaves } from './components/my-leaves/my-leaves/my-leaves';
import { LeaveSummary } from './components/my-leaves/leave-summary/leave-summary';
import { LeaveHistory } from './components/my-leaves/leave-history/leave-history';
import { ApplyLeaveComponent } from './components/my-leaves/apply-leave/apply-leave.component';
import { EmployeeDetailsComponent } from './components/employee-details/employee-details.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { PersonalDetailsComponent } from './components/personal-details/personal-details.component';
import { EmploymentDetailsComponent } from './components/employment-details/employment-details.component';

export const FeatureRoutes: Routes = [
  {
    path: 'management',
    component: FeatureContainer,
    children: [
      // { path: 'dashboard', component: Dashboard },
      { path: 'settings', component: Settings },
      { path: 'notifications', component: Notifications },
      { path: 'announcements', component: Announcements },

      { path: 'employees', 
        component: EmployeesComponent,
      },
      {
        path:'personal-details',
        component:PersonalDetailsComponent,
      },
      {
        path:'employement-details',
        component:EmploymentDetailsComponent,
      },
      {
        path: 'leaves',
        component: MyLeaves,
        children: [
          {
            path: 'apply-leave',
            component: ApplyLeaveComponent,
          },
          {
            path: 'my-leaves',
            component: LeaveSummary,
          },
          {
            path: 'history',
            component: LeaveHistory,
          },
          {
            path:'leave-summary',
            component:LeaveSummary,
          }
        ],
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'management',
    pathMatch: 'full',
  },
];
