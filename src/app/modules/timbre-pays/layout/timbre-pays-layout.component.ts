import {Component, OnInit} from "@angular/core";
import {TimbrePaysService} from "../services/timbre-pays.service";
import {MatDialog} from "@angular/material/dialog";
import {TimbrePaysModifierComponent} from "../components/modifier/timbre-pays-modifier.component";
import {TimbrePaysImporterComponent} from "../components/importer/timbre-pays-importer.component";
import {first} from "rxjs";
import {TimbrePaysModel} from "../../../model/timbre-pays.model";
import {BaseEnum} from "../../../shared/enum/base.enum";
import {UtilsService} from "../../../shared/services/utils.service";
import {HeaderService} from "../../../shared/services/header.service";
import {DroitEnum} from "../../../shared/enum/droit.enum";
import {RouteEnum} from "../../../shared/enum/route.enum";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
	selector: "app-timbre-pays-layout",
	templateUrl: "./timbre-pays-layout.component.html",
	styleUrls: ["./timbre-pays-layout.component.scss"],
})
export class TimbrePaysLayoutComponent implements OnInit {
	constructor(private headerService: HeaderService, public timbrePaysService: TimbrePaysService, private dialog: MatDialog, private utilsService: UtilsService, public authService: AuthService) {
	}

	ngOnInit(): void {
		this.headerService.titre$.next("TIMBRE PAR PAYS");
		//this.timbrePaysResultatService.timbres$ = this.timbrePaysService.getTimbres2();
		//this.timbrePaysService.getTimbres2();
		//this.timbrePaysService.supprimerbyCode("FR")
	}

	ajouter() {
		const refDialog = this.dialog.open(TimbrePaysModifierComponent, {
			maxHeight: "95vh",
			width: "30%",
			minWidth: "300px"
		});

		refDialog.afterClosed().subscribe(() => {
			refDialog.close()
		});
	}

	ajouterBouchon() {
		this.utilsService.getMaxIdentAsync(BaseEnum.PAYS).pipe(first()).subscribe(id => {
			const timbrePaysModel: TimbrePaysModel = this.timbrePaysService.getBouchon();
			timbrePaysModel.setId(id);
			this.timbrePaysService.ajouter(timbrePaysModel);
		});
	}

	importer() {
		const refDialog = this.dialog.open(TimbrePaysImporterComponent, {
			//height: "25vh",
			//width: "20%",
			height: "90vh",
			width: "70%",
			minWidth: "300px"
		});

		refDialog.afterClosed().subscribe(() => {
			refDialog.close()
		});
	}

	protected readonly DroitEnum = DroitEnum;
	protected readonly RouteEnum = RouteEnum;
}
