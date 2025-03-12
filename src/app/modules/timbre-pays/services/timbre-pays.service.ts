import {Injectable} from '@angular/core';
import {TimbrePaysModel} from "../../../model/timbre-pays.model";
import {BehaviorSubject, map, Observable} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Utils} from "../../../shared/utils/utils";
import {plainToInstance} from "class-transformer";

@Injectable()
export class TimbrePaysService {
	private basePath: string = '/timbres_pays';

	dossierImage: string = "pays/";
	heigthTable: number = 50;
	widthDrapeau: number = 620;
	heightDrapeau: number = 430;
	widthLangue: number = 780;
	heightLangue: number = 200;
	widthMap: number = 220;
	heightMap: number = 220;
	total$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	constructor(private firestore: AngularFirestore) {
	}

	/*getTimbreByIdAsync(id: any): Observable<TimbrePaysModel> {
		return this.firestore.collection(this.basePath).doc(id).valueChanges().pipe(
			map((data: any) => {
				return plainToInstance(TimbrePaysModel, data);
			}))
	}*/

	getTimbreByIdAsync(id: string): Observable<TimbrePaysModel> {
		return this.firestore.collection(this.basePath, ref => ref.where('id', '==', id))
			.valueChanges().pipe(
				map((data: any) => {
					return plainToInstance(TimbrePaysModel, data[0]);
				}))
	}

	getByCodeAsync(code: string): Observable<TimbrePaysModel> {
		return this.firestore.collection(this.basePath, ref => ref.where('code', '==', code))
			.valueChanges().pipe(
				map((data: any) => {
					return plainToInstance(TimbrePaysModel, data[0]);
				}))
	}

	getTimbres(): Observable<TimbrePaysModel[]> {
		return this.firestore.collection(this.basePath).valueChanges().pipe(
			map((timbres: any) => {
				let total: number = 0;
				let timbresPaysModel: TimbrePaysModel[] = [];
				if (timbres?.length > 0) {
					timbres.forEach((timbre: any) => {
						const timbrePaysModel: TimbrePaysModel = plainToInstance(TimbrePaysModel, timbre);
						timbresPaysModel.push(timbrePaysModel);
						total += +timbrePaysModel.getTotal();
					});
				}
				this.total$.next(total);
				return timbresPaysModel;
			}))
	}

	addTimbre(timbrePaysModel: TimbrePaysModel) {
		return this.firestore.collection(this.basePath).add(
			Object.assign(new Object(), timbrePaysModel)
		)
	}

	modifierTimbre(timbrePaysModel: TimbrePaysModel) {
		this.firestore.collection(this.basePath)
			.ref.where('id', '==', timbrePaysModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					// Mise à jour du document
					doc.ref.update(Object.assign(new Object(), timbrePaysModel));
				});
			})
			.catch(error => {
				console.error('Erreur de mise à jour:', error);
			});
	}

	deleteTimbre(timbrePaysModel: TimbrePaysModel) {
		this.firestore.collection(this.basePath)
			.ref.where('id', '==', timbrePaysModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					// Mise à jour du document
					doc.ref.delete();
				});
			})
			.catch(error => {
				console.error('Erreur de mise à jour:', error);
			});
	}

	getBouchon(): TimbrePaysModel {
		let timbre: TimbrePaysModel = new TimbrePaysModel();
		let id: number = Utils.getRandom(10000)
		//timbre.setId(id);
		timbre.setCode("FR");
		timbre.setLibelle("France " + id);
		timbre.setLibelleLangue("France " + id);
		timbre.setDrapeau("FR");
		timbre.setZone("FR");
		timbre.setMap("FR");
		timbre.setClasseur(1);
		timbre.setPage(1);
		timbre.setVisible(true);
		return timbre;
	}
}
