import {Label} from "./utils/utils-model";
import {ProprieteModel} from "./utils/propriete-model";
import {FontAwesomeEnum} from "../shared/enum/font-awesome";
import {FontAwesomeTypeEnum} from "../shared/enum/font-awesome/font-awesome-type.enum";

export class IconeModel extends ProprieteModel {

	@Label("Icone")
	icone: FontAwesomeEnum;

	@Label("Type")
	type: FontAwesomeTypeEnum;

	@Label("Info")
	info: string;

	@Label("Lien")
	lien: string;


	constructor(icone?: FontAwesomeEnum, type?: FontAwesomeTypeEnum, info?: string, lien?: string) {
		super();
		this.icone = icone ? icone : null;
		this.type = type ? type : null;
		this.info = info ? info : null;
		this.lien = lien ? lien : null;
	}

	getIcone(): FontAwesomeEnum {
		return this.icone;
	}

	setIcone(value: FontAwesomeEnum) {
		this.icone = value;
	}

	getType(): FontAwesomeTypeEnum {
		return this.type;
	}

	setType(value: FontAwesomeTypeEnum) {
		this.type = value;
	}

	getInfo(): string {
		return this.info;
	}

	setInfo(value: string) {
		this.info = value;
	}

	getLien(): string {
		return this.lien;
	}

	setLien(value: string) {
		this.lien = value;
	}
}
