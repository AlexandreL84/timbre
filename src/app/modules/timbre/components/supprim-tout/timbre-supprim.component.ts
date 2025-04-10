import {Component} from "@angular/core";
import {FontAwesomeAttributEnum, FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {FontAwesomeTypeEnum} from "../../../../shared/enum/font-awesome/font-awesome-type.enum";
import {TimbreSupprimService} from "../../../../shared/services/timbre/timbre-supprim.service";
import {MatDialog} from "@angular/material/dialog";
import {TimbreSupprimChoixAnneeComponent} from "./choix-annee/timbre-supprim-choix-annee.component";

@Component({
	selector: "app-timbre-supprim",
	templateUrl: "./timbre-supprim.component.html",
})
export class TimbreSupprimComponent {
	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;
	readonly FontAwesomeAttributEnum = FontAwesomeAttributEnum;

	constructor(private dialog: MatDialog, public timbreSupprimService: TimbreSupprimService) {
	}

	supprimer() {
		this.dialog.open(TimbreSupprimChoixAnneeComponent, {
			maxHeight: "50vh",
			width: "300px"
		});
	}
}
