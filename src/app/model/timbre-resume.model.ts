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

	@Label("Total carnet")
	nombreCarnet: number;

	@Label("Acquis")
	acquisCarnet: number;

	@Label("Doublon")
	doublonCarnet: number;

	@Label("Total bloc")
	nombreBloc: number;

	@Label("Acquis")
	acquisBloc: number;

	@Label("Doublon")
	doublonBloc: number;


	constructor(annee?: number, nombre?: number, acquis?: number, doublon?: number, nombreCarnet?: number, acquisCarnet?: number, doublonCarnet?: number, nombreBloc?: number, acquisBloc?: number, doublonBloc?: number) {
		super();
		this.annee = annee ? annee : null;
		this.nombre = nombre ? nombre : 0;
		this.acquis = acquis ? acquis : 0;
		this.doublon = doublon ? doublon : 0;
		this.nombreCarnet = nombreCarnet ? nombreCarnet : 0;
		this.acquisCarnet = acquisCarnet ? acquisCarnet : 0;
		this.doublonCarnet = doublonCarnet ? doublonCarnet : 0;
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

	getNombreCarnet(): number {
		return this.nombreCarnet;
	}

	setNombreCarnet(value: number) {
		this.nombreCarnet = value;
	}

	getAcquisCarnet(): number {
		return this.acquisCarnet;
	}

	setAcquisCarnet(value: number) {
		this.acquisCarnet = value;
	}

	getDoublonCarnet(): number {
		return this.doublonCarnet;
	}

	setDoublonCarnet(value: number) {
		this.doublonCarnet = value;
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
