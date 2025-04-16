import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, first} from 'rxjs';
import {isNotNullOrUndefined, isNullOrUndefined} from '../../utils/utils';
import {TimbreCritereModel} from '../../../model/timbre-critere.model';
import {TimbreBlocService} from './timbre-bloc.service';
import {TimbreUtilsService} from './timbre-utils.service';
import {TimbreService} from "./timbre.service";
import {TimbreResumeModel} from "../../../model/timbre-resume.model";

@Injectable()
export class TimbreResumeService {
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	timbresResume$: BehaviorSubject<TimbreResumeModel[]> = new BehaviorSubject<TimbreResumeModel[]>(null);
	totalTimbreResume$: BehaviorSubject<TimbreResumeModel> = new BehaviorSubject<TimbreResumeModel>(null);

	constructor(
		private timbreService: TimbreService,
		private timbreBlocService: TimbreBlocService,
		private timbreUtilsService: TimbreUtilsService) {
	}

	getResume(timbreCritereModel?: TimbreCritereModel) {
		this.load$.next(false);
		this.timbresResume$.next(null);
		this.totalTimbreResume$.next(null);
		combineLatest([
			this.timbreUtilsService.getAllTimbres(timbreCritereModel),
			this.timbreService.getTimbreAcquis(),
			this.timbreBlocService.getAllBlocs(timbreCritereModel),
			this.timbreBlocService.getTimbreBlocAcquis()
		]).pipe(first()).subscribe(([timbres, timbresAcquis, timbresBloc, timbresBlocAcquis]) => {
			this.timbresResume$.next(this.construct(timbres, timbresAcquis, timbresBloc, timbresBlocAcquis));
		});
	}

