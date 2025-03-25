import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {routes} from './app.routes';
import {environment} from "../environments/environment";
import {provideAnimations} from "@angular/platform-browser/animations";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {FIREBASE_OPTIONS} from "@angular/fire/compat";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {PaginatorIntlService} from "./shared/services/paginator-intl.service";
import {HeaderService} from "./shared/services/header.service";
import {SimpleNotificationModule} from "./modules/simple-notification/simple-notification.module";


export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes), provideAnimations(),
		provideFirestore(() => getFirestore()),
		provideZoneChangeDetection({eventCoalescing: true}),
		provideRouter(routes),
		AngularFireStorageModule,
		AngularFireAuthModule,
		provideAuth(() => getAuth()),
		{provide: FIREBASE_OPTIONS, useValue: environment.firebase},
		{provide: MatPaginatorIntl, useClass: PaginatorIntlService},
		HeaderService,
		SimpleNotificationModule
	]
};
