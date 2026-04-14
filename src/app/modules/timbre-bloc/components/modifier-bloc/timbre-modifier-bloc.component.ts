import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, first} from 'rxjs';
import {isNotNullOrUndefined} from '../../../../shared/utils/utils';
import {NgForm} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {TimbreBlocService} from '../../../../shared/services/timbre/timbre-bloc.service';
import {BaseEnum} from "../../../../shared/enum/base.enum";
import {UtilsService} from "../../../../shared/services/utils.service";
import {TimbreBlocModel} from "../../../../model/timbre-bloc.model";
import {FileUploadModel} from "../../../../model/file/file-upload.model";
import {DimensionImageEnum} from "../../../../shared/enum/dimension-image.enum";
import {TypeTimbreEnum} from "../../../../shared/enum/type-timbre.enum";
import {MonnaieEnum} from "../../../../shared/enum/monnaie.enum";
import {TimbreModel} from "../../../../model/timbre.model";
import {TypeImageTimbreEnum} from "../../../../shared/enum/type-image-timbre.enum";
import {TimbreUploadService} from "../../../../shared/services/timbre/timbre-upload.service";
import {TimbreVarService} from "../../../../shared/services/timbre/timbre-var.service";
import {TimbreActionsService} from "../../../../shared/services/timbre/timbre-actions.service";

@Component({
	selector: 'app-timbre-modifier-bloc',
	templateUrl: './timbre-modifier-bloc.component.html',
})
export class TimbreModifierBlocComponent implements OnInit {
	@ViewChild('canvas', {static: false}) canvas!: ElementRef<HTMLCanvasElement>;

	messageError$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	id: number;
	maxAnnee: number = new Date().getFullYear() + 1;
	timbreBlocModel: TimbreBlocModel = new TimbreBlocModel();
	fileUploadModel: FileUploadModel = new FileUploadModel();

	readonly DimensionImageEnum = DimensionImageEnum;
	readonly TypeTimbreEnum = TypeTimbreEnum;

	constructor(
		public dialogRef: MatDialogRef<TimbreModifierBlocComponent>,
		private utilsService: UtilsService,
		private timbreBlocService: TimbreBlocService,
		private timbreActionsService: TimbreActionsService,
		private timbreUploadService: TimbreUploadService,
		public timbreVarService: TimbreVarService
	) {
	}

	ngOnInit(): void {
		this.fileUploadModel = this.timbreUploadService.initUpload();
		this.timbreVarService.loadModifBloc$.next(false);
		if (isNotNullOrUndefined(this.id)) {
			this.timbreBlocService.getBlocByIdAsync(this.id).subscribe(timbreBlocModel => {
				this.timbreBlocModel = timbreBlocModel;
				this.timbreVarService.loadModifBloc$.next(true);
			});
		} else {
			this.timbreBlocModel.setAnnee(new Date().getFullYear());
			this.timbreBlocModel.setMonnaie(MonnaieEnum.EURO);
			this.timbreVarService.loadModifBloc$.next(true);
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
		this.timbreVarService.loadModifBloc$.next(false);
		if (isNotNullOrUndefined(this.timbreBlocModel.getId())) {
			this.timbreActionsService.saveBloc(this.timbreBlocModel, this.dialogRef);
		} else {
			this.ajouter();
		}
	}

	ajouter() {
		this.utilsService.getMaxIdentAsync(BaseEnum.TIMBRE_BLOC).pipe(first()).subscribe(id => {
			this.timbreBlocModel.setId(id);
			this.timbreActionsService.saveBloc(this.timbreBlocModel, this.dialogRef, true);
		});
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
