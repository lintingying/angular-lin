import { LOCALE_ID, NgModule } from '@angular/core';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { RootComponent } from './root.component';
import { BrowserModule } from '@angular/platform-browser';
import { RootRoutesModule } from './root-routing.module';
import { SharedModule } from '@shared/shared.module';
import { CoreModule } from './core/core.module';
import { IconModule } from '@ant-design/icons-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
registerLocaleData(zh);

@NgModule({
  declarations: [RootComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule, // 应该在根模块中导入一次 ta为浏览器所做的应用配置只会使用一次
    RootRoutesModule,
    CoreModule.forRoot(),
    SharedModule,
    IconModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'zh' },
    { provide: NZ_I18N, useValue: zh_CN },
  ],
  bootstrap: [RootComponent],
})

export class RootModule { }
