import {Injectable} from '@angular/core';
import {BehaviorSubject, first} from "rxjs";
import {isNotNullOrUndefined} from "../../utils/utils";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {BaseEnum} from "../../enum/base.enum";

@Injectable()
export class TimbreSupprimService {
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
				console.log(timbres)
				timbres.forEach((timbre, index) => {
					this.firestore.collection(baseEmun)
						.ref.where(critere, '==', timbre[critere])
						.get()
						.then(snapshot => {
							snapshot.forEach(doc => {
								console.log(doc.ref)
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

	supprimerTimbres() {
		this.load$.next(false);
		this.firestore.collection(BaseEnum.TIMBRE,
			/*ref => {
				let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
				filteredQuery = filteredQuery.where("idTimbre", "<=", 1000);
				return filteredQuery;
			}*/)
			.valueChanges().pipe(first()).subscribe(timbres => {
			if (isNotNullOrUndefined(timbres) && timbres?.length > 0) {
				console.log(timbres)
				timbres.forEach((timbre, index) => {
					this.firestore.collection(BaseEnum.TIMBRE)
						.ref.where('id', '==', timbre["id"])
						.get()
						.then(snapshot => {
							snapshot.forEach(doc => {
								console.log(doc.ref)
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

	supprimerAcquis() {
		this.load$.next(false);
		this.firestore.collection(BaseEnum.TIMBRE_ACQUIS,
			/*ref => {
				let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
				filteredQuery = filteredQuery.where("idTimbre", "<=", 1000);
				return filteredQuery;
			}*/)
			.valueChanges().pipe(first()).subscribe(timbres => {
			if (isNotNullOrUndefined(timbres) && timbres?.length > 0) {
				console.log(timbres)
				timbres.forEach((timbre, index) => {
					this.firestore.collection(BaseEnum.TIMBRE_ACQUIS)
						.ref.where('idTimbre', '==', timbre["idTimbre"])
						.get()
						.then(snapshot => {
							snapshot.forEach(doc => {
								console.log(doc.ref)
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


	supprimerBlocs() {
		this.load$.next(false);
		this.firestore.collection(BaseEnum.TIMBRE_BLOC_ACQUIS,
			/*ref => {
				let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
				filteredQuery = filteredQuery.where("idTimbre", "<=", 1000);
				return filteredQuery;
			}*/)
			.valueChanges().pipe(first()).subscribe(timbres => {
			if (isNotNullOrUndefined(timbres) && timbres?.length > 0) {
				console.log(timbres)
				timbres.forEach((timbre, index) => {
					this.firestore.collection(BaseEnum.TIMBRE_BLOC_ACQUIS)
						.ref.where('idBloc', '==', timbre["idBloc"])
						.get()
						.then(snapshot => {
							snapshot.forEach(doc => {
								console.log(doc.ref)
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

	supprimerBlocsAcquis() {
		this.load$.next(false);
		this.firestore.collection(BaseEnum.TIMBRE_BLOC,
			/*ref => {
				let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
				filteredQuery = filteredQuery.where("idTimbre", "<=", 1000);
				return filteredQuery;
			}*/)
			.valueChanges().pipe(first()).subscribe(timbres => {
			if (isNotNullOrUndefined(timbres) && timbres?.length > 0) {
				console.log(timbres)
				timbres.forEach((timbre, index) => {
					this.firestore.collection(BaseEnum.TIMBRE_BLOC)
						.ref.where('id', '==', timbre["id"])
						.get()
						.then(snapshot => {
							snapshot.forEach(doc => {
								console.log(doc.ref)
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
