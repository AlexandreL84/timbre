import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TimbreModel} from '../../../../model/timbre.model';
import {TimbreService} from '../../../../shared/services/timbre/timbre.service';
import {BehaviorSubject, catchError, combineLatest, EMPTY, filter, first} from 'rxjs';
import {isNotNullOrUndefined} from '../../../../shared/utils/utils';
import {NgForm} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {HttpResponseHandlerService} from '../../../../shared/services/httpResponseHandler.service';
import {NotificationTypeEnum} from '../../../../shared/enum/notification/notification-type.enum';
import {NotificationMessageEnum} from '../../../../shared/enum/notification/notification-message.enum';
import {FileUploadModel} from '../../../../model/file/file-upload.model';
import {TimbreBlocService} from '../../../../shared/services/timbre/timbre-bloc.service';
import {TimbreBlocModel} from '../../../../model/timbre-bloc.model';
import {DossierEnum} from "../../../../shared/enum/dossier.enum";
import {TimbreCritereModel} from "../../../../model/timbre-critere.model";
import {UtilsService} from "../../../../shared/services/utils.service";
import {BaseEnum} from "../../../../shared/enum/base.enum";
import {TimbreUtilsService} from "../../../../shared/services/timbre/timbre-utils.service";
import {DimensionImageEnum} from "../../../../shared/enum/dimension-image.enum";
import {TypeTimbreEnum} from "../../../../shared/enum/type-timbre.enum";
import {MonnaieEnum} from "../../../../shared/enum/monnaie.enum";
import {take} from "rxjs/operators";

@Component({
	selector: 'app-timbre-modifier',
	templateUrl: './timbre-modifier.component.html',
})
export class TimbreModifierComponent implements OnInit {
	@ViewChild('canvas', {static: false}) canvas!: ElementRef<HTMLCanvasElement>;

	messageError$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
	id: number;
	maxAnnee: number = new Date().getFullYear() + 1;
	timbreModel: TimbreModel = new TimbreModel();
	fileUploadModel: FileUploadModel = new FileUploadModel();

	readonly TypeTimbreEnum = TypeTimbreEnum;
	readonly DimensionImageEnum = DimensionImageEnum;

	constructor(
		private httpResponseHandlerService: HttpResponseHandlerService,
		public dialogRef: MatDialogRef<TimbreModifierComponent>,
		public timbreService: TimbreService,
		public timbreBlocService: TimbreBlocService,
		public timbreUtilsService: TimbreUtilsService,
		public utilsService: UtilsService
	) {
	}

	ngOnInit(): void {
		//this.timbreBlocService.getBlocs();
		this.fileUploadModel = this.timbreUtilsService.initUpload();
		this.load$.next(false);
		if (isNotNullOrUndefined(this.id)) {
			this.timbreService.getTimbreByIdAsync(this.id).subscribe(timbreModel => {
				this.timbreModel = timbreModel;
				if (isNotNullOrUndefined(timbreModel.getTimbreBlocModel())) {
					this.timbreModel.setAnnee(timbreModel.getTimbreBlocModel().getAnnee());
					this.timbreModel.setMonnaie(timbreModel.getTimbreBlocModel().getMonnaie());
				}
				this.load$.next(true);
			});
		} else {
			this.timbreModel.setAnnee(new Date().getFullYear());
			this.timbreModel.setMonnaie(MonnaieEnum.EURO);
			this.load$.next(true);
		}
		this.changeAnnee(this.timbreModel.getAnnee());
	}

	valider(formModif: NgForm) {
		this.messageError$.next(null);
		if (formModif?.valid) {
			if (isNotNullOrUndefined(this.timbreModel.getImage())) {
				this.saveData();
			} else {
				this.messageError$.next('Veuillez sélectionner une image');
				return;
			}
		}
	}

	saveData() {
		this.load$.next(false);
		if (isNotNullOrUndefined(this.timbreModel.getId())) {
			this.save();
		} else {
			this.ajouter();
		}
	}

	ajouter() {
		this.utilsService.getMaxIdentAsync(BaseEnum.TIMBRE).pipe(first()).subscribe(id => {
			this.timbreModel.setId(id);
			this.save(true);
		});
	}

	save(ajout?: boolean) {
		if (this.timbreModel.getAnnee() >= 2002) {
			this.timbreModel.setMonnaie(MonnaieEnum.EURO);
		} else if (this.timbreModel.getAnnee() >= 1999) {
			this.timbreModel.setMonnaie(MonnaieEnum.FRANC_EURO);
		} else {
			this.timbreModel.setMonnaie(MonnaieEnum.FRANC);
		}

		combineLatest([
			this.timbreService.upload(this.timbreModel, DossierEnum.AUTRE),
			this.timbreService.upload(this.timbreModel, DossierEnum.TABLE),
			this.timbreService.upload(this.timbreModel, DossierEnum.ZOOM),
		]).pipe(
			filter(([image, imageTable, imageZoom]) =>
				isNotNullOrUndefined(image) &&
				isNotNullOrUndefined(imageTable) &&
				isNotNullOrUndefined(imageZoom)
			),
			take(1),
			catchError(error => {
				this.httpResponseHandlerService.showNotificationError(NotificationTypeEnum.TRANSACTION_NOK, ajout? NotificationMessageEnum.TIMBRE_AJOUT_NOK: NotificationMessageEnum.TIMBRE_MODIF_NOK);
				this.load$.next(true);
				return EMPTY; // stop the stream
			})).subscribe(([image, imageTable, imageZoom]) => {
				if (this.timbreUtilsService.isValidImage(image)) {
					this.timbreModel.setImage(image);
				}
				if (this.timbreUtilsService.isValidImage(imageTable)) {
					this.timbreModel.setImageTable(imageTable);
				}
				if (this.timbreUtilsService.isValidImage(imageZoom)) {
					this.timbreModel.setImageZoom(imageZoom);
				}
				if (!ajout) {
					this.timbreService.modifier(this.timbreModel);
				} else {
					this.timbreService.ajouter(this.timbreModel, true);
				}
				this.httpResponseHandlerService.showNotificationSuccess(NotificationTypeEnum.TRANSACTION_OK, ajout? NotificationMessageEnum.TIMBRE_AJOUT: NotificationMessageEnum.TIMBRE_MODIF);
				this.load$.next(true);
				this.dialogRef.close();
		});
	}

	close() {
		this.dialogRef.close();
	}

	changeAnnee(annee: number) {
		this.timbreModel.setTimbreBlocModel(null);
		if (isNotNullOrUndefined(annee)) {
			const timbreCritereModel: TimbreCritereModel = new TimbreCritereModel();
			timbreCritereModel.initCritereBloc();
			timbreCritereModel.setAnnees([annee]);
			timbreCritereModel.setSort("desc");
			this.timbreBlocService.getBlocs(timbreCritereModel, false);
		}
	}

	changeBloc(timbreBlocModel: TimbreBlocModel) {
		if (isNotNullOrUndefined(timbreBlocModel)) {
			this.timbreModel.setIdBloc(timbreBlocModel.getId());
			this.timbreModel.setTimbreBlocModel(timbreBlocModel);
			this.timbreModel.setMonnaie(timbreBlocModel.getMonnaie());
			this.timbreModel.setAnnee(timbreBlocModel.getAnnee());
		} else {
			this.timbreModel.setIdBloc(null);
			this.timbreModel.setTimbreBlocModel(null);
			//this.timbreModel.setAnnee(new Date().getFullYear());
			this.timbreModel.setMonnaie(MonnaieEnum.EURO);
		}
	}
}
