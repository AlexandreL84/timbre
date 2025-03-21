import {Injectable} from '@angular/core';
import {TimbrePaysModel} from "../../../model/timbre-pays.model";
import {BehaviorSubject, map, Observable, of} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {isNotNullOrUndefined, Utils} from "../../../shared/utils/utils";
import {plainToInstance} from "class-transformer";
import {collectionData} from "@angular/fire/firestore";
import {DossierEnum} from "../../../shared/enum/dossier.enum";
import {UploadService} from "../../../shared/services/upload.service";

interface DocumentData {
	id: number; // Assurez-vous que vos documents ont une propriété numérique "id"
}

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

	constructor(private firestore: AngularFirestore, private uploadService: UploadService) {
	}

	upload(timbrePaysModel: TimbrePaysModel, dossier: DossierEnum, zoom: boolean): Observable<string> {
		let witdth: number;
		let height: number;
		let image: File | string;

		switch (dossier) {
			case DossierEnum.DRAPEAU :
				witdth = this.widthDrapeau;
				height = this.heightDrapeau;
				image = timbrePaysModel.getDrapeau();
				break;
			case DossierEnum.LANGUE :
				witdth = this.widthLangue;
				height = this.heightLangue;
				image = timbrePaysModel.getImageLangue();
				break;
			case DossierEnum.MAP :
				witdth = this.widthMap;
				height = this.heightMap;
				image = timbrePaysModel.getMap();
				break;
		}
		if (dossier == DossierEnum.ZOOM) {
			witdth = witdth * (height/ height);
		}

		if (isNotNullOrUndefined(image)) {
			return this.uploadService.processAndUploadImage(image, witdth, height, timbrePaysModel?.getId(), this.getDossier(dossier, zoom));
		} else {
			return of("nok");
		}
	}

	getDossier(dossier: DossierEnum, zoom: boolean): string {
		let dossierImage = this.dossierImage + '/';
		if (zoom == true) {
			dossierImage = dossierImage + '/' + DossierEnum.ZOOM;
		}
		if (isNotNullOrUndefined(dossier)) {
			dossierImage = dossierImage + '/' + dossier;
		}
		return dossierImage;
	}

	getMaxIdentAsync(): Observable<number> {
		const query =
			this.firestore.collection(this.basePath)
				.ref.orderBy("id", "desc")
				.limit(1);

		return collectionData(query).pipe(
			map((docs: DocumentData[]) => (docs.length > 0 ? docs[0].id + 1 : 1))
		);
	}


	getTimbreByIdAsync(id: number): Observable<TimbrePaysModel> {
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
		timbre.setZone("FR");
		timbre.setClasseur(1);
		timbre.setPage(1);
		timbre.setTotal(1);
		timbre.setVisible(true);
		return timbre;
	}
}
