import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {DirectiveModule} from "../../shared/directives/directive.module";
import {LoginComponent} from "./components/login/login.component";
import {HeaderModule} from "../header/header.module";
import {MatButton} from "@angular/material/button";
import {ZLibelleModelModule} from "../../shared/components/z-libelle-model";
import {MatError} from "@angular/material/form-field";
import {ZSpinnerModule} from "../../shared/components/z-spinner";

const route = [{path: "", component: LoginComponent}];

@NgModule({
	declarations: [LoginComponent],
	imports: [CommonModule, RouterModule.forChild(route), FlexLayoutModule, FormsModule, MatCheckbox, MatProgressSpinner, DirectiveModule, ReactiveFormsModule, HeaderModule, MatButton, ZLibelleModelModule, MatError, ZSpinnerModule],
})
export class AuthentificationModule {
}
