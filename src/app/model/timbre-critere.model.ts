import {Label} from "./utils/utils-model";
import {ProprieteModel} from "./utils/propriete-model";

export class TimbreCritereModel extends ProprieteModel {
	@Label("Année")
	annees: number[];

	@Label("Acquis")
	acquis: string;

	@Label("Doublon")
	doublon: string;

	getAnnees(): number[] {
		return this.annees;
	}

	setAnnees(value: number[]) {
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
