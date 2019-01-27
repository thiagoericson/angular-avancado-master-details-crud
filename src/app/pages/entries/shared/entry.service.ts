import { Injectable, Injector } from '@angular/core';

import { BaseResourceService } from "../../../shared/services/base-resource.service";

import { CategoryService } from "../../categories/shared/category.service";

import { Entry } from "./entry.model";

import { Observable } from "rxjs";
import { flatMap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(protected injector: Injector, private categoryService: CategoryService) {
    super("api/entries", injector)
  }

  create(entry: Entry): Observable<any> {
    return this.categoryService.getById(entry.categoryId).pipe(
      /**
       * usa-se o flatMap() pois é um Observable dentro de outro Observable
      */
      flatMap(category => {
        entry.category = category;
        // return this.http.post(this.apiPath, entry).pipe(
        //   catchError(this.handleError),
        //   map(this.jsonDataToResource)
        // )
        return super.create(entry)
      })
    )
  }

  update(entry: Entry): Observable<Entry> { // Depois dos dois pontos é o tipo do retorno
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => { // category é o retorno da requisição
        entry.category = category
        // return this.http.put(url, entry).pipe(
        //   catchError(this.handleError),
        //   map(() => entry) // força o retorno do mesmo objeto, pois no put não tem retorno do objeto
        // )
        return super.update(entry)
      })
    )
  }

  // PRIVATE METHODS

  protected jsonDataToResources(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    // jsonData.forEach(element => entry.push(element as Entry));
    /**
     * Da forma acima, faz apenas um cast (conversão)
     * Desta forma abaixo, converte para o Object, para conseguir usar o método paidText() na tela.
     */
    jsonData.forEach(element => {
      const entry = Object.assign(new Entry(), element)
      entries.push(entry);
    });
    return entries;
  }

  protected jsonDataToResource(jsonData: any): Entry {
    return jsonData as Entry;
  }
}
