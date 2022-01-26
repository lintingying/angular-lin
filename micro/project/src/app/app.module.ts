import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ApplyComponent } from './pages/apply/apply.component';
import { SettingComponent } from './pages/setting/setting.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';

@NgModule({
  declarations: [ApplyComponent, StatisticsComponent, SettingComponent],
  imports: [AppRoutingModule],
  providers: [],
})
export class AppModule { }
