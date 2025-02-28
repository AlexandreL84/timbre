import {Label} from "./utils/utils-model";
import {ProprieteModel} from "./utils/propriete-model";

export class TimbreAcquisModel extends ProprieteModel {
	@Label("Identifiant Utilisateur")
	idUser: string;

	@Label("Identifiant timbre")
	idTimbre: number;

	@Label("Acquis")
	acquis: boolean;

	@Label("Doublon")
	doublon: boolean;

	constructor(idUser?: string, idTimbre?: number, acquis?: boolean, doublon?: boolean) {
		super();
		this.idUser = idUser ? idUser : null;
		this.idTimbre = idTimbre ? idTimbre : null;
		this.acquis = acquis ? acquis : false;
		this.doublon = doublon ? doublon : false;
	}

	getIdUser(): string {
		return this.idUser;
	}

	setIdUser(value: string) {
		this.idUser = value;
	}

	getIdTimbre(): number {
		return this.idTimbre;
	}

	setIdTimbre(value: number) {
		this.idTimbre = value;
	}

	isAcquis(): boolean {
		return this.acquis;
	}

	setAcquis(value: boolean) {
		this.acquis = value;
	}

	isDoublon(): boolean {
		return this.doublon;
	}

	setDoublon(value: boolean) {
		this.doublon = value;
	}
}
