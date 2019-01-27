import { TestBed } from '@angular/core/testing';
import { BaseResourceModel } from "../models/base-resource.model";

import { Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

/**
 * <T extends BaseResourceModel> = Essa configuração signfica que, qualquer tipo
 * que for passado (Entry, Category, etc), estará extendendo automaticamente a classe BaseResourceModel,
 * deta forma, ele já implementa os métodos/recursos da classe base.
 */

export abstract class BaseResourceService<T extends BaseResourceModel>{

    // <T> -> Tipo Genérico https://www.typescriptlang.org/docs/handbook/generics.html

    protected http: HttpClient;

    /**
     * Usando Injector, não precisa declarar todas as dependencias no constructor,
     * o próprio recurso de injestão de dependencias (Injector) faz o trabalho de adicionar novas
     * dependencias, de maneira que as outras classes que extendem esta classe, não precisam também
     * passar essas dependencias no super(), que seria obrigatório/requerido e sim, apenas o injector.
     * Do contrário, se precisar de 10 dependencias, todas as classes que extendem, teriam que 
     * passar essas 10 dependencias no super(), para poder usar essa class abstract.
     */
    constructor(protected apiPath: string, protected injector: Injector) { 
        this.http = injector.get(HttpClient);
    }

    getAll(): Observable<T[]> {
        return this.http.get(this.apiPath).pipe(
            catchError(this.handleError),
            map(this.jsonDataToResources)
        )
    }

    getById(id: number): Observable<T> {
        const url = `${this.apiPath}/${id}`;

        return this.http.get(url).pipe(
            catchError(this.handleError),
            map(this.jsonDataToResource)
        )
    }

    create(resource: T): Observable<T> {
        return this.http.post(this.apiPath, resource).pipe(
            catchError(this.handleError),
            map(this.jsonDataToResource)
        )
    }

    update(resource: T): Observable<T> {
        const url = `${this.apiPath}/${resource.id}`;

        return this.http.put(url, resource).pipe(
            catchError(this.handleError),
            map(() => resource) // força o retorno do mesmo objeto, pois no put não tem retorno do objeto
        )
    }

    delete(id: number): Observable<any> {
        const url = `${this.apiPath}/${id}`;

        return this.http.delete(url).pipe(
            catchError(this.handleError), // manipulador de erro
            map(() => null)
        )
    }

    // PROTECTED METHODS

    protected jsonDataToResources(jsonData: any[]): T[] {
        const resources: T[] = [];
        jsonData.forEach(element => resources.push(element as T));
        return resources;
    }

    protected jsonDataToResource(jsonData: any): T {
        return jsonData as T; // Converte jsonData para o formato do Tipo <T> (Category, Entry, etc)
    }

    protected handleError(error: any): Observable<any> {
        console.log("ERRO NA REQUISIÇÃO =>", error)
        return throwError(error)
    }
}