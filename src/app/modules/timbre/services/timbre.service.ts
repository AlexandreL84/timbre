import {Injectable} from '@angular/core';
import {MapperModel} from "../../../model/utils/mapper-model";
import {TimbreModel} from "../../../model/timbre.model";
import {BehaviorSubject, combineLatestWith, first, map, Observable, switchMap} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {isNotNullOrUndefined, Utils} from "../../../shared/utils/utils";
import {AuthService} from "../../../shared/services/auth.service";
import {TimbreAcquisModel} from "../../../model/timbre-acquis.model";

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
				return new MapperModel(TimbreModel).map(data);
			}))
	}*/

	getTimbreByIdAsync(id: number): Observable<TimbreModel> {
		return this.firestore.collection(this.basePath, ref => ref.where('id', '==', id))
			.valueChanges().pipe(
				map((data: any) => {
					return new MapperModel(TimbreModel).map(data[0]);
				}));
	}

	getByCodeAsync(code: string): Observable<TimbreModel> {
		console.log(code)
		return this.firestore.collection(this.basePath, ref => ref.where('code', '==', code))
			.valueChanges().pipe(
				map((data: any) => {
					return new MapperModel(TimbreModel).map(data[0]);
				}));
	}

	getTimbres() {
		this.timbres$.next(null);
		this.firestore.collection(this.basePath).valueChanges().pipe(combineLatestWith(this.getTimbreAcquis()),
			first())
			.subscribe(([timbres, timbreAcquis]) => {
				let timbresModel = [];
				if (timbres?.length > 0) {
					timbres.forEach((timbre: any) => {
						const timbreModel: TimbreModel = new MapperModel(TimbreModel).map(timbre);
						const findTimbreAcquis = timbreAcquis.find(timbre => timbre["idTimbre"] == timbreModel.getId());
						if (isNotNullOrUndefined(findTimbreAcquis)) {
							timbreModel.setTimbreAcquisModel(new MapperModel(TimbreAcquisModel).map(findTimbreAcquis));
						} else {
							timbreModel.setTimbreAcquisModel(null);
						}
						timbresModel.push(timbreModel);
					});
				}
				this.timbres$.next(timbresModel);
			});
	}

	/*
	getTimbres(): Observable<TimbreModel[]> {
		return this.firestore.collection(this.basePath).valueChanges().pipe(combineLatestWith(this.getTimbreAcquis()),
			first(),
			map(([timbres, timbreAcquis]) => {
				let timbresModel = [];
				if (timbres?.length > 0) {
					timbres.forEach((timbre: any) => {
						const timbreModel: TimbreModel = new MapperModel(TimbreModel).map(timbre);
						const findTimbreAcquis = timbreAcquis.find(timbre => timbre["idTimbre"] == timbreModel.getId());
						if (isNotNullOrUndefined(findTimbreAcquis)) {
							timbreModel.setTimbreAcquisModel(new MapperModel(TimbreAcquisModel).map(findTimbreAcquis));
						} else {
							timbreModel.setTimbreAcquisModel(null);
						}
						timbresModel.push(timbreModel);
					});
				}
				console.log(timbresModel);
				return timbresModel;
			}));
	}
	 */

	getTimbreAcquis(): Observable<any> {
		return this.authService.getUser().pipe(
			first(),
			switchMap((user) => {
				if (isNotNullOrUndefined(user)) {
					return this.getTimbreAcquisByUser(user.getId()).pipe(first(),
						map(result => {
							return result;
						}))
				}
				return null;
			}))
	}

	getTimbreAcquisByUser(id): Observable<any> {
		return this.firestore.collection(this.basePathAcquis, ref => ref.where('idUser', '==', id)).valueChanges();
	}

	acquis(timbreModel: TimbreModel, doublon : boolean) {
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
				return this.firestore.collection(this.basePathAcquis).add(
					Object.assign(new Object(), timbreAcquisModel)
				)
			}
		})
	}

	addTimbre(timbreModel: TimbreModel) {
		timbreModel.setId(Utils.getRandom(10000));
		this.firestore.collection(this.basePath).add(
			Object.assign(new Object(), timbreModel)
		);
		this.getTimbres();
	}

	modifierTimbre(timbreModel: TimbreModel) {
		console.log(timbreModel)
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
		this.firestore.collection(this.basePath)
			.ref.where('id', '==', timbreModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					// Todo suuprimer timre_acquis
					doc.ref.delete();
					this.getTimbres();
				});
			})
			.catch(error => {
				console.error('Erreur de mise à jour:', error);
			});
	}

	getBouchon(): TimbreModel {
		let timbre: TimbreModel = new TimbreModel();
		let id: number = Utils.getRandom(10000)
		timbre.setId(id);
		timbre.setCode(id?.toString());
		timbre.setAnnee(2025);
		timbre.setMonnaie("E");
		timbre.setType("");
		timbre.setYt("");
		return timbre;
	}
}
