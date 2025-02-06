import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {finalize} from "rxjs/operators";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Component({
    selector: "lib-upload",
    templateUrl: "./lib-upload.component.html",
    styleUrls: ["./lib-upload.component.scss"],
})
export class LibUploadComponent {
	@ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

	@Input() object
	@Input() key
	@Input() maxWidth = 100;
	@Input() maxHeight = 200

	@Output() outPutObject: EventEmitter<any> = new EventEmitter<any>();

	selectedFile!: File;
	id: string = "file" + Math.floor(Math.random() * Math.floor(1000));

	constructor(private storage: AngularFireStorage) {
	}

	triggerFileInput(): void {
		const fileInput = document.getElementById(this.id) as HTMLElement;
		fileInput.click();
	}

	onFileSelected(event: Event): void {
		this.object[this.key] = ""
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			this.selectedFile = file;

			const img = new Image();
			const reader = new FileReader();

			reader.onload = (e) => {
				img.src = e.target?.result as string;

				img.onload = () => {
					const canvas = this.canvas.nativeElement;
					console.log(this.canvas.nativeElement)
					const ctx = canvas.getContext('2d');

					if (ctx) {
						// Calcul des dimensions
						const ratio = Math.min(this.maxWidth / img.width, this.maxHeight / img.height, 1);
						const width = img.width * ratio;
						const height = img.height * ratio;

						// Configuration du canvas
						canvas.width = this.maxWidth;
						canvas.height = this.maxHeight;

						// Fond transparent
						ctx.clearRect(0, 0, canvas.width, canvas.height);

						// Centrage de l'image redimensionnée
						const x = (canvas.width - width) / 2;
						const y = (canvas.height - height) / 2;

						// Dessin de l'image
						ctx.drawImage(img, x, y, width, height);
						this.saveFile();
					}
				};
			};

			reader.readAsDataURL(file);
		}
	}

	saveFile() {
		const filePath = `images/${Date.now()}-resized.png`;
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
									this.object[this.key] = url;
									this.outPutObject.emit(this.object)
									console.log('URL de l’image téléchargée : ', url);
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
