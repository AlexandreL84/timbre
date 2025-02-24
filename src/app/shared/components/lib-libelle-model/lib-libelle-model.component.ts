import {Component, Input} from "@angular/core";
import {FontAwesomeEnum} from "../../enum/font-awesome";

@Component({
    selector: "lib-libelle-model",
    templateUrl: "./lib-libelle-model.component.html",
})
export class LibLibelleModelComponent {
    @Input() object;
    @Input() key: string;
    @Input() classLibelle: string = null;
    @Input() toLowerCase: boolean = false;
    @Input() classIcone: string;
    @Input() propriete: string = "label";
    @Input() info: string = null;
    @Input() showInfo: boolean = true;
    @Input() showUnite: boolean = true;
    @Input() showQuestion: boolean = false;
    @Input() separator: string;
	@Input() align: string = "start center";

    readonly FontAwesomeEnum = FontAwesomeEnum;
}
