import { Component, OnInit, Input } from '@angular/core';

interface BreadCrumbItem {
  text: string;
  link?: string; // quando coloca '?' o campo deixa de ser obrigatório
}

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent implements OnInit {

  @Input() items: Array<BreadCrumbItem> = [];

  constructor() { }

  ngOnInit() {
  }

  isTheLastItem(item: BreadCrumbItem): boolean {
    const index = this.items.indexOf(item)
    // se o index do item for do tamanho do length, retorna true
    return index + 1 == this.items.length;
  }
}
