import {NgModule} from "@angular/core";
import {PageNotFoundComponent} from "./page-not-found.component";
import {RouterModule} from "@angular/router";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import {DirectiveModule} from "../../shared/directives/directive.module";
import {LibIconModule} from "../../shared/components/lib-icon";
import {ReactiveFormsModule} from "@angular/forms";

const route = [{path: "", component: PageNotFoundComponent}];

@NgModule({
    declarations: [PageNotFoundComponent],
	imports: [RouterModule.forChild(route), FlexLayoutModule, MatButtonModule, DirectiveModule, LibIconModule, ReactiveFormsModule],
})
export class PageNotFoundModule {}
