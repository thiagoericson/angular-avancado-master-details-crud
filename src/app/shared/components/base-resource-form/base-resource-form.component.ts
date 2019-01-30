import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { BaseResourceModel } from "../../models/base-resource.model";
import { BaseResourceService } from "../../services/base-resource.service";

import { switchMap } from "rxjs/operators";

import toastr from "toastr";

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

    currentAction: string;
    resourceForm: FormGroup;
    pageTitle: string;
    serverErrorMessages: string[] = null;
    submittingForm: boolean = false;

    protected route: ActivatedRoute;
    protected router: Router;
    protected formBuilder: FormBuilder;

    constructor(
        protected injector: Injector,
        public resource: T,
        protected resourceService: BaseResourceService<T>,
        protected jsonDataToResourceFn: (jsonData) => T
    ) {
        this.route = this.injector.get(ActivatedRoute);
        this.router = this.injector.get(Router);
        this.formBuilder = this.injector.get(FormBuilder);
    }

    ngOnInit() {
        this.setCurrentAction();
        this.buildResourceForm();
        this.loadResource();
    }

    ngAfterContentChecked() {
        this.setPageTitle();
    }

    submitForm() {
        this.submittingForm = true;

        if (this.currentAction == "new")
            this.createResource();
        else // currentAction == "edit"
            this.updateResource();
    }

    // PROTECTED METHODS
    protected setCurrentAction() {
        // pega o último level da url
        if (this.route.snapshot.url[0].path == "new")
            this.currentAction = "new"
        else
            this.currentAction = "edit"
    }

    protected loadResource() {
        if (this.currentAction == "edit") {
            this.route.paramMap.pipe(
                switchMap(params => this.resourceService.getById(+params.get("id"))) // colocando '+' faz um cast pra inteiro
            )
                .subscribe(
                    (resource) => {
                        this.resource = resource
                        this.resourceForm.patchValue(resource) // binds loaded category data to CategoryForm
                    },
                    (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
                )
        }
    }

    protected setPageTitle() {
        if (this.currentAction == 'new')
            this.pageTitle = this.creationPageTitle()
        else {
            this.pageTitle = this.editionPageTitle()
        }
    }

    protected creationPageTitle(): string {
        return "Novo"
    }

    protected editionPageTitle(): string {
        return "Edição"
    }

    protected createResource() {
        const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

        this.resourceService.create(resource)
            .subscribe(
                resource => this.actionsForSuccess(resource),
                error => this.actionsForError(resource)
            )
    }

    protected updateResource() {
        const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

        this.resourceService.update(resource)
            .subscribe(
                resource => this.actionsForSuccess(resource),
                error => this.actionsForError(error)
            )
    }

    protected actionsForSuccess(resource: T) {
        toastr.success("Solicitação processada com sucesso");

        const baseComponentPath: string = this.route.snapshot.parent.url[0].path;

        console.log('baseComponentPath', baseComponentPath);

        // força o recarregamento do componente
        this.router.navigateByUrl(baseComponentPath, { skipLocationChange: true }).then( // promise
            () => this.router.navigate([baseComponentPath, resource.id, "edit"])
        )
    }

    protected actionsForError(error) {
        toastr.error("Ocorreu um erro ao processar a sua solicitação!");

        this.submittingForm = false;

        if (error.status === 422)
            this.serverErrorMessages = JSON.parse(error._body).errors;
        else
            this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente mais tarde."]
    }

    /**
     * Este método abstrato obriga que qualquer classe que herde esta classe, implemente o método.
     * Neste caso, não há como fazer um método de form generico para todas as classes, no entanto é necessário
     * possuir um para funcionar, por isso, obrigamos a classe herdeira a implementá-lo.
     */
    protected abstract buildResourceForm(): void;
}
