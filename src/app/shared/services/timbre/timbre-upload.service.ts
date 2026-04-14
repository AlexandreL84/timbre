import { Injectable } from '@angular/core';
import {
	catchError,
	Observable,
	of,
	retry,
	switchMap,
	throwError
} from 'rxjs';
import { isNotNullOrUndefined } from '../../utils/utils';
import { TimbreModel } from '../../../model/timbre.model';
import { DimensionImageEnum } from '../../enum/dimension-image.enum';
import {TimbreVarService} from "./timbre-var.service";
import {DossierEnum} from "../../enum/dossier.enum";
import {UploadService} from "../upload.service";
import {FileUploadModel} from "../../../model/file/file-upload.model";
import {FileDetailUploadModel} from "../../../model/file/file-detail-upload.model";
import {TimbreBlocModel} from "../../../model/timbre-bloc.model";


@Injectable()
export class TimbreUploadService {
	constructor(private timbreVarService: TimbreVarService, private uploadService: UploadService) {
	}

	initUpload(): FileUploadModel {
		const fileUploadModel: FileUploadModel = new FileUploadModel();
		fileUploadModel.setDossier('table');
		fileUploadModel.setNom(new Date().getTime()?.toString());

		const fileDetailUploadModel = new FileDetailUploadModel();
		fileDetailUploadModel.setMaxWidth(DimensionImageEnum.WIDTH_TIMBRE);
		fileDetailUploadModel.setMaxHeight(DimensionImageEnum.HEIGTH_TIMBRE);
		fileDetailUploadModel.setDossier('autre');

		const fileDetailUploadModelZoom = new FileDetailUploadModel();
		fileDetailUploadModelZoom.setMaxWidth(DimensionImageEnum.WIDTH_TIMBRE_ZOOM);
		fileDetailUploadModelZoom.setMaxHeight(DimensionImageEnum.HEIGTH_TIMBRE_ZOOM);
		fileDetailUploadModelZoom.setDossier('zoom');

		fileUploadModel.setDetail([fileDetailUploadModel, fileDetailUploadModelZoom]);

		return fileUploadModel;
	}

	uploadBloc(timbreBlocModel: TimbreBlocModel, dossier: DossierEnum, ident?: number): Observable<string> {
		let width: number = DimensionImageEnum.WIDTH_TIMBRE;
		let height: number = DimensionImageEnum.HEIGTH_TIMBRE;
		if (dossier == DossierEnum.TABLE) {
			width = width * (DimensionImageEnum.HEIGTH_TABLE / height);
			height = DimensionImageEnum.HEIGTH_TABLE;
		} else if (dossier == DossierEnum.ZOOM) {
			width = width * (DimensionImageEnum.HEIGTH_TIMBRE_ZOOM / height);
			height = DimensionImageEnum.HEIGTH_TIMBRE_ZOOM;
		}
		return this.uploadService.processAndUploadImage(timbreBlocModel?.getImage(), width, height, ('bloc-' + timbreBlocModel.getId()), this.getDossierBloc(timbreBlocModel, dossier, ident));
	}

	getDossierBloc(timbreBlocModel: TimbreBlocModel, dossier, ident: number): string {
		let dossierImage = DossierEnum.TIMBRE + '/' + timbreBlocModel.getAnnee();
		if (isNotNullOrUndefined(dossier)) {
			dossierImage = dossierImage + '/' + dossier;
		}
		dossierImage = dossierImage + '/bloc/' + (isNotNullOrUndefined(ident) ? ident : timbreBlocModel.getId());
		return dossierImage;
	}

	upload(timbreModel: TimbreModel, dossier: DossierEnum, ident?: number, bloc?: true): Observable<string> {
		const baseWidth = DimensionImageEnum.WIDTH_TIMBRE;
		const baseHeight = DimensionImageEnum.HEIGTH_TIMBRE;

		let width: number = baseWidth;
		let height: number = baseHeight;

		switch (dossier) {
			case DossierEnum.TABLE:
				height = DimensionImageEnum.HEIGTH_TABLE;
				width = baseWidth * (height / baseHeight);
				break;
			case DossierEnum.ZOOM:
				height = DimensionImageEnum.HEIGTH_TIMBRE_ZOOM;
				width = baseWidth * (height / baseHeight);
				break;
		}

		return this.uploadService.processAndUploadImage(
			timbreModel?.getImage(), width, height,
			isNotNullOrUndefined(ident) ? ident : timbreModel?.getId(),
			this.getDossier(timbreModel, dossier)
		).pipe(
			// ← retry si 'nok' ou erreur
			switchMap((result) => {
				if (result === 'nok') {
					return throwError(() => new Error('Upload nok'));
				}
				return of(result);
			}),
			retry({
				count: this.timbreVarService.retryMax,          // ← 3 tentatives maximum
				delay: 1000,       // ← 1 seconde entre chaque tentative
			}),
			catchError(() => {
				console.error('Upload échoué après ' + this.timbreVarService.retryMax + ' tentatives', timbreModel);
				return of('nok'); // ← retourne 'nok' définitivement
			})
		);
	}

	getDossier(timbreModel: TimbreModel, dossier: string): string {
		let dossierImage = DossierEnum.TIMBRE + '/';
		if (isNotNullOrUndefined(timbreModel.getIdBloc())) {
			dossierImage = dossierImage + timbreModel.getTimbreBlocModel().getAnnee();
		} else {
			dossierImage = dossierImage + timbreModel.getAnnee();
		}
		if (isNotNullOrUndefined(dossier)) {
			dossierImage = dossierImage + '/' + dossier;
		}
		if (isNotNullOrUndefined(timbreModel.getIdBloc())) {
			dossierImage = dossierImage + '/bloc/' + timbreModel.getIdBloc();
		}
		return dossierImage;
	}

	async supprimerImages(timbre: TimbreModel | TimbreBlocModel): Promise<void> {
		const urls = [timbre.getImage(), timbre.getImageZoom()]
			.filter((url): url is string => typeof url === 'string' && !!url);
		await Promise.all(urls.map(url => this.uploadService.supprimerImage(url)));
	}
}
