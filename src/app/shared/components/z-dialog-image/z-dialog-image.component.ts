import {Component, Input} from "@angular/core";
import {FontAwesomeEnum} from "../../enum/font-awesome";

@Component({
    selector: "z-dialog-image",
    templateUrl: "./z-dialog-image.component.html",
    styleUrls: ["./z-dialog-image.component.scss"],
})
export class ZDialogImageComponent {
    @Input() url: string;

    readonly FontAwesomeEnum = FontAwesomeEnum;
}
