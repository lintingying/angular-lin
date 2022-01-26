import { NgModule } from '@angular/core';
import { AppRoutesModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmptyComponent } from './empty.component';
import { LayoutModule } from './layout/layout.module';
import { MicroComponent } from './micro.component';
@NgModule({
  declarations: [
    AppComponent,
    MicroComponent,
    EmptyComponent
  ],
  imports: [
    AppRoutesModule,
    LayoutModule,
  ],
})
export class AppModule { }
