import {NgModule} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {FlexLayoutModule, FlexModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {TimbreRoutingModule} from './timbre-routing.module';
import {MaterialModule} from '../../shared/modules/material.module';
import {TimbreLayoutComponent} from './layout/timbre-layout.component';
import {TimbreService} from '../../shared/services/timbre/timbre.service';
import {TimbreModifierComponent} from './components/modifier/timbre-modifier.component';
import {LibSpinnerModule} from '../../shared/components/lib-spinner';
import {DirectiveModule} from '../../shared/directives/directive.module';
import {ErrorModule} from '../error';
import {PipeModule} from '../../shared/pipes/pipe.module';
import {SimpleNotificationModule} from '../simple-notification/simple-notification.module';
import {TimbreImporterComponent} from './components/importer/timbre-importer.component';
import {TimbreResultatComponent} from './components/resultat/timbre-resultat.component';
import {UploadService} from '../../shared/services/upload.service';
import {provideHttpClient} from '@angular/common/http';
import {LibDialogImageModule} from '../../shared/components/lib-dialog-image/lib-dialog-image.module';
import {UtilsService} from '../../shared/services/utils.service';
import {LibModalModule} from '../../shared/components/lib-modal/lib-modal.module';
import {LibIconModule} from '../../shared/components/lib-icon';
import {LibLibelleModelModule} from '../../shared/components/lib-libelle-model';
import {LibUploadModule} from '../../shared/components/lib-upload/lib-upload.module';
import {TimbreBlocService} from '../../shared/services/timbre/timbre-bloc.service';
import {TimbreUtilsService} from '../../shared/services/timbre/timbre-utils.service';
import {MenuModule} from "../menu/menu.module";

@NgModule({
	declarations: [
		TimbreLayoutComponent, TimbreModifierComponent, TimbreImporterComponent, TimbreResultatComponent
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
		MenuModule
	],
	exports: [],
	providers: [UtilsService, TimbreUtilsService, TimbreService, TimbreBlocService, UploadService, provideHttpClient()]
})
export class TimbreModule {
}
