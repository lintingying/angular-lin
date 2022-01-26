import { Component, OnInit } from '@angular/core';
import { MenuType } from '../model/layout';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  /**
   * 界面菜单布局
   */
  MenuType = MenuType;
  isCollapsed: boolean = false;
  fullLogoSrc: string;
  miniLogoSrc: string;
  constructor(public settings: SettingsService) { }

  ngOnInit() {
    this.isCollapsed = this.settings.layout.collapsed;
    // this.fullLogoSrc = `/api/Attachment/File/GetTenantLogo?${this.token}&modcode=${this.fullLogoModcode}`;
    // this.miniLogoSrc = `/api/Attachment/File/GetTenantLogo?${this.token}&modcode=${this.miniLogoModcode}`;
  }
  toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed;
    this.settings.setLayout('collapsed', this.isCollapsed);
  }

}
