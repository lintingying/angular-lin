import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./app.module').then((m) => m.AppModule) },
  { path: '**', redirectTo: 'project' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false, enableTracing: false })],
  exports: [RouterModule],
})
export class RootRoutingModule { }
