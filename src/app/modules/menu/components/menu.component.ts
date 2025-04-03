import {Component} from '@angular/core';
import {FontAwesomeEnum} from "../../../shared/enum/font-awesome";
import {HeaderService} from "../../../shared/services/header.service";
import {TimbreModifierComponent} from "../../timbre/components/modifier/timbre-modifier.component";
import {TimbreModifierBlocComponent} from "../../timbre-bloc/components/modifier-bloc/timbre-modifier-bloc.component";
import {TimbreImporterComponent} from "../../timbre/components/importer/timbre-importer.component";
import {TimbreService} from "../../../shared/services/timbre/timbre.service";
import {MatDialog} from "@angular/material/dialog";
import {RouteEnum} from "../../../shared/enum/route.enum";
import {FontAwesomeTypeEnum} from "../../../shared/enum/font-awesome/font-awesome-type.enum";

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
})
export class MenuComponent {
	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly RouteEnum = RouteEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;

	constructor(public headerService: HeaderService, private timbreService: TimbreService, private dialog: MatDialog) {
	}

	ajouter() {
		const refDialog = this.dialog.open(TimbreModifierComponent, {
			maxHeight: "95vh",
			width: "30%",
		});

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
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

	ajouterBouchon() {
		this.timbreService.ajouterSansId(this.timbreService.getBouchon());
	}

	importer() {
		const refDialog = this.dialog.open(TimbreImporterComponent, {
			//height: "25vh",
			//width: "20%",
			height: "90vh",
			width: "70%",
		});

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}
}
