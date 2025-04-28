import {Injectable} from '@angular/core';
import {BehaviorSubject, first, map, Observable} from "rxjs";
import {isNotNullOrUndefined, isNullOrUndefined} from "../../utils/utils";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {BaseEnum} from "../../enum/base.enum";
import {TimbreCritereModel} from "../../../model/timbre-critere.model";
import {TimbreBlocModel} from "../../../model/timbre-bloc.model";
import {TimbreModel} from "../../../model/timbre.model";
import {plainToInstance} from "class-transformer";
import {TimbreAcquisModel} from "../../../model/timbre-acquis.model";
import {AuthService} from "../auth.service";
import {FileDetailUploadModel} from "../../../model/file/file-detail-upload.model";
import {DimensionImageEnum} from "../../enum/dimension-image.enum";
import {FileUploadModel} from "../../../model/file/file-upload.model";

@Injectable()
export class TimbreUtilsService {
	reinitResume$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
	public timbreCritereModel: TimbreCritereModel = new TimbreCritereModel();
	public timbreCritereBlocModel: TimbreCritereModel = new TimbreCritereModel();

	constructor(private authService: AuthService, private firestore: AngularFirestore) {
	}

	initUpload(): FileUploadModel {
		const fileUploadModel: FileUploadModel = new FileUploadModel();
		fileUploadModel.setDossier('table');
		fileUploadModel.setNom(new Date().getTime()?.toString());

		const fileDetailUploadModel = new FileDetailUploadModel();
		fileDetailUploadModel.setMaxWidth(DimensionImageEnum.WIDTH_TIMBRE);
		fileDetailUploadModel.setMaxHeight(DimensionImageEnum.HEIGTH_TIMBRE);
		fileDetailUploadModel.setDossier('autre');

		const fileDetailUploadModelZoom = new FileDetailUploadModel();
		fileDetailUploadModelZoom.setMaxWidth(DimensionImageEnum.WIDTH_TIMBRE_ZOOM);
		fileDetailUploadModelZoom.setMaxHeight(DimensionImageEnum.HEIGTH_TIMBRE_ZOOM);
		fileDetailUploadModelZoom.setDossier('zoom');

		fileUploadModel.setDetail([fileDetailUploadModel, fileDetailUploadModelZoom]);

		return fileUploadModel;
	}

