import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {TimbrePaysModel} from "../../../../model/timbre-pays.model";
import {TimbrePaysService} from "../../services/timbre-pays.service";
import {BehaviorSubject} from "rxjs";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {NgForm} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {ImageService} from "../../services/image.service";
import {HttpResponseHandlerService} from "../../../../shared/services/httpResponseHandler.service";
import {NotificationTypeEnum} from "../../../../shared/enum/notification/notification-type.enum";
import {NotificationMessageEnum} from "../../../../shared/enum/notification/notification-message.enum";

@Component({
	selector: "app-timbre-pays-modifier",
	templateUrl: "./timbre-pays-modifier.component.html",
	styleUrls: ["./timbre-pays-modifier.component.scss"],
})
export class TimbrePaysModifierComponent implements OnInit {
	@ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

	messageError$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
	id: number;
	timbrePaysModel: TimbrePaysModel = new TimbrePaysModel()
	maxClasseur: number = 10
	maxPage: number = 64

	constructor(
		private httpResponseHandlerService: HttpResponseHandlerService,
		public dialogRef: MatDialogRef<TimbrePaysModifierComponent>, public timbrePaysService: TimbrePaysService, private imageService: ImageService) {
	}

	ngOnInit(): void {
		this.load$.next(false)
		if (isNotNullOrUndefined(this.id)) {
			this.timbrePaysService.getTimbreByIdAsync(this.id).subscribe(timbrePaysModel => {
				this.timbrePaysModel = timbrePaysModel
				this.load$.next(true)
			});
		} else {
			this.load$.next(true)
		}
	}

	valider(formModif: NgForm) {
		this.messageError$.next(null)
		if (formModif?.valid) {
			if (isNotNullOrUndefined(this.timbrePaysModel.getImageUrl())) {
				this.saveData();
			} else {
				this.messageError$.next("Veuillez sélectionner une image")
				return;
			}
		}
	}

	saveData() {
		try {
			if (isNotNullOrUndefined(this.timbrePaysModel.id)) {
				this.timbrePaysService.modifierTimbre(this.timbrePaysModel)
			} else {
				this.timbrePaysService.addTimbre(this.timbrePaysModel)
			}
			this.httpResponseHandlerService.showNotificationSuccess(NotificationTypeEnum.TRANSACTION_OK, NotificationMessageEnum.PAYS_MODIF);
			this.dialogRef.close();
		}  catch (error) {
			this.httpResponseHandlerService.showNotificationError(NotificationTypeEnum.TRANSACTION_NOK, NotificationMessageEnum.PAYS_MODIF_NOK);
		}
	}

	close() {
		this.dialogRef.close();
	}
}
