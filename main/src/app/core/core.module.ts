import { NgModule, SkipSelf, Optional, APP_INITIALIZER, ModuleWithProviders } from '@angular/core';
import zh from '@angular/common/locales/zh';
import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StartService } from './init/start.service';
import { StartServiceFactory } from './init/start-service-factory';
import { HeaderInterceptor } from './interceptors/header-interceptor';
import { ResponseInterceptor } from './interceptors/response-interceptor';
import { throwIfAlreadyLoaded } from './init/module-import-guard';

registerLocaleData(zh);

@NgModule({
  imports: [HttpClientModule, HttpClientJsonpModule],
  declarations: [],
  providers: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: APP_INITIALIZER,
          useFactory: StartServiceFactory,
          deps: [StartService],
          multi: true
        },
        // { provide: PlatformLocation, useClass: BrowserPlatformLocation, deps: [DOCUMENT, ENVIRONMENT] },
        // {
        //   provide: LocationStrategy,
        //   useFactory: provideLocationStrategy,
        //   deps: [PlatformLocation, [new Inject(APP_BASE_HREF), new Optional()], ENVIRONMENT, ROUTER_CONFIGURATION],
        // },
        { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
        StartService,
      ],
    };
  }
}


// ANGULAR使用FORROOT() 注册单一实例服务
// 一个应用程序中可以运行多个拦截器。注：拦截器将只拦截使用HttpClient服务发出的请求
// multi: true是必须的，因为它会告诉 Angular 这个 HTTP_INTERCEPTORS 表示的是一个数组，而不是单个的值。
