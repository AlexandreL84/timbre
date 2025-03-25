import {Component, OnInit} from "@angular/core";
import {TimbreService} from "../../../shared/services/timbre/timbre.service";
import {MatDialog} from "@angular/material/dialog";
import {TimbreModifierComponent} from "../components/modifier/timbre-modifier.component";
import {TimbreImporterComponent} from "../components/importer/timbre-importer.component";
import {FontAwesomeTypeEnum} from "../../../shared/enum/font-awesome/font-awesome-type.enum";
import {FontAwesomeEnum} from "../../../shared/enum/font-awesome";
import {TimbreModifierBlocComponent} from "../../timbre-bloc/components/modifier-bloc/timbre-modifier-bloc.component";
import {HeaderService} from "../../../shared/services/header.service";

@Component({
	selector: "app-timbre-layout",
	templateUrl: "./timbre-layout.component.html",
	styleUrls: ["./timbre-layout.component.scss"],
})
export class TimbreLayoutComponent implements OnInit {
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;
	readonly FontAwesomeEnum = FontAwesomeEnum;

	constructor(private headerService: HeaderService, public timbreService: TimbreService, private dialog: MatDialog) {
	}

	ngOnInit(): void {
		this.headerService.titre$.next("TIMBRES");
		this.timbreService.getTimbres();
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
