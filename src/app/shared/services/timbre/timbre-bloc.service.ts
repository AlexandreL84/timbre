import {Injectable} from '@angular/core';
import {first, map, Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {isNotNullOrUndefined} from '../../utils/utils';
import {TimbreCritereModel} from '../../../model/timbre-critere.model';
import {plainToInstance} from 'class-transformer';
import {TimbreBlocModel} from '../../../model/timbre-bloc.model';
import {BaseEnum} from '../../enum/base.enum';
import {AuthService} from '../auth.service';
import {TimbreUtilsService} from './timbre-utils.service';
import {MonnaieEnum} from "../../enum/monnaie.enum";
import {TimbreModel} from "../../../model/timbre.model";
import {TimbreVarService} from "./timbre-var.service";
import {TimbreTotalService} from "./timbre-total.service";

@Injectable()
export class TimbreBlocService {

	constructor(
		private angularFirestore: AngularFirestore,
		private authService: AuthService,
		private timbreUtilsService: TimbreUtilsService,
		private timbreVarService: TimbreVarService,
		private timbreTotalService: TimbreTotalService,
	) {
	}


	getBloc(id: number): Observable<any> {
		return this.angularFirestore.collection(BaseEnum.TIMBRE_BLOC, ref => ref.where('id', '==', id))
			.valueChanges();
	}

	getBlocByIdAsync(id: number): Observable<TimbreBlocModel> {
		return this.getBloc(id).pipe(
			map((data: any) => {
				return plainToInstance(TimbreBlocModel, data[0]);
			}));
	}

	getRef(ref, timbreCritereModel: TimbreCritereModel) {
		let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
		if (isNotNullOrUndefined(timbreCritereModel)) {
			if (isNotNullOrUndefined(timbreCritereModel.getAnnees()) && timbreCritereModel.getAnnees()?.length > 0) {
				filteredQuery = filteredQuery.where("annee", "in", timbreCritereModel.getAnnees());
			}
			if (isNotNullOrUndefined(timbreCritereModel.getType()) && timbreCritereModel.getType()?.length > 0) {
				filteredQuery = filteredQuery.where("type", "in", timbreCritereModel.getType());
			}

			/*if (isNotNullOrUndefined(timbreCritereModel.getCarnet()) && timbreCritereModel.getCarnet() != "TOUS") {
				filteredQuery = filteredQuery.where("carnet", timbreCritereModel.getCarnet() != "OUI" ? "==" : "!=", false);
			}*/
		}
		filteredQuery = filteredQuery.orderBy("id", timbreCritereModel?.getSort() == "desc" ? "desc" : "asc");
		return filteredQuery;
	}

	getAllBlocs(timbreCritereModel: TimbreCritereModel): Observable<any> {
		return this.angularFirestore.collection(BaseEnum.TIMBRE_BLOC, ref => {
			return this.getRef(ref, timbreCritereModel);
		}).valueChanges();
	}

	getBlocs(timbreCritereModel: TimbreCritereModel, nbTimbres: boolean, total: boolean) {
		this.timbreVarService.loadBloc$.next(false);
		this.timbreVarService.timbresBlocModel$.next(null);
		if (total) {
			this.timbreTotalService.getTotalBlocByCritere(timbreCritereModel);
		}

		this.getAllBlocs(timbreCritereModel).pipe(first()).subscribe(timbresBloc => {
			this.timbreVarService.timbresBlocModel$.next(this.constructBlocs(timbresBloc, timbreCritereModel, nbTimbres));
			this.timbreVarService.loadBloc$.next(true);
		});
	}

	getBlocsAsync(timbreCritereModel?: TimbreCritereModel): Observable<TimbreBlocModel[]> {
		this.timbreVarService.timbresBlocModel$.next(null);
		return this.getAllBlocs(timbreCritereModel).pipe(first(), map(timbresBloc => {
			return this.constructBlocs(timbresBloc, timbreCritereModel, true);
		}));
	}

	constructBlocs(blocs, timbreCritereModel: TimbreCritereModel, nbTimbres: boolean): TimbreBlocModel[] {
		//console.log("constructBlocs")
		let timbresBlocModel: TimbreBlocModel[] = [];

		this.authService.userSelect$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			if (blocs?.length > 0) {
				blocs.forEach((bloc: any) => {
					const timbreBlocModel: TimbreBlocModel = plainToInstance(TimbreBlocModel, bloc);

					/*if (timbreBlocModel.getNbTimbres() <= 0 && nbTimbres == true) {
						this.getTimbresByBlocAsync(timbreBlocModel.getId()).subscribe(timbres => {
							timbreBlocModel.setNbTimbres(timbres?.length);
							const nbTimbresAcquis: number = timbres?.filter(timbre => timbre?.isAcquis(user))?.length;
							timbreBlocModel.setNbTimbresAcquis(nbTimbresAcquis);
							//this.timbreUtilsService.verifBloc(timbreBlocModel);
						});
					}*/

					let ajout: boolean = true;
					if (isNotNullOrUndefined(timbreCritereModel)) {
						/*if (timbreCritereModel?.getType()?.find(type => type == TypeTimbreEnum.CARNET) && timbreBlocModel?.getType() == TypeTimbreEnum.CARNET) {
							ajout = true;
						} else if (timbreCritereModel?.getType()?.find(type => type == TypeTimbreEnum.BLOC) && timbreBlocModel?.getType() == TypeTimbreEnum.BLOC) {
							ajout = true;
						} else if (timbreCritereModel?.getType()?.find(type => type == TypeTimbreEnum.COLLECTOR) && timbreBlocModel?.getType() == TypeTimbreEnum.COLLECTOR) {
							ajout = true;
						}*/

						if (isNotNullOrUndefined(timbreBlocModel.isAcquis(user))) {
							if (isNotNullOrUndefined(timbreCritereModel.getAcquis()) && !(timbreCritereModel.getAcquis() == 'TOUS' || (timbreCritereModel.getAcquis() == 'OUI' && timbreBlocModel.isAcquis(user)) || (timbreCritereModel.getAcquis() == 'NON' && !timbreBlocModel.isAcquis(user)))) {
								ajout = false;
							}
							if (isNotNullOrUndefined(timbreCritereModel.getDoublon()) && !(timbreCritereModel.getDoublon() == 'TOUS' || (timbreCritereModel.getDoublon() == 'OUI' && timbreBlocModel.isDoublon(user)) || (timbreCritereModel.getDoublon() == 'NON' && !timbreBlocModel.isDoublon(user)))) {
								ajout = false;
							}
						}
					} else {
						ajout = true;
					}

					if (ajout == true) {
						timbresBlocModel.push(timbreBlocModel);
					}
				});
			}
		});
		return timbresBlocModel;
	}

	getTimbresByBlocAsync(idBloc: number): Observable<TimbreModel[]> {
		const timbreCritereModel: TimbreCritereModel = new TimbreCritereModel();
		timbreCritereModel.setIdBloc(idBloc);
		return this.timbreUtilsService.getTimbresByCritereAsync(timbreCritereModel);
	}

	getBouchon(): TimbreBlocModel {
		let timbreBlocModel: TimbreBlocModel = new TimbreBlocModel();
		timbreBlocModel.setAnnee(new Date().getFullYear());
		timbreBlocModel.setMonnaie(MonnaieEnum.EURO);
		return timbreBlocModel;
	}
}
