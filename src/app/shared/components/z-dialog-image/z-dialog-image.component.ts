import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FontAwesomeEnum} from "../../../enums/ui/font-awesome/font-awesome.enum";
import {NavigationService} from "../../../services/services";

@Component({
    selector: "z-dialog-image",
    templateUrl: "./z-dialog-image.component.html",
    styleUrls: ["./z-dialog-image.component.scss"],
})
export class ZDialogImageComponent {
    @Input() ftp: boolean = false;
    @Input() url: string;
    @Input() datas: any;
    @Input() lien: string;
    @Input() lienExterne: boolean;
    @Input() colorClose: string;
    @Input() content: any;
    @Input() clickContent: boolean;

    @Output() outputClose: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() outputContent: EventEmitter<boolean> = new EventEmitter<boolean>();

    readonly FontAwesomeEnum = FontAwesomeEnum;

    constructor(public navigationService: NavigationService) {}

    close() {
        this.outputClose.emit(true);
    }
}
