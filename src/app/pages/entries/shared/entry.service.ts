import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError, flatMap } from "rxjs/operators";

import { Entry } from "./entry.model";

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = "api/entries";

  constructor(private http: HttpClient) { }

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

  create(entry: Entry): Observable<Entry> {
    return this.http.post(this.apiPath, entry)
  }

  update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`;

    return this.http.put(url, entry).pipe(
        catchError(this.handleError),
      map(() => entry) // força o retorno do mesmo objeto, pois no put não tem retorno do objeto
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
    const entry: Entry[] = [];
    jsonData.forEach(element => entry.push(element as Entry));
    return entry;
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return jsonData as Entry;
  }

  private handleError(error: any): Observable<any>{
    console.log("ERRO NA REQUISIÇÃO =>", error)
    return throwError(error)
  }
}
