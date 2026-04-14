import {Injectable} from '@angular/core';
import {TimbreModel} from '../../../model/timbre.model';
import {
	combineLatest,
	first,
	map,
	Observable,
	of, switchMap,
} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {isNotNullOrUndefined} from '../../utils/utils';
import {AuthService} from '../auth.service';
import {TimbreCritereModel} from '../../../model/timbre-critere.model';
import {TimbreBlocService} from './timbre-bloc.service';
import {BaseEnum} from '../../enum/base.enum';
import {TimbreUtilsService} from './timbre-utils.service';
import {MonnaieEnum} from "../../enum/monnaie.enum";
import {TimbreVarService} from "./timbre-var.service";
import {TimbreTotalService} from "./timbre-total.service";
import {plainToInstance} from "class-transformer";

@Injectable()
export class TimbreService {

	constructor(
		private angularFirestore: AngularFirestore,
		private authService: AuthService,
		private timbreBlocService: TimbreBlocService,
		private timbreUtilsService: TimbreUtilsService,
		private timbreVarService: TimbreVarService,
		private timbreTotalService: TimbreTotalService
	) {
	}

	getTimbre(id: number): Observable<any> {
		if (isNotNullOrUndefined(id)) {
			return this.angularFirestore.collection(BaseEnum.TIMBRE, ref => ref.where('id', '==', id)).valueChanges();
		} else {
			return of(null);
		}
	}

	getTimbreByIdAsync(id: number): Observable<TimbreModel> {
		return this.getTimbre(id).pipe(
			switchMap(data => {
				const timbreModel: TimbreModel = plainToInstance(TimbreModel, data[0]);
				return this.timbreBlocService.getBlocByIdAsync(timbreModel.getIdBloc()).pipe(
					map(timbreBlocModel => {
						if (isNotNullOrUndefined(timbreBlocModel)) {
							timbreModel.setTimbreBlocModel(timbreBlocModel)
						}
						//this.timbreUtilsService.constructTimbre(data[0], [timbreBlocModel])
						return timbreModel;
					})
				);
			})
		);
	}

	getTimbres(timbreCritereModel: TimbreCritereModel, total: boolean) {
		const timbreCritereBlocModel: TimbreCritereModel = new TimbreCritereModel();
		timbreCritereBlocModel.setAnnees(timbreCritereModel.getAnnees())
		if (total) {
			this.timbreTotalService.getTotalByCritere(timbreCritereModel);
		}
		this.timbreVarService.timbres$.next(null);
		this.timbreVarService.load$.next(false);
		combineLatest([
			this.authService.userSelect$,
			this.timbreUtilsService.getAllTimbres(timbreCritereModel),
			this.timbreBlocService.getBlocsAsync(timbreCritereBlocModel)
		]).pipe(first()).subscribe(([user, timbres, timbresBlocModel]) => {
			if (isNotNullOrUndefined(timbres) && timbres.length > 0) {
				let timbresRetour: TimbreModel[] = this.timbreUtilsService.constructTimbres(user, timbres, timbresBlocModel, timbreCritereModel);
				//console.log("verif constructTimbres timbresRetour", timbresRetour)
				if (timbresRetour?.length > 0) {
					timbresRetour = timbresRetour.sort((a, b) => {
						return a.getIdBloc() - b.getIdBloc();
					}).sort((a, b) => {
						return a?.getTimbreBlocModel()?.getNbTimbres() - b?.getTimbreBlocModel()?.getNbTimbres();
					});
				}
				this.timbreVarService.timbres$.next(timbresRetour);
			}
			this.timbreVarService.load$.next(true);
		});
	}

	getBouchon(): TimbreModel {
		let timbre: TimbreModel = new TimbreModel();
		timbre.setAnnee(new Date().getFullYear());
		timbre.setMonnaie(MonnaieEnum.EURO);
		timbre.setYt('');
		return timbre;
	}
}
