import { Component, OnInit } from '@angular/core';
import { MenuThemeType, MenuType } from 'src/app/layout/model/layout';
import { SettingsService } from 'src/app/layout/services/settings.service';
import { ThemesService } from 'src/app/layout/services/themes.service';


@Component({
  selector: 'app-header-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.less'],
})
export class HeaderThemeComponent implements OnInit {
  MenuType = MenuType;

  themes: { l: string; title: string; bg: string }[] = [
    { l: 'magenta', title: '法式洋红', bg: '#eb2f96' },
    { l: 'seagreen', title: '海藻绿', bg: '#3CB371' },
    { l: 'blue', title: '拂晓蓝（默认）', bg: '#1890ff' },
    { l: 'geekblue', title: '极客蓝', bg: '#2f54eb' },
    { l: 'purple', title: '酱紫', bg: '#722ed1' },
  ];

  menuStyles: { l: MenuThemeType; title: string; bg: string }[] = [
    { l: 'light', title: '亮色菜单风格', bg: '#fff' },
    { l: 'dark', title: '暗色菜单风格', bg: '#001529' },
  ];

  constructor(public settings: SettingsService, private themeServ: ThemesService) { }

  ngOnInit(): void {
  }

  changeTheme(theme: string) {
    this.themeServ.setTheme(theme);
    this.settings.setLayout('theme', theme);
  }
  changeCompact(compact: boolean) {
    this.themeServ.setCompact(compact);
    this.settings.setLayout('compact', compact);
  }
  changeMenuStyles(menuStyle: MenuThemeType) {
    // this.themeServ.setMenuStyle(menuStyle);
    this.settings.setLayout('menuThemeType', menuStyle);
  }
}
