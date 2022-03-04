import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventBusService } from '@shared/services/event-bus.service';
import { WebsocketService } from '@shared/services/websocket.service';
import { Config } from 'src/app/core/init/config';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {

  constructor(private config: Config, private router: Router, private eventbus: EventBusService, private websocketSvc: WebsocketService) { }

  ngOnInit() {
    console.log(this.config);
    this.websocketSvc.on('Portal', 'reload').subscribe(r => {
      console.log(r);
    })
  }

  reload() {
    this.eventbus.trigger('Portal', 'reload', true);
  }
  open() {
    this.router.navigate(['/extra/portal/article-detail'])
  }
}
