import {Injectable} from '@angular/core';
import {TimbreModel} from '../../../model/timbre.model';
import {combineLatest, first} from 'rxjs';
import {isNotNullOrUndefined} from '../../utils/utils';
import {TimbreCritereModel} from '../../../model/timbre-critere.model';
import {TypeTimbreEnum} from "../../enum/type-timbre.enum";
import {TimbreVarService} from "./timbre-var.service";
import {TimbreBlocService} from "./timbre-bloc.service";
import {TimbreUtilsService} from "./timbre-utils.service";
import {AuthService} from "../auth.service";

@Injectable()
export class ModiAllService {

	constructor(
		private authService: AuthService,
		private timbreUtilsService: TimbreUtilsService,
		private timbreBlocService: TimbreBlocService,
		private timbreVarService: TimbreVarService,
	) {
	}

	getAnnees(): number[] {
		/*
		let anneeDepart = 1926;
		if (baseEmun == BaseEnum.TIMBRE) {
			anneeDepart = 1849
		}*/
		//1920
		const anneeDebut = 2026;
		const anneeFin = 2026;
		const annees: number[] = []
		for (let i = anneeDebut; i <= anneeFin; i++) {
			annees.push(i);
		}
		return annees;
	}

	getTimbres() {
		const timbreCritereModel = new TimbreCritereModel();
		timbreCritereModel.initCritere();
		timbreCritereModel.setType([TypeTimbreEnum.CARNET, TypeTimbreEnum.BLOC]);
		timbreCritereModel.setAnnees(this.getAnnees());


		this.timbreVarService.timbresPdf$.next(null);
		this.timbreVarService.loadPdf$.next(false);
		combineLatest([
			this.authService.userSelect$,
			this.timbreBlocService.getAllBlocs(timbreCritereModel),
		]).pipe(first()).subscribe(([user, timbres]) => {
			if (isNotNullOrUndefined(timbres) && timbres.length > 0) {
				let timbresRetour: TimbreModel[] = this.timbreUtilsService.constructTimbres(user, timbres, null, timbreCritereModel);
				if (isNotNullOrUndefined(timbresRetour) && timbresRetour.length > 0) {
					timbresRetour.forEach(timbreRetour => {
						if (timbreRetour.isAcquis(user)) {
							timbreRetour.addUserAcquis2(user);
						}
					})
				}

				console.log(timbresRetour);
			}
		});
	}

}
