import { Component, OnInit } from '@angular/core';
import { Config } from 'src/app/core/init/config';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.less']
})
export class PortalComponent implements OnInit {

  constructor(private config: Config) { }

  ngOnInit() {
    console.log(this.config);
  }

}
