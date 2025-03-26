import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TimbreModel} from '../../../../model/timbre.model';
import {TimbreService} from '../../../../shared/services/timbre/timbre.service';
import {BehaviorSubject, combineLatest, first} from 'rxjs';
import {isNotNullOrUndefined} from '../../../../shared/utils/utils';
import {NgForm} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {HttpResponseHandlerService} from '../../../../shared/services/httpResponseHandler.service';
import {NotificationTypeEnum} from '../../../../shared/enum/notification/notification-type.enum';
import {NotificationMessageEnum} from '../../../../shared/enum/notification/notification-message.enum';
import {FileUploadModel} from '../../../../model/file/file-upload.model';
import {FileDetailUploadModel} from '../../../../model/file/file-detail-upload.model';
import {TimbreBlocService} from '../../../../shared/services/timbre/timbre-bloc.service';
import {TimbreBlocModel} from '../../../../model/timbre-bloc.model';
import {DossierEnum} from "../../../../shared/enum/dossier.enum";
import {TimbreCritereModel} from "../../../../model/timbre-critere.model";
import {UtilsService} from "../../../../shared/services/utils.service";
import {BaseEnum} from "../../../../shared/enum/base.enum";

@Component({
	selector: 'app-timbre-modifier',
	templateUrl: './timbre-modifier.component.html',
})
export class TimbreModifierComponent implements OnInit {
	@ViewChild('canvas', {static: false}) canvas!: ElementRef<HTMLCanvasElement>;

	messageError$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
	id: number;
	maxAnnee: number = new Date().getFullYear();
	timbreModel: TimbreModel = new TimbreModel();
	fileUploadModel: FileUploadModel = new FileUploadModel();

	constructor(
		private httpResponseHandlerService: HttpResponseHandlerService,
		public dialogRef: MatDialogRef<TimbreModifierComponent>,
		public timbreService: TimbreService,
		public timbreBlocService: TimbreBlocService,
		public utilsService: UtilsService
	) {
	}

	ngOnInit(): void {
		//this.timbreBlocService.getBlocs();
		this.initUpload();
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
			this.timbreModel.setMonnaie('E');
			this.load$.next(true);
		}
		this.changeAnnee(this.timbreModel.getAnnee());
	}

	initUpload() {
		this.fileUploadModel.setDossier('test');
		this.fileUploadModel.setNom(new Date().getTime()?.toString());

		const fileDetailUploadModel = new FileDetailUploadModel();
		fileDetailUploadModel.setMaxWidth(this.timbreService.widthTimbre);
		fileDetailUploadModel.setMaxHeight(this.timbreService.heightTimbre);
		fileDetailUploadModel.setDossier('autre');

		const fileDetailUploadModelZoom = new FileDetailUploadModel();
		fileDetailUploadModelZoom.setMaxWidth(this.timbreService.widthTimbreZoom);
		fileDetailUploadModelZoom.setMaxHeight(this.timbreService.heightTimbreZoom);
		fileDetailUploadModelZoom.setDossier('zoom');

		this.fileUploadModel.setDetail([fileDetailUploadModel, fileDetailUploadModelZoom]);
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
		try {
			combineLatest([
				this.timbreService.upload(this.timbreModel, DossierEnum.AUTRE),
				this.timbreService.upload(this.timbreModel, DossierEnum.TABLE),
				this.timbreService.upload(this.timbreModel, DossierEnum.ZOOM),
			]).pipe(first(([image, imageTable, imageZoom]) => isNotNullOrUndefined(image) && isNotNullOrUndefined(imageZoom) && isNotNullOrUndefined(imageTable))).subscribe(([imageTable, image, imageZoom]) => {
				if (isNotNullOrUndefined(image) && image != 'nok') {
					this.timbreModel.setImage(image);
				}
				if (isNotNullOrUndefined(imageTable) && imageTable != 'nok') {
					this.timbreModel.setImageTable(imageTable);
				}
				if (isNotNullOrUndefined(imageZoom) && imageZoom != 'nok') {
					this.timbreModel.setImageZoom(imageZoom);
				}
				if (!ajout) {
					this.timbreService.modifier(this.timbreModel);
				} else {
					this.timbreService.ajouter(this.timbreModel, true);
				}
				this.httpResponseHandlerService.showNotificationSuccess(NotificationTypeEnum.TRANSACTION_OK, NotificationMessageEnum.TIMBRE_MODIF);
				this.load$.next(true);
				this.dialogRef.close();
			});
		} catch (error) {
			this.httpResponseHandlerService.showNotificationError(NotificationTypeEnum.TRANSACTION_NOK, NotificationMessageEnum.TIMBRE_MODIF_NOK);
			this.load$.next(true);
		}
	}

	close() {
		this.dialogRef.close();
	}

	changeAnnee(annee: number) {
		this.timbreModel.setTimbreBlocModel(null);
		if (isNotNullOrUndefined(annee)) {
			const timbreCritereModel: TimbreCritereModel = new TimbreCritereModel();
			timbreCritereModel.setAnnees([annee]);
			this.timbreBlocService.getBlocs(timbreCritereModel);
		}
	}

	changeBloc(timbreBlocModel: TimbreBlocModel) {
		if (isNotNullOrUndefined(timbreBlocModel)) {
			this.timbreModel.setIdBloc(timbreBlocModel.getId());
			this.timbreModel.setTimbreBlocModel(timbreBlocModel);
			this.timbreModel.setMonnaie(timbreBlocModel.getMonnaie());
		} else {
			this.timbreModel.setIdBloc(null);
			this.timbreModel.setTimbreBlocModel(null);
			//this.timbreModel.setAnnee(new Date().getFullYear());
			this.timbreModel.setMonnaie('E');
		}
	}
}
