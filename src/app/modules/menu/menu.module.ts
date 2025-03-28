import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {DirectiveModule} from "../../shared/directives/directive.module";
import {MenuComponent} from "./components/menu.component";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {LibIconModule} from "../../shared/components/lib-icon";
import {TimbreService} from "../../shared/services/timbre/timbre.service";


@NgModule({
	declarations: [MenuComponent],
	imports: [CommonModule, FlexLayoutModule, FormsModule, MatCheckbox, MatProgressSpinner, DirectiveModule, ReactiveFormsModule, MatIcon, MatIconButton, LibIconModule, MatButton],
	exports: [
		MenuComponent
	],
	providers: [TimbreService]
})
export class MenuModule {
}
