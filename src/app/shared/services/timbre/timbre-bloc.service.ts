import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, first, map, Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {isNotNullOrUndefined} from '../../utils/utils';
import {TimbreCritereModel} from '../../../model/timbre-critere.model';
import {plainToInstance} from 'class-transformer';
import {TimbreBlocModel} from '../../../model/timbre-bloc.model';
import {DossierEnum} from "../../enum/dossier.enum";
import {UploadService} from "../upload.service";
import {BaseEnum} from "../../enum/base.enum";
import {UtilsService} from "../utils.service";


@Injectable()
export class TimbreBlocService {
	heigthTable: number = 50;
	widthTimbre: number = 100;
	heightTimbre: number = 100;
	widthTimbreZoom: number = 500;
	heightTimbreZoom: number = 500;

	total$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	timbresBlocModel$: BehaviorSubject<TimbreBlocModel[]> = new BehaviorSubject<TimbreBlocModel[]>(null);

	constructor(private firestore: AngularFirestore, private uploadService: UploadService, private utilsService:UtilsService) {
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

	getTotal(timbreCritereModel?: TimbreCritereModel) {
		this.total$.next(null);
		this.getAllBlocs(timbreCritereModel).pipe(first()).subscribe(timbres => {
			this.total$.next(timbres?.length);
		});
	}

	getBlocByIdAsync(id: number): Observable<TimbreBlocModel> {
		this.getTotal();
		return this.firestore.collection(BaseEnum.TIMBRE_BLOC, ref => ref.where('id', '==', id))
			.valueChanges().pipe(
				map((data: any) => {
					return plainToInstance(TimbreBlocModel, data[0]);
				}));
	}

	getAllBlocs(timbreCritereModel: TimbreCritereModel): Observable<any> {
		return this.firestore.collection(BaseEnum.TIMBRE_BLOC, ref => {
			let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
			if (isNotNullOrUndefined(timbreCritereModel)) {
				if (isNotNullOrUndefined(timbreCritereModel.getAnnees()) && timbreCritereModel.getAnnees()?.length > 0) {
					filteredQuery = filteredQuery.where("annee", "in", timbreCritereModel.getAnnees());
				}
			}
			//filteredQuery = filteredQuery.orderBy('id', 'asc');
			return filteredQuery;
		})
		.valueChanges();
	}

	getBlocsAsync(timbreCritereModel?: TimbreCritereModel): Observable<TimbreBlocModel[]> {
		this.timbresBlocModel$.next(null);
		return this.getAllBlocs(timbreCritereModel).pipe(first(), map(blocs => {
				return this.constructBlocs(blocs);
			}
		));
	}

	constructBlocs(blocs): TimbreBlocModel[] {
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

	ajouterSansId(timbreBlocModel: TimbreBlocModel) {
		this.utilsService.getMaxIdentAsync(BaseEnum.TIMBRE_BLOC).pipe(first()).subscribe(id => {
			timbreBlocModel.setId(id);
			this.ajouter(timbreBlocModel);
		});
	}

	ajouter(timbreBlocModel: TimbreBlocModel) {
		this.firestore.collection(BaseEnum.TIMBRE_BLOC).add(
			Object.assign(new Object(), timbreBlocModel)
		);
		this.getBlocsAsync().pipe(first()).subscribe(timbresBlocModel => {});
	}

	modifier(timbreBlocModel: TimbreBlocModel) {
		this.firestore.collection(BaseEnum.TIMBRE_BLOC)
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

	supprimer(timbreBlocModel: TimbreBlocModel) {
		this.firestore.collection(BaseEnum.TIMBRE_BLOC)
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

	getDossier(timbreBlocModel: TimbreBlocModel, dossier): string {
		let dossierImage = DossierEnum.TIMBRE + '/' + timbreBlocModel.getAnnee();
		if (isNotNullOrUndefined(dossier)) {
			dossierImage = dossierImage + '/' + dossier;
		}
		dossierImage = dossierImage + '/bloc/' + timbreBlocModel.getId();
		return dossierImage;
	}

	getBouchon(): TimbreBlocModel {
		let timbreBlocModel: TimbreBlocModel = new TimbreBlocModel();
		timbreBlocModel.setAnnee(new Date().getFullYear());
		timbreBlocModel.setMonnaie('E');
		return timbreBlocModel;
	}
}
