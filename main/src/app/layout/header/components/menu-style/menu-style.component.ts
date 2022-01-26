import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-menu-style',
  templateUrl: './menu-style.component.html',
  styleUrls: ['./menu-style.component.less']
})
export class MenuStyleComponent implements OnInit {

  @Input() type: string;

  constructor() { }

  ngOnInit() {
  }

}
