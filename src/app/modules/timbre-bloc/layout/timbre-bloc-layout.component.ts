import {Component, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {FontAwesomeTypeEnum} from "../../../shared/enum/font-awesome/font-awesome-type.enum";
import {FontAwesomeEnum} from "../../../shared/enum/font-awesome";
import {TimbreModifierBlocComponent} from "../components/modifier-bloc/timbre-modifier-bloc.component";
import {TimbreBlocService} from "../../../shared/services/timbre/timbre-bloc.service";
import {HeaderService} from "../../../shared/services/header.service";
import {first} from "rxjs";

@Component({
	selector: "app-timbre-bloc-layout",
	templateUrl: "./timbre-bloc-layout.component.html",
})
export class TimbreBlocLayoutComponent implements OnInit {
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;
	readonly FontAwesomeEnum = FontAwesomeEnum;

	constructor(private headerService: HeaderService, public timbreBlocService: TimbreBlocService, private dialog: MatDialog) {
	}

	ngOnInit(): void {
		this.headerService.titre$.next("TIMBRES - BLOC");
		this.timbreBlocService.getBlocs();
	}

	ajouterBloc() {
		const refDialog = this.dialog.open(TimbreModifierBlocComponent, {
			maxHeight: "95vh",
			width: "30%",
		});

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}
}
