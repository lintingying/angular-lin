import { Routes, RouterModule } from '@angular/router';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'article-detail',
        component: ArticleDetailComponent
      }
    ]
  }
];
export const PortalExtraRoutes = RouterModule.forChild(routes);
