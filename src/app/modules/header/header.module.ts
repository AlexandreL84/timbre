import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {HeaderComponent} from "./components/header.component";
import {LibIconModule} from "../../shared/components/lib-icon";

@NgModule({
	declarations: [HeaderComponent],
	imports: [CommonModule, LibIconModule],
	exports: [
		HeaderComponent
	],
})

export class HeaderModule {
}
