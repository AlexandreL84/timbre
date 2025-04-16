import {Injectable} from '@angular/core';
import {BehaviorSubject, first} from "rxjs";
import {isNotNullOrUndefined} from "../../utils/utils";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {BaseEnum} from "../../enum/base.enum";

@Injectable()
export class TimbreSupprimService {
	loadGlob$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

	constructor(private firestore: AngularFirestore) {
	}

	supprimer(baseEmun: BaseEnum, critere: string) {
		this.load$.next(false);
		return this.firestore.collection(baseEmun,
			/*ref => {
				let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
				filteredQuery = filteredQuery.where(critere, "<=", 1000);
				return filteredQuery;
			}*/)
			.valueChanges().pipe(first()).subscribe(timbres => {
			if (isNotNullOrUndefined(timbres) && timbres?.length > 0) {
				timbres.forEach((timbre, index) => {
					this.firestore.collection(baseEmun)
						.ref.where(critere, '==', timbre[critere])
						.get()
						.then(snapshot => {
							snapshot.forEach(doc => {
								doc.ref.delete();
								if (index == timbres.length - 1) {
									this.load$.next(true);
								}
							});
						})
						.catch(error => {
							console.error('Erreur de suppression :', error);
						});
				});
			} else {
				this.load$.next(true);
			}
		});}

	supprimerTimbres(annee: number) {
		this.load$.next(false);
		this.firestore.collection(BaseEnum.TIMBRE,
			ref => {
				let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
				filteredQuery = filteredQuery.where("annee", "==", annee);
				return filteredQuery;
			})
			.valueChanges().pipe(first()).subscribe(timbres => {
			if (isNotNullOrUndefined(timbres) && timbres?.length > 0) {
				timbres.forEach((timbre, index) => {
					this.firestore.collection(BaseEnum.TIMBRE)
						.ref.where('id', '==', timbre["id"])
						.get()
						.then(snapshot => {
							snapshot.forEach(doc => {
								this.supprimerAcquis(timbre["id"]);
								doc.ref.delete();
								if (index == timbres.length - 1) {
									this.load$.next(true);
								}
							});
						})
						.catch(error => {
							console.error('Erreur de suppression :', error);
						});
				});
			} else {
				this.load$.next(true);
			}
		});
	}

	supprimerAcquis(idTimbre: number) {
		this.load$.next(false);
		this.firestore.collection(BaseEnum.TIMBRE_ACQUIS,
			ref => {
				let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
				filteredQuery = filteredQuery.where("idTimbre", "==", idTimbre);
				return filteredQuery;
			})
			.valueChanges().pipe(first()).subscribe(timbres => {
			if (isNotNullOrUndefined(timbres) && timbres?.length > 0) {
				timbres.forEach((timbre, index) => {
					this.firestore.collection(BaseEnum.TIMBRE_ACQUIS)
						.ref.where('idTimbre', '==', timbre["idTimbre"])
						.get()
						.then(snapshot => {
							snapshot.forEach(doc => {
								doc.ref.delete();
								if (index == timbres.length - 1) {
									this.load$.next(true);
								}
							});
						})
						.catch(error => {
							console.error('Erreur de suppression :', error);
						});
				});
			} else {
				this.load$.next(true);
			}
		});
	}


	supprimerBlocs(annee: number) {
		this.load$.next(false);
		this.firestore.collection(BaseEnum.TIMBRE_BLOC,
			ref => {
				let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
				filteredQuery = filteredQuery.where("annee", "==", annee);
				return filteredQuery;
			})
			.valueChanges().pipe(first()).subscribe(timbres => {
			if (isNotNullOrUndefined(timbres) && timbres?.length > 0) {
				timbres.forEach((timbre, index) => {
					this.firestore.collection(BaseEnum.TIMBRE_BLOC)
						.ref.where('id', '==', timbre["id"])
						.get()
						.then(snapshot => {
							snapshot.forEach(doc => {
								this.supprimerBlocsAcquis(timbre["id"]);
								doc.ref.delete();
								if (index == timbres.length - 1) {
									this.load$.next(true);
								}
							});
						})
						.catch(error => {
							console.error('Erreur de suppression :', error);
						});
				});
			} else {
				this.load$.next(true);
			}
		});
	}

	supprimerBlocsAcquis(idBloc: number) {
		this.load$.next(false);
		this.firestore.collection(BaseEnum.TIMBRE_BLOC_ACQUIS,
			ref => {
				let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
				filteredQuery = filteredQuery.where("idBloc", "==", idBloc);
				return filteredQuery;
			})
			.valueChanges().pipe(first()).subscribe(timbres => {
			if (isNotNullOrUndefined(timbres) && timbres?.length > 0) {
				timbres.forEach((timbre, index) => {
					this.firestore.collection(BaseEnum.TIMBRE_BLOC_ACQUIS)
						.ref.where('id', '==', timbre["id"])
						.get()
						.then(snapshot => {
							snapshot.forEach(doc => {
								doc.ref.delete();
								if (index == timbres.length - 1) {
									this.load$.next(true);
								}
							});
						})
						.catch(error => {
							console.error('Erreur de suppression :', error);
						});
				});
			} else {
				this.load$.next(true);
			}
		});
	}
}
