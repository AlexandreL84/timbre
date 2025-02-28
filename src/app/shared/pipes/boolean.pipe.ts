import {Pipe, PipeTransform} from "@angular/core";
import {isNotNullOrUndefined, isNumber, isString} from "../utils/utils";

@Pipe({
    name: "boolean",
})
export class BooleanPipe implements PipeTransform {
    transform(value: boolean | number | string, args?: any): any {
        if (
            (isNumber(value) && value == 1) ||
            (isString(value) &&
                (value?.toString()?.toUpperCase() == "1" ||
                    value?.toString()?.toUpperCase() == "TRUE" ||
                    value?.toString()?.toUpperCase() == "OUI" ||
                    (args == "all" && isNotNullOrUndefined(value)))) ||
            (!isNumber(value) && !isString(value) && value === true)
        ) {
            return "Oui";
        } else {
            return "Non";
        }
    }
}
