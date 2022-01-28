import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuardService } from './core/auth/auth-guard.service';
import { ExtraComponent } from './extra.component';

// 全空白页面
const routes = [
  {
    path: '',
    component: ExtraComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'portal',
        loadChildren: () => import('@module/portal/portal-extra.module').then((m) => m.PortalExtraModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtraRoutesModule { }
