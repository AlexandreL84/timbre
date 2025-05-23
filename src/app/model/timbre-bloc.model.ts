import { Label } from './utils/utils-model';
import { ProprieteModel } from './utils/propriete-model';
import {TimbreBlocAcquisModel} from "./timbre-bloc-acquis.model";

export class TimbreBlocModel extends ProprieteModel {
	@Label('Identifiant')
	id: number;

	@Label('Année')
	annee: number;

	@Label('Carnet')
	carnet: boolean;

	@Label('Monnaie')
	monnaie: string;

	@Label('Image')
	image: string | File;

	@Label('Image tableau')
	imageTable: string;

	@Label('Image zoom')
	imageZoom: string;

	@Label("Réference")
	yt: string;

	@Label("vérif")
	timbreBlocAcquisModel: TimbreBlocAcquisModel;

	@Label("Nombre de timbres")
	nbTimbres: number;

	idOrigine: number;


	constructor(id?: number, annee?: number, carnet?: boolean, monnaie?: string, image?: string | File, imageTable?: string, imageZoom?: string, yt?: string, timbreBlocAcquisModel?: TimbreBlocAcquisModel, nbTimbres?: number) {		super();
		this.id = id ? id : null;
		this.annee = annee ? annee : null;
		this.carnet = carnet ? carnet : false;
		this.monnaie = monnaie ? monnaie : null;
		this.image = image ? image : null;
		this.imageTable = imageTable ? imageTable : null;
		this.imageZoom = imageZoom ? imageZoom : null;
		this.yt = yt ? yt : null;
		this.timbreBlocAcquisModel = timbreBlocAcquisModel ? timbreBlocAcquisModel : null;
		this.nbTimbres = nbTimbres ? nbTimbres : null;
	}

	getId(): number {
		return this.id;
	}

	setId(value: number) {
		this.id = value;
	}

	getIdOrigine(): number {
		return this.idOrigine;
	}

	setIdOrigine(value: number) {
		this.idOrigine = value;
	}

	getAnnee(): number {
		return this.annee;
	}

	setAnnee(value: number) {
		this.annee = value;
	}

	isCarnet(): boolean {
		return this.carnet;
	}

	setCarnet(value: boolean) {
		this.carnet = value;
	}

	getMonnaie(): string {
		return this.monnaie;
	}

	setMonnaie(value: string) {
		this.monnaie = value;
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

	getYt(): string {
		return this.yt;
	}

	setYt(value: string) {
		this.yt = value;
	}

	getTimbreBlocAcquisModel(): TimbreBlocAcquisModel {
		return this.timbreBlocAcquisModel;
	}

	setTimbreBlocAcquisModel(value: TimbreBlocAcquisModel) {
		this.timbreBlocAcquisModel = value;
	}

	getNbTimbres(): number {
		return this.nbTimbres;
	}

	setNbTimbres(value: number) {
		this.nbTimbres = value;
	}
}
