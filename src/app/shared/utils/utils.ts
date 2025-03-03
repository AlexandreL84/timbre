export const isNotNullOrUndefined = input => input !== null && input !== undefined && input != "undefined";
export const isNullOrUndefined = input => input == null || input == undefined;
export const isUndefined = input => input == undefined;
export const isNumber = valeur => typeof valeur == "number";
export const isString = valeur => typeof valeur == "string" || valeur instanceof String;
export function isObject(val: any) {
  if (val === null) return false;
  return typeof val === "function" || typeof val === "object";
}


export class Utils {
		static isTypeDate(value: any): boolean {
		if (isNotNullOrUndefined(value) && value.toString() == "Invalid Date") {
			return false;
		}
		if (value instanceof Date) {
			if (isNaN(value.getTime())) {
				return false;
			}
			return true;
		}
		if (new Date(value).getTime()) {
			return true;
		}
		return false;
	}

	static getRandom(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}

	static generateRange(min: number, max: number): number[] {
		return Array.from({ length: max - min + 1 }, (_, i) => i + min);
	}
}
