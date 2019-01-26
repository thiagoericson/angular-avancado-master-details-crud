import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError, flatMap } from "rxjs/operators";

import { CategoryService } from "../../categories/shared/category.service";

import { Entry } from "./entry.model";

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = "/api/entries";

  constructor(private http: HttpClient, private categoryService: CategoryService) { }

  getAll(): Observable<Entry[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries)
    )
  }

  getById(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    )
  }

  create(entry: Entry): Observable<any> {
    return this.categoryService.getById(entry.categoryId).pipe(
      /**
       * usa-se o flatMap() pois é um Observable dentro de outro Observable
      */
      flatMap(category => {
        entry.category = category;
        return this.http.post(this.apiPath, entry).pipe(
          catchError(this.handleError),
          map(this.jsonDataToEntry)
        )
      })
    ) 
  }

  update(entry: Entry): Observable<Entry> { // Depois dos dois pontos é o tipo do retorno
    const url = `${this.apiPath}/${entry.id}`;

    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => { // category é o retorno da requisição
        entry.category = category
        return this.http.put(url, entry).pipe(
          catchError(this.handleError),
          map(() => entry) // força o retorno do mesmo objeto, pois no put não tem retorno do objeto
        )
      })
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleError), // manipulador de erro
      map(() => null)
    )
  }

  // PRIVATE METHODS
  private jsonDataToEntries(jsonData: any[]): Entry[] {
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

  private jsonDataToEntry(jsonData: any): Entry {
    return jsonData as Entry;
  }

  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÃO =>", error)
    return throwError(error)
  }
}
