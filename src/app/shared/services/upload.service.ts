import {Injectable} from '@angular/core';
import {getDownloadURL, ref, uploadBytes, getStorage} from '@angular/fire/storage';
import {HttpClient} from '@angular/common/http';
import {catchError, from, map, Observable, of, switchMap} from 'rxjs';
import {isNotNullOrUndefined, isString} from '../utils/utils';
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Injectable()
export class UploadService {
	constructor(private http: HttpClient, private storage: AngularFireStorage) {
	}

	checkIfImageExists(imagePath: string) {
		return this.http.head(imagePath, {observe: 'response'}).pipe(
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
			// ← vérification avant de retourner l'URL
			return from(fetch(image)).pipe(
				switchMap((response) => {
					const contentType = response.headers.get('Content-Type');
					if (!contentType || !contentType.startsWith('image/')) {
						console.warn('Image Firebase invalide, Content-Type :', contentType);
						return of('nok');
					}
					return of(image);
				}),
				catchError(() => of('nok'))
			);
		} else if (isNotNullOrUndefined(image) && !isString(image)) {
			return this.processAndUploadImageByFile(image, width, height, code, dossier, heigthDiv);
		} else if (isString(image)) {
			return this.processAndUploadImageByString(image, width, height, code, dossier, heigthDiv);
		}
		return of('nok');
	}

	processAndUploadImageByString(
		imagePath: string,
		width: number,
		height: number,
		code: number | string,
		dossier: string,
		heigthDiv?: number
	): Observable<string> {
		if (!imagePath) return of('nok');

		return from(fetch(imagePath)).pipe(
			switchMap((response) => {
				const contentType = response.headers.get('Content-Type');
				if (!contentType || !contentType.startsWith('image/')) {
					console.warn('Fichier non valide, Content-Type :', contentType);
					return of('nok');
				}
				return from(this.loadImageFromAssets(imagePath)).pipe(
					switchMap((img) => {
						const w = heigthDiv ? width * (heigthDiv / height) : width;
						return from(this.getBlob(img, w, height, heigthDiv)).pipe(
							switchMap((resizedBlob) =>
								from(this.uploadImageToFirebase(resizedBlob, this.getFileRetour(dossier, code)))
							)
						);
					})
				);
			}),
			catchError((error) => {
				console.error(error);
				return of('nok');
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
					const img = new Image();
					img.src = event.target?.result as string;

					img.onload = async () => {  // ← attendre que l'image soit prête
						try {
							const resizedBlob = await this.getBlob(img, width, height, heigthDiv);
							const result = await this.uploadImageToFirebase(
								resizedBlob,
								this.getFileRetour(dossier, code)
							);
							observer.next(result);
							observer.complete();
						} catch (error) {
							console.error('Erreur resize/upload :', error);
							observer.next('nok');
							observer.complete();
						}
					};

					img.onerror = () => {
						console.error('Erreur chargement image');
						observer.next('nok');
						observer.complete();
					};
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
		return new Promise((resolve, reject) => {  // ← ajoute reject
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			if (ctx) {
				const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
				const width = img.width * ratio;
				const height = img.height * ratio;

				canvas.width = width;
				canvas.height = height;

				ctx.clearRect(0, 0, canvas.width, canvas.height);

				const x = (canvas.width - width) / 2;
				const y = (canvas.height - height) / 2;

				ctx.drawImage(img, x, y, width, height);
			}

			canvas.toBlob((blob) => {
				if (blob) {
					resolve(blob);
				} else {
					reject(new Error('canvas.toBlob() a retourné null'));
				}
			}, 'image/png', 1);
		});
	}

	async uploadImageToFirebase(blob: Blob | string, filePath: string): Promise<string> {
		if (!blob) {
			console.warn('Blob est null ou undefined');
			return 'nok';
		}

		if (!isString(blob)) {
			if (blob.size < 1000) {
				console.warn('Blob trop petit, probablement invalide :', blob.size, 'bytes');
				return 'nok';
			}
			if (!blob.type.startsWith('image/')) {
				console.warn('Blob type invalide :', blob.type);
				return 'nok';
			}
			const storage = getStorage();
			const storageRef = ref(storage, filePath);
			const metadata = { contentType: blob.type || 'image/png' };
			await uploadBytes(storageRef, blob, metadata);
			return await getDownloadURL(storageRef);
		}

		return null;
	}

	async supprimerImage(imageUrl: string): Promise<void> {
		if (!imageUrl) return;
		await this.storage.refFromURL(imageUrl).delete().toPromise();
	}

	private extraireCheminDepuisUrl(url: string): string {
		const match = url.match(/\/o\/(.+?)\?/);
		if (!match) throw new Error(`URL Firebase invalide : ${url}`);
		return decodeURIComponent(match[1]);
	}
}