	getAnneesAsync(baseEmun: BaseEnum): Observable<number[]>  {
		return this.firestore.collection(baseEmun, ref => {
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

	getTimbresByCritereAsync(timbreCritereModel?: TimbreCritereModel): Observable<TimbreModel[]> {
		return this.getAllTimbres(timbreCritereModel)
			.pipe(map((timbres) => {
				return this.constructTimbres(timbres, null, null);
			}));
	}

	getAllTimbres(timbreCritereModel: TimbreCritereModel) {
		return this.firestore.collection(BaseEnum.TIMBRE, ref => {
			let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
			if (isNotNullOrUndefined(timbreCritereModel)) {
				if (isNotNullOrUndefined(timbreCritereModel.getAnnees()) && timbreCritereModel.getAnnees()?.length > 0) {
					filteredQuery = filteredQuery.where("annee", "in", timbreCritereModel.getAnnees());
				}
				if (isNotNullOrUndefined(timbreCritereModel.getBloc()) && timbreCritereModel.getBloc() != 'TOUS') {
					filteredQuery = filteredQuery.where("idBloc", timbreCritereModel.getBloc() != "OUI" ? "==" : "!=", null);
				} else if (isNotNullOrUndefined(timbreCritereModel.getIdBloc())) {
					filteredQuery = filteredQuery.where("idBloc", "==", timbreCritereModel.getIdBloc());
				}
			}
			filteredQuery = filteredQuery.orderBy('id', 'asc');
			return filteredQuery;
		}).valueChanges();
	}

	constructTimbres(timbres, timbresAcquis, timbresBlocModel?: TimbreBlocModel[], timbreCritereModel?: TimbreCritereModel): TimbreModel[] {
		let timbresModel: TimbreModel[] = [];
		if (timbres?.length > 0) {
			timbres.forEach((timbre: any) => {
				const timbreModel: TimbreModel = this.constructTimbre(timbre, timbresAcquis, timbresBlocModel);

				let ajout: boolean = true;
				if (isNotNullOrUndefined(timbreCritereModel) && isNotNullOrUndefined(timbreModel.getTimbreAcquisModel())) {
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
		return timbresModel;
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

	supprimerTimbreAcquis(timbreModel: TimbreModel) {
		this.firestore.collection(BaseEnum.TIMBRE_ACQUIS)
			.ref.where('idTimbre', '==', timbreModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					doc.ref.delete();
				});
			});
	}

	supprimerTimbre(timbreModel: TimbreModel) {
		this.firestore.collection(BaseEnum.TIMBRE)
			.ref.where('id', '==', timbreModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					doc.ref.delete();
				});
			})
			.catch(error => {
				console.error('Erreur de suppression :', error);
			});
	}

	acquis(timbreModel: TimbreModel, doublon: boolean, force?: boolean) {
		this.authService.userSelect$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			//if (isNotNullOrUndefined(timbreModel?.getTimbreAcquisModel()?.getIdUser())) {
				this.firestore.collection(BaseEnum.TIMBRE_ACQUIS)
					.ref.where('idTimbre', '==', timbreModel.getId()).where('idUser', '==', user.getId())
					//.limit(1)
					.get()
					.then(snapshot => {
						if (snapshot?.size == 0) {
							this.addAcquis(user.getId(), timbreModel, doublon);
						}
						snapshot.forEach(doc => {
							//const timbreAcquisModel: TimbreAcquisModel = timbreModel.getTimbreAcquisModel();
							const timbreAcquisModel = plainToInstance(TimbreAcquisModel, doc.data());
							if (doublon) {
								timbreAcquisModel.setAcquis(true);
								timbreAcquisModel.setDoublon(force? force : !timbreAcquisModel.isDoublon());
							} else {
								timbreAcquisModel.setAcquis(force? force : !timbreAcquisModel.isAcquis());
								if (!timbreAcquisModel.isAcquis()) {
									timbreAcquisModel.setDoublon(false);
								}
							}
							doc.ref.update(Object.assign(new Object(), timbreAcquisModel))
								.then(snapshot => {
									timbreModel.setTimbreAcquisModel(timbreAcquisModel);
								})
								.catch(error => {
									console.error('Erreur de mise à jour:', error);
								});
						});
					})
					.catch(error => {
						console.error('Erreur de mise à jour id introuvable :', error);
					});
			/*} else {
				this.addAcquis(user?.getId(), timbreModel, doublon);
			}*/
			this.reinitResume$.next(true);
		});
	}

	supprimerAcquisTimbreByUser(idUser: string, timbreModel: TimbreModel, doublon?: boolean, ajout?: boolean) {
		this.firestore.collection(BaseEnum.TIMBRE_ACQUIS)
			.ref.where('idTimbre', '==', timbreModel.getId()).where('idUser', '==', idUser)
			.get()
			.then(snapshot => {
				if (snapshot?.size == 0) {
					if (ajout) {
						this.addAcquis(idUser, timbreModel, doublon);
					}
				}
				snapshot.forEach(doc => {
					doc.ref.delete().then((result) => {
						if (ajout) {
							this.supprimerTimbreAcquis(timbreModel);
						}
					})
				});
			})
			.catch(error => {
				console.error('Erreur de suppression :', error);
			});
	}

	addAcquis(idUser: string, timbreModel: TimbreModel, doublon: boolean) {
		const timbreAcquisModel = new TimbreAcquisModel();
		timbreAcquisModel.setIdUser(idUser);
		timbreAcquisModel.setIdTimbre(timbreModel.getId());
		timbreAcquisModel.setAcquis(true);
		timbreAcquisModel.setDoublon(doublon);
		timbreModel.setTimbreAcquisModel(timbreAcquisModel);
		this.firestore.collection(BaseEnum.TIMBRE_ACQUIS).add(
			Object.assign(new Object(), timbreAcquisModel)
		);
	}
}
