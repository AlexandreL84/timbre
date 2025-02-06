import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {DirectiveModule} from "../../ui/directives/directive.module";

const route = [{path: "login", component: LoginComponent}];

@NgModule({
    declarations: [LoginComponent],
  imports: [CommonModule, RouterModule.forChild(route), FlexLayoutModule, FormsModule, MatCheckbox, MatProgressSpinner, DirectiveModule, ReactiveFormsModule],
})
export class AuthentificationModule {}
