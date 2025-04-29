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
import {DirectiveModule} from "../../shared/directives/directive.module";
import {ErrorModule} from "../error";
import {PipeModule} from "../../shared/pipes/pipe.module";
import {SimpleNotificationModule} from "../simple-notification/simple-notification.module";
import {TimbrePaysImporterComponent} from "./components/importer/timbre-pays-importer.component";
import {TimbrePaysResultatComponent} from "./components/resultat/timbre-pays-resultat.component";
import {UploadService} from "../../shared/services/upload.service";
import {LibDialogImageModule} from "../../shared/components/lib-dialog-image/lib-dialog-image.module";
import {UtilsService} from "../../shared/services/utils.service";
import {LibModalModule} from "../../shared/components/lib-modal/lib-modal.module";
import {LibIconModule} from "../../shared/components/lib-icon";
import {LibLibelleModelModule} from "../../shared/components/lib-libelle-model";
import {LibUploadModule} from "../../shared/components/lib-upload/lib-upload.module";

@NgModule({
	declarations: [
		TimbrePaysLayoutComponent, TimbrePaysModifierComponent, TimbrePaysImporterComponent, TimbrePaysResultatComponent
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
        DirectiveModule,
        ErrorModule,
        PipeModule,
        SimpleNotificationModule,
        LibModalModule,
        LibUploadModule
    ],
	exports: [],
	providers: [UtilsService, TimbrePaysService, UploadService],
})
export class TimbrePaysModule {
}
