import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideFirebaseApp, initializeApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {routes} from './app.routes';
import {environment} from "../environments/environment";
import {provideAnimations} from "@angular/platform-browser/animations";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {FIREBASE_OPTIONS} from "@angular/fire/compat";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {HttpResponseHandlerService} from "./shared/services/httpResponseHandler.service";
import {NotificationsService} from "angular2-notifications";


export const appConfig: ApplicationConfig = {
    providers: [
		provideRouter(routes), provideAnimations(),
        //provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideZoneChangeDetection({eventCoalescing: true}), provideRouter(routes),
		//AngularFireDatabaseModule,
		AngularFireStorageModule,
		provideAuth(() => getAuth()),
		{ provide: FIREBASE_OPTIONS, useValue: environment.firebase },
		HttpResponseHandlerService, NotificationsService

		//provideDatabase((app: any) => getDatabase(app, "https://book-f941b.firebaseio.com/"))
    ]
};
