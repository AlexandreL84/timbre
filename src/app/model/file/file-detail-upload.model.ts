export class FileDetailUploadModel {
	key: any;
	dossier: string;
	maxWidth: number;
	maxHeight: number;

	getKey(): number {
		return this.key;
	}

	setKey(value: number) {
		this.key = value;
	}

	getDossier(): string {
		return this.dossier;
	}

	setDossier(value: string) {
		this.dossier = value;
	}

	getMaxWidth(): number {
		return this.maxWidth;
	}

	setMaxWidth(value: number) {
		this.maxWidth = value;
	}

	getMaxHeight(): number {
		return this.maxHeight;
	}

	setMaxHeight(value: number) {
		this.maxHeight = value;
	}
}
