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
import {DossierEnum} from "../../../../shared/enum/dossier.enum";

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
		const timbrePaysModel: TimbrePaysModel = new TimbrePaysModel();
		timbrePaysModel.setId(item["ID"] != "NULL" ? item["ID"] : "");
		timbrePaysModel.setCode(item["CODE"] != "NULL" ? item["CODE"] : "");
		timbrePaysModel.setLibelle(item["LIBELLE_FR"] != "NULL" ? item["LIBELLE_FR"] : "");
		timbrePaysModel.setZone(item["ZONE"] != "NULL" ? item["ZONE"] : "");
		timbrePaysModel.setClasseur(item["CLASSEUR"] != "NULL" ? item["CLASSEUR"] : "");
		timbrePaysModel.setPage(item["PAGE"] != "NULL" ? item["PAGE"] : "");
		timbrePaysModel.setTotal(item["TOTAL"] != "NULL" ? item["TOTAL"] : "");
		timbrePaysModel.setVisible(item["VISIBLE"] != "NULL" ? item["VISIBLE"] : "");

		const imageDrapeau = '/assets/images/drapeau/' + timbrePaysModel.getCode() + '.png';
		this.uploadService.checkIfImageExists(imageDrapeau).pipe(first()).subscribe(
			exists => {
				if (exists) {
					timbrePaysModel.setDrapeau(imageDrapeau);
				}
			}
		);

		const imageLangue = '/assets/images/langue/' + timbrePaysModel.getCode() + '.png';
		this.uploadService.checkIfImageExists(imageLangue).pipe(first()).subscribe(
			exists => {
				if (exists) {
					timbrePaysModel.setImageLangue(imageLangue);
				} else {
					timbrePaysModel.setLibelleLangue(item["LIBELLE_LANGUE"] != "NULL" ? item["LIBELLE_LANGUE"] : "");
				}
			}
		);

		const imageMap = '/assets/images/map/' + timbrePaysModel.getCode() + '.png';
		this.uploadService.checkIfImageExists(imageMap).pipe(first()).subscribe(
			exists => {
				if (exists) {
					timbrePaysModel.setMap(imageMap);
				} else {
					timbrePaysModel.setMap(item["MAP"] != "NULL" ? item["MAP"] : "");
				}
			}
		);
		//this.uploadedUrl = await this.processAndUploadImage();
		//timbrePaysModel.setDrapeau(await this.processAndUploadImage());

		return timbrePaysModel
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
					timbresModel.forEach((timbrePaysModel, index) => {
						this.saveTimbre(timbrePaysModel, index == timbresModel.length - 1);
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

	saveTimbre(timbrePaysModel: TimbrePaysModel, last: boolean) {
		combineLatest([
			this.timbrePaysService.upload(timbrePaysModel, DossierEnum.DRAPEAU, false),
			this.timbrePaysService.upload(timbrePaysModel, DossierEnum.LANGUE, false),
			this.timbrePaysService.upload(timbrePaysModel, DossierEnum.MAP, false),
			this.timbrePaysService.upload(timbrePaysModel, DossierEnum.DRAPEAU, true),
			this.timbrePaysService.upload(timbrePaysModel, DossierEnum.LANGUE, true),
			this.timbrePaysService.upload(timbrePaysModel, DossierEnum.MAP, true)
		]).pipe(first()).subscribe(([drapeau, langue, map, drapeauZoom, langueZoom, mapZoom]) => {
			if (isNotNullOrUndefined(drapeau) && drapeau != "nok") {
				timbrePaysModel.setDrapeau(drapeau);
			}
			if (isNotNullOrUndefined(langue) && langue != "nok") {
				timbrePaysModel.setImageLangue(langue);
			}
			if (isNotNullOrUndefined(map) && map != "nok") {
				timbrePaysModel.setMap(map);
			}
			if (isNotNullOrUndefined(drapeauZoom) && drapeauZoom != "nok") {
				timbrePaysModel.setDrapeauZoom(drapeauZoom);
			}
			if (isNotNullOrUndefined(langueZoom) && langueZoom != "nok") {
				timbrePaysModel.setImageLangueZoom(langueZoom);
			}
			if (isNotNullOrUndefined(mapZoom) && mapZoom != "nok") {
				timbrePaysModel.setMapZoom(mapZoom);
			}

			this.timbrePaysService.getMaxIdentAsync().pipe(first()).subscribe(id => {
				this.timbrePaysService.addTimbre(timbrePaysModel)
				if (last) {
					this.load$.next(true);
					this.close()
				}
			});
		});
	}


	close() {
		this.dialogRef.close();
	}

}
