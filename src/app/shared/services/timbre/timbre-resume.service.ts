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
	timbresResume$: BehaviorSubject<TimbreResumeModel[]> = new BehaviorSubject<TimbreResumeModel[]>(null);
	totalTimbreResume$: BehaviorSubject<TimbreResumeModel> = new BehaviorSubject<TimbreResumeModel>(null);

	constructor(
		private timbreService: TimbreService,
		private timbreBlocService: TimbreBlocService,
		private timbreUtilsService: TimbreUtilsService) {
	}

	getResume(timbreCritereModel?: TimbreCritereModel) {
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

				let timbreResumeModel: TimbreResumeModel = timbreResumeModels.find(timbreResumeModel => timbreResumeModel.getAnnee() == annee)
				if (isNotNullOrUndefined(timbreResumeModel)) {
					timbreResumeModel.setNombre(timbreResumeModel.getNombre() + 1);
				} else {
					timbreResumeModel = new TimbreResumeModel();
					timbreResumeModel.setAnnee(annee);
					timbreResumeModel.setNombre(1);
					timbreResumeModels.push(timbreResumeModel);
				}

				if (isNotNullOrUndefined(timbresAcquis)) {
					const findTimbreAcquis = timbresAcquis.find(timbreAcquis => timbreAcquis['idTimbre'] == timbre["id"]);
					if (isNotNullOrUndefined(findTimbreAcquis)) {
						if (findTimbreAcquis["acquis"] == true) {
							timbreResumeModel.setAcquis(timbreResumeModel.getAcquis() + 1);
						}
						if (findTimbreAcquis["doublon"] == true) {
							timbreResumeModel.setDoublon(timbreResumeModel.getDoublon() + 1);
						}
					}
				}

			});


			timbresBloc.forEach((bloc: any) => {
				let timbreResumeModel: TimbreResumeModel = timbreResumeModels.find(timbreResumeModel => timbreResumeModel.getAnnee() == bloc["annee"])
				if (isNotNullOrUndefined(timbreResumeModel)) {
					timbreResumeModel.setNombreBloc(timbreResumeModel.getNombreBloc() + 1);
				} else {
					timbreResumeModel = new TimbreResumeModel();
					timbreResumeModel.setAnnee(bloc["annee"]);
					timbreResumeModel.setNombreBloc(1);
					timbreResumeModels.push(timbreResumeModel);
				}

				if (isNotNullOrUndefined(timbresBlocAcquis)) {
					const findTimbreBlocAcquis = timbresBlocAcquis.find(timbreBlocAcquis => timbreBlocAcquis['idBloc'] == bloc["id"]);
					if (isNotNullOrUndefined(findTimbreBlocAcquis)) {
						if (findTimbreBlocAcquis["acquis"] == true) {
							timbreResumeModel.setAcquisBloc(timbreResumeModel.getAcquisBloc() + 1);
						}
						if (findTimbreBlocAcquis["doublon"] == true) {
							timbreResumeModel.setDoublonBloc(timbreResumeModel.getDoublonBloc() + 1);
						}
					}
				}
			});
		}
		if (isNotNullOrUndefined(timbreResumeModels) && timbreResumeModels?.length > 0) {
			const totalTimbreResume = new TimbreResumeModel();
			timbreResumeModels.forEach(timbreResumeModel => {
				totalTimbreResume.setNombre(totalTimbreResume.getNombre() + timbreResumeModel.getNombre());
				totalTimbreResume.setAcquis(totalTimbreResume.getAcquis() + timbreResumeModel.getAcquis());
				totalTimbreResume.setDoublon(totalTimbreResume.getDoublon() + timbreResumeModel.getDoublon());
				totalTimbreResume.setNombreBloc(totalTimbreResume.getNombre() + timbreResumeModel.getNombre());
				totalTimbreResume.setAcquisBloc(totalTimbreResume.getAcquisBloc() + timbreResumeModel.getAcquisBloc());
				totalTimbreResume.setDoublonBloc(totalTimbreResume.getDoublonBloc() + timbreResumeModel.getDoublonBloc());
			})
			this.totalTimbreResume$.next(totalTimbreResume);
		}
		return timbreResumeModels;
	}
}
