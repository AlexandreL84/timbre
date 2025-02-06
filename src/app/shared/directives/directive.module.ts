import {NgModule} from "@angular/core";
import {NoEspaceDirective} from "./no-espace.directive";
import {ControlErrorsDirective} from "./control";

@NgModule({
    declarations: [
        NoEspaceDirective,
		ControlErrorsDirective
    ],
    exports: [
		NoEspaceDirective,
		ControlErrorsDirective
    ],
    imports: [],
    providers: [],
})
export class DirectiveModule {}
