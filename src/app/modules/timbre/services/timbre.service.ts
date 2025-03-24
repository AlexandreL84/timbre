import {Injectable} from '@angular/core';
import {TimbreModel} from '../../../model/timbre.model';
import {
	BehaviorSubject,
	combineLatest,
	first,
	map,
	Observable,
	switchMap
} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {isNotNullOrUndefined} from '../../../shared/utils/utils';
import {AuthService} from '../../../shared/services/auth.service';
import {TimbreAcquisModel} from '../../../model/timbre-acquis.model';
import {TimbreCritereModel} from '../../../model/timbre-critere.model';
import {plainToInstance} from 'class-transformer';
import {collectionData} from '@angular/fire/firestore';
import {TimbreBlocModel} from '../../../model/timbre-bloc.model';
import {TimbreBlocService} from './timbre-bloc.service';
import {TimbreUtilsService} from './timbre-utils.service';
import {UploadService} from "../../../shared/services/upload.service";
import {DossierEnum} from "../../../shared/enum/dossier.enum";

interface DocumentData {
	id: number; // Assurez-vous que vos documents ont une propriété numérique "id"
}

@Injectable()
export class TimbreService {
	private basePath: string = '/timbres';
	private basePathAcquis: string = '/timbres_acquis';
	private basePathBloc: string = '/timbres_bloc';

	heigthTable: number = 50;
	widthTimbre: number = 100;
	heightTimbre: number = 100;
	widthTimbreZoom: number = 500;
	heightTimbreZoom: number = 500;

	total$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	timbres$: BehaviorSubject<TimbreModel[]> = new BehaviorSubject<TimbreModel[]>(null);

	constructor(private firestore: AngularFirestore, private authService: AuthService, private timbreBlocService: TimbreBlocService, private timbreUtilsService: TimbreUtilsService, private uploadService: UploadService) {
	}

	getAnneesAsync(): Observable<number[]>  {
		return this.firestore.collection(this.basePath, ref => {
			let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
			filteredQuery = filteredQuery.orderBy('annee', 'desc');

			return filteredQuery;
		}).valueChanges().pipe(
			map(docs => {
				const allValues = docs.map(doc => Number(doc['annee'])).filter(doc => isNotNullOrUndefined(doc) && doc != 0);
				return Array.from(new Set(allValues));
			})
		);
	}

	getTimbre(id: number): Observable<any>  {
		return this.firestore.collection(this.basePath, ref => ref.where('id', '==', id)).valueChanges();
	}

	getTimbreByIdAsync(id: number): Observable<TimbreModel> {
		return combineLatest([
			this.getTimbre(id),
			this.timbreBlocService.getBlocsAsync()
		]).pipe(map(([data, timbresBlocModel]) => {
			return this.constructTimbre(data[0], null, timbresBlocModel);
		}));
	}

	getNbTimbres(timbreCritereModel?: TimbreCritereModel) {
		this.total$.next(null);
		this.getAllTimbres(timbreCritereModel).pipe(first()).subscribe(timbres => {
			this.total$.next(timbres?.length);
		});
	}

	getTimbres(timbreCritereModel?: TimbreCritereModel) {
		this.getNbTimbres();
		this.timbres$.next(null);
		combineLatest([
			this.getAllTimbres(timbreCritereModel),
			this.getTimbreAcquis(),
			this.timbreBlocService.getBlocsAsync(timbreCritereModel)
		]).pipe(first()).subscribe(([timbres, timbresAcquis, timbresBlocModel]) => {
			this.constructTimbres(timbres, timbresAcquis, timbresBlocModel, timbreCritereModel);
		});

		/*this.firestore.collection(this.basePath, ref => {
			let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
			if (isNotNullOrUndefined(timbreCritereModel)) {
				if (isNotNullOrUndefined(timbreCritereModel.getAnnees()) && timbreCritereModel.getAnnees()?.length > 0) {
					filteredQuery = filteredQuery.where('annee', '==', timbreCritereModel.getAnnees()[0]);
				}
			}
			filteredQuery = filteredQuery.orderBy("id", "asc");

			return filteredQuery;
		})
			.valueChanges().pipe(
				combineLatestWith(this.getTimbreAcquis()),
				//combineLatestWith(this.timbreBlocService.timbresBlocModel$)),
			first())
			.subscribe(([timbres, timbresAcquis]) => {
				this.constructTimbres(timbres, timbresAcquis, timbreCritereModel);
			});*/
	}

	getAllTimbres(timbreCritereModel: TimbreCritereModel) {
		return this.firestore.collection(this.basePath, ref => {
			let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
			if (isNotNullOrUndefined(timbreCritereModel)) {
				if (isNotNullOrUndefined(timbreCritereModel.getAnnees()) && timbreCritereModel.getAnnees()?.length > 0) {
					filteredQuery = filteredQuery.where("annee", "in", timbreCritereModel.getAnnees());
				}
				if (isNotNullOrUndefined(timbreCritereModel.getBloc()) && timbreCritereModel.getBloc() != 'TOUS') {
					filteredQuery = filteredQuery.where("idBloc", timbreCritereModel.getBloc() != 'NON'? "!=": "==", null);
				}
			}
			filteredQuery = filteredQuery.orderBy('id', 'asc');
			return filteredQuery;
		}).valueChanges();
	}

	getMaxIdentAsync(): Observable<number> {
		const query =
			this.firestore.collection(this.basePath)
				.ref.orderBy('id', 'desc')
				.limit(1);

		return collectionData(query).pipe(
			map((docs: DocumentData[]) => (docs.length > 0 ? docs[0].id + 1 : 1))
		);
	}


