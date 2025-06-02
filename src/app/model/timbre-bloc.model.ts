import { Label } from './utils/utils-model';
import { ProprieteModel } from './utils/propriete-model';
import {TimbreBlocAcquisModel} from "./timbre-bloc-acquis.model";
import {TypeTimbreEnum} from "../shared/enum/type-timbre.enum";
import {MonnaieEnum} from "../shared/enum/monnaie.enum";
import {TimbreModel} from "./timbre.model";
import {isNullOrUndefined} from "../shared/utils/utils";

export class TimbreBlocModel extends ProprieteModel {
	@Label('Identifiant')
	id: number;

	@Label('Année')
	annee: number;

	@Label("Type")
	type: TypeTimbreEnum;

	@Label('Monnaie')
	monnaie: MonnaieEnum;

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

	@Label("Timbres")
	timbres: TimbreModel[];


	constructor(id?: number, annee?: number, type?: TypeTimbreEnum, monnaie?: MonnaieEnum, image?: string | File, imageTable?: string, imageZoom?: string, yt?: string, timbreBlocAcquisModel?: TimbreBlocAcquisModel, nbTimbres?: number) {		super();
		this.id = id ? id : null;
		this.annee = annee ? annee : null;
		this.type = type ? type : null;
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

	getType(): TypeTimbreEnum {
		return this.type;
	}

	setType(value: TypeTimbreEnum) {
		this.type = value;
	}

	getMonnaie(): MonnaieEnum {
		return this.monnaie;
	}

	setMonnaie(value: MonnaieEnum) {
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

	getTimbres(): TimbreModel[] {
		return this.timbres;
	}

	setTimbres(value: TimbreModel[]) {
		this.timbres = value;
	}

	addTimbre(value: TimbreModel) {
		let timbres = this.getTimbres();
		if (isNullOrUndefined(timbres)) {
			timbres = [];
		}
		timbres.push(value);
		this.setTimbres(timbres);
	}
}
