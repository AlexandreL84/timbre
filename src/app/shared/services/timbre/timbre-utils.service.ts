import {Injectable} from '@angular/core';
import {first, map, Observable} from "rxjs";
import {isNotNullOrUndefined} from "../../utils/utils";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {BaseEnum} from "../../enum/base.enum";
import {TimbreCritereModel} from "../../../model/timbre-critere.model";
import {TimbreBlocModel} from "../../../model/timbre-bloc.model";
import {TimbreModel} from "../../../model/timbre.model";
import {plainToInstance} from "class-transformer";
import {TimbreAcquisModel} from "../../../model/timbre-acquis.model";

@Injectable()
export class TimbreUtilsService {
	constructor(private firestore: AngularFirestore) {
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
					filteredQuery = filteredQuery.where("idBloc", timbreCritereModel.getBloc() != 'NON' ? "!=" : "==", null);
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

	supprimerTimbreAcquis(timbreModel: TimbreModel, idUUser: string) {
		if (isNotNullOrUndefined(timbreModel?.getTimbreAcquisModel()?.getIdUser())) {
			this.firestore.collection(BaseEnum.TIMBRE_ACQUIS)
				.ref.where('idTimbre', '==', timbreModel.getId()).where('idUser', '==', idUUser)
				.get()
				.then(snapshot => {
					snapshot.forEach(doc => {
						doc.ref.delete();
					});
				});
		}
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

}
