import {NgModule} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {FlexLayoutModule, FlexModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TimbreRoutingModule} from './timbre-routing.module';
import {MaterialModule} from '../../shared/modules/material.module';
import {TimbreLayoutComponent} from './layout/timbre-layout.component';
import {TimbreModifierComponent} from './components/modifier/timbre-modifier.component';
import {LibSpinnerModule} from '../../shared/components/lib-spinner';
import {DirectiveModule} from '../../shared/directives/directive.module';
import {ErrorModule} from '../error';
import {PipeModule} from '../../shared/pipes/pipe.module';
import {SimpleNotificationModule} from '../simple-notification/simple-notification.module';
import {TimbreResultatComponent} from './components/resultat/timbre-resultat.component';
import {UploadService} from '../../shared/services/upload.service';
import {LibDialogImageModule} from '../../shared/components/lib-dialog-image/lib-dialog-image.module';
import {UtilsService} from '../../shared/services/utils.service';
import {LibModalModule} from '../../shared/components/lib-modal/lib-modal.module';
import {LibIconModule} from '../../shared/components/lib-icon';
import {LibLibelleModelModule} from '../../shared/components/lib-libelle-model';
import {LibUploadModule} from '../../shared/components/lib-upload/lib-upload.module';
import {TimbreBlocService} from '../../shared/services/timbre/timbre-bloc.service';
import {TimbreUtilsService} from '../../shared/services/timbre/timbre-utils.service';
import {MenuModule} from "../menu/menu.module";
import {TimbreResumeComponent} from "./components/resume/timbre-resume.component";
import {TimbreResumeService} from "../../shared/services/timbre/timbre-resume.service";
import {TimbreRechercheComponent} from "./components/recherche/timbre-recherche.component";
import {TimbreResultatTableComponent} from "./components/resultat-table/timbre-resultat-table.component";
import {TimbreTotalComponent} from "./components/total/timbre-total.component";
import {TimbreService} from "../../shared/services/timbre/timbre.service";
import {TimbreActionsService} from "../../shared/services/timbre/timbre-actions.service";
import {TimbreVarService} from "../../shared/services/timbre/timbre-var.service";
import {TimbreUploadService} from "../../shared/services/timbre/timbre-upload.service";
import {LetDirective} from "@ngrx/component";
import {TimbreTotalService} from "../../shared/services/timbre/timbre-total.service";
import {TimbrePdfService} from "../../shared/services/timbre/timbre-pdf.service";

@NgModule({
	declarations: [
		TimbreLayoutComponent, TimbreModifierComponent, TimbreResultatTableComponent, TimbreResultatComponent, TimbreResumeComponent, TimbreRechercheComponent, TimbreTotalComponent
	],
	imports: [
		MaterialModule,
		TimbreRoutingModule,
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
		LibModalModule,
		LibUploadModule,
		SimpleNotificationModule,
		MenuModule,
		ReactiveFormsModule,
		LetDirective
	],
	exports: [
		TimbreTotalComponent
	],
	providers: [TimbreService, TimbreActionsService, TimbreVarService, TimbreTotalService, TimbreUploadService, UtilsService, TimbreUtilsService, TimbreBlocService, TimbreResumeService, TimbrePdfService, UploadService]
})
export class TimbreModule {
}
