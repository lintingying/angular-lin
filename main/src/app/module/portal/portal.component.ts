import { StartService } from './../../core/init/start.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.less']
})
export class PortalComponent implements OnInit {

  constructor(private startSvc: StartService) { }

  ngOnInit() {
    console.log(this.startSvc.getConfig());

  }

}
