import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuardService } from './core/auth/auth-guard.service';
import { RightGuardService } from './core/right/right-guard.service';
import { EmptyComponent } from './empty.component';
import { MicroComponent } from './micro.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [RightGuardService],
    children: [
      { path: '', redirectTo: 'portal', pathMatch: 'full' },
      {
        path: 'portal',
        loadChildren: () => import('@module/portal/portal.module').then(m => m.PortalModule),
      },
      {
        path: 'project',
        component: MicroComponent,
        children: [{ path: '**', component: EmptyComponent }],
      },
      {
        path: 'matter',
        component: MicroComponent,
        children: [{ path: '**', component: EmptyComponent }],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutesModule { }
