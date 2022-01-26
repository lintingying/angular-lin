import { NgModule } from '@angular/core';
import { PortalComponent } from './portal.component';
import { PortalRoutes } from './portal.routing';
import { SharedModule } from '@shared/shared.module';
@NgModule({
  imports: [
    SharedModule,
    PortalRoutes,
  ],
  declarations: [PortalComponent]
})
export class PortalModule { }
