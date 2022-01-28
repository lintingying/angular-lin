import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { PortalExtraRoutes } from './portal-extra.routing';

@NgModule({
  imports: [SharedModule, PortalExtraRoutes],
  declarations: [ArticleDetailComponent],
})
export class PortalExtraModule { }
