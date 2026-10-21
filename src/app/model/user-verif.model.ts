import {Label} from "./utils/utils-model";
import {ProprieteModel} from "./utils/propriete-model";

export class UserVerifModel extends ProprieteModel {
	@Label("Identifiant")
	id: string;

	@Label("Ok")
	ok: boolean;

	constructor(id?: string, ok?: boolean) {
		super();
		this.id = id ? id : null;
		this.ok = ok ? ok : false;
	}

	getId(): string {
		return this.id;
	}

	setId(value: string) {
		this.id = value;
	}

	isOK(): boolean {
		return this.ok;
	}

	setOk(value: boolean) {
		this.ok = value;
	}
}
