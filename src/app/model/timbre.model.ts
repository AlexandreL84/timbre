import {Label} from "./utils/utils-model";
import {ProprieteModel} from "./utils/propriete-model";
import {TimbreAcquisModel} from "./timbre-acquis.model";
import {TimbreBlocModel} from './timbre-bloc.model';

export class TimbreModel extends ProprieteModel {
	@Label("Identifiant")
	id: number;

	@Label("Identifiant bloc")
	idBloc: number;

	@Label("Année")
	annee: number;

	@Label("Monnaie")
	monnaie: string;

	@Label("Type")
	type: string;

	@Label("Réference")
	yt: string;

	@Label("Image")
	image: string | File;

	@Label("Image tableau")
	imageTable: string;

	@Label("Image zoom")
	imageZoom: string;

	@Label("vérif")
	timbreAcquisModel: TimbreAcquisModel;

	@Label("Bloc")
	timbreBlocModel: TimbreBlocModel;


	constructor(id?: number, idBloc?: number, annee?: number, monnaie?: string, type?: string, yt?: string, image?: string | File, imageTable?: string, imageZoom?: string, timbreAcquisModel?: TimbreAcquisModel, timbreBlocModel?: TimbreBlocModel) {
		super();
		this.id = id ? id : null;
		this.idBloc = idBloc ? idBloc : null;
		this.annee = annee ? annee : null;
		this.monnaie = monnaie ? monnaie : null;
		this.type = type ? type : null;
		this.yt = yt ? yt : null;
		this.image = image ? image : null;
		this.imageTable = imageTable ? imageTable : null;
		this.imageZoom = imageZoom ? imageZoom : null;
		this.timbreAcquisModel = timbreAcquisModel ? timbreAcquisModel : null;
		this.timbreBlocModel = timbreBlocModel ? timbreBlocModel : null;
	}

	getId(): number {
		return this.id;
	}

	setId(value: number) {
		this.id = value;
	}

	getIdBloc(): number {
		return this.idBloc;
	}

	setIdBloc(value: number) {
		this.idBloc = value;
	}

	getAnnee(): number {
		return this.annee;
	}

	setAnnee(value: number) {
		this.annee = value;
	}


	getMonnaie(): string {
		return this.monnaie;
	}

	setMonnaie(value: string) {
		this.monnaie = value;
	}

	getType(): string {
		return this.type;
	}

	setType(value: string) {
		this.type = value;
	}

	getYt(): string {
		return this.yt;
	}

	setYt(value: string) {
		this.yt = value;
	}

	getImage(): string | File {
		return this.image;
	}

	setImage(value: string | File) {
		this.image = value;
	}

	getImageTable(): string {
		return this.imageTable;
	}

	setImageTable(value: string) {
		this.imageTable = value;
	}

	getImageZoom(): string {
		return this.imageZoom;
	}

	setImageZoom(value: string) {
		this.imageZoom = value;
	}

	getTimbreAcquisModel(): TimbreAcquisModel {
		return this.timbreAcquisModel;
	}

	setTimbreAcquisModel(value: TimbreAcquisModel) {
		this.timbreAcquisModel = value;
	}

	getTimbreBlocModel(): TimbreBlocModel {
		return this.timbreBlocModel;
	}

	setTimbreBlocModel(value: TimbreBlocModel) {
		this.timbreBlocModel = value;
	}
}
