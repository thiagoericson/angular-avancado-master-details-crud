import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {

  /**
      <app-page-header 
        [page-title]=""
        [button-class]=""
        [button-text]=""
        [button-link]=""
        ></app-page-header>
   */
  @Input('page-title') pageTitle: string;
  @Input('show-button') showButton: boolean = true;
  @Input('button-class') buttonClass: string;
  @Input('button-text') buttonText: string;
  @Input('button-link') buttonLink: string;

  constructor() { }

  ngOnInit() {
  }

}
