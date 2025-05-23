import {Component, OnInit, ViewChild} from "@angular/core";
import {TimbrePaysModel} from "../../../../model/timbre-pays.model";
import {TimbrePaysService} from "../../services/timbre-pays.service";
import {BehaviorSubject} from "rxjs";
import {NgForm} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {HttpResponseHandlerService} from "../../../../shared/services/httpResponseHandler.service";
import {NotificationTypeEnum} from "../../../../shared/enum/notification/notification-type.enum";
import {NotificationMessageEnum} from "../../../../shared/enum/notification/notification-message.enum";

@Component({
	selector: "app-timbre-pays-ajout-timbre",
	templateUrl: "./timbre-pays-ajout-timbre.component.html",
	styleUrl: "./timbre-pays-ajout-timbre.component.scss",
})
export class TimbrePaysAjoutTimbreComponent implements OnInit {
	@ViewChild("formAjoutTimbre") formAjoutTimbre: NgForm;

	messageError$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
	id: number;
	timbrePaysModel: TimbrePaysModel = new TimbrePaysModel();
	totalOrigine: number;
	nbTimbres: number;

	constructor(
		private httpResponseHandlerService: HttpResponseHandlerService,
		public dialogRef: MatDialogRef<TimbrePaysAjoutTimbreComponent>,
		public timbrePaysService: TimbrePaysService) {
	}

	ngOnInit(): void {
		this.load$.next(false);
		this.timbrePaysService.getTimbreByIdAsync(this.id).subscribe(timbrePaysModel => {
			this.timbrePaysModel = timbrePaysModel;
			this.totalOrigine = this.timbrePaysModel.getTotal();
			this.load$.next(true);
		});
	}

	setTotal() {
		this.timbrePaysModel.setTotal(this.nbTimbres + +this.totalOrigine);
	}

	valider() {
		this.messageError$.next(null)
		if (this.formAjoutTimbre?.valid) {
			if (this.timbrePaysModel.getTotal() >= 0) {
				this.saveData();
			} else {
				this.messageError$.next("Le total doit être positif")
				return;
			}
		}
	}

	saveData() {
		this.load$.next(false);
		this.timbrePaysService.modifier(this.timbrePaysModel);
		this.httpResponseHandlerService.showNotificationSuccess(NotificationTypeEnum.TRANSACTION_OK, NotificationMessageEnum.TIMBRE_MODIF);
		this.load$.next(true);
		this.dialogRef.close();
	}

	close() {
		this.dialogRef.close();
	}
}
