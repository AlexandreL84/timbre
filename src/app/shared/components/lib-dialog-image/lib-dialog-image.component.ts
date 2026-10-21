import {Component, Input} from "@angular/core";
import {FontAwesomeEnum} from "../../enum/font-awesome";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "../../modules/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {LibIconModule} from "../lib-icon";

@Component({
    // Standalone : ce composant est ouvert en modale depuis d'autres modules (menu, services partagés),
    // il doit donc déclarer lui-même ses dépendances de template.
    imports: [CommonModule, MaterialModule, FlexLayoutModule, LibIconModule],
    selector: "lib-dialog-image",
    templateUrl: "./lib-dialog-image.component.html",
    styleUrls: ["./lib-dialog-image.component.scss"],
})
export class LibDialogImageComponent {
    @Input() url: string;

    readonly FontAwesomeEnum = FontAwesomeEnum;
}
