import {Label} from "./utils/utils-model";
import {ProprieteModel} from "./utils/propriete-model";
import {Type} from 'class-transformer';
import {TypeTimbreEnum} from "../shared/enum/type-timbre.enum";
import {isNullOrUndefined} from "../shared/utils/utils";
import {TimbreResumeAcquisModel} from "./timbre-resume-acquis.model";

export class TimbreResumeTypeModel extends ProprieteModel {
	@Label("Nombre")
	nombre: number;

	@Label("Nombre Timbres")
	nombreTimbre: number;

	@Label("Type")
	type: TypeTimbreEnum;

	@Label("Nombre acquis")
	@Type(() => TimbreResumeAcquisModel)
	timbreResumeAcquisModel: TimbreResumeAcquisModel[];


	constructor(nombre?: number, nombreTimbre?: number, type?: TypeTimbreEnum, timbreResumeAcquisModel?: TimbreResumeAcquisModel[]) {
		super();
		this.nombre = nombre ? nombre : 0;
		this.nombreTimbre = nombreTimbre ? nombreTimbre : 0;
		this.type = type ? type : null;
		this.timbreResumeAcquisModel = timbreResumeAcquisModel ? timbreResumeAcquisModel : null;

	}

	getNombre(): number {
		return this.nombre;
	}

	setNombre(value: number) {
		this.nombre = value;
	}

	getNombreTimbre(): number {
		return this.nombreTimbre;
	}

	setNombreTimbre(value: number) {
		this.nombreTimbre = value;
	}

	getType(): TypeTimbreEnum {
		return this.type;
	}

	setType(value: TypeTimbreEnum) {
		this.type = value;
	}

	getTimbreResumeAcquis(): TimbreResumeAcquisModel[] {
		return this.timbreResumeAcquisModel;
	}

	setTimbreResumeAcquis(timbreBlocAcquisModels: TimbreResumeAcquisModel[])  {
		this.timbreResumeAcquisModel = timbreBlocAcquisModels;
	}

	addTimbreResumeAcquis(timbreBlocAcquisModel: TimbreResumeAcquisModel) {
		if (isNullOrUndefined(this.getTimbreResumeAcquis())) {
			this.setTimbreResumeAcquis([]);
		}

		const findNbAcquis = this.timbreResumeAcquisModel?.find(resume => resume.getIdUser() == timbreBlocAcquisModel?.getIdUser());
		if (isNullOrUndefined(findNbAcquis)) {
			this.timbreResumeAcquisModel.push(timbreBlocAcquisModel);
		} else {
			findNbAcquis.setNbAcquis(findNbAcquis.getNbAcquis() + timbreBlocAcquisModel.getNbAcquis());
			findNbAcquis.setNbDoublon(findNbAcquis.getNbDoublon() + timbreBlocAcquisModel.getNbDoublon());
			findNbAcquis.setNbTimbresAcquis(findNbAcquis.getNbTimbresAcquis() + timbreBlocAcquisModel.getNbTimbresAcquis());
			findNbAcquis.setNbTimbresDoublon(findNbAcquis.getNbTimbresDoublon() + timbreBlocAcquisModel.getNbTimbresDoublon());
		}
	}
}
