import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {TimbreModel} from "../../../../model/timbre.model";
import {TimbreService} from "../../services/timbre.service";
import {BehaviorSubject, first, combineLatest} from "rxjs";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {NgForm} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {HttpResponseHandlerService} from "../../../../shared/services/httpResponseHandler.service";
import {NotificationTypeEnum} from "../../../../shared/enum/notification/notification-type.enum";
import {NotificationMessageEnum} from "../../../../shared/enum/notification/notification-message.enum";
import {FileUploadModel} from "../../../../model/file/file-upload.model";
import {FileDetailUploadModel} from "../../../../model/file/file-detail-upload.model";
import {UploadService} from "../../../../shared/services/upload.service";


@Component({
	selector: "app-timbre-modifier",
	templateUrl: "./timbre-modifier.component.html",
	styleUrls: ["./timbre-modifier.component.scss"],
})
export class TimbreModifierComponent implements OnInit {
	@ViewChild('canvas', {static: false}) canvas!: ElementRef<HTMLCanvasElement>;

	messageError$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
	id: number;
	code: string;
	maxAnnee: number = new Date().getFullYear();
	timbreModel: TimbreModel = new TimbreModel();
	fileUploadModel: FileUploadModel = new FileUploadModel();

	constructor(
		private httpResponseHandlerService: HttpResponseHandlerService,
		public dialogRef: MatDialogRef<TimbreModifierComponent>,
		public timbreService: TimbreService,
		private uploadService: UploadService,
	) {
	}

	ngOnInit(): void {
		this.initUpload();
		this.load$.next(false);
		if (isNotNullOrUndefined(this.code)) {
			this.timbreService.getByCodeAsync(this.code).subscribe(timbreModel => {
				this.timbreModel = timbreModel;
				this.load$.next(true);
			});
		} else if (isNotNullOrUndefined(this.id)) {
			this.timbreService.getTimbreByIdAsync(this.id).subscribe(timbreModel => {
				this.timbreModel = timbreModel;
				this.load$.next(true);
			});
		} else {
			this.timbreModel.setAnnee(new Date().getFullYear());
			this.timbreModel.setMonnaie("E");
			this.load$.next(true);
		}
	}

	initUpload() {
		this.fileUploadModel.setDossier("test");
		this.fileUploadModel.setNom(new Date().getTime()?.toString());

		const fileDetailUploadModel = new FileDetailUploadModel();
		fileDetailUploadModel.setMaxWidth(this.timbreService.widthTimbre);
		fileDetailUploadModel.setMaxHeight(this.timbreService.heightTimbre);
		fileDetailUploadModel.setDossier("autre");

		const fileDetailUploadModelZoom = new FileDetailUploadModel();
		fileDetailUploadModelZoom.setMaxWidth(this.timbreService.widthTimbreZoom);
		fileDetailUploadModelZoom.setMaxHeight(this.timbreService.heightTimbreZoom);
		fileDetailUploadModelZoom.setDossier("zoom");

		this.fileUploadModel.setDetail([fileDetailUploadModel, fileDetailUploadModelZoom]);
	}

	valider(formModif: NgForm) {
		this.messageError$.next(null)
		if (formModif?.valid) {
			if (isNotNullOrUndefined(this.timbreModel.getImage())) {
				this.saveData();
			} else {
				this.messageError$.next("Veuillez sélectionner une image")
				return;
			}
		}
	}

	saveData() {
		this.load$.next(false);
		if (isNotNullOrUndefined(this.timbreModel.getId())) {
			this.save();
		} else {
			this.addTimbre();
		}
	}

	addTimbre() {
		this.timbreService.getMaxIdentAsync().pipe(first()).subscribe(id => {
			this.timbreModel.setId(id)
			this.save(true);
		})
	}

	save(ajout?: boolean) {
		const dossierImage = this.timbreService.dossierImage + (isNotNullOrUndefined(this.timbreModel.getIdBloc())? "bloc/" : "")
		try {
			combineLatest([
				this.uploadService.processAndUploadImageByFile(this.timbreModel?.getImage(), this.timbreService.widthTimbre, this.timbreService.heightTimbre, this.timbreModel?.getId(), dossierImage + "autre"),
				this.uploadService.processAndUploadImageByFile(this.timbreModel?.getImage(), this.timbreService.widthTimbre * (this.timbreService.heigthTable / this.timbreService.heightTimbre), this.timbreService.heigthTable, this.timbreModel?.getId(), dossierImage + "table"),
				this.uploadService.processAndUploadImageByFile(this.timbreModel?.getImage(), this.timbreService.widthTimbreZoom, this.timbreService.heightTimbreZoom, this.timbreModel?.getId(), dossierImage + "zoom"),
			]).pipe(first(([image, imageTable, imageZoom]) => isNotNullOrUndefined(image) && isNotNullOrUndefined(imageZoom) && isNotNullOrUndefined(imageTable))).subscribe(([imageTable, image, imageZoom]) => {
				console.log("image", image)
				console.log("imageTable", imageTable)
				console.log("imageZoom", imageZoom)
				if (isNotNullOrUndefined(image) && image != "nok") {
					this.timbreModel.setImage(image);
				}
				if (isNotNullOrUndefined(imageTable) && imageTable != "nok") {
					this.timbreModel.setImageTable(imageTable);
				}
				if (isNotNullOrUndefined(imageZoom) && imageZoom != "nok") {
					this.timbreModel.setImageZoom(imageZoom);
				}
				if (!ajout) {
					this.timbreService.modifierTimbre(this.timbreModel);
				} else {
					this.timbreService.addTimbre(this.timbreModel);
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
