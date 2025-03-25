import {Label} from "./utils/utils-model";
import {ProprieteModel} from "./utils/propriete-model";

export class TimbreBlocAcquisModel extends ProprieteModel {
	@Label("Identifiant Utilisateur")
	idUser: string;

	@Label("Identifiant bloc")
	idBloc: number;

	@Label("Acquis")
	acquis: boolean;

	@Label("Doublon")
	doublon: boolean;

	constructor(idUser?: string, idBloc?: number, acquis?: boolean, doublon?: boolean) {
		super();
		this.idUser = idUser ? idUser : null;
		this.idBloc = idBloc ? idBloc : null;
		this.acquis = acquis ? acquis : false;
		this.doublon = doublon ? doublon : false;
	}

	getIdUser(): string {
		return this.idUser;
	}

	setIdUser(value: string) {
		this.idUser = value;
	}

	getIdBloc(): number {
		return this.idBloc;
	}

	setIdBloc(value: number) {
		this.idBloc = value;
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
