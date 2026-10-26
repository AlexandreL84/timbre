import {EnvironmentProviders, inject, provideAppInitializer} from "@angular/core";
import {FirebaseApp} from "@angular/fire/app";
import {initializeFirestore, persistentLocalCache, persistentMultipleTabManager} from "@angular/fire/firestore";

/**
 * Active le cache persistant de Firestore dans le navigateur (IndexedDB).
 *
 * Les documents déjà lus sont conservés entre deux visites. Quand la même requête est relancée
 * (rechargement de page, nouvelle recherche identique) moins de 30 minutes après, Firestore ne
 * renvoie et ne facture que les documents qui ont changé depuis.
 *
 * Firestore doit être initialisé avec ce cache avant toute utilisation : ce provider est donc
 * exécuté au démarrage, avant que l'API modulaire (provideFirestore) ou compat (AngularFirestore)
 * ne crée l'instance. Les deux API partagent ensuite cette même instance.
 */
export function provideFirestorePersistentCache(): EnvironmentProviders {
	return provideAppInitializer(() => {
		const app = inject(FirebaseApp);
		try {
			initializeFirestore(app, {
				// Cache partagé entre les onglets ouverts sur l'application
				localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()}),
			});
		} catch (erreur) {
			// Firestore déjà initialisé (rechargement à chaud en développement) : on garde l'instance existante
			console.warn("Cache persistant Firestore non activé :", erreur);
		}
	});
}
