import {Label} from "./utils/utils-model";
import {ProprieteModel} from "./utils/propriete-model";
import {UserModel} from "./user.model";

export class TimbreCritereModel extends ProprieteModel {
	@Label("Année")
	annees: number[];

	@Label("Acquis")
	acquis: string;

	@Label("Doublon")
	doublon: string;

	@Label("Ident bloc")
	idBloc: number;

	@Label("Bloc")
	bloc: string;

	@Label("Carnet")
	carnet: string;

	@Label("User")
	user: UserModel;

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

	getIdBloc(): number {
		return this.idBloc;
	}

	setIdBloc(value: number) {
		this.idBloc = value;
	}

	getCarnet(): string {
		return this.carnet;
	}

	setCarnet(value: string) {
		this.carnet = value;
	}

	getBloc(): string {
		return this.bloc;
	}

	setBloc(value: string) {
		this.bloc = value;
	}

	getUser(): UserModel {
		return this.user;
	}

	setUser(value: UserModel) {
		this.user = value;
	}
}
