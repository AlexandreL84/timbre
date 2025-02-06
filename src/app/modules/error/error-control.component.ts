import {Component, Input} from "@angular/core";
import {AbstractControl, AbstractControlDirective} from "@angular/forms";
import {ErrorEnum} from "../../enums/error.enum";

@Component({
    selector: "app-control-error",
    templateUrl: "./error-control.component.html",
    styleUrls: ["./error-control.component.scss"],
})
export class ErrorControlComponent {
    @Input() control: AbstractControlDirective | AbstractControl;
    @Input() attribut: string;
    @Input() needTouched = true;

    shouldShowErrors(): boolean {
        return this.control && this.control.errors && (this.needTouched ? this.control.touched : true);
    }

    listOfErrors(): string[] {
        const _errors = [];
        if (this.control.hasError("required")) {
            if (this.attribut === ErrorEnum.NUMTELEPHONE) {
                _errors.push("Le téléphone fixe ou portable est obligatoire.");
            } else {
                _errors.push("Ce champ est obligatoire");
            }
        } else {
            Object.keys(this.control.errors).map(field => {
                if (this.control.errors[field].message) {
                    _errors.push(this.control.errors[field].message);
                }
            });
        }
        return _errors;
    }
}
