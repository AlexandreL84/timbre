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
import {TimbreSupprimToutModule} from "../timbre/components/supprim-tout/timbre-supprim-tout.module";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatHeaderCell} from "@angular/material/table";
import {MatSortHeader} from "@angular/material/sort";


@NgModule({
	declarations: [MenuComponent],
    imports: [CommonModule, FlexLayoutModule, FormsModule, MatCheckbox, MatProgressSpinner, DirectiveModule, ReactiveFormsModule, MatIcon, MatIconButton, LibIconModule, MatButton, TimbreSupprimToutModule, MatOption, MatSelect, MatHeaderCell, MatSortHeader],
	exports: [
		MenuComponent
	],
})
export class MenuModule {
}
