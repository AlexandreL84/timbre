import {Injectable} from '@angular/core';
import {TimbreModel} from "../../../model/timbre.model";
import {BehaviorSubject, combineLatestWith, first, map, Observable, switchMap} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {isNotNullOrUndefined, Utils} from "../../../shared/utils/utils";
import {AuthService} from "../../../shared/services/auth.service";
import {TimbreAcquisModel} from "../../../model/timbre-acquis.model";
import {TimbreCritereModel} from "../../../model/timbre-critere.model";
import {plainToInstance} from "class-transformer";
import {collectionData} from "@angular/fire/firestore";

interface DocumentData {
	id: number; // Assurez-vous que vos documents ont une propriété numérique "id"
}

@Injectable()
export class TimbreService {
	private basePath: string = '/timbres';
	private basePathAcquis: string = '/timbre_acquis';

	dossierImage: string = "timbres/";
	heigthTable: number = 50;
	widthTimbre: number = 100;
	heightTimbre: number = 100;
	widthTimbreZoom: number = 500;
	heightTimbreZoom: number = 500;

	total$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	timbres$: BehaviorSubject<TimbreModel[]> = new BehaviorSubject<TimbreModel[]>(null);

	constructor(private firestore: AngularFirestore, private authService: AuthService) {
	}

	/*getTimbreByIdAsync(id: any): Observable<TimbreModel> {
		return this.firestore.collection(this.basePath).doc(id).valueChanges().pipe(
			map((data: any) => {
				return plainToInstance(TimbreModel, data);
			}))
	}*/

	getTimbreByIdAsync(id: number): Observable<TimbreModel> {
		return this.firestore.collection(this.basePath, ref => ref.where('id', '==', id))
			.valueChanges().pipe(
				map((data: any) => {
					return plainToInstance(TimbreModel, data[0]);
				}));
	}

	getByCodeAsync(code: string): Observable<TimbreModel> {
		return this.firestore.collection(this.basePath, ref => ref.where('code', '==', code))
			.valueChanges().pipe(
				map((data: any) => {
					return plainToInstance(TimbreModel, data[0]);
				}));
	}

	/*getTimbres2() {
		this.timbres$.next(null);
		this.firestore.collection(this.basePath).valueChanges().pipe(combineLatestWith(this.getTimbreAcquis()),
			first())
			.subscribe(([timbres, timbreAcquis]) => {
				this.constructTimbres(timbres, timbreAcquis);
			});
	}*/

	getTimbres(timbreCritereModel?: TimbreCritereModel) {
		this.timbres$.next(null);
		this.firestore.collection(this.basePath, ref => {
			let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
			if (isNotNullOrUndefined(timbreCritereModel)) {
				console.log(timbreCritereModel)
				if (isNotNullOrUndefined(timbreCritereModel.getAnnees()) && timbreCritereModel.getAnnees()?.length > 0) {
					filteredQuery = filteredQuery.where('annee', '==', timbreCritereModel.getAnnees()[0]);
				}
			}
			filteredQuery = filteredQuery.orderBy("id", "asc");

			console.log(filteredQuery)
			return filteredQuery;
		})
			.valueChanges().pipe(combineLatestWith(this.getTimbreAcquis(timbreCritereModel)),
			first())
			.subscribe(([timbres, timbreAcquis]) => {
				this.constructTimbres(timbres, timbreAcquis, timbreCritereModel);
			});
	}

	getMaxIdentAsync(): Observable<number> {
		const query =
			this.firestore.collection(this.basePath)
				.ref.orderBy("id", "desc")
				.limit(1);

		return collectionData(query).pipe(
			map((docs: DocumentData[]) => (docs.length > 0 ? docs[0].id  + 1 : 1))
		);
	}

	constructTimbres(timbres, timbreAcquis, timbreCritereModel?: TimbreCritereModel) {
		let timbresModel = [];
		if (timbres?.length > 0) {
			timbres.forEach((timbre: any) => {
				const timbreModel: TimbreModel = plainToInstance(TimbreModel, timbre);

				const findTimbreAcquis = timbreAcquis.find(timbre => timbre["idTimbre"] == timbreModel.getId());
				if (isNotNullOrUndefined(findTimbreAcquis)) {
					timbreModel.setTimbreAcquisModel(plainToInstance(TimbreAcquisModel, findTimbreAcquis));
				} else {
					timbreModel.setTimbreAcquisModel(new TimbreAcquisModel());
				}
				let ajout: boolean = true
				if (isNotNullOrUndefined(timbreCritereModel)) {
					if (isNotNullOrUndefined(timbreCritereModel.getAcquis()) && !(timbreCritereModel.getAcquis() == "TOUS" || (timbreCritereModel.getAcquis() == "OUI" && timbreModel.getTimbreAcquisModel().isAcquis()) || (timbreCritereModel.getAcquis() == "NON" && !timbreModel.getTimbreAcquisModel().isAcquis()))) {
						ajout = false
					}
					if (isNotNullOrUndefined(timbreCritereModel.getDoublon()) && !(timbreCritereModel.getDoublon() == "TOUS" || (timbreCritereModel.getDoublon() == "OUI" && timbreModel.getTimbreAcquisModel().isDoublon()) || (timbreCritereModel.getDoublon() == "NON" && !timbreModel.getTimbreAcquisModel().isDoublon()))) {
						ajout = false
					}
				}
				if (ajout == true) {
					timbresModel.push(timbreModel);
				}
			});
		}
		this.timbres$.next(timbresModel);
	}

