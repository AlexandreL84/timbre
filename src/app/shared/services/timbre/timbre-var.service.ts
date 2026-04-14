import {Injectable} from '@angular/core';
import {TimbreModel} from '../../../model/timbre.model';
import {
	BehaviorSubject, first,
} from 'rxjs';
import {TotalModel} from "../../../model/total.model";
import {TimbreBlocModel} from "../../../model/timbre-bloc.model";
import {isNotNullOrUndefined} from "../../utils/utils";

@Injectable()
export class TimbreVarService {
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	loadModifTimbre$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	totalTimbres$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
	totalTimbresByCritere$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
	timbres$: BehaviorSubject<TimbreModel[]> = new BehaviorSubject<TimbreModel[]>(null);
	maxIdentTimbre$: BehaviorSubject<number> = new BehaviorSubject<number>(null);


	loadBloc$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	loadModifBloc$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	totalBloc$: BehaviorSubject<TotalModel[]> = new BehaviorSubject<TotalModel[]>(null);
	totalBlocByCritere$: BehaviorSubject<TotalModel[]> = new BehaviorSubject<TotalModel[]>(null);
	timbresBlocModel$: BehaviorSubject<TimbreBlocModel[]> = new BehaviorSubject<TimbreBlocModel[]>(null);
	maxIdentBloc$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

	maxIdentPays$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

	reinitResume$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

	retryMax: number = 5;

	addMaxIdentTimbre() {
		this.maxIdentTimbre$.pipe(first()).subscribe(total => {
			this.maxIdentTimbre$.next(total + 1);
		});
	}

	addMaxIdentBloc() {
		this.maxIdentBloc$.pipe(first()).subscribe(total => {
			this.maxIdentBloc$.next(total + 1);
		});
	}
}
