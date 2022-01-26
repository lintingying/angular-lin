import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { MenuStyleComponent } from './header/components/menu-style/menu-style.component';
import { HeaderThemeComponent } from './header/components/theme/theme.component';
import { ThemesService } from './services/themes.service';
import { SettingsService } from './services/settings.service';
import { LazyService } from './services/lazy.service';
import { SidebarComponent } from './sidebar/sidebar.component';

const COMPONENTS = [
  LayoutComponent,
  HeaderComponent,
  SidebarComponent,
];

const HEADERCOMPONENTS = [
  MenuStyleComponent,
  HeaderThemeComponent,
];

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    ThemesService,
    SettingsService,
    LazyService
  ],
  declarations: [
    ...COMPONENTS,
    ...HEADERCOMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ],
})
export class LayoutModule { }
