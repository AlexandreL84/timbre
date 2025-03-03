import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {finalize} from "rxjs/operators";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {isNotNullOrUndefined} from "../../utils/utils";
import {FontAwesomeEnum} from "../../enum/font-awesome";
import {UtilsService} from "../../services/utils.service";
import {FileUploadModel} from "../../../model/file/file-upload.model";
import {FileDetailUploadModel} from "../../../model/file/file-detail-upload.model";
import {FontAwesomeTypeEnum} from "../../enum/font-awesome/font-awesome-type.enum";

@Component({
	selector: "lib-upload-new",
	templateUrl: "./lib-upload-new.component.html",
	styleUrls: ["./lib-upload-new.component.scss"],
})
export class LibUploadNewComponent {
	@ViewChild('canvas', {static: false}) canvas!: ElementRef<HTMLCanvasElement>;

	@Input() object;
	@Input() fileUploadModel: FileUploadModel;

	@Output() outPutObject: EventEmitter<any> = new EventEmitter<any>();

	selectedFile!: File;
	id: string = "file" + Math.floor(Math.random() * Math.floor(1000));

	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;

	constructor(private storage: AngularFireStorage, public utilsService: UtilsService) {
	}

	triggerFileInput(): void {
		const fileInput = document.getElementById(this.id) as HTMLElement;
		fileInput.click();
	}

	onFileSelected(event: Event): void {
		this.fileUploadModel.getDetail().forEach(detail => {
			this.object[detail.key] = ""
		})
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			this.selectedFile = file;

			const img = new Image();
			const reader = new FileReader();

			reader.onload = (e) => {
				img.src = e.target?.result as string;

				img.onload = () => {
					const canvas = this.canvas.nativeElement;
					const ctx = canvas.getContext('2d');

					if (ctx) {
						this.fileUploadModel.getDetail().forEach(detail => {
							this.save(canvas, ctx, img, detail);
						})
					}
				};
			};

			reader.readAsDataURL(file);
		}
	}

	save(canvas, ctx, img, detail: FileDetailUploadModel) {
		// Calcul des dimensions
		const ratio = Math.min(detail.maxWidth / img.width, detail.maxHeight / img.height, 1);
		const width = img.width * ratio;
		const height = img.height * ratio;

		// Configuration du canvas
		canvas.width = detail.maxWidth;
		canvas.height = detail.maxHeight;

		// Fond transparent
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Centrage de l'image redimensionnée
		const x = (canvas.width - width) / 2;
		const y = (canvas.height - height) / 2;

		// Dessin de l'image
		ctx.drawImage(img, x, y, width, height);

		this.saveFile(detail);
	}

	saveFile(detail: FileDetailUploadModel) {
		let filePath: string;
		filePath = "images/";

		if (isNotNullOrUndefined(this.fileUploadModel?.getDossier())) {
			filePath += this.fileUploadModel.getDossier() + "/";
		}
		if (isNotNullOrUndefined(detail?.getDossier())) {
			filePath += detail.getDossier() + "/";
		}
		if (isNotNullOrUndefined(this.fileUploadModel?.getNom())) {
			filePath += this.fileUploadModel.getNom();
		} else {
			filePath += new Date().getTime();
		}
		filePath += ".png";

		const fileRef = this.storage.ref(filePath);

		try {
			const canvas = this.canvas.nativeElement;
			canvas.toBlob((blob) => {
				if (blob) {
					const task = this.storage.upload(filePath, blob);

					task
						.snapshotChanges()
						.pipe(
							finalize(() => {
								fileRef.getDownloadURL().subscribe((url) => {
									this.object[detail.getKey()] = url;
									//console.log(this.object)
									this.outPutObject.emit(this.object)
									//console.log('URL de l’image téléchargée : ', url);
								});
							})
						)
						.subscribe();
				}
			}, 'image/png');
		} catch (error) {
			console.error('Error uploading image:', error);
		}
	}
}
