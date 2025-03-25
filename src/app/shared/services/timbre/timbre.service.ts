import {Injectable} from '@angular/core';
import {TimbreModel} from '../../../model/timbre.model';
import {BehaviorSubject, combineLatest, first, map, Observable, switchMap} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {isNotNullOrUndefined} from '../../utils/utils';
import {AuthService} from '../auth.service';
import {TimbreAcquisModel} from '../../../model/timbre-acquis.model';
import {TimbreCritereModel} from '../../../model/timbre-critere.model';
import {plainToInstance} from 'class-transformer';
import {TimbreBlocModel} from '../../../model/timbre-bloc.model';
import {TimbreBlocService} from './timbre-bloc.service';
import {UploadService} from "../upload.service";
import {DossierEnum} from "../../enum/dossier.enum";
import {BaseEnum} from "../../enum/base.enum";
import {UtilsService} from "../utils.service";

@Injectable()
export class TimbreService {
	heigthTable: number = 50;
	widthTimbre: number = 100;
	heightTimbre: number = 100;
	widthTimbreZoom: number = 500;
	heightTimbreZoom: number = 500;

	total$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	timbres$: BehaviorSubject<TimbreModel[]> = new BehaviorSubject<TimbreModel[]>(null);

	constructor(
		private firestore: AngularFirestore,
		private authService: AuthService,
		private timbreBlocService: TimbreBlocService,
		private uploadService: UploadService,
		private utilsService: UtilsService) {
	}

	getTimbre(id: number): Observable<any> {
		return this.firestore.collection(BaseEnum.TIMBRE, ref => ref.where('id', '==', id)).valueChanges();
	}

	getTimbreByIdAsync(id: number): Observable<TimbreModel> {
		return combineLatest([
			this.getTimbre(id),
			this.timbreBlocService.getBlocsAsync()
		]).pipe(map(([data, timbresBlocModel]) => {
			return this.constructTimbre(data[0], null, timbresBlocModel);
		}));
	}

	getTotal(timbreCritereModel?: TimbreCritereModel) {
		this.total$.next(null);
		this.getAllTimbres(timbreCritereModel).pipe(first()).subscribe(timbres => {
			this.total$.next(timbres?.length);
		});
	}

	getTimbres(timbreCritereModel?: TimbreCritereModel) {
		this.getTotal();
		this.timbres$.next(null);
		combineLatest([
			this.getAllTimbres(timbreCritereModel),
			this.getTimbreAcquis(),
			this.timbreBlocService.getBlocsAsync(timbreCritereModel)
		]).pipe(first()).subscribe(([timbres, timbresAcquis, timbresBlocModel]) => {
			this.constructTimbres(timbres, timbresAcquis, timbresBlocModel, timbreCritereModel);
		});
	}

	getAllTimbres(timbreCritereModel: TimbreCritereModel) {
		return this.firestore.collection(BaseEnum.TIMBRE, ref => {
			let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
			if (isNotNullOrUndefined(timbreCritereModel)) {
				if (isNotNullOrUndefined(timbreCritereModel.getAnnees()) && timbreCritereModel.getAnnees()?.length > 0) {
					filteredQuery = filteredQuery.where("annee", "in", timbreCritereModel.getAnnees());
				}
				if (isNotNullOrUndefined(timbreCritereModel.getBloc()) && timbreCritereModel.getBloc() != 'TOUS') {
					filteredQuery = filteredQuery.where("idBloc", timbreCritereModel.getBloc() != 'NON' ? "!=" : "==", null);
				}
			}
			filteredQuery = filteredQuery.orderBy('id', 'asc');
			return filteredQuery;
		}).valueChanges();
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
		return this.firestore.collection(BaseEnum.TIMBRE_ACQUIS, ref => ref.where('idUser', '==', id)).valueChanges();
	}


	getTimbreBlocById(id): Observable<TimbreBlocModel> {
		return this.firestore.collection(BaseEnum.TIMBRE_BLOC, ref => ref.where('id', '==', id))
			.valueChanges().pipe(
				map((data: any) => {
					return plainToInstance(TimbreBlocModel, data[0]);
				}));
	}

	acquis(timbreModel: TimbreModel, doublon: boolean) {
		return this.authService.getUser().pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			if (isNotNullOrUndefined(timbreModel?.getTimbreAcquisModel()?.getIdUser())) {
				this.firestore.collection(BaseEnum.TIMBRE_ACQUIS)
					.ref.where('idTimbre', '==', timbreModel.getId()).where('idUser', '==', user.getId())
					//.limit(1)
					.get()
					.then(snapshot => {
						snapshot.forEach(doc => {
							// Mise à jour du document
							const timbreAcquisModel: TimbreAcquisModel = timbreModel.getTimbreAcquisModel();
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
				this.firestore.collection(BaseEnum.TIMBRE_ACQUIS).add(
					Object.assign(new Object(), timbreAcquisModel)
				);
			}
		});
	}

	ajouterSansId(timbreModel: TimbreModel) {
		this.utilsService.getMaxIdentAsync(BaseEnum.TIMBRE).pipe(first()).subscribe(id => {
			timbreModel.setId(id);
			if (isNotNullOrUndefined(timbreModel.getIdBloc())) {
				timbreModel.setAnnee(null);
				timbreModel.setMonnaie(null);
			}
			this.ajouter(timbreModel);
		});
	}

	ajouter(timbreModel: TimbreModel) {
		timbreModel.setTimbreAcquisModel(null);
		timbreModel.setTimbreBlocModel(null);

		this.firestore.collection(BaseEnum.TIMBRE).add(
			Object.assign(new Object(), timbreModel)
		);
		this.getTimbres();
	}

	modifier(timbreModel: TimbreModel) {
		timbreModel.setTimbreBlocModel(null);
		timbreModel.setTimbreAcquisModel(null);
		this.firestore.collection(BaseEnum.TIMBRE)
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

	supprimer(timbreModel: TimbreModel) {
		this.authService.getUser().pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			if (isNotNullOrUndefined(timbreModel?.getTimbreAcquisModel()?.getIdUser())) {
				this.firestore.collection(BaseEnum.TIMBRE_ACQUIS)
					.ref.where('idTimbre', '==', timbreModel.getId()).where('idUser', '==', user.getId())
					.get()
					.then(snapshot => {
						snapshot.forEach(doc => {
							doc.ref.delete();
						});
					});
			}

			this.firestore.collection(BaseEnum.TIMBRE)
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
		let dossierImage = DossierEnum.TIMBRE + '/';
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
