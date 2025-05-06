import {NgModule} from '@angular/core';
import {TimbreBlocResultatComponent} from "./components/resultat/timbre-bloc-resultat.component";
import {CommonModule} from "@angular/common";
import {FlexLayoutModule, FlexModule} from "@angular/flex-layout";
import {FormsModule} from "@angular/forms";
import {TimbreModifierBlocComponent} from "./components/modifier-bloc/timbre-modifier-bloc.component";
import {TimbreBlocRoutingModule} from "./timbre-bloc-routing.module";
import {MaterialModule} from "../../shared/modules/material.module";
import {LibIconModule} from "../../shared/components/lib-icon";
import {LibLibelleModelModule} from "../../shared/components/lib-libelle-model";
import {LibSpinnerModule} from "../../shared/components/lib-spinner";
import {DirectiveModule} from "../../shared/directives/directive.module";
import {LibUploadModule} from "../../shared/components/lib-upload/lib-upload.module";
import {TimbreBlocService} from "../../shared/services/timbre/timbre-bloc.service";
import {TimbreUtilsService} from "../../shared/services/timbre/timbre-utils.service";
import {UploadService} from "../../shared/services/upload.service";
import {TimbreBlocLayoutComponent} from "./layout/timbre-bloc-layout.component";
import {SimpleNotificationModule} from "../simple-notification/simple-notification.module";
import {MenuModule} from "../menu/menu.module";
import {TimbreBlocResultatTableComponent} from "./components/resultat-table/timbre-bloc-resultat-table.component";
import {TimbreBlocTotalComponent} from "./components/total/timbre-bloc-total.component";
import {TimbreBlocRechercheComponent} from "./components/recherche/timbre-bloc-recherche.component";
import {TimbreService} from "../../shared/services/timbre/timbre.service";
import {TimbreResumeService} from "../../shared/services/timbre/timbre-resume.service";
import {PipeModule} from "../../shared/pipes/pipe.module";

@NgModule({
	declarations: [
		TimbreBlocLayoutComponent,
		TimbreBlocRechercheComponent,
		TimbreBlocResultatComponent,
		TimbreBlocResultatTableComponent,
		TimbreBlocTotalComponent,
		TimbreModifierBlocComponent
	],
    imports: [
        TimbreBlocRoutingModule,
        MaterialModule,
        CommonModule,
        FlexModule,
        FlexLayoutModule,
        FormsModule,
        LibIconModule,
        LibLibelleModelModule,
        LibSpinnerModule,
        DirectiveModule,
        LibUploadModule,
        SimpleNotificationModule,
        MenuModule,
        PipeModule,
    ],
	exports: [],
	providers: [TimbreService, TimbreBlocService, TimbreUtilsService, TimbreResumeService, UploadService]
})
export class TimbreBlocModule {
}
