import {Component, Input} from "@angular/core";
import {isNotNullOrUndefined} from "../../utils/utils";

@Component({
    selector: "lib-spinner",
    templateUrl: "./lib-spinner.component.html",
    styleUrls: ["./lib-spinner.component.scss"],
})
export class LibSpinnerComponent {
    @Input() size: number = 100;
    @Input() bar: boolean = false;
    @Input() color: boolean = false;
    @Input() set classSpinner(classe: string) {
        if (classe === "noClass") {
            this._classSpinner = "";
        } else {
            this._classSpinner = classe;
        }
    }
    @Input() classText: string;
    @Input() set chargementDonnees(loadData: boolean) {
        this._chargementDonnees = loadData;
        if (loadData) {
            this.text = "Chargement des données en cours ...";
        }
    }
    @Input() set chargement(loadData: boolean) {
        this._chargement = loadData;
        if (loadData && !this._chargementDonnees) {
            this.text = "Chargement en cours ...";
        }
    }
    @Input() set textSpec(txt: string) {
        if (!this._chargementDonnees && !this._chargement && isNotNullOrUndefined(txt)) {
            this.text = txt;
        }
    }
    @Input() diameter: number;
    @Input() align: string = "center center";
    @Input() info: string;

    text: string;
    _chargementDonnees: boolean = false;
    _chargement: boolean = false;
    _classSpinner: string = "spinner";
}
