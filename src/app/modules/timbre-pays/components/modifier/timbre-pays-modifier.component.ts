import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {TimbrePaysModel} from "../../../../model/timbre-pays.model";
import {TimbrePaysService} from "../../services/timbre-pays.service";
import {BehaviorSubject, combineLatest, combineLatestWith, first} from "rxjs";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {NgForm} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {HttpResponseHandlerService} from "../../../../shared/services/httpResponseHandler.service";
import {NotificationTypeEnum} from "../../../../shared/enum/notification/notification-type.enum";
import {NotificationMessageEnum} from "../../../../shared/enum/notification/notification-message.enum";
import {UploadService} from "../../../../shared/services/upload.service";
import {DossierEnum} from "../../../../shared/enum/dossier.enum";

@Component({
	selector: "app-timbre-pays-modifier",
	templateUrl: "./timbre-pays-modifier.component.html",
	styleUrls: ["./timbre-pays-modifier.component.scss"],
})
export class TimbrePaysModifierComponent implements OnInit {
	@ViewChild('canvas', {static: false}) canvas!: ElementRef<HTMLCanvasElement>;

	messageError$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
	id: number;
	code: string;
	timbrePaysModel: TimbrePaysModel = new TimbrePaysModel();
	maxClasseur: number = 10;
	maxPage: number = 64;

	constructor(
		private httpResponseHandlerService: HttpResponseHandlerService,
		public dialogRef: MatDialogRef<TimbrePaysModifierComponent>, public timbrePaysService: TimbrePaysService, private uploadService: UploadService) {
	}

	ngOnInit(): void {
		this.load$.next(false);
		if (isNotNullOrUndefined(this.code)) {
			this.timbrePaysService.getByCodeAsync(this.code).subscribe(timbrePaysModel => {
				this.timbrePaysModel = timbrePaysModel;
				this.load$.next(true);
			});
		} else if (isNotNullOrUndefined(this.id)) {
			this.timbrePaysService.getTimbreByIdAsync(this.id).subscribe(timbrePaysModel => {
				this.timbrePaysModel = timbrePaysModel;
				this.load$.next(true);
			});
		} else {
			this.timbrePaysModel = this.timbrePaysService.getBouchon();
			this.load$.next(true);
		}
	}

	valider(formModif: NgForm) {
		this.messageError$.next(null)
		if (formModif?.valid) {
			if (isNotNullOrUndefined(this.timbrePaysModel.getDrapeau())) {
				this.saveData();
			} else {
				this.messageError$.next("Veuillez sélectionner une image")
				return;
			}
		}
	}

	saveData() {
		this.load$.next(false);
		if (isNotNullOrUndefined(this.timbrePaysModel.getId())) {
			this.save(false);
		} else {
			this.addTimbrePays();
		}
	}

	addTimbrePays() {
		this.timbrePaysService.getMaxIdentAsync().pipe(first()).subscribe(id => {
			this.timbrePaysModel.setId(id)
			this.save(true);
		})
	}

	save(ajout?: boolean) {
		try {
			combineLatest([
				this.timbrePaysService.upload(this.timbrePaysModel, DossierEnum.DRAPEAU, false),
				this.timbrePaysService.upload(this.timbrePaysModel, DossierEnum.LANGUE, false),
				this.timbrePaysService.upload(this.timbrePaysModel, DossierEnum.MAP, false),
				this.timbrePaysService.upload(this.timbrePaysModel, DossierEnum.DRAPEAU, true),
				this.timbrePaysService.upload(this.timbrePaysModel, DossierEnum.LANGUE, true),
				this.timbrePaysService.upload(this.timbrePaysModel, DossierEnum.MAP, true)
			]).pipe(first(([drapeau, langue, map, drapeauZoom, langueZoom, mapZoom]) => isNotNullOrUndefined(drapeau)
				&& isNotNullOrUndefined(drapeau) &&
				isNotNullOrUndefined(langue) &&
				isNotNullOrUndefined(map) &&
				isNotNullOrUndefined(drapeauZoom) &&
				isNotNullOrUndefined(langueZoom) &&
				isNotNullOrUndefined(mapZoom))).subscribe(([drapeau, langue, map, drapeauZoom, langueZoom, mapZoom]) => {
				if (isNotNullOrUndefined(drapeau) && drapeau != "nok") {
					this.timbrePaysModel.setDrapeau(drapeau);
				}
				if (isNotNullOrUndefined(langue) && langue != "nok") {
					this.timbrePaysModel.setImageLangue(langue);
				}
				if (isNotNullOrUndefined(map) && map != "nok") {
					this.timbrePaysModel.setMap(map);
				}
				if (isNotNullOrUndefined(drapeauZoom) && drapeauZoom != "nok") {
					this.timbrePaysModel.setDrapeauZoom(drapeauZoom);
				}
				if (isNotNullOrUndefined(langueZoom) && langueZoom != "nok") {
					this.timbrePaysModel.setImageLangueZoom(langueZoom);
				}
				if (isNotNullOrUndefined(mapZoom) && mapZoom != "nok") {
					this.timbrePaysModel.setMapZoom(mapZoom);
				}

				if (!ajout) {
					this.timbrePaysService.modifierTimbre(this.timbrePaysModel);
				} else {
					this.timbrePaysService.addTimbre(this.timbrePaysModel);
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
