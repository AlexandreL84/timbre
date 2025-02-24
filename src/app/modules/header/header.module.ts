import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {DirectiveModule} from "../../shared/directives/directive.module";
import {HeaderComponent} from "./components/header/header.component";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {ZIconModule} from "../../shared/components/z-icon";


@NgModule({
    declarations: [HeaderComponent],
    imports: [CommonModule, FlexLayoutModule, FormsModule, MatCheckbox, MatProgressSpinner, DirectiveModule, ReactiveFormsModule, MatIcon, MatIconButton, ZIconModule],
    exports: [
        HeaderComponent
    ]
})
export class HeaderModule {}
