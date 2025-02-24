import {NgModule} from "@angular/core";
import {NoEspaceDirective} from "./no-espace.directive";
import {ControlErrorsDirective} from "./control";
import {TrimDirective} from "./trim.directive";
import {MaxDirective, MinDirective} from "./coherence";
import {UpperCaseDirective} from "./upper-case.directive";
import {DragAndDropDirective} from "./drag-and-drop.directive";
import {FormatDirective} from "./format.directive";

@NgModule({
    declarations: [
        NoEspaceDirective,
		ControlErrorsDirective,
		TrimDirective,
		MinDirective,
		MaxDirective,
		UpperCaseDirective,
		DragAndDropDirective,
		FormatDirective
    ],
	exports: [
		NoEspaceDirective,
		ControlErrorsDirective,
		TrimDirective,
		MinDirective,
		MaxDirective,
		UpperCaseDirective,
		DragAndDropDirective,
		FormatDirective
	],
    imports: [],
    providers: [],
})
export class DirectiveModule {}
