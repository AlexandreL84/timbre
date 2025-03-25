import { Label } from './utils/utils-model';
import { ProprieteModel } from './utils/propriete-model';
import {TimbreBlocAcquisModel} from "./timbre-bloc-acquis.model";

export class TimbreBlocModel extends ProprieteModel {
	@Label('Identifiant')
	id: number;

	@Label('Année')
	annee: number;

	@Label('Monnaie')
	monnaie: string;

	@Label('Image')
	image: string | File;

	@Label('Image tableau')
	imageTable: string;

	@Label('Image zoom')
	imageZoom: string;

	@Label("vérif")
	timbreBlocAcquisModel: TimbreBlocAcquisModel;


	constructor(id?: number, annee?: number, monnaie?: string, image?: string | File, imageTable?: string, imageZoom?: string,  timbreBlocAcquisModel?: TimbreBlocAcquisModel) {
		super();
		this.id = id ? id : null;
		this.annee = annee ? annee : null;
		this.monnaie = monnaie ? monnaie : null;
		this.image = image ? image : null;
		this.imageTable = imageTable ? imageTable : null;
		this.imageZoom = imageZoom ? imageZoom : null;
		this.timbreBlocAcquisModel = timbreBlocAcquisModel ? timbreBlocAcquisModel : null;
	}

	getId(): number {
		return this.id;
	}

	setId(value: number) {
		this.id = value;
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

	getTimbreBlocAcquisModel(): TimbreBlocAcquisModel {
		return this.timbreBlocAcquisModel;
	}

	setTimbreBlocAcquisModel(value: TimbreBlocAcquisModel) {
		this.timbreBlocAcquisModel = value;
	}
}
