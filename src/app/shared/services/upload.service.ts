import {Injectable} from '@angular/core';
import {MapperModel} from "../../../model/utils/mapper-model";
import {TimbrePaysModel} from "../../../model/timbre-pays.model";
import {map, Observable} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Utils} from "../../../shared/utils/utils";

@Injectable()
export class TimbrePaysService {
	private basePath = '/timbres_pays';

	constructor(private firestore: AngularFirestore) {
	}

	getTimbreByIdAsync(id: any): Observable<TimbrePaysModel> {
		return this.firestore.collection(this.basePath).doc(id).valueChanges().pipe(
			map((data: any) => {
				return new MapperModel(TimbrePaysModel).map(data);
			}))
	}

	getTimbres(): Observable<TimbrePaysModel[]> {
		return this.firestore.collection(this.basePath).valueChanges().pipe(
			map((timbres: any) => {
				let timbresModel = [];
				if (timbres?.length > 0) {
					timbres.forEach((timbre: any) => {
						timbresModel.push(new MapperModel(TimbrePaysModel).map(timbre));
					});
				}
				return timbresModel;
			}))
	}

	addTimbre(timbrePaysModel: TimbrePaysModel) {
		return this.firestore.collection(this.basePath).add(
			Object.assign(new Object(), timbrePaysModel)
		).then(ref => {
			timbrePaysModel.setId(ref.id);
			this.firestore.collection(this.basePath).doc(timbrePaysModel?.id?.toString()).update(Object.assign(new Object(), timbrePaysModel))
		});
	}

	modifierTimbre(timbrePaysModel: TimbrePaysModel) {
		this.firestore.collection(this.basePath).doc(timbrePaysModel?.getId()?.toString()).update(Object.assign(new Object(), timbrePaysModel))
	}

	deleteTimbre(timbrePaysModel: TimbrePaysModel) {
		this.firestore.collection(this.basePath).doc(timbrePaysModel?.getId()?.toString()).delete()
	}

	getBouchon(): TimbrePaysModel {
		let timbre: TimbrePaysModel = new TimbrePaysModel();
		let id: number = Utils.getRandom(10000)
		//timbre.setId(id);
		timbre.setCode("FR");
		timbre.setLibelle("France " + id);
		timbre.setLibelle2("France " + id);
		timbre.setDrapeau("FR");
		timbre.setZone("FR");
		timbre.setMap("FR");
		timbre.setClasseur(1);
		timbre.setPage(1);
		timbre.setVisible(true);
		return timbre;
	}
}
