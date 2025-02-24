import {Component, Input} from "@angular/core";
import {FontAwesomeEnum} from "../../enum/font-awesome";

@Component({
    selector: "lib-dialog-image",
    templateUrl: "./lib-dialog-image.component.html",
    styleUrls: ["./lib-dialog-image.component.scss"],
})
export class LibDialogImageComponent {
    @Input() url: string;

    readonly FontAwesomeEnum = FontAwesomeEnum;
}
