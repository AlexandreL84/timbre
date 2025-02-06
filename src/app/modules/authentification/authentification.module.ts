import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MaterialModule, ZInputModule} from "@libs/z-tools";
import {FormsModule} from "@angular/forms";

const route = [{path: "login", component: LoginComponent}];

@NgModule({
    declarations: [LoginComponent],
    imports: [CommonModule, RouterModule.forChild(route), MaterialModule, FlexLayoutModule, ZInputModule, FormsModule],
})
export class AuthentificationModule {}
