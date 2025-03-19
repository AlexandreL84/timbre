import {Label} from "./utils/utils-model";
import {ProprieteModel} from "./utils/propriete-model";
import {TimbreAcquisModel} from "./timbre-acquis.model";

export class TimbreModel extends ProprieteModel {
	@Label("Identifiant")
	id: number;

	@Label("Identifiant bloc")
	idBloc: string;

	@Label("Code")
	code: string;

	@Label("Année")
	annee: number;

	@Label("Monnaie")
	monnaie: string;

	@Label("Type")
	type: string;

	@Label("Réference Yvert Tellier")
	yt: string;

	@Label("Image")
	image: string | File;

	@Label("Image tableau")
	imageTable: string;

	@Label("Image zoom")
	imageZoom: string;

	@Label("vérif")
	timbreAcquisModel: TimbreAcquisModel;


	constructor(id?: number, idBloc?: string, code?: string, annee?: number, monnaie?: string, type?: string, yt?: string, image?: string | File, imageTable?: string, imageZoom?: string, timbreAcquisModel?: TimbreAcquisModel) {
		super();
		this.id = id ? id : null;
		this.idBloc = idBloc ? idBloc : null;
		this.code = code ? code : null;
		this.annee = annee ? annee : null;
		this.monnaie = monnaie ? monnaie : null;
		this.type = type ? type : null;
		this.yt = yt ? yt : null;
		this.image = image ? image : null;
		this.imageTable = imageTable ? imageTable : null;
		this.imageZoom = imageZoom ? imageZoom : null;
		this.timbreAcquisModel = timbreAcquisModel ? timbreAcquisModel : null;
	}

	getId(): number {
		return this.id;
	}

	setId(value: number) {
		this.id = value;
	}

	getIdBloc(): string {
		return this.idBloc;
	}

	setIdBloc(value: string) {
		this.idBloc = value;
	}

	getCode(): string {
		return this.code;
	}

	setCode(value: string) {
		this.code = value;
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
}
