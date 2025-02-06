import {Pipe, PipeTransform} from "@angular/core";
import {isNotNullOrUndefined} from "../utils";
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
    name: "reduireChaine",
})
export class ReduireChainePipe implements PipeTransform {
    constructor(private _sanitizer: DomSanitizer) {}

    transform(value: string, nbCaractere = 25, completeWords = false, ellipsis = "...") {
        if (isNotNullOrUndefined(value)) {
            let message: string = value;
            if (value.length > nbCaractere) {
                if (completeWords) {
                    nbCaractere = value.substr(0, nbCaractere).lastIndexOf(" ");
                }
                message = value.length > nbCaractere ? value.substr(0, nbCaractere) + ellipsis : value;
            }
            return this._sanitizer.bypassSecurityTrustHtml(message);
        }
        return value;
    }
}
