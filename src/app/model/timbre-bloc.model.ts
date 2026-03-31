import { Label } from './utils/utils-model';
import { ProprieteModel } from './utils/propriete-model';
import {TimbreBlocAcquisModel} from "./timbre-bloc-acquis.model";
import {TypeTimbreEnum} from "../shared/enum/type-timbre.enum";
import {MonnaieEnum} from "../shared/enum/monnaie.enum";
import {TimbreModel} from "./timbre.model";
import {isNotNullOrUndefined, isNullOrUndefined} from "../shared/utils/utils";
import {UserModel} from "./user.model";

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

	@Label("Nombre de timbres acquis")
	nbTimbresAcquis: number;

	idOrigine: number;

	@Label("Timbres")
	timbres: TimbreModel[];

	@Label("Utilisateurs acquis")
	usersAcquis: string[] = [];

	@Label("Utilisateurs doublon")
	usersDoublon: string[] = [];

	constructor(id?: number, annee?: number, type?: TypeTimbreEnum, monnaie?: MonnaieEnum, image?: string | File, imageTable?: string, imageZoom?: string, yt?: string, timbreBlocAcquisModel?: TimbreBlocAcquisModel, nbTimbres?: number, nbTimbresAcquis?: number, usersAcquis?: [], usersDoublon?: []) {
		super();
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
		this.nbTimbresAcquis = nbTimbresAcquis ? nbTimbresAcquis : null;
		this.usersAcquis = usersAcquis ? usersAcquis : null;
		this.usersDoublon = usersDoublon ? usersDoublon : null;
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

	getNbTimbresAcquis(): number {
		return this.nbTimbresAcquis;
	}

	setNbTimbresAcquis(value: number) {
		this.nbTimbresAcquis = value;
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

	isAcquis(user: UserModel): boolean {
		return isNotNullOrUndefined(this.getUsersAcquis()?.find(userAcquis => userAcquis == user?.getId()));
	}

	addUserAcquis(user: UserModel) {
		if (isNotNullOrUndefined(user)) {
			if (isNullOrUndefined(this.usersAcquis)) {
				this.usersAcquis = []
			}

			if (!this.isAcquis(user)) {
				this.usersAcquis.push(user?.getId());
			}
		}
	}

	removeUserAcquis(user: UserModel) {
		if (isNotNullOrUndefined(this.usersAcquis) && isNotNullOrUndefined(user)) {
			const findIndex: number = this.usersAcquis.findIndex(userAcquis => userAcquis == user.getId());
			if (findIndex >= 0) {
				this.usersAcquis.splice(findIndex, 1);
			}
		}
	}

	setUsersAcquis(value: string[]) {
		this.usersAcquis = value;
	}

	getUsersAcquis(): string[] {
		return this.usersAcquis;
	}

	isDoublon(user: UserModel): boolean {
		return isNotNullOrUndefined(this.getUsersDoublon()?.find(userAcquis => userAcquis == user.getId()));
	}

	addUserDoublon(user: UserModel) {
		if (isNotNullOrUndefined(user)) {
			if (isNullOrUndefined(this.usersDoublon)) {
				this.usersDoublon = []
			}
			if (!this.isDoublon(user)) {
				this.usersDoublon.push(user.getId());
			}
		}
	}

	removeUserDoublon(user: UserModel) {
		if (isNotNullOrUndefined(this.usersDoublon) && isNotNullOrUndefined(user)) {
			const findIndex: number = this.usersDoublon.findIndex(userDoublon => userDoublon == user.getId());
			if (findIndex >= 0) {
				this.usersDoublon.splice(findIndex, 1);
			}
		}
	}

	setUsersDoublon(value: string[]) {
		this.usersDoublon = value;
	}

	getUsersDoublon(): string[] {
		return this.usersDoublon;
	}
}
