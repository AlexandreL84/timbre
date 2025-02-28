import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {TimbreModel} from "../../../../model/timbre.model";
import {TimbreService} from "../../services/timbre.service";
import {BehaviorSubject} from "rxjs";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {NgForm} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {HttpResponseHandlerService} from "../../../../shared/services/httpResponseHandler.service";
import {NotificationTypeEnum} from "../../../../shared/enum/notification/notification-type.enum";
import {NotificationMessageEnum} from "../../../../shared/enum/notification/notification-message.enum";

@Component({
	selector: "app-timbre-modifier",
	templateUrl: "./timbre-modifier.component.html",
	styleUrls: ["./timbre-modifier.component.scss"],
})
export class TimbreModifierComponent implements OnInit {
	@ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

	messageError$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
	id: number;
	code: string;
	maxAnnee: number = new Date().getFullYear();
	timbreModel: TimbreModel = new TimbreModel();

	constructor(
		private httpResponseHandlerService: HttpResponseHandlerService,
		public dialogRef: MatDialogRef<TimbreModifierComponent>, public timbreService: TimbreService) {
	}

	ngOnInit(): void {
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

	valider(formModif: NgForm) {
		this.messageError$.next(null)
		if (formModif?.valid) {
			//if (isNotNullOrUndefined(this.timbreModel.getImage())) {
				this.saveData();
			/*} else {
				this.messageError$.next("Veuillez sélectionner une image")
				return;
			}*/
		}
	}

	saveData() {
		this.load$.next(false);
		try {
			if (isNotNullOrUndefined(this.timbreModel.getId())) {
				this.timbreService.modifierTimbre(this.timbreModel)
			} else {
				this.timbreService.addTimbre(this.timbreModel)
			}
			this.httpResponseHandlerService.showNotificationSuccess(NotificationTypeEnum.TRANSACTION_OK, NotificationMessageEnum.TIMBRE_MODIF);
			this.load$.next(true);
			this.dialogRef.close();
		}  catch (error) {
			this.httpResponseHandlerService.showNotificationError(NotificationTypeEnum.TRANSACTION_NOK, NotificationMessageEnum.TIMBRE_MODIF_NOK);
			this.load$.next(true);
		}
	}

	close() {
		this.dialogRef.close();
	}
}
