import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MenuThemeType, MenuType } from '../model/layout';
import { Platform } from 'src/app/util/platform';
import { LazyService } from './lazy.service';
import { SettingsService } from './settings.service';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class ThemesService {

  inited = new ReplaySubject<boolean>();

  constructor(public settings: SettingsService, private lazy: LazyService, @Inject(DOCUMENT) private doc: Document) {
    settings.loadLayout().subscribe(r => {
      this.setTheme(settings.layout.theme);
      this.setMenuStyle(settings.layout.menuThemeType);
      this.setMenuType(settings.layout.menuType);
      this.inited.next(true);
    });
  }

  setTheme(name: string) {
    this.loadTheme(name).then(() => {
      this.setCompact(this.settings.layout.compact);
    });
  }

  setCompact(compact: boolean) {
    const dom = document.getElementById('site-theme');
    if (dom) {
      if (Platform.isIE()) {
        (dom as any).removeNode(true);
      } else {
        dom.remove();
      }
    }
    const bodyEl = this.doc.querySelector('body');
    bodyEl.classList.remove('compact');
    if (compact) {
      bodyEl.classList.add('compact');
      const themeResUri = '/assets/css/themes/';
      const style = document.createElement('link');
      style.type = 'text/css';
      style.rel = 'stylesheet';
      style.id = 'site-theme';
      style.href = `${themeResUri}compact.css`;
      this.doc.querySelector('head').appendChild(style);
    }
  }

  private loadTheme(themeName: string): Promise<void> {
    if (themeName === 'blue') {
      this.SetThemeCss(themeName);
      return new Promise(res => res());
    } else {
      const themeResUri = '/assets/css/themes/';
      return (
        // version跟随ng-zorro-antd更新
        this.lazy
          .loadStyle(`${themeResUri}theme-${themeName.toLowerCase()}.css?v=1.4.0&t=190105`, 'stylesheet', '', this.doc.querySelector('body'))
          .then(() => {
            this.SetThemeCss(themeName);
          })
      );
    }
  }
  private SetThemeCss(themeName: string) {
    const bodyEl = this.doc.querySelector('body');
    if (bodyEl.classList.length > 1) {
      const removeArr = [];
      for (let i in bodyEl.classList) {
        if (bodyEl.classList[i].startsWith('theme-') && bodyEl.classList[i].lastIndexOf('compact') < 0) {
          removeArr.push(bodyEl.classList[i]);
        }
      }

      removeArr.forEach(rm => {
        bodyEl.classList.remove(rm);
      });
    }
    bodyEl.classList.add(`theme-${themeName.toLowerCase()}`);
  }
  setMenuStyle(menuThemeType: MenuThemeType) {
    if (menuThemeType === 'dark') {
      const bodyEl = this.doc.querySelector('body');
      bodyEl.classList.add('layout-sider-dark');
    } else {
      const bodyEl = this.doc.querySelector('body');
      bodyEl.classList.remove('layout-sider-dark');
    }
  }
  setMenuType(menuType: MenuType) {
    const bodyEl = this.doc.querySelector('body');
    switch (menuType) {
      case MenuType.Top:
        bodyEl.classList.add('layout-menu-top');
        bodyEl.classList.remove('layout-menu-side');
        bodyEl.classList.remove('layout-menu-compact');
        break;
      case MenuType.Side:
        bodyEl.classList.add('layout-menu-side');
        bodyEl.classList.remove('layout-menu-top');
        bodyEl.classList.remove('layout-menu-compact');
        break;
      case MenuType.Compact:
        bodyEl.classList.add('layout-menu-compact');
        bodyEl.classList.remove('layout-menu-top');
        bodyEl.classList.remove('layout-menu-side');
        break;
    }
  }
}
