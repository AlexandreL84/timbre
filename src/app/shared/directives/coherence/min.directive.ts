import {NG_VALIDATORS, UntypedFormControl, ValidationErrors, Validator} from "@angular/forms";
import {Directive, Input, OnChanges, SimpleChanges} from "@angular/core";
import {isNotNullOrUndefined, isUndefined} from "../../utils/utils";

@Directive({
    selector: "[zMin][formControlName],[zMin][formControl],[zMin][ngModel]",
    providers: [{provide: NG_VALIDATORS, useExisting: MinDirective, multi: true}],
})
export class MinDirective implements Validator, OnChanges {
    @Input() labelError: string;
	@Input() set zMin(min: number | string) {
		this.min = min;
	}
c
	min: number | string;

    validate(c: UntypedFormControl): ValidationErrors {
        if (!isUndefined(c.value)) {
            const minValue = Number(c.value);
            if (isNotNullOrUndefined(this.min)) {
                const isValid = minValue >= Number(this.min);
                const message = {
                    zMin: {
                        message: (isNotNullOrUndefined(this.labelError) ? this.labelError : "Ce champ") + " doit être supérieur ou égal à " + this.min,
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
        if ("zMin" in changes) {
            if (this._onChange) this._onChange();
        }
    }
}
