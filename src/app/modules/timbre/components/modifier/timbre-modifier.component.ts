import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TimbreModel} from '../../../../model/timbre.model';
import {TimbreService} from '../../../../shared/services/timbre/timbre.service';
import {BehaviorSubject, catchError, combineLatest, EMPTY, filter, first, of, switchMap, throwError} from 'rxjs';
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
import {take, tap} from "rxjs/operators";
import {TimbreVarService} from "../../../../shared/services/timbre/timbre-var.service";
import {TimbreActionsService} from "../../../../shared/services/timbre/timbre-actions.service";
import {TimbreUploadService} from "../../../../shared/services/timbre/timbre-upload.service";

@Component({
	selector: 'app-timbre-modifier',
	templateUrl: './timbre-modifier.component.html',
})
export class TimbreModifierComponent implements OnInit {
	@ViewChild('canvas', {static: false}) canvas!: ElementRef<HTMLCanvasElement>;

	messageError$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	id: number;
	maxAnnee: number = new Date().getFullYear() + 1;
	timbreModel: TimbreModel = new TimbreModel();
	fileUploadModel: FileUploadModel = new FileUploadModel();
	retryCount: number = 0

	readonly TypeTimbreEnum = TypeTimbreEnum;
	readonly DimensionImageEnum = DimensionImageEnum;

	constructor(
		private httpResponseHandlerService: HttpResponseHandlerService,
		public dialogRef: MatDialogRef<TimbreModifierComponent>,
		private timbreActionsService: TimbreActionsService,
		private timbreService: TimbreService,
		private timbreUploadService: TimbreUploadService,
		public timbreVarService: TimbreVarService,
		public timbreBlocService: TimbreBlocService,
		public timbreUtilsService: TimbreUtilsService,
		public utilsService: UtilsService
	) {
	}

	ngOnInit(): void {
		this.fileUploadModel = this.timbreUploadService.initUpload();
		this.timbreVarService.loadModifTimbre$.next(false);
		if (isNotNullOrUndefined(this.id)) {
			this.timbreService.getTimbreByIdAsync(this.id).subscribe(timbreModel => {
				this.timbreModel = timbreModel;
				if (isNotNullOrUndefined(timbreModel.getTimbreBlocModel())) {
					this.timbreModel.setAnnee(timbreModel.getTimbreBlocModel().getAnnee());
					this.timbreModel.setMonnaie(timbreModel.getTimbreBlocModel().getMonnaie());
				}
				this.timbreVarService.loadModifTimbre$.next(true);
			});
		} else {
			this.timbreModel.setAnnee(new Date().getFullYear());
			this.timbreModel.setMonnaie(MonnaieEnum.EURO);
			this.timbreVarService.loadModifTimbre$.next(true);
		}
		this.changeAnnee(this.timbreModel.getAnnee());
	}

	getBlocsByAnnee(annee: number) {
		const timbreCritereModel = new TimbreCritereModel();
		timbreCritereModel.setAnnees([annee]);
		this.timbreBlocService.getBlocs(timbreCritereModel, false, false);
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
		this.timbreVarService.loadModifTimbre$.next(false);
		if (isNotNullOrUndefined(this.timbreModel.getId())) {
			this.timbreActionsService.save(this.timbreModel, this.dialogRef, false, true);
		} else {
			this.ajouter();
		}
	}

	ajouter() {
		this.utilsService.getMaxIdentAsync(BaseEnum.TIMBRE).pipe(first()).subscribe(id => {
			this.timbreModel.setId(id);
			this.timbreActionsService.save(this.timbreModel, this.dialogRef, true, true);
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
			this.getBlocsByAnnee(annee)
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
