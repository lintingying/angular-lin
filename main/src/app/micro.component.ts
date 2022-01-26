import { Component, AfterViewInit, OnInit } from '@angular/core';
import { start } from 'qiankun';
import { StartService } from './core/init/start.service';

/**
 * 如何在主应用的某个路由页面加载微应用
 * https://qiankun.umijs.org/zh/faq
 */
@Component({
  selector: 'app-micro',
  template: ``,
})
export class MicroComponent implements OnInit, AfterViewInit {
  CONTAINER = 'micro-app-container';
  constructor(private startSvc: StartService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const apps = this.startSvc.getConfig().MicroApps;

    if (!window.qiankunStarted && apps && apps.length > 0 && document.getElementById(this.CONTAINER)) {
      window.qiankunStarted = true;
      start({
        prefetch: 'all',
        // 指定部分特殊的动态加载的微应用资源（css/js) 不被 qiankun 劫持处理
        excludeAssetFilter: (assetUrl: string) => {
          if (assetUrl.includes('/assets/')) {
            return true;
          }
        },
      });
    }
  }
}
