import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { ApplyComponent } from './pages/apply/apply.component';
import { SettingComponent } from './pages/setting/setting.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';

const routes: Routes = [
  {
    path: 'project',
    // canActivateChild: [RightGuard],
    children: [
      { path: '', redirectTo: 'week', pathMatch: 'full' },
      { path: 'apply', component: ApplyComponent },
      { path: 'statistics', component: StatisticsComponent },
      { path: 'setting', component: SettingComponent },
      { path: '**', redirectTo: '/404' },
    ],
  },
  { path: '**', component: EmptyRouteComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
