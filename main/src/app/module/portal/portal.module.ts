import { NgModule } from '@angular/core';
import { PortalRoutes } from './portal.routing';
import { SharedModule } from '@shared/shared.module';
import { IndexComponent } from './pages/index/index.component';
@NgModule({
  imports: [
    SharedModule,
    PortalRoutes,
  ],
  declarations: [IndexComponent]
})
export class PortalModule { }
