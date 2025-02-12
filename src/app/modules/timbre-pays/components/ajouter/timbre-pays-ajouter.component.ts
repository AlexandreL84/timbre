import {Component, OnInit} from "@angular/core";
import {TimbrePaysModel} from "../../../../model/timbre-pays.model";
import {TimbrePaysService} from "../../services/timbre-pays.service";
import {BehaviorSubject} from "rxjs";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {NgForm} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {HttpResponseHandlerService} from "../../../../shared/services/httpResponseHandler.service";
import {NotificationTypeEnum} from "../../../../shared/enum/notification/notification-type.enum";
import {NotificationMessageEnum} from "../../../../shared/enum/notification/notification-message.enum";

@Component({
	selector: "app-timbre-pays-ajouter",
	templateUrl: "./timbre-pays-ajouter.component.html",
})
export class TimbrePaysAjouterComponent implements OnInit {
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
	id: string;
	timbrePaysModel: TimbrePaysModel = new TimbrePaysModel();
	nbTimbres: number = 0;
	total: number = 0;

	constructor(
		private httpResponseHandlerService: HttpResponseHandlerService,
		public dialogRef: MatDialogRef<TimbrePaysAjouterComponent>, public timbrePaysService: TimbrePaysService) {
	}

	ngOnInit(): void {
		this.load$.next(false);
		if (isNotNullOrUndefined(this.id)) {
			this.timbrePaysService.getTimbreByIdAsync(this.id).subscribe(timbrePaysModel => {
				this.timbrePaysModel = timbrePaysModel;
				this.total = timbrePaysModel.getTotal();
				this.load$.next(true);
			});
		}
	}

	changeTotal($event) {
		this.nbTimbres = $event;
		this.total = +this.nbTimbres + +this.timbrePaysModel.getTotal();
	}

	valider(formAjout: NgForm) {
		if (formAjout?.valid) {
			this.saveData();
		}
	}

	saveData() {
		try {
			this.load$.next(false);
			this.timbrePaysModel.setTotal(this.total);
			this.timbrePaysService.modifierTimbre(this.timbrePaysModel);
			this.httpResponseHandlerService.showNotificationSuccess(NotificationTypeEnum.TRANSACTION_OK, NotificationMessageEnum.PAYS_AJOUT);
			this.load$.next(true);
			this.dialogRef.close();
		} catch (error) {
			this.load$.next(true);
			this.httpResponseHandlerService.showNotificationError(NotificationTypeEnum.TRANSACTION_NOK, NotificationMessageEnum.PAYS_AJOUT_NOK);
		}
	}

	close() {
		this.dialogRef.close();
	}
}
