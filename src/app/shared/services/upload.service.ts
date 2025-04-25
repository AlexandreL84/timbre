import { Injectable } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { isNotNullOrUndefined, isString } from '../utils/utils';

@Injectable()
export class UploadService {
	constructor(private http: HttpClient) {
	}

	checkIfImageExists(imagePath: string) {
		return this.http.head(imagePath, { observe: 'response' }).pipe(
			map(response => response.status === 200), // Si l'image existe
			catchError(() => of(false)) // Si l'image n'existe pas
		);
	}

	processAndUploadImage(
		image: File | string,
		width: number,
		height: number,
		code: number | string,
		dossier: string,
		heigthDiv?: number
	): Observable<string> {
		if (isString(image) && image.includes('firebasestorage')) {
			return of(image);
		} else if (isNotNullOrUndefined(image) && !isString(image)) {
			return this.processAndUploadImageByFile(image, width, height, code, dossier, heigthDiv);
		} else if (isString(image)) {
			return this.processAndUploadImageByString(image?.toString(), width, height, code, dossier, heigthDiv);
		}
	}

	processAndUploadImageByString(
		imagePath: string,
		width: number,
		height: number,
		code: number | string,
		dossier: string,
		heigthDiv?: number
	): Observable<string> {
		return from(fetch(imagePath)).pipe(
			switchMap(async (response) => {
				if (isNotNullOrUndefined(imagePath) && imagePath != '') {
					if (isNotNullOrUndefined(heigthDiv)) {
						width = width * (heigthDiv / height);
					}
					//const blob = await response.blob();
					const img = await this.loadImageFromAssets(imagePath);
					const resizedBlob = await this.getBlob(img, width, height, heigthDiv);
					return this.uploadImageToFirebase(resizedBlob, this.getFileRetour(dossier, code));
				} else {
					return 'nok';
				}
			})
		);
	}

	processAndUploadImageByFile(
		file: File | string,
		width: number,
		height: number,
		code: number | string,
		dossier?: string,
		heigthDiv?: number
	): Observable<string> {
		return new Observable((observer) => {
			if (isNotNullOrUndefined(file) && !isString(file)) {
				const img = new Image();
				const reader: FileReader = new FileReader();
				reader.readAsDataURL(file);

				reader.onload = async (event) => {
					img.src = event.target?.result as string;
					//const resizedBlob = await this.resizeImage(img, width, isNotNullOrUndefined(heigthDiv) ? heigthDiv : height);
					const resizedBlob = await this.getBlob(img, width, height, heigthDiv);

					return this.uploadImageToFirebase(resizedBlob, this.getFileRetour(dossier, code))
						.then((result) => {
							observer.next(result);
						})
						.catch((error) => {
							observer.next('nok');
							console.error(error);
						});
				};
			} else {
				observer.next('nok');
			}
		});
	}


	getBlob(img, width: number, height: number, heigthDiv?: number): Promise<Blob> {
		if (isNotNullOrUndefined(heigthDiv)) {
			width = width * (heigthDiv / height);
		}
		return this.resizeImage(img, width, isNotNullOrUndefined(heigthDiv) ? heigthDiv : height);

	}

	getFileRetour(dossier: string, code: number | string): string {
		let fileRetour = 'images/';
		if (isNotNullOrUndefined(dossier)) {
			fileRetour = fileRetour + dossier + '/';
		}
		return fileRetour + code?.toString() + '.png';
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

	resizeImage(img: HTMLImageElement, maxWidth: number, maxHeight: number): Promise<Blob> {
		return new Promise((resolve) => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			if (ctx) {
				// Calcul des dimensions
				const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
				const width = img.width * ratio;
				const height = img.height * ratio;

				// Configuration du canvas
				canvas.width = width;
				canvas.height = height;

				// Fond transparent
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				// Centrage de l'image redimensionnée
				const x = (canvas.width - width) / 2;
				const y = (canvas.height - height) / 2;

				// Dessin de l'image
				ctx.drawImage(img, x, y, width, height);
			}
			canvas.toBlob((blob) => {
				resolve(blob)
				/*if (blob) {
					resolve(blob)
				}*/
			}, 'image/png', 1);
		});
	}


	async uploadImageToFirebase(blob: Blob | string, filePath: string): Promise<string> {
		if (!isString(blob)) {
			const storage = getStorage();
			const storageRef = ref(storage, filePath);
			await uploadBytes(storageRef, blob);
			return await getDownloadURL(storageRef);
		}
		return null;
	}
}
