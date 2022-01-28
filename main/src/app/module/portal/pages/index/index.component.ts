import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from 'src/app/core/init/config';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {

  constructor(private config: Config, private router: Router) { }

  ngOnInit() {
    console.log(this.config);
  }

  open() {
    this.router.navigate(['/extra/portal/article-detail'])
  }
}
