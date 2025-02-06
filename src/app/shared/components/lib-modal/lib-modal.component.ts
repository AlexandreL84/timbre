import {Component, Inject, Input, OnDestroy, ViewChild} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {isNotNullOrUndefined, isNullOrUndefined} from "../../utils/utils";

export interface DialogData {
    classTitre: string;
    titre: string;
    message: string;
    route: string;
    resultat: string;
    btnGauche: string;
    btnDroite: string;
    desactiveBtnDroite: boolean;
    desactiveBtnGauche: boolean;
    positionBtn: string;
    move: boolean;
}

@Component({
    selector: "z-modal",
    templateUrl: "./z-modal.component.html",
})
export class ZModalComponent implements OnDestroy {
    @Input() content: any;
    @Input() componentRef;

	positionBtn = "space-between";

    constructor(public dialogRef: MatDialogRef<ZModalComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, public router: Router) {
        if (isNullOrUndefined(data.btnDroite)) {
            data.btnDroite = "Valider";
        }
        if (isNullOrUndefined(data.btnGauche)) {
            data.btnGauche = "Annuler";
        }
    }

    annuler() {
        this.data.resultat = "annuler";
        this.dialogRef.close(false);
    }

    valider() {
        this.data.resultat = "valider";
        this.dialogRef.close(true);
        if (isNotNullOrUndefined(this.data.route)) {
            this.router.navigate(["/" + this.data.route]);
        }
    }

    ngOnDestroy() {
        if (isNotNullOrUndefined(this.componentRef)) {
            this.componentRef.destroy();
        }
    }
}