	construct(timbres, timbresAcquis, timbresBloc, timbresBlocAcquis) {
		let timbreResumeModels: TimbreResumeModel[] = [];
		if (timbres?.length > 0) {
			timbres.forEach((timbre: any) => {
				let annee: number = timbre["annee"];

				if (isNotNullOrUndefined(timbresBloc) && isNullOrUndefined(timbre["annee"]) && isNotNullOrUndefined(timbre["idBloc"])) {
					const findTimbreBloc = timbresBloc.find(timbreBloc => timbreBloc["id"] == timbre["idBloc"]);
					if (isNotNullOrUndefined(findTimbreBloc)) {
						annee = findTimbreBloc["annee"];
					}
				}

				let timbreResumeModel: TimbreResumeModel = timbreResumeModels.find(timbreResumeModel => timbreResumeModel.getAnnee() == annee);
				if (isNullOrUndefined(timbreResumeModel)) {
					timbreResumeModel = new TimbreResumeModel();
					timbreResumeModel.setAnnee(annee);
					timbreResumeModels.push(timbreResumeModel);
				}
				timbreResumeModel.setTotal(timbreResumeModel.getTotal() + 1);

				const findBloc = isNotNullOrUndefined(timbre["idBloc"])? timbresBloc.find(timbreBloc => timbreBloc["id"] == timbre["idBloc"]): null;
				if (isNotNullOrUndefined(timbre["idBloc"])) {
					if (isNotNullOrUndefined(findBloc) && findBloc["carnet"]) {
						timbreResumeModel.setNombreTimbresCarnet(timbreResumeModel.getNombreTimbresCarnet() + 1);
					} else {
						timbreResumeModel.setNombreTimbresBloc(timbreResumeModel.getNombreTimbresBloc() + 1);
					}
				} else {
					timbreResumeModel.setNombre(timbreResumeModel.getNombre() + 1);
				}

				if (isNotNullOrUndefined(timbresAcquis)) {
					const findTimbreAcquis = timbresAcquis.find(timbreAcquis => timbreAcquis['idTimbre'] == timbre["id"]);
					if (isNotNullOrUndefined(findTimbreAcquis)) {
						if (findTimbreAcquis["acquis"] == true) {
							if (isNotNullOrUndefined(timbre["idBloc"])) {
								if (isNotNullOrUndefined(findBloc) && findBloc["carnet"]) {
									timbreResumeModel.setAcquisTimbresCarnet(timbreResumeModel.getAcquisTimbresCarnet() + 1);
								} else {
									timbreResumeModel.setAcquisTimbresBloc(timbreResumeModel.getAcquisTimbresBloc() + 1);
								}
							} else {
								timbreResumeModel.setAcquis(timbreResumeModel.getAcquis() + 1);
							}
						}
						if (findTimbreAcquis["doublon"] == true) {
							if (isNotNullOrUndefined(timbre["idBloc"])) {
								if (isNotNullOrUndefined(findBloc) && findBloc["carnet"]) {
									timbreResumeModel.setDoublonTimbresCarnet(timbreResumeModel.getDoublonTimbresCarnet() + 1);
								} else {
									timbreResumeModel.setDoublonTimbresBloc(timbreResumeModel.getDoublonTimbresBloc() + 1);
								}
							} else {
								timbreResumeModel.setDoublon(timbreResumeModel.getDoublon() + 1);
							}
						}
					}
				}

			});


			timbresBloc.forEach(bloc => {
				let timbreResumeModel: TimbreResumeModel = timbreResumeModels.find(timbreResumeModel => timbreResumeModel.getAnnee() == bloc["annee"])
				if (isNullOrUndefined(timbreResumeModel)) {
					timbreResumeModel = new TimbreResumeModel();
					timbreResumeModel.setAnnee(bloc["annee"]);
					timbreResumeModels.push(timbreResumeModel);
				}

				if (bloc["carnet"]) {
					timbreResumeModel.setNombreCarnet(timbreResumeModel.getNombreCarnet() + 1);
				} else {
					timbreResumeModel.setNombreBloc(timbreResumeModel.getNombreBloc() + 1);
				}

				if (isNotNullOrUndefined(timbresBlocAcquis)) {
					const findTimbreBlocAcquis = timbresBlocAcquis.find(timbreBlocAcquis => timbreBlocAcquis['idBloc'] == bloc["id"]);
					if (isNotNullOrUndefined(findTimbreBlocAcquis)) {
						if (findTimbreBlocAcquis["acquis"] == true) {
							if (!bloc["carnet"]) {
								timbreResumeModel.setAcquisBloc(timbreResumeModel.getAcquisBloc() + 1);
							}
						}
						if (findTimbreBlocAcquis["doublon"] == true) {
							if (!bloc["carnet"]) {
								timbreResumeModel.setDoublonBloc(timbreResumeModel.getDoublonBloc() + 1);
							}
						}
					}
				}
			});
		}

		if (isNotNullOrUndefined(timbreResumeModels) && timbreResumeModels?.length > 0) {
			const totalTimbreResume = new TimbreResumeModel();
			timbreResumeModels.forEach(timbreResumeModel => {
				totalTimbreResume.setTotal(totalTimbreResume.getTotal() + timbreResumeModel.getTotal());
				totalTimbreResume.setNombre(totalTimbreResume.getNombre() + timbreResumeModel.getNombre());
				totalTimbreResume.setAcquis(totalTimbreResume.getAcquis() + timbreResumeModel.getAcquis());
				totalTimbreResume.setDoublon(totalTimbreResume.getDoublon() + timbreResumeModel.getDoublon());
				totalTimbreResume.setNombreCarnet(totalTimbreResume.getNombreCarnet() + timbreResumeModel.getNombreCarnet());
				totalTimbreResume.setNombreTimbresCarnet(totalTimbreResume.getNombreTimbresCarnet() + timbreResumeModel.getNombreTimbresCarnet());
				totalTimbreResume.setAcquisTimbresCarnet(totalTimbreResume.getAcquisTimbresCarnet() + timbreResumeModel.getAcquisTimbresCarnet());
				totalTimbreResume.setDoublonTimbresCarnet(totalTimbreResume.getDoublonTimbresCarnet() + timbreResumeModel.getDoublonTimbresCarnet());
				totalTimbreResume.setNombreBloc(totalTimbreResume.getNombreBloc() + timbreResumeModel.getNombreBloc());
				totalTimbreResume.setAcquisBloc(totalTimbreResume.getAcquisBloc() + timbreResumeModel.getAcquisBloc());
				totalTimbreResume.setDoublonBloc(totalTimbreResume.getDoublonBloc() + timbreResumeModel.getDoublonBloc());
				totalTimbreResume.setNombreTimbresBloc(totalTimbreResume.getNombreTimbresBloc() + timbreResumeModel.getNombreTimbresBloc());
				totalTimbreResume.setAcquisTimbresBloc(totalTimbreResume.getAcquisTimbresBloc() + timbreResumeModel.getAcquisTimbresBloc());
				totalTimbreResume.setDoublonTimbresBloc(totalTimbreResume.getDoublonTimbresBloc() + timbreResumeModel.getDoublonTimbresBloc());
			})
			this.totalTimbreResume$.next(totalTimbreResume);
		}
		this.load$.next(true);
		return timbreResumeModels;
	}
}
