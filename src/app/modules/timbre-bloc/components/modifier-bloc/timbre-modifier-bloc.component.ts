import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, catchError, combineLatest, EMPTY, filter, first} from 'rxjs';
import {isNotNullOrUndefined} from '../../../../shared/utils/utils';
import {NgForm} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {HttpResponseHandlerService} from '../../../../shared/services/httpResponseHandler.service';
import {NotificationTypeEnum} from '../../../../shared/enum/notification/notification-type.enum';
import {NotificationMessageEnum} from '../../../../shared/enum/notification/notification-message.enum';
import {TimbreBlocService} from '../../../../shared/services/timbre/timbre-bloc.service';
import {DossierEnum} from "../../../../shared/enum/dossier.enum";
import {BaseEnum} from "../../../../shared/enum/base.enum";
import {UtilsService} from "../../../../shared/services/utils.service";
import {TimbreBlocModel} from "../../../../model/timbre-bloc.model";
import {FileUploadModel} from "../../../../model/file/file-upload.model";
import {TimbreUtilsService} from "../../../../shared/services/timbre/timbre-utils.service";
import {DimensionImageEnum} from "../../../../shared/enum/dimension-image.enum";
import {TypeTimbreEnum} from "../../../../shared/enum/type-timbre.enum";
import {MonnaieEnum} from "../../../../shared/enum/monnaie.enum";
import {TimbreModel} from "../../../../model/timbre.model";
import {TimbreService} from "../../../../shared/services/timbre/timbre.service";
import {TypeImageTimbreEnum} from "../../../../shared/enum/type-image-timbre.enum";
import {take} from "rxjs/operators";

@Component({
	selector: 'app-timbre-modifier-bloc',
	templateUrl: './timbre-modifier-bloc.component.html',
})
export class TimbreModifierBlocComponent implements OnInit {
	@ViewChild('canvas', {static: false}) canvas!: ElementRef<HTMLCanvasElement>;

	messageError$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
	id: number;
	maxAnnee: number = new Date().getFullYear() + 1;
	timbreBlocModel: TimbreBlocModel = new TimbreBlocModel();
	fileUploadModel: FileUploadModel = new FileUploadModel();

	readonly DimensionImageEnum = DimensionImageEnum;
	readonly TypeTimbreEnum = TypeTimbreEnum;

	constructor(
		private httpResponseHandlerService: HttpResponseHandlerService,
		public dialogRef: MatDialogRef<TimbreModifierBlocComponent>,
		private utilsService: UtilsService,
		public timbreBlocService: TimbreBlocService,
		private timbreService: TimbreService,
		public timbreUtilsService: TimbreUtilsService,
	) {
	}

	ngOnInit(): void {
		this.fileUploadModel = this.timbreUtilsService.initUpload();
		this.load$.next(false);
		if (isNotNullOrUndefined(this.id)) {
			this.timbreBlocService.getBlocByIdAsync(this.id).subscribe(timbreBlocModel => {
				this.timbreBlocModel = timbreBlocModel;
				this.load$.next(true);
			});
		} else {
			this.timbreBlocModel.setAnnee(new Date().getFullYear());
			this.timbreBlocModel.setMonnaie(MonnaieEnum.EURO);
			this.load$.next(true);
		}
	}

	setImageBloc(timbreBlocModel: TimbreBlocModel) {
		this.timbreBlocModel = timbreBlocModel;
		if (timbreBlocModel.getYt()?.includes(TypeImageTimbreEnum.BK)) {
			timbreBlocModel.setType(TypeTimbreEnum.BLOC);
		} else if (timbreBlocModel.getYt()?.includes(TypeImageTimbreEnum.CARNET)) {
			timbreBlocModel.setType(TypeTimbreEnum.CARNET);
		} else if (timbreBlocModel.getYt()?.includes(TypeImageTimbreEnum.MTAM)) {
			timbreBlocModel.setType(TypeTimbreEnum.COLLECTOR);
		}
	}

	valider(formModif: NgForm) {
		this.messageError$.next(null);
		if (formModif?.valid) {
			if (isNotNullOrUndefined(this.timbreBlocModel.getImage())) {
				this.saveData();
			} else {
				this.messageError$.next('Veuillez sélectionner une image');
				return;
			}
		}
	}

	saveData() {
		this.load$.next(false);
		if (isNotNullOrUndefined(this.timbreBlocModel.getId())) {
			this.save();
		} else {
			this.ajouter();
		}
	}

	ajouter() {
		this.utilsService.getMaxIdentAsync(BaseEnum.TIMBRE_BLOC).pipe(first()).subscribe(id => {
			this.timbreBlocModel.setId(id);
			this.save(true);
		});
	}

