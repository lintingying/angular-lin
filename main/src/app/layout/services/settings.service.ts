import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Layout, MenuType } from '../model/layout';
import { LocalStorageService } from 'angular-web-storage';

const KEY = 'layout';

@Injectable()
export class SettingsService {

  layout: Layout = {
    fixed: true,
    collapsed: false,
    boxed: false,
    theme: 'blue',
    lang: null,
    menuThemeType: 'light',
    menuType: MenuType.Side,
    compact: false
  };

  constructor(private local: LocalStorageService) { }

  loadLayout(): Observable<any> {
    const sub = new ReplaySubject<any>();
    const localStorage = this.local.get(KEY);
    if (localStorage != null) {
      // 优先从local storage中加载系统导航布局
      Object.assign(this.layout, localStorage);
    }
    switch (this.layout.menuType) {
      case MenuType.Top:
        this.layout = Object.assign(this.layout, { collapsed: false });
        break;
      case MenuType.Compact:
        this.layout = Object.assign(this.layout, { collapsed: true });
        break;
      default:
        if (window.innerWidth <= 1024) {
          // 装载用户缓存后，判断窗体大小并设置aside menu的折叠状态
          this.layout = Object.assign(this.layout, { collapsed: true });
        }
        break;
    }
    this.local.set(KEY, this.layout);
    sub.next(this.layout);
    sub.complete();
    return sub;
  }

  setLayout(name: string, value: any): boolean {
    if (typeof this.layout[name] !== 'undefined' && this.layout[name] !== value) {
      this.layout[name] = value;
      this.local.set(KEY, this.layout);
      return true;
    }
    return false;
  }

}
