import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, first} from 'rxjs';
import {isNotNullOrUndefined, isNullOrUndefined} from '../../utils/utils';
import {TimbreCritereModel} from '../../../model/timbre-critere.model';
import {TimbreBlocService} from './timbre-bloc.service';
import {TimbreUtilsService} from './timbre-utils.service';
import {TimbreService} from "./timbre.service";
import {TimbreResumeModel} from "../../../model/timbre-resume.model";
import {TypeTimbreEnum} from "../../enum/type-timbre.enum";

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
			this.timbreUtilsService.getTimbreAcquis(),
			this.timbreBlocService.getAllBlocs(timbreCritereModel),
			this.timbreBlocService.getTimbreBlocAcquis()
		]).pipe(first()).subscribe(([timbres, timbresAcquis, timbresBloc, timbresBlocAcquis]) => {
			this.timbresResume$.next(this.construct(timbres, timbresAcquis, timbresBloc, timbresBlocAcquis));
			this.timbreUtilsService.reinitResume$.next(false);
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
					if (isNotNullOrUndefined(findBloc) && findBloc["type"] == TypeTimbreEnum.CARNET) {
						timbreResumeModel.setNombreTimbresCarnet(timbreResumeModel.getNombreTimbresCarnet() + 1);
					} else if (isNotNullOrUndefined(findBloc) && findBloc["type"] == TypeTimbreEnum.COLLECTOR) {
						timbreResumeModel.setNombreTimbresCollector(timbreResumeModel.getNombreTimbresCollector() + 1);
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
								if (isNotNullOrUndefined(findBloc) && findBloc["type"] == TypeTimbreEnum.CARNET) {
									timbreResumeModel.setAcquisTimbresCarnet(timbreResumeModel.getAcquisTimbresCarnet() + 1);
								} else if (isNotNullOrUndefined(findBloc) && findBloc["type"] == TypeTimbreEnum.COLLECTOR) {
									timbreResumeModel.setAcquisTimbresCollector(timbreResumeModel.getAcquisTimbresCollector() + 1);
								} else {
									timbreResumeModel.setAcquisTimbresBloc(timbreResumeModel.getAcquisTimbresBloc() + 1);
								}
							} else {
								timbreResumeModel.setAcquis(timbreResumeModel.getAcquis() + 1);
							}
						}
						if (findTimbreAcquis["doublon"] == true) {
							if (isNotNullOrUndefined(timbre["idBloc"])) {
								if (isNotNullOrUndefined(findBloc) && findBloc["type"] == TypeTimbreEnum.CARNET) {
									timbreResumeModel.setDoublonTimbresCarnet(timbreResumeModel.getDoublonTimbresCarnet() + 1);
								} else if (isNotNullOrUndefined(findBloc) && findBloc["type"] == TypeTimbreEnum.COLLECTOR) {
									timbreResumeModel.setDoublonTimbresCollector(timbreResumeModel.getDoublonTimbresCollector() + 1);
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

				if (bloc["type"] == TypeTimbreEnum.CARNET) {
					timbreResumeModel.setNombreCarnet(timbreResumeModel.getNombreCarnet() + 1);
				} else if (bloc["type"] == TypeTimbreEnum.COLLECTOR) {
					timbreResumeModel.setNombreCollector(timbreResumeModel.getNombreCollector() + 1);
				} else {
					timbreResumeModel.setNombreBloc(timbreResumeModel.getNombreBloc() + 1);
				}

				if (isNotNullOrUndefined(timbresBlocAcquis)) {
					const findTimbreBlocAcquis = timbresBlocAcquis.find(timbreBlocAcquis => timbreBlocAcquis['idBloc'] == bloc["id"]);
					if (isNotNullOrUndefined(findTimbreBlocAcquis)) {
						if (findTimbreBlocAcquis["acquis"] == true) {
							if (isNullOrUndefined(bloc["type"]) || bloc["type"] == TypeTimbreEnum.BLOC) {
								timbreResumeModel.setAcquisBloc(timbreResumeModel.getAcquisBloc() + 1);
							} else if (bloc["type"] == TypeTimbreEnum.COLLECTOR) {
								timbreResumeModel.setAcquisCollector(timbreResumeModel.getAcquisCollector() + 1);
							}
						}
						if (findTimbreBlocAcquis["doublon"] == true) {
							if (isNullOrUndefined(bloc["type"]) || bloc["type"] == TypeTimbreEnum.BLOC) {
								timbreResumeModel.setDoublonBloc(timbreResumeModel.getDoublonBloc() + 1);
							} else if (bloc["type"] == TypeTimbreEnum.COLLECTOR) {
								timbreResumeModel.setDoublonCollector(timbreResumeModel.getDoublonCollector() + 1);
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

				totalTimbreResume.setNombreCollector(totalTimbreResume.getNombreCollector() + timbreResumeModel.getNombreCollector());
				totalTimbreResume.setAcquisCollector(totalTimbreResume.getAcquisCollector() + timbreResumeModel.getAcquisCollector());
				totalTimbreResume.setDoublonCollector(totalTimbreResume.getDoublonCollector() + timbreResumeModel.getDoublonCollector());
				totalTimbreResume.setNombreTimbresCollector(totalTimbreResume.getNombreTimbresCollector() + timbreResumeModel.getNombreTimbresCollector());
				totalTimbreResume.setAcquisTimbresCollector(totalTimbreResume.getAcquisTimbresCollector() + timbreResumeModel.getAcquisTimbresCollector());
				totalTimbreResume.setDoublonTimbresCollector(totalTimbreResume.getDoublonTimbresCollector() + timbreResumeModel.getDoublonTimbresCollector());
			})
			this.totalTimbreResume$.next(totalTimbreResume);
		}
		this.load$.next(true);
		return timbreResumeModels;
	}
}
