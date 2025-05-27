import {Pipe, PipeTransform} from "@angular/core";
import {isNotNullOrUndefined} from "../utils/utils";
@Pipe({
    name: "capitalize",
})
export class CapitalizePipe implements PipeTransform {
    transform(value: string, args?: any): any {
        if (isNotNullOrUndefined(value) && typeof value === "string") {
            value = value.toLowerCase();
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return value;
    }
}
