import {NG_VALIDATORS, UntypedFormControl, ValidationErrors, Validator} from "@angular/forms";
import {Directive, Input, OnChanges, SimpleChanges} from "@angular/core";
import {isNullOrUndefined} from "../../../utils/cleva-utils";
import {Utils} from "../../../utils/utils";

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
            case "immatriculation":
                isValid = /^[a-zA-Z]{2}-\d{3}-[a-zA-Z]{2}$|^\d{1,4}[A-Za-z]{1,3}(\d{2}|97\d|2[A-Ba-b])$/.test(c.value);
                msg = "Le format incorrect exemple: AA-123-BB";
                break;
            case "immatriculationZCyclo":
                isValid = /^[a-zA-Z]{1,2}\d{2,3}[a-zA-Z]{1,2}$|^[a-zA-Z]{2}-\d{3}-[a-zA-Z]{2}$|^\d{1,4}[A-Za-z]{1,3}(\d{2}|97\d|2[A-Ba-b])$/.test(c.value);
                msg = "Le format incorrect exemple: AA-123-BB ou AA-123-A";
                break;
            case "immatriculationMultiple":
                isValid = /^[a-zA-Z]{2}-\d{3}-[a-zA-Z]{2}$|^\d{1,4}[A-Za-z]{1,3}(\d{2}|97\d|2[A-Ba-b])$/.test(c.value);
                if (!isValid) {
                    isValid = /^[a-zA-Z]{1,2}\d{2,3}[a-zA-Z]{1,2}$|^[a-zA-Z]{2}-\d{3}-[a-zA-Z]{2}$|^\d{1,4}[A-Za-z]{1,3}(\d{2}|97\d|2[A-Ba-b])$/.test(c.value);
                }
                msg = "Le format incorrect exemple: AA-123-BB ou AA-123-BB ou AA-123-A";
                break;
            case "mail":
                isValid = /^[a-z0-9._%+-]+@[a-z0-9._-]+\.[a-z]{2,}$/.test(c.value);
                msg = "Le format du mail est incorrect";
                break;
            case "mailList":
                isValid = /^([a-z0-9._%+-]+@[a-z0-9._-]+\.[a-z]{2,})(;[a-z0-9._%+-]+@[a-z0-9._-]+\.[a-z]{2,})*$/.test(c.value);
                msg = 'Le format des mails est incorrect. Pensez à séparer les adresses mail avec ";"';
                break;
            case "codePostal":
                isValid = /[0-9]{5}/.test(c.value);
                msg = "Le code postal est incorrect";
                break;
            case "siren":
                isValid = /[0-9]{9}/.test(c.value);
                msg = "Le format du siren  est incorrect";
                break;
            case "siret":
                isValid = /[0-9]{14}/.test(c.value);
                msg = "Le format du siret est incorrect";
                break;
            case "sirenSiret":
                isValid = RegExp("^" + this.valueOfRegex).test(c.value);
                msg = "Le siren doit être égal au 9 premier caractères du siret";
                break;
            case "website":
                isValid = /[w]{3}[.][a-zA-Z0-9-_]+[.][a-zA-Z0-9-]{2,}$/.test(c.value);
                msg = "Le format du site web est incorrect";
                break;
            case "crm":
                isValid = /^\d$|^\d[,\.]\d{1,2}$/.test(c.value);
                msg = "Le format du crm est incorrect";
                break;
            case "pFiscaleCamping":
                isValid = /^[1-9][0-9]?$|^40$/.test(c.value);
                msg = "La puissance fiscale doit être comprise entre 1 et 40";
                break;
            case "securiteSoc":
                isValid = RegExp("^" + this.valueOfRegex).test(c.value);
                msg = "Le format de votre numéro de sécurité sociale est incorrect";
                break;
            case "JJMM":
                isValid = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])$/.test(c.value);
                msg = "Format attendue (JJMM)";
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
