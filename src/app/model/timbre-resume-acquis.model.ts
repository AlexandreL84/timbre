export class TimbreResumeAcquisModel {
	idUser: string;
	nbAcquis: number;
	nbDoublon: number;
	nbTimbresAcquis: number;
	nbTimbresDoublon: number;

	constructor(idUser?: string, nbAcquis?: number, nbDoublon?: number, nbTimbresAcquis?: number, nbTimbresDoublon?: number) {
		this.idUser = idUser ? idUser : null;
		this.nbAcquis = nbAcquis ? nbAcquis : 0;
		this.nbDoublon = nbDoublon ? nbDoublon : 0;
		this.nbTimbresAcquis = nbTimbresAcquis ? nbTimbresAcquis : 0;
		this.nbTimbresDoublon = nbTimbresDoublon ? nbTimbresDoublon : 0;
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

	getNbTimbresAcquis(): number {
		return this.nbTimbresAcquis;
	}

	setNbTimbresAcquis(value: number) {
		this.nbTimbresAcquis = value;
	}

	getNbTimbresDoublon(): number {
		return this.nbTimbresDoublon;
	}

	setNbTimbresDoublon(value: number) {
		this.nbTimbresDoublon = value;
	}
}
