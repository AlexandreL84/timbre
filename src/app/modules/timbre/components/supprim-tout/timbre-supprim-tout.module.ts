import {NgModule} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {FlexLayoutModule, FlexModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {TimbreSupprimToutComponent} from "./timbre-supprim-tout.component";
import {MaterialModule} from "../../../../shared/modules/material.module";
import {LibSpinnerModule} from "../../../../shared/components/lib-spinner";
import {LibIconModule} from "../../../../shared/components/lib-icon";
import {TimbreSupprimService} from "../../../../shared/services/timbre/timbre-supprim.service";
import {provideHttpClient} from "@angular/common/http";

@NgModule({
	declarations: [
		TimbreSupprimToutComponent
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
	],
	exports: [
		TimbreSupprimToutComponent
	],
	providers: [TimbreSupprimService, provideHttpClient()]
})
export class TimbreSupprimToutModule {
}
