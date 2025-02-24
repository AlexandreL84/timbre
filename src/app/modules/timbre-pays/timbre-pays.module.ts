import {NgModule} from "@angular/core";
import {AsyncPipe, CommonModule} from "@angular/common";
import {FlexLayoutModule, FlexModule} from "@angular/flex-layout";
import {FormsModule} from "@angular/forms";
import {TimbrePaysRoutingModule} from "./timbre-pays-routing.module";
import {MaterialModule} from "../../shared/modules/material.module";
import {TimbrePaysLayoutComponent} from "./layout/timbre-pays-layout.component";
import {TimbrePaysService} from "./services/timbre-pays.service";
import {TimbrePaysModifierComponent} from "./components/modifier/timbre-pays-modifier.component";
import {LibSpinnerModule} from "../../shared/components/lib-spinner";
import {HeaderModule} from "../header/header.module";
import {DirectiveModule} from "../../shared/directives/directive.module";
import {ErrorModule} from "../error";
import {PipeModule} from "../../shared/pipes/pipe.module";
import {SimpleNotificationModule} from "../simple-notification/simple-notification.module";
import {LibUploadModule} from "../../shared/components/lib-upload/lib-upload.module";
import {TimbrePaysImporterComponent} from "./components/importer/timbre-pays-importer.component";
import {TimbrePaysResultatComponent} from "./components/resultat/timbre-pays-resultat.component";
import {UploadService} from "../../shared/services/upload.service";
import {provideHttpClient} from "@angular/common/http";
import {LibDialogImageModule} from "../../shared/components/lib-dialog-image/lib-dialog-image.module";
import {UtilsService} from "../../shared/services/utils.service";
import {LibModalModule} from "../../shared/components/lib-modal/lib-modal.module";
import {TimbrePaysAjouterComponent} from "./components/ajouter/timbre-pays-ajouter.component";
import {LibIconModule} from "../../shared/components/lib-icon";
import {LibLibelleModelModule} from "../../shared/components/lib-libelle-model";

@NgModule({
	declarations: [
		TimbrePaysLayoutComponent, TimbrePaysModifierComponent, TimbrePaysImporterComponent, TimbrePaysResultatComponent, TimbrePaysAjouterComponent
	],
	imports: [
		MaterialModule,
		TimbrePaysRoutingModule,
		CommonModule,
		FlexModule,
		FlexLayoutModule,
		FormsModule,
		AsyncPipe,
		LibSpinnerModule,
		LibIconModule,
		LibDialogImageModule,
		LibLibelleModelModule,
		HeaderModule,
		DirectiveModule,
		ErrorModule,
		PipeModule,
		SimpleNotificationModule,
		LibUploadModule,
		LibModalModule
	],
	exports: [TimbrePaysLayoutComponent],
	providers: [UtilsService, TimbrePaysService, UploadService, provideHttpClient()],
})
export class TimbrePaysModule {
}
