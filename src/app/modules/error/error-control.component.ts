import {Component, Input} from "@angular/core";
import {AbstractControl, AbstractControlDirective} from "@angular/forms";

@Component({
	selector: "app-control-error",
	templateUrl: "./error-control.component.html",
})
export class ErrorControlComponent {
	@Input() control: AbstractControlDirective | AbstractControl;
	@Input() attribut: string;
	@Input() needTouched = true;

	listOfErrors(): string[] {
		const _errors = [];
		if (this.control.hasError("required")) {
			_errors.push("Ce champ est obligatoire");
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
