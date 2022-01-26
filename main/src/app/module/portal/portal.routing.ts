import { Routes, RouterModule } from '@angular/router';
import { PortalComponent } from './portal.component';

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: PortalComponent, data: { title: '首页' } },
];

export const PortalRoutes = RouterModule.forChild(routes);
