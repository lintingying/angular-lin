import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { registerMicroApps } from 'qiankun';
import { Config } from './core/init/config';

@Component({
  selector: 'app-app',
  template: `<app-layout></app-layout>`
})
export class AppComponent implements OnInit {
  CONTAINER = '#micro-app-container';
  microApps = [];
  constructor(private router: Router, private config: Config) { }

  ngOnInit(): void {
    const apps = this.config.MicroApps;
    if (apps && apps.length > 0) {
      apps.forEach((entry: any) => {
        const paths = `/micro/${entry.Path}`;
        const name = entry.Name;
        const app = {
          name: name,
          entry: paths,
          container: this.CONTAINER,
          activeRule: () => {
            return this.canActive(`/${name}`);
          },
        };
        this.microApps.push(app);
      });

      registerMicroApps(this.microApps);
    }
  }

  canActive(url: string) {
    return this.router.url.startsWith(url);
  }

}
