import {Injectable} from '@angular/core';
import {BehaviorSubject, first, map, Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {isNotNullOrUndefined} from '../../../shared/utils/utils';
import {TimbreCritereModel} from '../../../model/timbre-critere.model';
import {plainToInstance} from 'class-transformer';
import {collectionData} from '@angular/fire/firestore';
import {TimbreBlocModel} from '../../../model/timbre-bloc.model';
import {TimbreUtilsService} from './timbre-utils.service';
import {DossierEnum} from "../../../shared/enum/dossier.enum";
import {UploadService} from "../../../shared/services/upload.service";

interface DocumentData {
	id: number; // Assurez-vous que vos documents ont une propriété numérique "id"
}

@Injectable()
export class TimbreBlocService {
	private basePathBloc: string = '/timbres_bloc';

	heigthTable: number = 50;
	widthTimbre: number = 100;
	heightTimbre: number = 100;
	widthTimbreZoom: number = 500;
	heightTimbreZoom: number = 500;

	timbresBlocModel$: BehaviorSubject<TimbreBlocModel[]> = new BehaviorSubject<TimbreBlocModel[]>(null);

	constructor(private firestore: AngularFirestore, private timbreUtilsService: TimbreUtilsService, private uploadService: UploadService) {
	}

	upload(timbreBlocModel: TimbreBlocModel, dossier: DossierEnum): Observable<string> {
		let witdth: number = this.widthTimbre;
		let height: number = this.heightTimbre;
		if (dossier == DossierEnum.TABLE) {
			witdth = witdth * (this.heigthTable / height);
			height = this.heigthTable;
		} else if (dossier == DossierEnum.ZOOM) {
			witdth = witdth * (this.heightTimbreZoom / height);
			height = this.heightTimbreZoom;
		}
		return this.uploadService.processAndUploadImage(timbreBlocModel?.getImage(), witdth, height, "bloc", this.getDossier(timbreBlocModel, dossier));
	}

	getDossier(timbreBlocModel: TimbreBlocModel, dossier): string {
		let dossierImage = this.timbreUtilsService.dossierImage + '/' + timbreBlocModel.getAnnee();
		if (isNotNullOrUndefined(dossier)) {
			dossierImage = dossierImage + '/' + dossier;
		}
		dossierImage = dossierImage + '/bloc/' + timbreBlocModel.getId();
		return dossierImage;
	}


	getBlocByIdAsync(id: number): Observable<TimbreBlocModel> {
		return this.firestore.collection(this.basePathBloc, ref => ref.where('id', '==', id))
			.valueChanges().pipe(
				map((data: any) => {
					return plainToInstance(TimbreBlocModel, data[0]);
				}));
	}

	getBlocsAsync(timbreCritereModel?: TimbreCritereModel) {
		return this.firestore.collection(this.basePathBloc, ref => {
			let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
			if (isNotNullOrUndefined(timbreCritereModel)) {
				if (isNotNullOrUndefined(timbreCritereModel.getAnnees()) && timbreCritereModel.getAnnees()?.length > 0) {
					filteredQuery = filteredQuery.where('annee', 'in', timbreCritereModel.getAnnees());
				}
			}
			//filteredQuery = filteredQuery.orderBy('id', 'asc');

			return filteredQuery;
		})
			.valueChanges().pipe(first(), map(blocs => {
					return this.constructBlocs(blocs);
				}
			));
	}

	getMaxIdentAsync(): Observable<number> {
		const query =
			this.firestore.collection(this.basePathBloc)
				.ref.orderBy('id', 'desc')
				.limit(1);

		return collectionData(query).pipe(
			map((docs: DocumentData[]) => (docs.length > 0 ? docs[0].id + 1 : 1))
		);
	}

	constructBlocs(blocs) {
		let timbresBlocModel: TimbreBlocModel[] = [];
		if (blocs?.length > 0) {
			blocs.forEach((timbre: any) => {
				const timbreBlocModel: TimbreBlocModel = plainToInstance(TimbreBlocModel, timbre);
				timbresBlocModel.push(timbreBlocModel);
			});
		}
		this.timbresBlocModel$.next(timbresBlocModel);
		return timbresBlocModel;
	}

	addBlocSansId(timbreBlocModel: TimbreBlocModel) {
		this.getMaxIdentAsync().pipe(first()).subscribe(id => {
			timbreBlocModel.setId(id);
			this.addBloc(timbreBlocModel);
		});
	}

	addBloc(timbreBlocModel: TimbreBlocModel) {
		this.firestore.collection(this.basePathBloc).add(
			Object.assign(new Object(), timbreBlocModel)
		);
		this.getBlocsAsync().pipe(first()).subscribe(timbresBlocModel => {});
	}

	modifierBloc(timbreBlocModel: TimbreBlocModel) {
		this.firestore.collection(this.basePathBloc)
			.ref.where('id', '==', timbreBlocModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					doc.ref.update(Object.assign(new Object(), timbreBlocModel));
					this.getBlocsAsync().pipe(first()).subscribe(timbresBlocModel => {});
				});
			})
			.catch(error => {
				console.error('Erreur de mise à jour:', error);
			});
	}

	deleteBloc(timbreBlocModel: TimbreBlocModel) {
		this.firestore.collection(this.basePathBloc)
			.ref.where('id', '==', timbreBlocModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					doc.ref.delete();
					this.getBlocsAsync().pipe(first()).subscribe(timbresBlocModel => {});
				});
			})
			.catch(error => {
				console.error('Erreur de suppression :', error);
			});
	}

	getBouchon(): TimbreBlocModel {
		let timbreBlocModel: TimbreBlocModel = new TimbreBlocModel();
		timbreBlocModel.setAnnee(new Date().getFullYear());
		timbreBlocModel.setMonnaie('E');
		return timbreBlocModel;
	}
}
