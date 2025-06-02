import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {FontAwesomeEnum} from "../../enum/font-awesome";
import {FontAwesomeTypeEnum} from "../../enum/font-awesome/font-awesome-type.enum";
import {UtilsService} from "../../services/utils.service";

@Component({
	selector: "lib-upload-multiple",
	templateUrl: "./lib-upload-multiple.component.html",
	styleUrls: ["./lib-upload-multiple.component.scss"],
})
export class LibUploadMultipleComponent {
	@ViewChild('canvas', {static: false}) canvas!: ElementRef<HTMLCanvasElement>;

	@Input() label: string = "Choisir les images";
	@Input() maxWidth: number = 100;
	@Input() maxHeight: number = 200
	@Input() alignLabel: string;

	@Output() outPutFiles: EventEmitter<File[]> = new EventEmitter<File[]>();

	selectedImages: string[] = [];
	id: string = "file" + Math.floor(Math.random() * Math.floor(1000));

	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;

	constructor(public utilsService: UtilsService) {
	}

	triggerFileInput(): void {
		const fileInput = document.getElementById(this.id) as HTMLElement;
		fileInput.click();
	}

	onFileSelected(event: Event): void {
		const files = (event.target as HTMLInputElement).files;
		this.selectedImages = [];
		const selectedFiles: File[] = [];
		if (files && files?.length > 0) {
			Array.from(files).forEach(file => {
				const reader = new FileReader();
				reader.onload = (e: ProgressEvent<FileReader>) => {
					if (e.target?.result) {
						this.selectedImages.push(e.target.result as string);
					}
				};
				reader.readAsDataURL(file);
				selectedFiles.push(file);
			});

			this.outPutFiles.emit(selectedFiles);
		}
	}
}
