import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {isNotNullOrUndefined} from "../../utils/utils";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {BaseEnum} from "../../enum/base.enum";

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
}
