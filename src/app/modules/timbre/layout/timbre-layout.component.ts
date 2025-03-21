import {Component, OnInit} from "@angular/core";
import {TimbreService} from "../services/timbre.service";
import {MatDialog} from "@angular/material/dialog";
import {TimbreModifierComponent} from "../components/modifier/timbre-modifier.component";
import {TimbreImporterComponent} from "../components/importer/timbre-importer.component";
import { TimbreModifierBlocComponent } from '../components/modifier-bloc/timbre-modifier-bloc.component';

@Component({
	selector: "app-timbre-layout",
	templateUrl: "./timbre-layout.component.html",
	styleUrls: ["./timbre-layout.component.scss"],
})
export class TimbreLayoutComponent implements OnInit {
	constructor(public timbreService: TimbreService, private dialog: MatDialog) {
	}

	ngOnInit(): void {
		this.timbreService.getTimbres();
	}

	addTimbre() {
		const refDialog = this.dialog.open(TimbreModifierComponent, {
			maxHeight: "95vh",
			width: "30%",
		});

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}

	addBloc() {
		const refDialog = this.dialog.open(TimbreModifierBlocComponent, {
			maxHeight: "95vh",
			width: "30%",
		});

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}

	addTimbreBouchon() {
		this.timbreService.addTimbreSansId(this.timbreService.getBouchon());
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