	constructTimbre(timbre: TimbreModel, timbresAcquis, timbresBlocModel?: TimbreBlocModel[]): TimbreModel {
		const timbreModel: TimbreModel = plainToInstance(TimbreModel, timbre);
		if (isNotNullOrUndefined(timbresBlocModel)) {
			const findTimbreBloc = timbresBlocModel.find(timbreBlocModel => timbreBlocModel.getId() == timbreModel?.getIdBloc());
			if (isNotNullOrUndefined(findTimbreBloc)) {
				timbreModel.setTimbreBlocModel(findTimbreBloc);
			}
		}

		if (isNotNullOrUndefined(timbresAcquis)) {
			const findTimbreAcquis = timbresAcquis.find(timbre => timbre['idTimbre'] == timbreModel.getId());
			if (isNotNullOrUndefined(findTimbreAcquis)) {
				timbreModel.setTimbreAcquisModel(plainToInstance(TimbreAcquisModel, findTimbreAcquis));
			} else {
				timbreModel.setTimbreAcquisModel(new TimbreAcquisModel());
			}
		}
		return timbreModel;
	}

	constructTimbres(timbres, timbresAcquis, timbresBlocModel?: TimbreBlocModel[], timbreCritereModel?: TimbreCritereModel) {
		let timbresModel = [];
		if (timbres?.length > 0) {
			timbres.forEach((timbre: any) => {
				const timbreModel: TimbreModel = this.constructTimbre(timbre, timbresAcquis, timbresBlocModel);

				let ajout: boolean = true;
				if (isNotNullOrUndefined(timbreCritereModel)) {
					if (isNotNullOrUndefined(timbreCritereModel.getAcquis()) && !(timbreCritereModel.getAcquis() == 'TOUS' || (timbreCritereModel.getAcquis() == 'OUI' && timbreModel.getTimbreAcquisModel().isAcquis()) || (timbreCritereModel.getAcquis() == 'NON' && !timbreModel.getTimbreAcquisModel().isAcquis()))) {
						ajout = false;
					}
					if (isNotNullOrUndefined(timbreCritereModel.getDoublon()) && !(timbreCritereModel.getDoublon() == 'TOUS' || (timbreCritereModel.getDoublon() == 'OUI' && timbreModel.getTimbreAcquisModel().isDoublon()) || (timbreCritereModel.getDoublon() == 'NON' && !timbreModel.getTimbreAcquisModel().isDoublon()))) {
						ajout = false;
					}
				}
				if (ajout == true) {
					timbresModel.push(timbreModel);
				}
			});
		}
		this.timbres$.next(timbresModel);
	}

	getTimbreAcquis(): Observable<any> {
		return this.authService.getUser().pipe(
			first(),
			switchMap((user) => {
				if (isNotNullOrUndefined(user)) {
					return this.getTimbreAcquisByUser(user.getId()).pipe(first(),
						map(result => {
							return result;
						}));
				}
				return null;
			}));
	}

	getTimbreAcquisByUser(id): Observable<any> {
		return this.firestore.collection(this.basePathAcquis, ref => ref.where('idUser', '==', id)).valueChanges();
	}


	getTimbreBlocById(id): Observable<TimbreBlocModel> {
		return this.firestore.collection(this.basePathBloc, ref => ref.where('id', '==', id))
			.valueChanges().pipe(
				map((data: any) => {
					return plainToInstance(TimbreBlocModel, data[0]);
				}));
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
				);
			}
		});
	}

	addTimbreSansId(timbreModel: TimbreModel) {
		this.getMaxIdentAsync().pipe(first()).subscribe(id => {
			timbreModel.setId(id);
			if (isNotNullOrUndefined(timbreModel.getIdBloc())) {
				timbreModel.setAnnee(null);
				timbreModel.setMonnaie(null);
			}
			this.addTimbre(timbreModel);
		});
	}

	addTimbre(timbreModel: TimbreModel) {
		timbreModel.setTimbreAcquisModel(null);
		timbreModel.setTimbreBlocModel(null);

		this.firestore.collection(this.basePath).add(
			Object.assign(new Object(), timbreModel)
		);
		this.getTimbres();
	}

	modifierTimbre(timbreModel: TimbreModel) {
		timbreModel.setTimbreBlocModel(null);
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
		timbre.setAnnee(new Date().getFullYear());
		timbre.setMonnaie('E');
		timbre.setType('');
		timbre.setYt('');
		return timbre;
	}

	upload(timbreModel: TimbreModel, dossier: DossierEnum): Observable<string> {
		let witdth: number = this.widthTimbre;
		let height: number = this.heightTimbre;
		if (dossier == DossierEnum.TABLE) {
			witdth = witdth * (this.heigthTable / height);
			height = this.heigthTable;
		} else if (dossier == DossierEnum.ZOOM) {
			witdth = witdth * (this.heightTimbreZoom / height);
			height = this.heightTimbreZoom;
		}
		return this.uploadService.processAndUploadImage(timbreModel?.getImage(), witdth, height, timbreModel?.getId(), this.getDossier(timbreModel, dossier));
	}

	getDossier(timbreModel: TimbreModel, dossier: string): string {
		let dossierImage = this.timbreUtilsService.dossierImage + '/';
		if (isNotNullOrUndefined(timbreModel.getIdBloc())) {
			dossierImage = dossierImage + timbreModel.getTimbreBlocModel().getAnnee();
		} else {
			dossierImage = dossierImage + timbreModel.getAnnee();
		}
		if (isNotNullOrUndefined(dossier)) {
			dossierImage = dossierImage + '/' + dossier;
		}
		if (isNotNullOrUndefined(timbreModel.getIdBloc())) {
			dossierImage = dossierImage + '/bloc/' + timbreModel.getIdBloc();
		}
		return dossierImage;
	}
}
