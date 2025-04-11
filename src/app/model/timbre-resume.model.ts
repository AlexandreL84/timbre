import {Label} from "./utils/utils-model";
import {ProprieteModel} from "./utils/propriete-model";

export class TimbreResumeModel extends ProprieteModel {
	@Label("Année")
	annee: number;

	@Label("Total")
	total: number;

	@Label("Nombre timbres")
	nombre: number;

	@Label("Total de timbres acquis")
	acquis: number;

	@Label("Total de timbres en doublon")
	doublon: number;

	@Label("Carnet")
	nombreCarnet: number;

	@Label("Timbres carnet")
	nombreTimbresCarnet: number;

	@Label("Total timbres carnet acquis")
	acquisTimbresCarnet: number;

	@Label("Total timbres carnet en doublon")
	doublonTimbresCarnet: number;

	@Label("Bloc")
	nombreBloc: number;

	@Label("Total bloc acquis")
	acquisBloc: number;

	@Label("Total bloc en doublon")
	doublonBloc: number;

	@Label("Timbres bloc")
	nombreTimbresBloc: number;

	@Label("Total timbres bloc acquis")
	acquisTimbresBloc: number;

	@Label("Total timbres bloc en doublon")
	doublonTimbresBloc: number;


	constructor(annee?: number, total?: number, nombre?: number, acquis?: number, doublon?: number, nombreCarnet?: number, nombreTimbresCarnet?: number, acquisTimbresCarnet?: number, doublonTimbresCarnet?: number, nombreBloc?: number, acquisBloc?: number, doublonBloc?: number, nombreTimbresBloc?: number, acquisTimbresBloc?: number, doublonTimbresBloc?: number) {
		super();
		this.annee = annee ? annee : null;
		this.total = total ? total : 0;
		this.nombre = nombre ? nombre : 0;
		this.acquis = acquis ? acquis : 0;
		this.doublon = doublon ? doublon : 0;
		this.nombreCarnet = nombreCarnet ? nombreCarnet : 0;
		this.nombreTimbresCarnet = nombreTimbresCarnet ? nombreTimbresCarnet : 0;
		this.acquisTimbresCarnet = acquisTimbresCarnet ? acquisTimbresCarnet : 0;
		this.doublonTimbresCarnet = doublonTimbresCarnet ? doublonTimbresCarnet : 0;
		this.nombreBloc = nombreBloc ? nombreBloc : 0;
		this.acquisBloc = acquisBloc ? acquisBloc : 0;
		this.doublonBloc = doublonBloc ? doublonBloc : 0;
		this.nombreTimbresBloc = nombreTimbresBloc ? nombreTimbresBloc : 0;
		this.acquisTimbresBloc = acquisTimbresBloc ? acquisTimbresBloc : 0;
		this.doublonTimbresBloc = doublonTimbresBloc ? doublonTimbresBloc : 0;

	}

	getAnnee(): number {
		return this.annee;
	}

	setAnnee(value: number) {
		this.annee = value;
	}

	getTotal(): number {
		return this.total;
	}

	setTotal(value: number) {
		this.total = value;
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

	getNombreTimbresCarnet(): number {
		return this.nombreTimbresCarnet;
	}

	setNombreTimbresCarnet(value: number) {
		this.nombreTimbresCarnet = value;
	}

	getAcquisTimbresCarnet(): number {
		return this.acquisTimbresCarnet;
	}

	setAcquisTimbresCarnet(value: number) {
		this.acquisTimbresCarnet = value;
	}

	getDoublonTimbresCarnet(): number {
		return this.doublonTimbresCarnet;
	}

	setDoublonTimbresCarnet(value: number) {
		this.doublonTimbresCarnet = value;
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

	getNombreTimbresBloc(): number {
		return this.nombreTimbresBloc;
	}

	setNombreTimbresBloc(value: number) {
		this.nombreTimbresBloc = value;
	}

	getAcquisTimbresBloc(): number {
		return this.acquisTimbresBloc;
	}

	setAcquisTimbresBloc(value: number) {
		this.acquisTimbresBloc = value;
	}

	getDoublonTimbresBloc(): number {
		return this.doublonTimbresBloc;
	}

	setDoublonTimbresBloc(value: number) {
		this.doublonTimbresBloc = value;
	}
}
