import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PageNotFoundComponent} from "./page-not-found.component";
import {RouterModule} from "@angular/router";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";

const route = [{path: "", component: PageNotFoundComponent}];

@NgModule({
    declarations: [PageNotFoundComponent],
    imports: [CommonModule, RouterModule.forChild(route), FlexLayoutModule, MatButtonModule],
})
export class PageNotFoundModule {}
