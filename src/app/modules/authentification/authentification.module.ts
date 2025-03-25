import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {DirectiveModule} from "../../shared/directives/directive.module";
import {LoginComponent} from "./components/login/login.component";
import {MatButton} from "@angular/material/button";
import {MatError} from "@angular/material/form-field";
import {LibSpinnerModule} from "../../shared/components/lib-spinner";
import {LibLibelleModelModule} from "../../shared/components/lib-libelle-model";
import {LibIconModule} from "../../shared/components/lib-icon";
import {ErrorModule} from "../error";

const route = [{path: "", component: LoginComponent}];

@NgModule({
	declarations: [LoginComponent],
	imports: [CommonModule,
		RouterModule.forChild(route),
		FlexLayoutModule,
		FormsModule,
		MatCheckbox,
		MatProgressSpinner,
		DirectiveModule,
		ReactiveFormsModule,
		MatButton,
		LibLibelleModelModule,
		MatError,
		LibSpinnerModule,
		LibIconModule,
		ErrorModule
	],
})
export class AuthentificationModule {
}
