import { NgModule } from '@angular/core';
import { PortalRoutes } from './portal.routing';
import { SharedModule } from '@shared/shared.module';
import { IndexComponent } from './pages/index/index.component';
import { ListComponent } from './components/list/list.component';
@NgModule({
  imports: [
    SharedModule,
    PortalRoutes,
  ],
  declarations: [IndexComponent, ListComponent]
})
export class PortalModule { }
