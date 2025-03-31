import {Label} from "./utils/utils-model";
import {ProprieteModel} from "./utils/propriete-model";

export class TimbreResumeModel extends ProprieteModel {
	@Label("Année")
	annee: number;

	@Label("Total")
	nombre: number;

	@Label("Acquis")
	acquis: number;

	@Label("Doublon")
	doublon: number;

	@Label("Total bloc")
	nombreBloc: number;

	@Label("Acquis")
	acquisBloc: number;

	@Label("Doublon")
	doublonBloc: number;


	constructor(annee?: number, nombre?: number, acquis?: number, doublon?: number, nombreBloc?: number, acquisBloc?: number, doublonBloc?: number ) {
		super();
		this.annee = annee ? annee : null;
		this.nombre = nombre ? nombre : 0;
		this.acquis = acquis ? acquis : 0;
		this.doublon = doublon ? doublon : 0;
		this.nombreBloc = nombreBloc ? nombreBloc : 0;
		this.acquisBloc = acquisBloc ? acquisBloc : 0;
		this.doublonBloc = doublonBloc ? doublonBloc : 0;

	}

	getAnnee(): number {
		return this.annee;
	}

	setAnnee(value: number) {
		this.annee = value;
	}

	getNombre(): number {
		return this.nombre;
	}

	setNombre(value: number) {
		this.nombre = value;
	}

	getAcquis(): number {
		return this.acquis;
	}

	setAcquis(value: number) {
		this.acquis = value;
	}

	getDoublon(): number {
		return this.doublon;
	}

	setDoublon(value: number) {
		this.doublon = value;
	}

	getNombreBloc(): number {
		return this.nombreBloc;
	}

	setNombreBloc(value: number) {
		this.nombreBloc = value;
	}

	getAcquisBloc(): number {
		return this.acquisBloc;
	}

	setAcquisBloc(value: number) {
		this.acquisBloc = value;
	}

	getDoublonBloc(): number {
		return this.doublonBloc;
	}

	setDoublonBloc(value: number) {
		this.doublonBloc = value;
	}
}
