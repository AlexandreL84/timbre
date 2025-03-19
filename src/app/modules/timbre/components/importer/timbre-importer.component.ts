import {Component, OnInit} from "@angular/core";
import {BehaviorSubject, combineLatest, first} from "rxjs";
import {NgForm} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import * as Papa from 'papaparse';
import {TimbreModel} from "../../../../model/timbre.model";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {TimbreService} from "../../services/timbre.service";
import {UploadService} from "../../../../shared/services/upload.service";
import { TimbreUtilsService } from '../../services/timbre-utils.service';

@Component({
	selector: "app-timbre-importer",
	templateUrl: "./timbre-importer.component.html",
	styleUrls: ["./timbre-importer.component.scss"],
})
export class TimbreImporterComponent implements OnInit {
	timbres$: BehaviorSubject<TimbreModel[]> = new BehaviorSubject<TimbreModel[]>(null);
	messageError$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	messageLoad$: BehaviorSubject<string> = new BehaviorSubject<string>("Chargement en cours ...");
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
	idFile: string = "fileImport";

	constructor(
		private timbreService: TimbreService,
		private timbreUtilsService: TimbreUtilsService,
		private uploadService: UploadService,
		public dialogRef: MatDialogRef<TimbreImporterComponent>) {
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
		let timbresModel: TimbreModel[] = [];
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

	setTimbre(item): TimbreModel {
		const timbreModel: TimbreModel = new TimbreModel();
		//timbreModel.setId(item["ID"] != "NULL" ? item["ID"] : "");
		timbreModel.setId(item["CODE"] != "NULL" && item["CODE"] != "" ? item["CODE"] : null);
		timbreModel.setIdBloc(item["IDENT_BLOC"] != "NULL" && item["IDENT_BLOC"] != "" ? item["IDENT_BLOC"] : null);
		timbreModel.setAnnee(item["ANNEE"] != "NULL" && item["ANNEE"] != "" ? item["ANNEE"] : null);
		timbreModel.setMonnaie(item["MONNAIE"] != "NULL" && item["MONNAIE"] != "" ? item["MONNAIE"] : null);
		timbreModel.setType(item["TYPE"] != "NULL" && item["TYPE"] != "" ? item["TYPE"] : null);
		timbreModel.setYt(item["YT"] != "NULL" && item["YT"] != "" ? item["YT"] : null);

		let image = "/assets/images/timbres/" + timbreModel.getAnnee() + "/";
		if (isNotNullOrUndefined(timbreModel.getIdBloc())) {
			image += "bloc/" + timbreModel.getIdBloc() + "-";
		}
		image += timbreModel.getId() + ".png";
		this.uploadService.checkIfImageExists(image).pipe(first()).subscribe(
			exists => {
				if (exists) {
					timbreModel.setImageTable(image);
				}
			}
		);
		return timbreModel
	}


	/*saveXls(file, reader) {
		let timbresModel: TimbreModel[] = [];

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
						//setTimeout(() => {this.saveTimbre(timbreModel, index == timbresModel.length - 1)}, 500);
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

	saveTimbre(timbreModel: TimbreModel, last: boolean) {
		const dossierImage = this.timbreUtilsService.dossierImage + (isNotNullOrUndefined(timbreModel.getIdBloc()) ? "bloc/" : "")

		combineLatest([
			this.uploadService.processAndUploadImage(timbreModel?.getImageTable(), this.timbreService.widthTimbre, this.timbreService.heightTimbre, timbreModel?.getId(), dossierImage + "autre"),
			this.uploadService.processAndUploadImage(timbreModel?.getImageTable(), this.timbreService.widthTimbre * (this.timbreService.heigthTable / this.timbreService.heightTimbre), this.timbreService.heigthTable, timbreModel?.getId(), dossierImage + "table"),
			this.uploadService.processAndUploadImage(timbreModel?.getImageTable(), this.timbreService.widthTimbreZoom, this.timbreService.heightTimbreZoom, timbreModel?.getId(), dossierImage + "zoom"),
		]).pipe(first(([image, imageTable, imageZoom]) => isNotNullOrUndefined(image) && isNotNullOrUndefined(imageZoom) && isNotNullOrUndefined(imageTable))).subscribe(([imageTable, image, imageZoom]) => {
			if (isNotNullOrUndefined(image) && image != "nok") {
				timbreModel.setImage(image);
			}
			if (isNotNullOrUndefined(imageTable) && imageTable != "nok") {
				timbreModel.setImageTable(imageTable);
			}
			if (isNotNullOrUndefined(imageZoom) && imageZoom != "nok") {
				timbreModel.setImageZoom(imageZoom);
			}
			this.timbreService.addTimbre(timbreModel)
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
