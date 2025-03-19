import {FileDetailUploadModel} from "./file-detail-upload.model";

export class FileUploadModel {
	dossier: string;
	nom: string;
	alignLabel: string;
	detail: FileDetailUploadModel[];
	file: File;

	getDossier(): string {
		return this.dossier;
	}

	setDossier(value: string) {
		this.dossier = value;
	}

	getNom(): string {
		return this.nom;
	}

	setNom(value: string) {
		this.nom = value;
	}

	getAlignLabel(): string {
		return this.alignLabel;
	}

	setAlignLabel(value: string) {
		this.alignLabel = value;
	}

	getDetail(): FileDetailUploadModel[] {
		return this.detail;
	}

	setDetail(value: FileDetailUploadModel[]) {
		this.detail = value;
	}

	getFile(): File {
		return this.file;
	}

	setFile(value: File) {
		this.file = value;
	}
}
