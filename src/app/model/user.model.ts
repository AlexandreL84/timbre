import {Label} from "./utils/utils-model";
import {ProprieteModel} from "./utils/propriete-model";

export class UserModel extends ProprieteModel {
	@Label("Identifiant")
	id: string;

	@Label("Nom")
	nom: string;

	@Label("Prénom")
	prenom: string;

	@Label("Droit")
	droit: number;

	constructor(id?: string,nom?: string, prenom?: string, droit?: number) {
		super();
		this.id = id ? id : null;
		this.nom = nom ? nom : null;
		this.prenom = prenom ? prenom : null;
		this.droit = droit ? droit : null;
	}

	getId(): string {
		return this.id;
	}

	setId(value: string) {
		this.id = value;
	}

	getNom(): string {
		return this.nom;
	}

	setNom(value: string) {
		this.nom = value;
	}

	getPrenom(): string {
		return this.prenom;
	}

	setPrenom(value: string) {
		this.prenom = value;
	}

	getDroit(): number {
		return this.droit;
	}

	setDroit(value: number) {
		this.droit = value;
	}
}
