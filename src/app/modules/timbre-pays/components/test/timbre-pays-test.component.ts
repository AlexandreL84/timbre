import {Component, OnInit} from "@angular/core";
import {BehaviorSubject, first} from "rxjs";
import {NgForm} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import {TimbrePaysModel} from "../../../../model/timbre-pays.model";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {TimbrePaysService} from "../../services/timbre-pays.service";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@angular/fire/storage";
import {UploadService} from "../../../../shared/services/upload.service";

@Component({
	selector: "app-timbre-pays-importer",
	templateUrl: "./timbre-pays-importer.component.html",
	styleUrls: ["./timbre-pays-importer.component.scss"],
})
export class TimbrePaysImporterComponent implements OnInit {
	timbres$: BehaviorSubject<TimbrePaysModel[]> = new BehaviorSubject<TimbrePaysModel[]>(null);
	messageError$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
	idFile: string = "fileImport";

	constructor(
		private timbrePaysService: TimbrePaysService,
		public dialogRef: MatDialogRef<TimbrePaysImporterComponent>) {
	}

	ngOnInit() {


		this.onUpload()
		console.log(this.uploadedUrl)
	}

	triggerFileInput(): void {
		const fileInput = document.getElementById(this.idFile) as HTMLElement;
		fileInput.click();
	}

	onFileChange(event: any): void {
		const file = event.target.files[0];

		if (file) {
			this.load$.next(false);
			const reader = new FileReader();

			this.saveCsv(file, reader)
			//this.saveXls(file, reader)
		}
	}

	saveCsv(file, reader) {
		reader.onload = () => {
			const csvData = reader.result as string;
			this.parseCsv(csvData);
		};
		reader.readAsText(file);
	}


	parseCsv(csvData: string): void {
		let timbresModel: TimbrePaysModel[] = [];
		this.timbres$.next(null);

		Papa.parse(csvData, {
			header: true, // Pour transformer chaque ligne en un objet basé sur les en-têtes
			skipEmptyLines: true,
			complete: (result) => {
				if (isNotNullOrUndefined(result.data) && result.data?.length > 0) {
					result.data.forEach(item => {
						timbresModel.push(this.setTimbre(item));
					})
				}
				console.log("import", timbresModel)
				this.timbres$.next(timbresModel);
				this.load$.next(true);
			},
			error: (error) => {
				console.error('Erreur lors du parsing du CSV :', error);
			}
		});
	}

	setTimbre(item): TimbrePaysModel {
		const timbreModel: TimbrePaysModel = new TimbrePaysModel();
		//timbreModel.setId(item["ID"] != "NULL" ? item["ID"] : "");
		timbreModel.setCode(item["CODE"] != "NULL" ? item["CODE"] : "");
		timbreModel.setLibelle(item["LIBELLE_FR"] != "NULL" ? item["LIBELLE_FR"] : "");
		timbreModel.setLibelle2(item["LIBELLE_LANGUE"] != "NULL" ? item["LIBELLE_LANGUE"] : "");
		timbreModel.setZone(item["ZONE"] != "NULL" ? item["ZONE"] : "");
		timbreModel.setClasseur(item["CLASSEUR"] != "NULL" ? item["CLASSEUR"] : "");
		timbreModel.setPage(item["PAGE"] != "NULL" ? item["PAGE"] : "");
		timbreModel.setTotal(item["TOTAL"] != "NULL" ? item["TOTAL"] : "");
		timbreModel.setVisible(item["VISIBLE"] != "NULL" ? item["VISIBLE"] : "");
		timbreModel.setMap(item["MAP"] != "NULL" ? item["MAP"] : "");
		timbreModel.setMap(item["MAP"] != "NULL" ? item["MAP"] : "");

		//this.uploadedUrl = await this.processAndUploadImage();

		//timbreModel.setDrapeau(await this.processAndUploadImage());

		return timbreModel
	}


	saveXls(file, reader) {
		let timbresModel: TimbrePaysModel[] = [];

		reader.onload = (e: any) => {
			const data = e.target.result;

			this.load$.next(true);
			const workbook = XLSX.read(data, {type: 'binary'});

			const firstSheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[firstSheetName];

			const rawData = XLSX.utils.sheet_to_json(worksheet, {raw: true});
			rawData.forEach(item => {
				timbresModel.push(this.setTimbre(item));
			})
		};

		reader.readAsBinaryString(file);
	}

	valider(formModif: NgForm) {
		this.messageError$.next(null)
		if (formModif?.valid) {
			this.timbres$.pipe(first()).subscribe(timbres => {
				if (isNotNullOrUndefined(timbres) && timbres?.length > 0) {
					this.saveData(timbres);
				} else {
					this.messageError$.next("Données incorrectes")
					return;
				}
			});
		}
	}

	saveData(timbresModel: TimbrePaysModel[]) {
		timbresModel.forEach(timbreModel => {
			this.timbrePaysService.addTimbre(timbreModel)
		})
	}

	close() {
		this.dialogRef.close();
	}


	loadImageFromAssets(path: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.src = path;
			img.onload = () => resolve(img);
			img.onerror = (err) => reject(err);
		});
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

	async processAndUploadImage() {
		try {
			// Étape 1 : Charger l'image
			const imagePath = '/assets/images/drapeau/AD.png';
			const img = await this.loadImageFromAssets(imagePath);

			// Étape 2 : Redimensionner l'image
			const resizedBlob = await this.resizeImage(img, 300, 300);

			// Étape 3 : Uploader l'image dans Firebase Storage
			const uploadedUrl = await this.uploadImageToFirebase(resizedBlob, 'images/sample-resized.png');

			console.log('Image uploaded. URL:', uploadedUrl);
			return uploadedUrl; // URL asynchrone
		} catch (err) {
			console.error('Error:', err);
		}
	}

	uploadedUrl: string | null = null;

	async onUpload() {
		this.uploadedUrl = await this.processAndUploadImage();

		console.log(this.uploadedUrl)
	}
}
