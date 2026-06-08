import {Label} from './utils/utils-model';
import {Type} from 'class-transformer';
import {ProprieteModel} from './utils/propriete-model';
import {TypeTimbreEnum} from "../shared/enum/type-timbre.enum";
import {MonnaieEnum} from "../shared/enum/monnaie.enum";
import {TimbreModel} from "./timbre.model";
import {isNotNullOrUndefined, isNullOrUndefined} from "../shared/utils/utils";
import {UserModel} from "./user.model";
import {TimbreBlocAcquisModel} from "./timbre-bloc-acquis.model";

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

	@Label('Image zoom')
	imageZoom: string;

	@Label("Réference")
	yt: string;

	@Label("Nombre de timbres")
	nbTimbres: number;

	idOrigine: number;

	@Label("Timbres")
	timbres: TimbreModel[];

	@Label("Acquis")
	usersAcquis: string[] = [];

	@Label("Doublon")
	usersDoublon: string[] = [];

	@Label("Utilisateurs en cours acquisition")
	usersEnCoursAcquis: string[] = [];

	@Label("Nombre de timbres")
	@Type(() => TimbreBlocAcquisModel)
	nbTimbresAcquisByUser: TimbreBlocAcquisModel[];

	constructor(id?: number, annee?: number, type?: TypeTimbreEnum, monnaie?: MonnaieEnum, image?: string | File, imageZoom?: string, yt?: string, nbTimbres?: number, usersAcquis?: [], usersDoublon?: [], usersEnCoursAcquis?: [], nbTimbresAcquisByUser?: TimbreBlocAcquisModel[]) {
		super();
		this.id = id ? id : null;
		this.annee = annee ? annee : null;
		this.type = type ? type : null;
		this.monnaie = monnaie ? monnaie : null;
		this.image = image ? image : null;
		this.imageZoom = imageZoom ? imageZoom : null;
		this.yt = yt ? yt : null;
		this.nbTimbres = nbTimbres ? nbTimbres : null;
		this.usersAcquis = usersAcquis ? usersAcquis : null;
		this.usersDoublon = usersDoublon ? usersDoublon : null;
		this.nbTimbresAcquisByUser = nbTimbresAcquisByUser ? nbTimbresAcquisByUser : null;
		this.usersEnCoursAcquis = usersEnCoursAcquis ? usersEnCoursAcquis : null;
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

	isAcquis(user: UserModel): boolean {
		return isNotNullOrUndefined(this.getUsersAcquis()?.find(u => u == user?.getId()));
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
		return isNotNullOrUndefined(this.getUsersDoublon()?.find(u => u == user?.getId()));
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

	getNbTimbresAcquisByUser(user: UserModel): number {
		return isNotNullOrUndefined(user) && isNotNullOrUndefined(this.nbTimbresAcquisByUser) && this.nbTimbresAcquisByUser?.length > 0
			? this.nbTimbresAcquisByUser?.find(t => t.getIdUser() == user?.getId())?.getNbAcquis() ?? 0
			: 0;
	}

	addTimbresAcquisByUser(user: UserModel, nb?: number) {
		if (isNotNullOrUndefined(user)) {
			if (isNullOrUndefined(this.nbTimbresAcquisByUser)) {
				this.nbTimbresAcquisByUser = []
			}

			const find = this.nbTimbresAcquisByUser.find(timbreBlocAcquis => timbreBlocAcquis.getIdUser() == user?.getId());
			if (isNotNullOrUndefined(find)) {
				find.setNbAcquis(this.getNb(find.getNbAcquis(), nb));
			} else {
				this.nbTimbresAcquisByUser.push(new TimbreBlocAcquisModel(user?.getId(), this.getNb(0, nb), null));
			}
		}
	}

	removeTimbresAcquisByUser(user: UserModel) {
		if (isNotNullOrUndefined(user) && isNotNullOrUndefined(this.nbTimbresAcquisByUser)) {
			const find = this.nbTimbresAcquisByUser.find(timbreBlocAcquis => timbreBlocAcquis.getIdUser() == user?.getId());
			if (isNotNullOrUndefined(find) && find.getNbAcquis() > 0) {
				find.setNbAcquis(find.getNbAcquis() - 1)
			}
		}
	}

	getNbTimbresDoublonByUser(user: UserModel): number {
		return isNotNullOrUndefined(user) && isNotNullOrUndefined(this.nbTimbresAcquisByUser) && this.nbTimbresAcquisByUser?.length > 0
			? this.nbTimbresAcquisByUser?.find(t => t.getIdUser() == user?.getId())?.getNbDoublon() ?? 0
			: 0;
	}

	addTimbresDoublonByUser(user: UserModel, nb?: number) {
		if (isNotNullOrUndefined(user)) {
			if (isNullOrUndefined(this.nbTimbresAcquisByUser)) {
				this.nbTimbresAcquisByUser = []
			}

			const find = this.nbTimbresAcquisByUser.find(timbreBlocAcquis => timbreBlocAcquis.getIdUser() == user?.getId());
			if (isNotNullOrUndefined(find)) {
				find.setNbDoublon(this.getNb(find.getNbDoublon(), nb));
			} else {
				this.nbTimbresAcquisByUser.push(new TimbreBlocAcquisModel(user?.getId(), null, this.getNb(0, nb)));
			}
		}
	}

	removeTimbresDoublonByUser(user: UserModel) {
		if (isNotNullOrUndefined(user) && isNotNullOrUndefined(this.nbTimbresAcquisByUser)) {
			const find = this.nbTimbresAcquisByUser.find(timbreBlocAcquis => timbreBlocAcquis.getIdUser() == user?.getId());
			if (isNotNullOrUndefined(find) && find.getNbDoublon() > 0) {
				find.setNbDoublon(find.getNbDoublon() - 1)
			}
		}
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

	getNb(nb: number, nbSupp: number): number {
		if (isNullOrUndefined(nbSupp)) {
			nbSupp = 1
		}
		nb = nb + nbSupp;

		if (nb > this.getNbTimbres()) {
			nb = this.getNbTimbres();
		}
		return nb;
	}
}
