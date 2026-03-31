import {Label} from "./utils/utils-model";
import {ProprieteModel} from "./utils/propriete-model";
import {TimbreAcquisModel} from "./timbre-acquis.model";
import {TimbreBlocModel} from './timbre-bloc.model';
import {MonnaieEnum} from "../shared/enum/monnaie.enum";
import {UserModel} from "./user.model";
import {isNotNullOrUndefined, isNullOrUndefined} from "../shared/utils/utils";

export class TimbreModel extends ProprieteModel {
	@Label("Identifiant")
	id: number;

	@Label("Identifiant bloc")
	idBloc: number;

	@Label("Année")
	annee: number;

	@Label("Monnaie")
	monnaie: MonnaieEnum;

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

	@Label("Utilisateurs acquis")
	usersAcquis: string[] = [];

	@Label("Utilisateurs doublon")
	usersDoublon: string[] = [];

	constructor(id?: number, idBloc?: number, annee?: number, monnaie?: MonnaieEnum, type?: string, yt?: string, image?: string | File, imageTable?: string, imageZoom?: string, timbreAcquisModel?: TimbreAcquisModel, timbreBlocModel?: TimbreBlocModel, usersAcquis?: [], usersDoublon?: []) {
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
		this.usersAcquis = usersAcquis ? usersAcquis : null;
		this.usersDoublon = usersDoublon ? usersDoublon : null;
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

	getMonnaie(): MonnaieEnum {
		return this.monnaie;
	}

	setMonnaie(value: MonnaieEnum) {
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

	getImageBloc() {
		return "<img src='" + this.timbreBlocModel?.getImage() + "'/>";
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
