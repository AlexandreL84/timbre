import {Injectable} from '@angular/core';
import {getDownloadURL, getStorage, ref, uploadBytes} from "@angular/fire/storage";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {HttpClient} from "@angular/common/http";
import {catchError, from, map, Observable, of, switchMap} from "rxjs";
import {isNotNullOrUndefined} from "../utils/utils";

@Injectable()
export class UploadService {
	constructor(private firestore: AngularFirestore, private http: HttpClient) {
	}

	checkIfImageExists(imagePath: string) {
		return this.http.head(imagePath, { observe: 'response' }).pipe(
			map(response => response.status === 200), // Si l'image existe
			catchError(() => of(false)) // Si l'image n'existe pas
		);
	}

	/*async onUpload() {
		const imagePath = '/assets/images/drapeau/AD.png';
		await this.processAndUploadImage(imagePath);
	}*/


	processAndUploadImage(
		imagePath: string,
		width: number,
		height: number,
		code: string,
		dossier: string
	): Observable<string> {
		return from(fetch(imagePath)).pipe(
			switchMap(async (response) => {
				if (isNotNullOrUndefined(imagePath) && imagePath != "") {
					//const blob = await response.blob();
					const img = await this.loadImageFromAssets(imagePath);
					const resizedBlob = await this.resizeImage(img, width, height);
					const  fileRetour = 'images/' + dossier + '/' + code + '.png'
					return this.uploadImageToFirebase(resizedBlob, fileRetour);
				} else {
					return null;
				}
			})
		);
	}

	// Charger une image depuis le dossier assets
	private loadImageFromAssets(path: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.src = path;
			img.onload = () => resolve(img);
			img.onerror = (err) => reject(err);
		});
	}

	// Redimensionner une image
	private resizeImage2(image: HTMLImageElement, width: number, height: number): string {
		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d');

		if (ctx) {
			ctx.drawImage(image, 0, 0, width, height);
		}

		// Convertir l'image en base64
		return canvas.toDataURL('image/png');
	}


	resizeImage(img: HTMLImageElement, width: number, height: number): Promise<Blob> {
		return new Promise((resolve) => {
			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext('2d');
			ctx?.drawImage(img, 0, 0, width, height);
			canvas.toBlob((blob) => {
				if (blob) resolve(blob);
			}, 'image/png', 0.8);
		});
	}

	async uploadImageToFirebase(blob: Blob, filePath: string): Promise<string> {
		const storage = getStorage();
		const storageRef = ref(storage, filePath);
		await uploadBytes(storageRef, blob);
		return await getDownloadURL(storageRef);
	}

	/*processAndUploadImage(dossier: string, code : string, canvas: HTMLCanvasElement, img: HTMLImageElement, maxWidth: number, maxHeight: number): void {

		console.log("ici");


				img.onload = () => {
					console.log(img);
					//const canvas = canvas.nativeElement;
					//console.log(canvas.nativeElement)
					const ctx = canvas.getContext('2d');

					if (ctx) {
						// Calcul des dimensions
						const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
						const width = img.width * ratio;
						const height = img.height * ratio;

						// Configuration du canvas
						canvas.width = maxWidth;
						canvas.height = maxHeight;

						// Fond transparent
						ctx.clearRect(0, 0, canvas.width, canvas.height);

						// Centrage de l'image redimensionnée
						const x = (canvas.width - width) / 2;
						const y = (canvas.height - height) / 2;

						// Dessin de l'image
						ctx.drawImage(img, x, y, width, height);
						this.saveFile(dossier, code, canvas);
					}
				};
	}

	saveFile(dossier: string, code : string, canvas: HTMLCanvasElement) {
		let filePath: string;
		if (isNotNullOrUndefined(code)) {
			filePath = "images/" + (isNotNullOrUndefined(dossier) ? (dossier + "/") : "") + code + '.png';
		} else {
			filePath = `images/${Date.now()}-resized.png`;
		}
		const fileRef = this.storage.ref(filePath);

		try {
			//const canvas = this.canvas.nativeElement;
			canvas.toBlob((blob) => {
				if (blob) {
					const task = this.storage.upload(filePath, blob);

					task
						.snapshotChanges()
						.pipe(
							finalize(() => {
								fileRef.getDownloadURL().subscribe((url) => {
									console.log('URL de l’image téléchargée : ', url);
									return url;
									//this.object[this.key] = url;
									//console.log(this.object)
									//this.outPutObject.emit(this.object)
								});
							})
						)
						.subscribe();
				}
			}, 'image/png');
		} catch (error) {
			console.error('Error uploading image:', error);
			return null;
		}
	}*/
}
