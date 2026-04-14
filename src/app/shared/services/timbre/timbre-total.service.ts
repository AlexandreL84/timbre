import {Injectable} from '@angular/core';
import {first, from, map, Observable,} from 'rxjs';
import {BaseEnum} from '../../enum/base.enum';
import {TimbreVarService} from "./timbre-var.service";
import {TimbreCritereModel} from "../../../model/timbre-critere.model";
import {collection, Firestore, getCountFromServer, query, where} from "@angular/fire/firestore";
import {TypeTimbreEnum} from "../../enum/type-timbre.enum";
import {TimbreBlocModel} from "../../../model/timbre-bloc.model";
import {TotalModel} from "../../../model/total.model";
import {isNotNullOrUndefined, isNullOrUndefined} from "../../utils/utils";

@Injectable()
export class TimbreTotalService {

    constructor(
        private firestore: Firestore,
        private timbreVarService: TimbreVarService
    ) {
    }


    // PARTIE TOTAL TIMBRE

    setTotal(number: number) {
        this.timbreVarService.totalTimbres$.pipe(first()).subscribe(total => {
            this.timbreVarService.totalTimbres$.next(total + number);
        });
    }

	getTotal(refresh?: boolean) {
		this.timbreVarService.totalTimbres$.pipe(first()).subscribe(total => {
			if (isNullOrUndefined(total)) {
				this.timbreVarService.totalTimbres$.next(null);
				this.getCountTimbres().subscribe(nbTotal => {
					this.timbreVarService.totalTimbres$.next(nbTotal);
				});
			}
		});
	}

	getTotalByCritere(timbreCritereModel?: TimbreCritereModel) {
		this.timbreVarService.totalTimbresByCritere$.next(null);
		this.getCountTimbres(timbreCritereModel).subscribe(nbTotal => {
			this.timbreVarService.totalTimbresByCritere$.next(nbTotal);
		});
	}

    getCountTimbres(timbreCritereModel?: TimbreCritereModel): Observable<number> {
        const ref = collection(this.firestore, BaseEnum.TIMBRE);
        let q: any = ref;
        if (isNotNullOrUndefined(timbreCritereModel)) {
            if (timbreCritereModel.getAnnees()?.length > 0) {
                q = query(q, where('annee', 'in', timbreCritereModel.getAnnees().slice(0, 10)));
            }

            if (timbreCritereModel.getIdBloc()) {
                q = query(q, where('idBloc', '==', timbreCritereModel.getIdBloc()));
            } else if (
                timbreCritereModel?.getType()?.length == 0 ||
                (timbreCritereModel?.getType()?.length == 1 &&
                    timbreCritereModel?.getType()?.includes(TypeTimbreEnum.TIMBRE))
            ) {
                q = query(q, where('idBloc', '==', null));
            } else if (
                timbreCritereModel?.getType()?.length > 0 &&
                !timbreCritereModel?.getType()?.includes(TypeTimbreEnum.TIMBRE)
            ) {
                q = query(q, where('idBloc', '!=', null));
            }
        }

        return from(getCountFromServer(q)).pipe(
            map(snapshot => snapshot.data().count)
        );
    }


    // PARTIE TOTAL BLOC

    setTotalBloc(timbreBlocModel: TimbreBlocModel, number: number) {
        this.timbreVarService.totalBloc$.pipe(first()).subscribe(total => {
            if (isNotNullOrUndefined(total)) {
                const findTotal: TotalModel = total.find(total => total.getType() == timbreBlocModel?.getType());
                if (isNotNullOrUndefined(findTotal)) {
                    findTotal.setTotal(findTotal.getTotal() + number);
                } else {
                    total.push(new TotalModel(timbreBlocModel?.getType(), 1));
                }
            } else {
                total = [new TotalModel(timbreBlocModel?.getType(), 1)];
            }
            this.timbreVarService.totalBloc$.next(total);
        });
    }

	getTotalBloc(refresh?: boolean) {
		this.timbreVarService.totalBloc$.pipe(first()).subscribe(total => {
			if (isNullOrUndefined(total)) {
				this.timbreVarService.totalBloc$.next(null);

				Object.values(TypeTimbreEnum).forEach((type: TypeTimbreEnum) => {
					if (type != TypeTimbreEnum.TIMBRE) {
						this.getCountBlocs(null, type).subscribe(nbTotal => {
							this.timbreVarService.totalBloc$.pipe(first()).subscribe(total => {
								if (isNotNullOrUndefined(total)) {
									const findTotal: TotalModel = total.find(total => total.getType() == type);
									if (isNotNullOrUndefined(findTotal)) {
										findTotal.setTotal(nbTotal);
									} else {
										total.push(new TotalModel(type, nbTotal))
									}
								} else {
									total = [new TotalModel(type, nbTotal)];
								}
								this.timbreVarService.totalBloc$.next(total);
							});
						});
					}
				});
			}
		});
	}

	getTotalBlocByCritere(timbreCritereModel?: TimbreCritereModel) {
		this.timbreVarService.totalBlocByCritere$.next(null);

		Object.values(TypeTimbreEnum).forEach((type: TypeTimbreEnum) => {
			if (type != TypeTimbreEnum.TIMBRE) {
				this.getCountBlocs(timbreCritereModel, type).subscribe(nbTotal => {
					this.timbreVarService.totalBlocByCritere$.pipe(first()).subscribe(total => {
						if (isNotNullOrUndefined(total)) {
							const findTotal: TotalModel = total.find(total => total.getType() == type);
							if (isNotNullOrUndefined(findTotal)) {
								findTotal.setTotal(nbTotal);
							} else {
								total.push(new TotalModel(type, nbTotal))
							}
							this.timbreVarService.totalBlocByCritere$.next(total);
						}
					});
				});
			}
		});
	}

    getCountBlocs(timbreCritereModel?: TimbreCritereModel, type?: TypeTimbreEnum): Observable<number> {
        const ref = collection(this.firestore, BaseEnum.TIMBRE_BLOC);
        let q: any = ref;
        if (isNotNullOrUndefined(timbreCritereModel)) {
            if (timbreCritereModel.getAnnees()?.length > 0) {
                q = query(q, where('annee', 'in', timbreCritereModel.getAnnees().slice(0, 10)));
            }
        }
		if (isNotNullOrUndefined(type)) {
			q = query(q, where('type', '==', type));
		}

        return from(getCountFromServer(q)).pipe(
            map(snapshot => snapshot.data().count)
        );
    }

}
