import {Component, OnInit} from "@angular/core";
import {BehaviorSubject, combineLatest, first, map} from "rxjs";
import {NgForm} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import {TimbrePaysModel} from "../../../../model/timbre-pays.model";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {TimbrePaysService} from "../../services/timbre-pays.service";
import {UploadService} from "../../../../shared/services/upload.service";

@Component({
	selector: "app-timbre-pays-importer",
	templateUrl: "./timbre-pays-importer.component.html",
	styleUrls: ["./timbre-pays-importer.component.scss"],
})
export class TimbrePaysImporterComponent implements OnInit {
	timbres$: BehaviorSubject<TimbrePaysModel[]> = new BehaviorSubject<TimbrePaysModel[]>(null);
	messageError$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	messageLoad$: BehaviorSubject<string> = new BehaviorSubject<string>("Chargement en cours ...");
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
	idFile: string = "fileImport";

	constructor(
		private timbrePaysService: TimbrePaysService,
		private uploadService: UploadService,
		public dialogRef: MatDialogRef<TimbrePaysImporterComponent>) {
	}

	ngOnInit() {

	}

	triggerFileInput(): void {
		const fileInput = document.getElementById(this.idFile) as HTMLElement;
		fileInput.click();
	}

	onFileChange(event: any): void {
		const file = event.target.files[0];

		if (file) {
			this.load$.next(false);
			this.messageLoad$.next("Chargement en cours ...");
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
				//console.log("import", timbresModel)
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
		timbreModel.setId(item["ID"] != "NULL" ? item["ID"] : "");
		timbreModel.setCode(item["CODE"] != "NULL" ? item["CODE"] : "");
		timbreModel.setLibelle(item["LIBELLE_FR"] != "NULL" ? item["LIBELLE_FR"] : "");
		timbreModel.setZone(item["ZONE"] != "NULL" ? item["ZONE"] : "");
		timbreModel.setClasseur(item["CLASSEUR"] != "NULL" ? item["CLASSEUR"] : "");
		timbreModel.setPage(item["PAGE"] != "NULL" ? item["PAGE"] : "");
		timbreModel.setTotal(item["TOTAL"] != "NULL" ? item["TOTAL"] : "");
		timbreModel.setVisible(item["VISIBLE"] != "NULL" ? item["VISIBLE"] : "");

		const imageDrapeau = '/assets/images/drapeau/' + timbreModel.getCode() + '.png';
		this.uploadService.checkIfImageExists(imageDrapeau).pipe(first()).subscribe(
			exists => {
				if (exists) {
					timbreModel.setDrapeau(imageDrapeau);
				}
			}
		);

		const imageLangue = '/assets/images/langue/' + timbreModel.getCode() + '.png';
		this.uploadService.checkIfImageExists(imageLangue).pipe(first()).subscribe(
			exists => {
				if (exists) {
					timbreModel.setImageLangue(imageLangue);
				} else {
					timbreModel.setLibelleLangue(item["LIBELLE_LANGUE"] != "NULL" ? item["LIBELLE_LANGUE"] : "");
				}
			}
		);

		const imageMap = '/assets/images/map/' + timbreModel.getCode() + '.png';
		this.uploadService.checkIfImageExists(imageMap).pipe(first()).subscribe(
			exists => {
				if (exists) {
					timbreModel.setMap(imageMap);
				} else {
					timbreModel.setMap(item["MAP"] != "NULL" ? item["MAP"] : "");
				}
			}
		);
		//this.uploadedUrl = await this.processAndUploadImage();
		//timbreModel.setDrapeau(await this.processAndUploadImage());

		return timbreModel
	}


	/*saveXls(file, reader) {
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
	}*/

	valider(formModif: NgForm) {
		this.messageError$.next(null)
		if (formModif?.valid) {
			this.load$.next(false);
			this.messageLoad$.next("Import en cours ...");
			this.timbres$.pipe(first()).subscribe(timbresModel => {
				if (isNotNullOrUndefined(timbresModel) && timbresModel?.length > 0) {
					timbresModel.forEach((timbreModel, index) => {
						this.saveTimbre(timbreModel, index == timbresModel.length - 1);
					})
					//this.close();
					//this.saveData(timbresModel);
				} else {
					this.messageError$.next("Données incorrectes")
					return;
				}
			});
		}
	}

	saveTimbre(timbreModel: TimbrePaysModel, last: boolean) {
		combineLatest([
			this.uploadService.processAndUploadImage(timbreModel?.getDrapeau(), this.timbrePaysService.widthDrapeau * (this.timbrePaysService.heigthTable / this.timbrePaysService.heightDrapeau), this.timbrePaysService.heigthTable, timbreModel?.getCode(), this.timbrePaysService.dossierImage + "zoom/drapeau"),
			this.uploadService.processAndUploadImage((timbreModel?.getImageLangue() ? timbreModel?.getImageLangue() : null), this.timbrePaysService.widthLangue * (this.timbrePaysService.heigthTable / this.timbrePaysService.heightLangue), this.timbrePaysService.heigthTable, timbreModel?.getCode(), this.timbrePaysService.dossierImage + "zoom/langue"),
			this.uploadService.processAndUploadImage(timbreModel?.getMap(), this.timbrePaysService.widthMap * (this.timbrePaysService.heigthTable / this.timbrePaysService.heightMap), this.timbrePaysService.heigthTable, timbreModel?.getCode(), this.timbrePaysService.dossierImage + "zoom/map"),
			this.uploadService.processAndUploadImage(timbreModel?.getDrapeau(), this.timbrePaysService.widthDrapeau, this.timbrePaysService.heightDrapeau, timbreModel?.getCode(), this.timbrePaysService.dossierImage + "drapeau"),
			this.uploadService.processAndUploadImage((timbreModel?.getImageLangue()? timbreModel?.getImageLangue() : null), this.timbrePaysService.widthLangue, this.timbrePaysService.heightLangue, timbreModel?.getCode(), this.timbrePaysService.dossierImage + "langue"),
			this.uploadService.processAndUploadImage(timbreModel?.getMap(), this.timbrePaysService.widthMap, this.timbrePaysService.heightMap, timbreModel?.getCode(), this.timbrePaysService.dossierImage + "map")
		]).pipe(first()).subscribe(([drapeau, langue, map, drapeauZoom, langueZoom, mapZoom]) => {
			if (isNotNullOrUndefined(drapeau)) {
				timbreModel.setDrapeau(drapeau);
			}
			if (isNotNullOrUndefined(langue)) {
				timbreModel.setImageLangue(langue);
			}
			if (isNotNullOrUndefined(map)) {
				timbreModel.setMap(map);
			}
			if (isNotNullOrUndefined(drapeauZoom)) {
				timbreModel.setDrapeauZoom(drapeauZoom);
			}
			if (isNotNullOrUndefined(langueZoom)) {
				timbreModel.setImageLangueZoom(langueZoom);
			}
			if (isNotNullOrUndefined(mapZoom)) {
				timbreModel.setMapZoom(mapZoom);
			}
			console.log(timbreModel);


			this.timbrePaysService.addTimbre(timbreModel)
			if (last) {
				this.load$.next(true);
				this.close()
			}
		});
	}


	close() {
		this.dialogRef.close();
	}

}
