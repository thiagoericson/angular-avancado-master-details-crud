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

  /**
      <app-bread-crumb
        [items]="[{text: 'Categorias', link: '/categories'}, {text: pageTitle}]"
        ></app-bread-crumb>
    
    A declaração abaixo, @Input(), permite que a tag do selector receba parametro via property binding, conforme acima.
  */
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
