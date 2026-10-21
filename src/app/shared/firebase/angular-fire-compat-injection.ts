import {EnvironmentInjector, EnvironmentProviders, inject, NgZone, provideAppInitializer, runInInjectionContext} from "@angular/core";
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";

/**
 * Correctifs temporaires pour l'API AngularFire "compat" (AngularFirestore) depuis AngularFire 20.
 *
 * 1. Contexte d'injection : AngularFirestoreCollection et AngularFirestoreDocument appellent inject()
 *    dans leur constructeur. Un appel à angularFirestore.collection(...) depuis une méthode ou un
 *    subscribe provoquait l'erreur NG0203. Ces méthodes sont donc exécutées dans le contexte
 *    d'injection de l'application.
 *
 * 2. Zone Angular : les Observables (valueChanges, snapshotChanges...) émettent désormais en dehors
 *    de la zone Angular. Une donnée Firestore affectée à une propriété (ex. les préférences de
 *    recherche) n'était donc affichée qu'au prochain clic. Les émissions sont ramenées dans la zone
 *    pour que l'écran se mette à jour immédiatement, comme avec AngularFire 18.
 *
 * Ce fichier pourra être supprimé une fois le code migré vers l'API modulaire
 * (@angular/fire/firestore : collection(), doc(), collectionData()...).
 */

type Methode = (...args: unknown[]) => unknown;

function remplacer(prototype: object, methodes: string[], enveloppe: (instance: unknown, original: Methode, args: unknown[]) => unknown): void {
    const proto = prototype as Record<string, Methode>;
    for (const nom of methodes) {
        const original = proto[nom];
        if (typeof original !== "function") {
            console.warn(`AngularFire compat : méthode ${nom} introuvable, correctif non appliqué`);
            continue;
        }
        proto[nom] = function (this: unknown, ...args: unknown[]) {
            return enveloppe(this, original, args);
        };
    }
}

/** Fait émettre un Observable (next, error, complete) à l'intérieur de la zone Angular. */
function dansLaZone<T>(source: Observable<T>, ngZone: NgZone): Observable<T> {
    return new Observable<T>(subscriber =>
        source.subscribe({
            next: valeur => ngZone.run(() => subscriber.next(valeur)),
            error: erreur => ngZone.run(() => subscriber.error(erreur)),
            complete: () => ngZone.run(() => subscriber.complete()),
        })
    );
}

let correctifApplique = false;

export function provideAngularFireCompatInjection(): EnvironmentProviders {
    return provideAppInitializer(() => {
        if (correctifApplique) {
            return;
        }
        correctifApplique = true;

        const injecteurApp = inject(EnvironmentInjector);
        const ngZone = inject(NgZone);
        // Chaque collection ou document AngularFire garde son propre injecteur dans le champ "injector"
        const injecteurDe = (instance: unknown) => (instance as {injector?: EnvironmentInjector}).injector ?? injecteurApp;

        // 1. Création des collections et documents dans un contexte d'injection
        const dansLeContexte = (getInjector: (instance: unknown) => EnvironmentInjector) => (instance: unknown, original: Methode, args: unknown[]) =>
            runInInjectionContext(getInjector(instance), () => original.apply(instance, args));
        remplacer(
            AngularFirestore.prototype,
            ["collection", "collectionGroup", "doc"],
            dansLeContexte(() => injecteurApp)
        );
        remplacer(AngularFirestoreCollection.prototype, ["doc"], dansLeContexte(injecteurDe));
        remplacer(AngularFirestoreDocument.prototype, ["collection"], dansLeContexte(injecteurDe));

        // 2. Émissions des Observables ramenées dans la zone Angular
        const ramenerDansLaZone = (instance: unknown, original: Methode, args: unknown[]) => dansLaZone(original.apply(instance, args) as Observable<unknown>, ngZone);
        remplacer(AngularFirestoreCollection.prototype, ["valueChanges", "snapshotChanges", "stateChanges", "auditTrail", "get"], ramenerDansLaZone);
        remplacer(AngularFirestoreCollectionGroup.prototype, ["valueChanges", "snapshotChanges", "stateChanges", "auditTrail", "get"], ramenerDansLaZone);
        remplacer(AngularFirestoreDocument.prototype, ["valueChanges", "snapshotChanges", "get"], ramenerDansLaZone);
    });
}
