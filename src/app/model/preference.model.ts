import {Label} from './utils/utils-model';
import {ProprieteModel} from './utils/propriete-model';

export class PreferenceModel extends ProprieteModel {
	@Label('Ident Utilisateur')
	idUser: string;

	@Label('Key')
	key: any;

	@Label('Value')
	value: string;

	constructor(key?: string, value?: any, idUser?: string) {
		super()
		this.key = key ? key : null;
		this.value = value ? value : null;;
		this.idUser = idUser ? idUser : null;
	}

	getIdUser(): string {
		return this.idUser;
	}

	setIdUser(value: string) {
		this.idUser = value;
	}

	getKey(): any {
		return this.key;
	}

	setKey(value: any) {
		this.key = value;
	}

	getValue(): string {
		return this.value;
	}

	setValue(value: string) {
		this.value = value;
	}
}
