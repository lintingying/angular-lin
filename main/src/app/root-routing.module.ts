import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const rootRoutes = [
  // { path: 'extra', loadChildren: () => import('./extra.module').then(m => m.ExtraModule) },
  { path: '', loadChildren: () => import('./app.module').then(m => m.AppModule) },
  { path: '**', redirectTo: '404' },
];
@NgModule({
  imports: [RouterModule.forRoot(rootRoutes)],
  declarations: [],
  exports: [RouterModule],
})
export class RootRoutesModule { }
