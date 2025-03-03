import {Label} from "./utils/utils-model";
import {ProprieteModel} from "./utils/propriete-model";

export class TimbreCritereModel extends ProprieteModel {
	@Label("Année")
	annees: string[];

	@Label("Acquis")
	acquis: string;

	@Label("Doublon")
	doublon: string;

	getAnnees(): string[] {
		return this.annees;
	}

	setAnnees(value: string[]) {
		this.annees = value;
	}

	getAcquis(): string {
		return this.acquis;
	}

	setAcquis(value: string) {
		this.acquis = value;
	}

	getDoublon(): string {
		return this.doublon;
	}

	setDoublon(value: string) {
		this.doublon = value;
	}
}
