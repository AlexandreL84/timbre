import {Component, OnInit} from "@angular/core";
import {TimbrePaysService} from "../services/timbre-pays.service";
import {MatDialog} from "@angular/material/dialog";
import {TimbrePaysModifierComponent} from "../components/modifier/timbre-pays-modifier.component";
import {TimbrePaysImporterComponent} from "../components/importer/timbre-pays-importer.component";

@Component({
	selector: "app-timbre-pays-layout",
	templateUrl: "./timbre-pays-layout.component.html",
	styleUrls: ["./timbre-pays-layout.component.scss"],
})
export class TimbrePaysLayoutComponent implements OnInit {
	constructor(public timbrePaysService: TimbrePaysService, private dialog: MatDialog) {
	}

	ngOnInit(): void {
		//this.timbrePaysResultatService.timbres$ = this.timbrePaysService.getTimbres2();
		//this.timbrePaysService.getTimbres2();
		//this.timbrePaysService.deleteTimbrebyCode("FR")
	}

	addTimbre() {
		const refDialog = this.dialog.open(TimbrePaysModifierComponent, {
			maxHeight: "95vh",
			width: "30%",
		});

		refDialog.afterClosed().subscribe(() => {
			refDialog.close()
		});
	}

	addTimbreBouchon() {
		this.timbrePaysService.addTimbre(this.timbrePaysService.getBouchon())
	}

	importer() {
		const refDialog = this.dialog.open(TimbrePaysImporterComponent, {
			//height: "25vh",
			//width: "20%",
			height: "90vh",
			width: "70%",
		});

		refDialog.afterClosed().subscribe(() => {
			refDialog.close()
		});
	}
}
