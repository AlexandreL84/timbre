import {NG_VALIDATORS, UntypedFormControl, ValidationErrors, Validator} from "@angular/forms";
import {Directive, Input, OnChanges, SimpleChanges} from "@angular/core";
import {isNullOrUndefined, Utils} from "../utils/utils";

@Directive({
    selector: "[format][formControlName],[format][formControl],[format][ngModel]",
    providers: [{provide: NG_VALIDATORS, useExisting: FormatDirective, multi: true}],
})
export class FormatDirective implements Validator, OnChanges {
    @Input() format: string;
    @Input() valueOfRegex: string;

    private _onChange: () => void;

    validate(c: UntypedFormControl): ValidationErrors {
        let isValid = false;
        let msg = "Format inconnu";

        if (isNullOrUndefined(c.value) || c.value == "" || isNullOrUndefined(this.format) || this.format == "") {
            return null;
        }

        switch (this.format) {
            case "date":
                if (Utils.isTypeDate(c.value)) {
                    isValid = true;
                } else {
                    isValid = /(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d/.test(c.value);
                }
                msg = "Le format de cette date est incorrect, format attendu : DD/MM/YYYY";
                break;
            case "alfa_numeric":
                isValid = /^[a-zA-Z0-9-]*$/.test(c.value);
                msg = "Le format est incorrect, format attendu : valeur alphanumérique";
                break;
            case "numeric":
                isValid = /^[[0-9]|[-][0-9]*$/.test(c.value);
                msg = "Le format est incorrect, format attendu : valeur numérique";
                break;
            case "entier":
                isValid = /^[0-9]*$/.test(c.value);
                msg = "Le format est incorrect, format attendu : valeur entier";
                break;
            case "pourcent":
                isValid = /^[0-9]$|^[1-9][0-9]$|^(100)$/.test(c.value);
                msg = "Le format est incorrect, format attendu : pourcentage";
                break;
            case "phone":
                isValid = /^[0]{1}[0-9]{9}$/.test(c.value);
                msg = "Le format de ce numéro de téléphone est incorrect";
                break;
            case "phoneFixe":
                //isValid = /^[0]{1}[1-5|8|9]{1}[-]\d{2}-\d{2}-\d{2}-\d{2}$/.test(c.value);
                isValid = /^[0]{1}[1-5|8|9]{1}[0-9]{8}$/.test(c.value);
                msg = "Le format est incorrect";
                break;
            case "phoneMobile":
                //isValid = /^[0]{1}[6|7]{1}[-]\d{2}-\d{2}-\d{2}-\d{2}$/.test(c.value);
                isValid = /^[0]{1}[6|7]{1}[0-9]{8}$/.test(c.value);
                msg = "Le format est incorrect";
                break;
            case "mail":
                isValid = /^[a-z0-9._%+-]+@[a-z0-9._-]+\.[a-z]{2,}$/.test(c.value);
                msg = "Le format du mail est incorrect";
                break;
        }
        const message = {
            format: {
                message: msg,
            },
        };
        return isValid ? null : message;
    }

    registerOnValidatorChange(fn: () => void): void {
        this._onChange = fn;
    }

    ngOnChanges(changes: SimpleChanges) {
        if ("valueOfRegex" in changes) {
            if (this._onChange) this._onChange();
        }
    }
}
