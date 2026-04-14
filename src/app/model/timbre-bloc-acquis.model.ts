export class TimbreBlocAcquisModel {
	idUser: string;
	nbAcquis: number;
	nbDoublon: number;

	constructor(idUser?: string, nbAcquis?: number, nbDoublon?: number) {
		this.idUser = idUser ? idUser : null;
		this.nbAcquis = nbAcquis ? nbAcquis : 0;
		this.nbDoublon = nbDoublon ? nbDoublon : 0;
	}

	getIdUser(): string {
		return this.idUser;
	}

	setIdUser(value: string) {
		this.idUser = value;
	}

	getNbAcquis(): number {
		return this.nbAcquis;
	}

	setNbAcquis(value: number) {
		this.nbAcquis = value;
	}

	getNbDoublon(): number {
		return this.nbDoublon;
	}

	setNbDoublon(value: number) {
		this.nbDoublon = value;
	}
}