	getTimbreAcquis(timbreCritereModel?: TimbreCritereModel): Observable<any> {
		return this.authService.getUser().pipe(
			first(),
			switchMap((user) => {
				if (isNotNullOrUndefined(user)) {
					return this.getTimbreAcquisByUser(user.getId(), timbreCritereModel).pipe(first(),
						map(result => {
							return result;
						}))
				}
				return null;
			}))
	}

	getTimbreAcquisByUser(id, timbreCritereModel?: TimbreCritereModel): Observable<any> {
		/*return this.firestore.collection(this.basePathAcquis, ref => {
			let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
			filteredQuery = filteredQuery.where('idUser', '==', id);
			if (isNotNullOrUndefined(timbreCritereModel)) {
				if (timbreCritereModel.isAcquis() == true) {
					filteredQuery = filteredQuery.where('acquis', '==', timbreCritereModel.isAcquis());
				}
				if (timbreCritereModel.isDoublon() == true) {
					filteredQuery = filteredQuery.where('doublon', '==', timbreCritereModel.isDoublon());
				}
			}
			console.log(filteredQuery)
			return filteredQuery;
		}).valueChanges();*/

		return this.firestore.collection(this.basePathAcquis, ref => ref.where('idUser', '==', id)).valueChanges();
	}

	acquis(timbreModel: TimbreModel, doublon: boolean) {
		return this.authService.getUser().pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			if (isNotNullOrUndefined(timbreModel?.getTimbreAcquisModel()?.getIdUser())) {
				this.firestore.collection(this.basePathAcquis)
					.ref.where('idTimbre', '==', timbreModel.getId()).where('idUser', '==', user.getId())
					//.limit(1)
					.get()
					.then(snapshot => {
						snapshot.forEach(doc => {
							// Mise à jour du document
							const timbreAcquisModel = timbreModel.getTimbreAcquisModel();
							if (doublon) {
								timbreAcquisModel.setAcquis(true);
								timbreAcquisModel.setDoublon(!timbreAcquisModel.isDoublon());
							} else {
								timbreAcquisModel.setAcquis(!timbreAcquisModel.isAcquis());
								if (!timbreAcquisModel.isAcquis()) {
									timbreAcquisModel.setDoublon(false);
								}
							}
							doc.ref.update(Object.assign(new Object(), timbreAcquisModel));
						});
					})
					.catch(error => {
						console.error('Erreur de mise à jour:', error);
					});
			} else {
				const timbreAcquisModel = new TimbreAcquisModel();
				timbreAcquisModel.setIdUser(user.getId());
				timbreAcquisModel.setIdTimbre(timbreModel.getId());
				timbreAcquisModel.setAcquis(true);
				timbreAcquisModel.setDoublon(doublon);
				timbreModel.setTimbreAcquisModel(timbreAcquisModel);
				this.firestore.collection(this.basePathAcquis).add(
					Object.assign(new Object(), timbreAcquisModel)
				)
			}
		})
	}

	addTimbre(timbreModel: TimbreModel) {
		this.getMaxIdentAsync().pipe(first()).subscribe(id => {
			timbreModel.setId(id)
			this.firestore.collection(this.basePath).add(
				Object.assign(new Object(), timbreModel)
			);
			this.getTimbres();
		})
	}

	modifierTimbre(timbreModel: TimbreModel) {
		timbreModel.setTimbreAcquisModel(null);
		this.firestore.collection(this.basePath)
			.ref.where('id', '==', timbreModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					doc.ref.update(Object.assign(new Object(), timbreModel));
					this.getTimbres();
				});
			})
			.catch(error => {
				console.error('Erreur de mise à jour:', error);
			});
	}

	deleteTimbre(timbreModel: TimbreModel) {
		this.authService.getUser().pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			if (isNotNullOrUndefined(timbreModel?.getTimbreAcquisModel()?.getIdUser())) {
				this.firestore.collection(this.basePathAcquis)
					.ref.where('idTimbre', '==', timbreModel.getId()).where('idUser', '==', user.getId())
					.get()
					.then(snapshot => {
						snapshot.forEach(doc => {
							doc.ref.delete();
						});
					});
			}

			this.firestore.collection(this.basePath)
				.ref.where('id', '==', timbreModel.getId())
				.get()
				.then(snapshot => {
					snapshot.forEach(doc => {
						doc.ref.delete();
						this.getTimbres();
					});
				})
				.catch(error => {
					console.error('Erreur de suppression :', error);
				});
		});
	}

	getBouchon(): TimbreModel {
		let timbre: TimbreModel = new TimbreModel();
		timbre.setCode(timbre.getId()?.toString());
		timbre.setAnnee(2025);
		timbre.setMonnaie("E");
		timbre.setType("");
		timbre.setYt("");
		return timbre;
	}
}
