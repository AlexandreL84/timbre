import {Label} from "./utils/utils-model";
import {ProprieteModel} from "./utils/propriete-model";
import {Type} from 'class-transformer';
import {TimbreResumeTypeModel} from "./timbre-resume-type.model";
import {isNotNullOrUndefined, isNullOrUndefined} from "../shared/utils/utils";
import {TimbreResumeAcquisModel} from "./timbre-resume-acquis.model";
import {UserModel} from "./user.model";
import {TypeTimbreEnum} from "../shared/enum/type-timbre.enum";

export class TimbreResumeModel extends ProprieteModel {
	@Label("Ident")
	id: string

	@Label("Année")
	annee: number;

	@Label("Total")
	total: number;

	@Label("Nombre de timbres")
	@Type(() => TimbreResumeTypeModel)
	timbresResumeTypeModel: TimbreResumeTypeModel[];

	constructor(id?: string, annee?: number, total?: number, timbresResumeTypeModel?: TimbreResumeTypeModel[]) {
		super();
		this.id = id ? id : null;
		this.annee = annee ? annee : null;
		this.total = total ? total : 0;
		this.timbresResumeTypeModel = timbresResumeTypeModel ? timbresResumeTypeModel : null;
	}

	getId(): string {
		return this.id;
	}

	setId(value: string) {
		this.id = value;
	}

	getAnnee(): number {
		return this.annee;
	}

	setAnnee(value: number) {
		this.annee = value;
	}

	getTotal(): number {
		return this.total;
	}

	setTotal(value: number) {
		this.total = value;
	}

	getTimbresResumeTypeModel(): TimbreResumeTypeModel[] {
		return this.timbresResumeTypeModel;
	}

	setTimbresResumeTypeModel(timbresResumeTypeModel: TimbreResumeTypeModel[]) {
		this.timbresResumeTypeModel = timbresResumeTypeModel;
	}

	addTimbresResumeTypeModel(timbresResumeTypeModel: TimbreResumeTypeModel, timbresResumeAcquisModel: TimbreResumeAcquisModel[]) {
		if (isNotNullOrUndefined(timbresResumeTypeModel)) {
			if (isNullOrUndefined(this.timbresResumeTypeModel)) {
				this.timbresResumeTypeModel = []
			}

			let findResume: TimbreResumeTypeModel = this.timbresResumeTypeModel.find(resume => resume.getType() == timbresResumeTypeModel?.getType());
			if (isNullOrUndefined(findResume)) {
				findResume = timbresResumeTypeModel
				timbresResumeTypeModel.setNombre(1);
				this.timbresResumeTypeModel.push(timbresResumeTypeModel);
			} else {
				findResume.setNombre(findResume.getNombre() + 1);
				findResume.setNombreTimbre(findResume.getNombreTimbre() + timbresResumeTypeModel.getNombreTimbre());

				if (isNotNullOrUndefined(timbresResumeTypeModel.getTimbreResumeAcquis()) && timbresResumeTypeModel.getTimbreResumeAcquis().length > 0) {
					timbresResumeTypeModel.getTimbreResumeAcquis().forEach(nombreAcquis => {
						//findResume.addNombreAcquis(timbresResumeTypeModel.getNombreAcquis())

						const findNbAcquis = findResume?.getTimbreResumeAcquis()?.find(resume => resume.getIdUser() == nombreAcquis?.getIdUser());
						if (isNullOrUndefined(findNbAcquis)) {
							findResume.addTimbreResumeAcquis(nombreAcquis);
						} else {
							findNbAcquis.setNbAcquis(findNbAcquis.getNbAcquis() + nombreAcquis.getNbAcquis());
							findNbAcquis.setNbDoublon(findNbAcquis.getNbDoublon() + nombreAcquis.getNbDoublon());
						}
					});
				}
			}
			if (isNotNullOrUndefined(timbresResumeAcquisModel) && timbresResumeAcquisModel.length > 0) {
				timbresResumeAcquisModel.forEach(timbreResumeAcquisModel => {
					findResume.addTimbreResumeAcquis(timbreResumeAcquisModel);
				});
			}
		}
	}


	getNbTimbresAcquisByTypeAndUser(user: UserModel, type: TypeTimbreEnum): number {
		if (isNotNullOrUndefined(user) && isNotNullOrUndefined(this.getTimbresResumeTypeModel()) && this.getTimbresResumeTypeModel()?.length > 0) {
			const find = this.getTimbresResumeTypeModel()?.find(timbreResumeTypeModel => timbreResumeTypeModel.getType() == type)?.getTimbreResumeAcquis()?.find(timbreResumeAcquis => timbreResumeAcquis.getIdUser() == user.getId());
			return find?.getNbTimbresAcquis()
		}

		return 0;
	}
}
