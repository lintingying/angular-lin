import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventBusService } from '@shared/services/event-bus.service';
import { Config } from 'src/app/core/init/config';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {

  constructor(private config: Config, private router: Router, private eventbus: EventBusService) { }

  ngOnInit() {
    console.log(this.config);
  }

  reload() {
    this.eventbus.trigger('portal', 'reload', true);
  }
  open() {
    this.router.navigate(['/extra/portal/article-detail'])
  }
}
