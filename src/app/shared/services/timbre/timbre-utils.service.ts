import {Injectable} from '@angular/core';
import {
	BehaviorSubject, combineLatest,
	first,
	Observable,
} from 'rxjs';
import {map} from 'rxjs/operators';
import {isNotNullOrUndefined, isNullOrUndefined} from '../../utils/utils';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {BaseEnum} from '../../enum/base.enum';
import {TimbreCritereModel} from '../../../model/timbre-critere.model';
import {TimbreBlocModel} from '../../../model/timbre-bloc.model';
import {TimbreModel} from '../../../model/timbre.model';
import {plainToInstance} from 'class-transformer';
import {AuthService} from '../auth.service';
import {TypeTimbreEnum} from '../../enum/type-timbre.enum';
import {MonnaieEnum} from "../../enum/monnaie.enum";
import {UserModel} from "../../../model/user.model";


@Injectable()
export class TimbreUtilsService {
	constructor(private authService: AuthService, private angularFirestore: AngularFirestore) {
	}

	getAnneesAsync(baseEmun: BaseEnum): BehaviorSubject<number[]> {
		let anneeDepart = 1926;
		if (baseEmun == BaseEnum.TIMBRE) {
			anneeDepart = 1849
		}
		const anneeActuelle = new Date().getFullYear();
		const listeAnnees = [];

		for (let annee = anneeActuelle; annee >= anneeDepart; annee--) {
			listeAnnees.push(annee);
		}

		return new BehaviorSubject<number[]>(listeAnnees);
	}

	getAllTimbres(timbreCritereModel: TimbreCritereModel) {
		return this.angularFirestore.collection(BaseEnum.TIMBRE, ref => {
			let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
			if (isNotNullOrUndefined(timbreCritereModel)) {
				if (isNotNullOrUndefined(timbreCritereModel.getAnnees()) && timbreCritereModel.getAnnees()?.length > 0) {
					filteredQuery = filteredQuery.where('annee', 'in', timbreCritereModel.getAnnees());
				}

				if (timbreCritereModel?.getType()?.length == 0 || (timbreCritereModel?.getType()?.length == 1 && isNotNullOrUndefined(timbreCritereModel?.getType()?.find(type => type == TypeTimbreEnum.TIMBRE)))) {
					filteredQuery = filteredQuery.where('idBloc', '==', null);
				} else if (timbreCritereModel?.getType()?.length > 0 && isNullOrUndefined(timbreCritereModel?.getType()?.find(type => type == TypeTimbreEnum.TIMBRE))) {
					filteredQuery = filteredQuery.where('idBloc', '!=', null);
				} else if (isNotNullOrUndefined(timbreCritereModel.getIdBloc())) {
					filteredQuery = filteredQuery.where('idBloc', '==', timbreCritereModel.getIdBloc());
				}
			}
			//filteredQuery = filteredQuery.orderBy('id', 'asc');
			return filteredQuery;
		}).valueChanges();
	}

	constructTimbres(user: UserModel, timbres, timbresBlocModel?: TimbreBlocModel[], timbreCritereModel?: TimbreCritereModel): TimbreModel[] {
		let timbresModel: TimbreModel[] = [];
		if (timbres?.length > 0) {
			timbres.forEach((timbre: any) => {
				const timbreModel: TimbreModel = this.constructTimbre(timbre, timbresBlocModel);

				let ajout: boolean = false;
				if (isNotNullOrUndefined(timbreCritereModel)) {
					if (timbreCritereModel?.getType()?.find(type => type == TypeTimbreEnum.TIMBRE) && isNullOrUndefined(timbreModel?.getTimbreBlocModel())) {
						ajout = true;
					} else if (timbreCritereModel?.getType()?.find(type => type == TypeTimbreEnum.BLOC) && isNotNullOrUndefined(timbreModel?.getTimbreBlocModel()) && timbreModel?.getTimbreBlocModel()?.getType() == TypeTimbreEnum.BLOC) {
						ajout = true;
					} else if (timbreCritereModel?.getType()?.find(type => type == TypeTimbreEnum.CARNET) && isNotNullOrUndefined(timbreModel?.getTimbreBlocModel()) && timbreModel?.getTimbreBlocModel()?.getType() == TypeTimbreEnum.CARNET) {
						ajout = true;
					}

					if (isNotNullOrUndefined(timbreModel.isAcquis(user))) {
						if (isNotNullOrUndefined(timbreCritereModel.getAcquis()) && !(timbreCritereModel.getAcquis() == 'TOUS' || (timbreCritereModel.getAcquis() == 'OUI' && timbreModel.isAcquis(user)) || (timbreCritereModel.getAcquis() == 'NON' && !timbreModel.isAcquis(user)))) {
							ajout = false;
						}
						if (isNotNullOrUndefined(timbreCritereModel.getDoublon()) && !(timbreCritereModel.getDoublon() == 'TOUS' || (timbreCritereModel.getDoublon() == 'OUI' && timbreModel.isDoublon(user)) || (timbreCritereModel.getDoublon() == 'NON' && !timbreModel.isDoublon(user)))) {
							ajout = false;
						}
					}
				} else {
					ajout = true;
				}

				if (ajout == true) {
					timbresModel.push(timbreModel);
				}
			});
		}
		return timbresModel;
	}

	constructTimbre(timbre: TimbreModel, timbresBlocModel?: TimbreBlocModel[]): TimbreModel {
		const timbreModel: TimbreModel = plainToInstance(TimbreModel, timbre);
		if (isNotNullOrUndefined(timbresBlocModel)) {
			const findTimbreBloc = timbresBlocModel.find(timbreBlocModel => timbreBlocModel.getId() == timbreModel?.getIdBloc());
			if (isNotNullOrUndefined(findTimbreBloc)) {
				timbreModel.setTimbreBlocModel(findTimbreBloc);
			}
		}
		return timbreModel;
	}

	getTimbresByCritereAsync(timbreCritereModel?: TimbreCritereModel): Observable<TimbreModel[]> {
		//console.log("getTimbresByCritereAsync", timbreCritereModel)
		return combineLatest([
			this.authService.userSelect$,
			this.getAllTimbres(timbreCritereModel)
		]).pipe(first(([user, timbres]) => isNotNullOrUndefined(user)), map(([user, timbres]) => {
			return this.constructTimbres(user, timbres, null, null);
		}));
	}

	isValidImage(img: string | null | undefined): boolean {
		return isNotNullOrUndefined(img) && img !== 'nok';
	}

	resolveMonnaie(annee: number): MonnaieEnum {
		if (annee >= 2002) return MonnaieEnum.EURO;
		if (annee >= 1999) return MonnaieEnum.FRANC_EURO;
		return MonnaieEnum.FRANC;
	}
}
