import {Label} from "./utils/utils-model";
import {ProprieteModel} from "./utils/propriete-model";
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

	@Label("Réference")
	yt: string;

	@Label("Image")
	image: string | File;

	@Label("Image zoom")
	imageZoom: string;

	@Label("Bloc")
	timbreBlocModel: TimbreBlocModel;

	@Label("Utilisateurs acquis")
	usersAcquis: string[] = [];

	@Label("Utilisateurs doublon")
	usersDoublon: string[] = [];

	@Label("Utilisateurs en cours acquisition")
	usersEnCoursAcquis: string[] = [];

	constructor(id?: number, idBloc?: number, annee?: number, monnaie?: MonnaieEnum, yt?: string, image?: string | File, imageZoom?: string, timbreBlocModel?: TimbreBlocModel, usersAcquis?: [], usersEnCoursAcquis?: [], usersDoublon?: []) {
		super();
		this.id = id ? id : null;
		this.idBloc = idBloc ? idBloc : null;
		this.annee = annee ? annee : null;
		this.monnaie = monnaie ? monnaie : null;
		this.yt = yt ? yt : null;
		this.image = image ? image : null;
		this.imageZoom = imageZoom ? imageZoom : null;
		this.timbreBlocModel = timbreBlocModel ? timbreBlocModel : null;
		this.usersAcquis = usersAcquis ? usersAcquis : null;
		this.usersDoublon = usersDoublon ? usersDoublon : null;
		this.usersEnCoursAcquis = usersEnCoursAcquis ? usersEnCoursAcquis : null;
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

	getImageZoom(): string {
		return this.imageZoom;
	}

	setImageZoom(value: string) {
		this.imageZoom = value;
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

	isEnCoursAcquis(user: UserModel): boolean {
		return isNotNullOrUndefined(this.getUsersEnCoursAcquis()?.find(userEnCoursAcquis => userEnCoursAcquis == user?.getId()));
	}

	addUserEnCoursAcquis(user: UserModel) {
		if (isNotNullOrUndefined(user)) {
			if (isNullOrUndefined(this.usersEnCoursAcquis)) {
				this.usersEnCoursAcquis = []
			}

			if (!this.isEnCoursAcquis(user)) {
				this.usersEnCoursAcquis.push(user?.getId());
			}
		}
	}

	removeUserEnCoursAcquis(user: UserModel) {
		if (isNotNullOrUndefined(this.usersEnCoursAcquis) && isNotNullOrUndefined(user)) {
			const findIndex: number = this.usersEnCoursAcquis.findIndex(userEnCoursAcquis => userEnCoursAcquis == user.getId());
			if (findIndex >= 0) {
				this.usersEnCoursAcquis.splice(findIndex, 1);
			}
		}
	}

	setUsersEnCoursAcquis(value: string[]) {
		this.usersEnCoursAcquis = value;
	}

	getUsersEnCoursAcquis(): string[] {
		return this.usersEnCoursAcquis;
	}
}
