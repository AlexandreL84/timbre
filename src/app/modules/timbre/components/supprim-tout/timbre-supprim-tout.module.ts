import {NgModule} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {FlexLayoutModule, FlexModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {TimbreSupprimComponent} from "./timbre-supprim.component";
import {MaterialModule} from "../../../../shared/modules/material.module";
import {LibSpinnerModule} from "../../../../shared/components/lib-spinner";
import {LibIconModule} from "../../../../shared/components/lib-icon";
import {TimbreSupprimService} from "../../../../shared/services/timbre/timbre-supprim.service";
import {provideHttpClient} from "@angular/common/http";
import {TimbreSupprimChoixAnneeComponent} from "./choix-annee/timbre-supprim-choix-annee.component";
import {DirectiveModule} from "../../../../shared/directives/directive.module";

@NgModule({
	declarations: [
		TimbreSupprimComponent,
		TimbreSupprimChoixAnneeComponent
	],
	imports: [
		MaterialModule,
		CommonModule,
		FlexModule,
		FlexLayoutModule,
		FormsModule,
		AsyncPipe,
		LibSpinnerModule,
		LibIconModule,
		DirectiveModule,
	],
	exports: [
		TimbreSupprimComponent,
		TimbreSupprimChoixAnneeComponent
	],
	providers: [TimbreSupprimService, provideHttpClient()]
})
export class TimbreSupprimToutModule {
}
