import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const rootRoutes = [
  { path: 'extra', loadChildren: () => import('./extra.module').then(m => m.ExtraModule) },
  { path: '', loadChildren: () => import('./app.module').then(m => m.AppModule) },
  { path: '**', redirectTo: '404' },
];
@NgModule({
  imports: [RouterModule.forRoot(rootRoutes)],
  declarations: [],
  exports: [RouterModule],
})
export class RootRoutesModule { }

// 所有惰性加载模块(ExtraModule, AppModule)都要用带路由的模块(ExtraRoutesModule,AppRoutesModule)
// 带路由的模块不会导出任何内容，因为它们的组件永远不会出现在外部组件的模板中。
