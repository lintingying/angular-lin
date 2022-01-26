import { Component, OnInit } from '@angular/core';
import { MenuType } from './model/layout';
import { SettingsService } from './services/settings.service';
import { ThemesService } from './services/themes.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit {

  MenuType = MenuType;
  loadReady = false;

  constructor(
    public settings: SettingsService,
    // private userService: UserService,
    private themesSvc: ThemesService,
  ) { }

  ngOnInit(): void {
    this.themesSvc.inited.subscribe(r => {
      this.loadReady = r;
    });
  }

}
