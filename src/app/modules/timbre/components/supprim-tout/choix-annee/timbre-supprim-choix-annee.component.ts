import {Component} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {NgForm} from "@angular/forms";
import {first} from "rxjs";
import {LibModalComponent} from "../../../../../shared/components/lib-modal/lib-modal.component";
import {BaseEnum} from "../../../../../shared/enum/base.enum";
import {TimbreSupprimService} from "../../../../../shared/services/timbre/timbre-supprim.service";

@Component({
	selector: "app-timbre-supprim-choix-annee",
	templateUrl: "./timbre-supprim-choix-annee.component.html",
})
export class TimbreSupprimChoixAnneeComponent {
	maxAnnee: number = new Date().getFullYear();
	annee: number = new Date().getFullYear();

	constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<TimbreSupprimChoixAnneeComponent>, public timbreSupprimService: TimbreSupprimService) {

	}

	valider(formModif: NgForm) {
		if (formModif?.valid) {
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
					this.timbreSupprimService.loadGlob$.next(false);

					this.timbreSupprimService.supprimerTimbres(this.annee);

					this.timbreSupprimService.load$.pipe(first(load => load == true)).subscribe(load => {
						this.timbreSupprimService.supprimerBlocs(this.annee);
						this.timbreSupprimService.load$.pipe(first(load => load == true)).subscribe(load => {
							this.timbreSupprimService.loadGlob$.next(true);
						});
					})

					/*const listeTableSuppr = [
						{base: BaseEnum.TIMBRE_ACQUIS, critere: "idTimbre"},
						{base: BaseEnum.TIMBRE_BLOC_ACQUIS, critere: "idBloc"},
						{base: BaseEnum.TIMBRE_BLOC, critere: "id"},
						{base: BaseEnum.TIMBRE, critere: "id"},
					];

					listeTableSuppr.forEach(tableSuppr => {
						this.timbreSupprimService.load$.pipe(first(load => load == true)).subscribe(load => {
							this.timbreSupprimService.supprimer(tableSuppr.base, tableSuppr.critere);
						});
					});*/
				}
			})
		}
	}

	close() {
		this.dialogRef.close();
	}
}
