import {NG_VALIDATORS, UntypedFormControl, ValidationErrors, Validator} from "@angular/forms";
import {Directive, Input, OnChanges, SimpleChanges} from "@angular/core";
import {isNotNullOrUndefined, isUndefined} from "../../utils/utils";

@Directive({
    selector: "[zMax][formControlName],[zMax][formControl],[zMax][ngModel]",
    providers: [{provide: NG_VALIDATORS, useExisting: MaxDirective, multi: true}],
})
export class MaxDirective implements Validator, OnChanges {
    @Input() labelError: string;
    @Input() set zMax(max: number | string) {
        this.max = max;
    }

    max: number | string;

    validate(c: UntypedFormControl): ValidationErrors {
        if (!isUndefined(c.value)) {
            const maxValue = Number(c.value);
            if (isNotNullOrUndefined(this.max)) {
                const isValid = maxValue <= +this.max;
                const message = {
                    zMax: {
                        message: (isNotNullOrUndefined(this.labelError) ? this.labelError : "Ce champ") + " doit être inférieur ou égal à " + this.max,
                    },
                };
                return isValid ? null : message;
            }
        }
        return null;
    }

    registerOnValidatorChange(fn: () => void): void {
        this._onChange = fn;
    }

    private _onChange: () => void;

    ngOnChanges(changes: SimpleChanges) {
        if ("zMax" in changes) {
            if (this._onChange) this._onChange();
        }
    }
}