	save(ajout?: boolean) {
		if (this.timbreBlocModel.getAnnee() >= 2002) {
			this.timbreBlocModel.setMonnaie(MonnaieEnum.EURO);
		} else if (this.timbreBlocModel.getAnnee() >= 1999) {
			this.timbreBlocModel.setMonnaie(MonnaieEnum.FRANC_EURO);
		} else {
			this.timbreBlocModel.setMonnaie(MonnaieEnum.FRANC);
		}

		combineLatest([
			this.timbreBlocService.upload(this.timbreBlocModel, DossierEnum.AUTRE),
			this.timbreBlocService.upload(this.timbreBlocModel, DossierEnum.TABLE),
			this.timbreBlocService.upload(this.timbreBlocModel, DossierEnum.ZOOM),
		]).pipe(
			filter(([image, imageTable, imageZoom]) =>
				isNotNullOrUndefined(image) &&
				isNotNullOrUndefined(imageTable) &&
				isNotNullOrUndefined(imageZoom)
			),
			take(1),
			catchError(error => {
				this.httpResponseHandlerService.showNotificationError(NotificationTypeEnum.TRANSACTION_NOK, ajout? NotificationMessageEnum.BLOC_AJOUT_NOK: NotificationMessageEnum.BLOC_MODIF_NOK);
				return EMPTY; // ou throwError si tu veux propager
			})).subscribe(([image, imageTable, imageZoom]) => {
			if (this.timbreUtilsService.isValidImage(image)) {
				this.timbreBlocModel.setImage(image);
			}
			if (this.timbreUtilsService.isValidImage(imageTable)) {
				this.timbreBlocModel.setImageTable(imageTable);
			}
			if (this.timbreUtilsService.isValidImage(imageZoom)) {
				this.timbreBlocModel.setImageZoom(imageZoom);
			}
			if (!ajout) {
				this.timbreBlocService.modifier(this.timbreBlocModel);
			} else {
				this.timbreBlocService.ajouter(this.timbreBlocModel, true);
			}

			if (this.timbreBlocModel?.getTimbres()?.length > 0) {
				this.saveTimbres(ajout);
			} else {
				this.validSuccess(ajout);
			}
		});
	}

	validSuccess(ajout: boolean) {
		this.httpResponseHandlerService.showNotificationSuccess(NotificationTypeEnum.TRANSACTION_OK, ajout? NotificationMessageEnum.BLOC_AJOUT: NotificationMessageEnum.BLOC_MODIF);
		this.load$.next(true);
		this.dialogRef.close();
	}

	saveTimbres(ajout: boolean) {
		if (this.timbreBlocModel?.getTimbres()?.length > 0) {
			this.utilsService.getMaxIdentAsync(BaseEnum.TIMBRE).pipe(first()).subscribe(id => {
				this.timbreBlocModel?.getTimbres().forEach((timbreModel, index) => {
					timbreModel.setIdBloc(this.timbreBlocModel.getId());
					timbreModel.setTimbreBlocModel(this.timbreBlocModel);
					timbreModel.setMonnaie(this.timbreBlocModel.getMonnaie());
					timbreModel.setAnnee(this.timbreBlocModel.getAnnee());
					timbreModel.setId(id);
					id++;

					combineLatest([
						this.timbreService.upload(timbreModel, DossierEnum.AUTRE),
						this.timbreService.upload(timbreModel, DossierEnum.TABLE),
						this.timbreService.upload(timbreModel, DossierEnum.ZOOM),
					]).pipe(
						filter(([image, imageTable, imageZoom]) =>
							isNotNullOrUndefined(image) &&
							isNotNullOrUndefined(imageTable) &&
							isNotNullOrUndefined(imageZoom)
						),
						take(1),
						catchError(error => {
							this.httpResponseHandlerService.showNotificationError(
								NotificationTypeEnum.TRANSACTION_NOK,
								NotificationMessageEnum.TIMBRE_AJOUT_NOK
							);
							this.load$.next(true);
							return EMPTY; // stop the stream
						})).subscribe(([image, imageTable, imageZoom]) => {
							if (this.timbreUtilsService.isValidImage(image)) {
								timbreModel.setImage(image);
							}
							if (this.timbreUtilsService.isValidImage(imageTable)) {
								timbreModel.setImageTable(imageTable);
							}
							if (this.timbreUtilsService.isValidImage(imageZoom)) {
								timbreModel.setImageZoom(imageZoom);
							}

							this.timbreService.ajouter(timbreModel, true);
							if (index == this.timbreBlocModel.getTimbres().length - 1) {
								this.validSuccess(ajout);
							}
					});
				});
			});
		}
	}

	close() {
		this.dialogRef.close();
	}

	selectTimbres(files: File[]) {
		this.timbreBlocModel.setTimbres(null);
		if (isNotNullOrUndefined(files) && files?.length > 0) {
			files.forEach(file => {
				const timbre = new TimbreModel();
				timbre.setImage(file);
				timbre.setYt(file?.name?.replace(/\.([a-z]+)$/, ''));
				this.timbreBlocModel.addTimbre(timbre);
			});
		}
	}
}
