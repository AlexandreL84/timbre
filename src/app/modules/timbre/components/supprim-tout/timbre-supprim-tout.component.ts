import {Component} from "@angular/core";
import {LibModalComponent} from "../../../../shared/components/lib-modal/lib-modal.component";
import {FontAwesomeAttributEnum, FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {FontAwesomeTypeEnum} from "../../../../shared/enum/font-awesome/font-awesome-type.enum";
import {TimbreSupprimService} from "../../../../shared/services/timbre/timbre-supprim.service";
import {MatDialog} from "@angular/material/dialog";
import {BaseEnum} from "../../../../shared/enum/base.enum";
import {first} from "rxjs";

@Component({
	selector: "app-timbre-supprim-tout",
	templateUrl: "./timbre-supprim-tout.component.html",
	styleUrls: ["./timbre-supprim-tout.component.scss"],
})
export class TimbreSupprimToutComponent {
	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;
	readonly FontAwesomeAttributEnum = FontAwesomeAttributEnum;

	constructor(private dialog: MatDialog, public timbreSupprimService: TimbreSupprimService) {
	}

	supprimer() {
		const dialogModal = this.dialog.open(LibModalComponent, {
			maxHeight: "95vh",
			data: {
				titre: "Confirmation",
				message: "Souhaitez-vous supprimer les timbres ?",
				btnDroite: "Oui",
				btnGauche: "Non",
			},
		});

		dialogModal.afterClosed().subscribe(() => {
			if (dialogModal.componentInstance.data.resultat === "valider") {
				const listeTableSuppr = [
					{base: BaseEnum.TIMBRE_ACQUIS, critere: "idTimbre"},
					{base: BaseEnum.TIMBRE_BLOC_ACQUIS, critere: "idBloc"},
					{base: BaseEnum.TIMBRE_BLOC, critere: "id"},
					{base: BaseEnum.TIMBRE, critere: "id"},
				];
				listeTableSuppr.forEach(tableSuppr => {
					this.timbreSupprimService.load$.pipe(first(load => load == true)).subscribe(load => {
						this.timbreSupprimService.supprimer(tableSuppr.base, tableSuppr.critere);
					});
				});

				/*this.timbreSupprimService.supprimer(BaseEnum.TIMBRE_ACQUIS, "idTimbre");
				this.timbreSupprimService.supprimer(BaseEnum.TIMBRE_BLOC_ACQUIS, "idBloc");
				this.timbreSupprimService.supprimer(BaseEnum.TIMBRE_BLOC, "id");
				this.timbreSupprimService.supprimer(BaseEnum.TIMBRE, "id");*/
			}
		})
	}
}
