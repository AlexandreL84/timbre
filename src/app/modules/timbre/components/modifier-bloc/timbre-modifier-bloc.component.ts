import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, first, combineLatest } from 'rxjs';
import { isNotNullOrUndefined } from '../../../../shared/utils/utils';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpResponseHandlerService } from '../../../../shared/services/httpResponseHandler.service';
import { NotificationTypeEnum } from '../../../../shared/enum/notification/notification-type.enum';
import { NotificationMessageEnum } from '../../../../shared/enum/notification/notification-message.enum';
import { FileUploadModel } from '../../../../model/file/file-upload.model';
import { FileDetailUploadModel } from '../../../../model/file/file-detail-upload.model';
import { UploadService } from '../../../../shared/services/upload.service';
import { TimbreBlocModel } from '../../../../model/timbre-bloc.model';
import { TimbreBlocService } from '../../services/timbre-bloc.service';


@Component({
	selector: 'app-timbre-modifier-bloc',
	templateUrl: './timbre-modifier-bloc.component.html',
})
export class TimbreModifierBlocComponent implements OnInit {
	@ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

	messageError$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
	id: number;
	maxAnnee: number = new Date().getFullYear();
	timbreBlocModel: TimbreBlocModel = new TimbreBlocModel();
	fileUploadModel: FileUploadModel = new FileUploadModel();

	constructor(
		private httpResponseHandlerService: HttpResponseHandlerService,
		public dialogRef: MatDialogRef<TimbreModifierBlocComponent>,
		public timbreBlocService: TimbreBlocService,
		private uploadService: UploadService
	) {
	}

	ngOnInit(): void {
		this.initUpload();
		this.load$.next(false);
		if (isNotNullOrUndefined(this.id)) {
			this.timbreBlocService.getBlocByIdAsync(this.id).subscribe(timbreBlocModel => {
				this.timbreBlocModel = timbreBlocModel;
				this.load$.next(true);
			});
		} else {
			this.timbreBlocModel.setAnnee(new Date().getFullYear());
			this.timbreBlocModel.setMonnaie('E');
			this.load$.next(true);
		}
	}

	initUpload() {
		this.fileUploadModel.setDossier('test');
		this.fileUploadModel.setNom(new Date().getTime()?.toString());

		const fileDetailUploadModel = new FileDetailUploadModel();
		fileDetailUploadModel.setMaxWidth(this.timbreBlocService.widthTimbre);
		fileDetailUploadModel.setMaxHeight(this.timbreBlocService.heightTimbre);
		fileDetailUploadModel.setDossier('autre');

		const fileDetailUploadModelZoom = new FileDetailUploadModel();
		fileDetailUploadModelZoom.setMaxWidth(this.timbreBlocService.widthTimbreZoom);
		fileDetailUploadModelZoom.setMaxHeight(this.timbreBlocService.heightTimbreZoom);
		fileDetailUploadModelZoom.setDossier('zoom');

		this.fileUploadModel.setDetail([fileDetailUploadModel, fileDetailUploadModelZoom]);
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
			this.addTimbre();
		}
	}

	addTimbre() {
		this.timbreBlocService.getMaxIdentAsync().pipe(first()).subscribe(id => {
			this.timbreBlocModel.setId(id);
			this.save(true);
		});
	}

	save(ajout?: boolean) {
		try {
			combineLatest([
				this.uploadService.processAndUploadImageByFile(this.timbreBlocModel?.getImage(), this.timbreBlocService.widthTimbre, this.timbreBlocService.heightTimbre, this.timbreBlocModel?.getId(),  this.timbreBlocService.getDossier(this.timbreBlocModel, "autre")),
				this.uploadService.processAndUploadImageByFile(this.timbreBlocModel?.getImage(), this.timbreBlocService.widthTimbre * (this.timbreBlocService.heigthTable / this.timbreBlocService.heightTimbre), this.timbreBlocService.heigthTable, this.timbreBlocModel?.getId(), this.timbreBlocService.getDossier(this.timbreBlocModel, "table")),
				this.uploadService.processAndUploadImageByFile(this.timbreBlocModel?.getImage(), this.timbreBlocService.widthTimbreZoom, this.timbreBlocService.heightTimbreZoom, this.timbreBlocModel?.getId(), this.timbreBlocService.getDossier(this.timbreBlocModel, "zoom"))
			]).pipe(first(([image, imageTable, imageZoom]) => isNotNullOrUndefined(image) && isNotNullOrUndefined(imageZoom) && isNotNullOrUndefined(imageTable))).subscribe(([imageTable, image, imageZoom]) => {
				if (isNotNullOrUndefined(image) && image != 'nok') {
					this.timbreBlocModel.setImage(image);
				}
				if (isNotNullOrUndefined(imageTable) && imageTable != 'nok') {
					this.timbreBlocModel.setImageTable(imageTable);
				}
				if (isNotNullOrUndefined(imageZoom) && imageZoom != 'nok') {
					this.timbreBlocModel.setImageZoom(imageZoom);
				}
				if (!ajout) {
					this.timbreBlocService.modifierBloc(this.timbreBlocModel);
				} else {
					this.timbreBlocService.addBloc(this.timbreBlocModel);
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
}
