import {Label} from "./utils/utils-model";
import {ProprieteModel} from "./utils/propriete-model";
import {UserModel} from "./user.model";
import {TypeTimbreEnum} from "../shared/enum/type-timbre.enum";

export class TimbreCritereModel extends ProprieteModel {
	@Label("Année")
	annees: number[];

	@Label("Acquis")
	acquis: string;

	@Label("Doublon")
	doublon: string;

	@Label("Ident bloc")
	idBloc: number;

	@Label("Type")
	type: TypeTimbreEnum[];

	@Label("User")
	user: UserModel;

	sort: string;

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

	getUser(): UserModel {
		return this.user;
	}

	setUser(value: UserModel) {
		this.user = value;
	}

	getType(): TypeTimbreEnum[] {
		return this.type;
	}

	setType(value: TypeTimbreEnum[]) {
		this.type = value;
	}

	getSort(): string {
		return this.sort;
	}

	setSort(value: string) {
		this.sort = value;
	}

	initCritere() {
		this.setType([TypeTimbreEnum.TIMBRE, TypeTimbreEnum.CARNET, TypeTimbreEnum.BLOC]);
	}

	initCritereBloc() {
		this.setType([TypeTimbreEnum.CARNET, TypeTimbreEnum.BLOC]);
	}
}
