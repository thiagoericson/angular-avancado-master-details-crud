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
    constructor(
        protected apiPath: string,
        protected injector: Injector,
        protected jsonDataToResourceFn: (jsonData: any) => T // um método como parametro, que recebe o jsonData como parametro e retorna um objeto do tipo T
    ) {
        this.http = injector.get(HttpClient);
    }

    getAll(): Observable<T[]> {
        return this.http.get(this.apiPath).pipe(
            // Os métodos são executados na ordem que estão
            map(this.jsonDataToResources.bind(this)), // passar o .bind(this) indica qual o contexto que deve ser usado quando a função for chamada.
            // se o handleError ficar por ultimo, sempre vai pegar qualquer erro que ocorra
            catchError(this.handleError)
        )
    }

    getById(id: number): Observable<T> {
        const url = `${this.apiPath}/${id}`;

        return this.http.get(url).pipe(
            // Os métodos são executados na ordem que estão
            map(this.jsonDataToResource.bind(this)), // passar o .bind(this) indica qual o contexto que deve ser usado quando a função for chamada.
            // se o handleError ficar por ultimo, sempre vai pegar qualquer erro que ocorra
            catchError(this.handleError)
        )
    }

    create(resource: T): Observable<T> {
        return this.http.post(this.apiPath, resource).pipe(
            // Os métodos são executados na ordem que estão
            map(this.jsonDataToResource.bind(this)), // passar o .bind(this) indica qual o contexto que deve ser usado quando a função for chamada.
            // se o handleError ficar por ultimo, sempre vai pegar qualquer erro que ocorra
            catchError(this.handleError)
        )
    }

    update(resource: T): Observable<T> {
        const url = `${this.apiPath}/${resource.id}`;

        return this.http.put(url, resource).pipe(
            // Os métodos são executados na ordem que estão
            map(() => resource), // força o retorno do mesmo objeto, pois no put não tem retorno do objeto
            // se o handleError ficar por ultimo, sempre vai pegar qualquer erro que ocorra
            catchError(this.handleError)
        )
    }

    delete(id: number): Observable<any> {
        const url = `${this.apiPath}/${id}`;

        return this.http.delete(url).pipe(
            // Os métodos são executados na ordem que estão
            map(() => null),
            // se o handleError ficar por ultimo, sempre vai pegar qualquer erro que ocorra
            catchError(this.handleError) // manipulador de erro
        )
    }

    // PROTECTED METHODS

    protected jsonDataToResources(jsonData: any[]): T[] {
        const resources: T[] = [];
        jsonData.forEach(
            // Roda um loop, chamando a function enviada via parametro no constructor.
            element => resources.push(this.jsonDataToResourceFn(element))
        );
        return resources;
    }

    protected jsonDataToResource(jsonData: any): T {
        // return jsonData as T; // Converte jsonData para o formato do Tipo <T> (Category, Entry, etc)
        // usa a function enviada via parametro para converter o jsonData para um Object do tipo T.
        return this.jsonDataToResourceFn(jsonData); 
    }

    protected handleError(error: any): Observable<any> {
        console.log("ERRO NA REQUISIÇÃO =>", error)
        return throwError(error)
    }
}