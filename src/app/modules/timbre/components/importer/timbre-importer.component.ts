import {Component, OnInit} from "@angular/core";
import {BehaviorSubject, combineLatest, first} from "rxjs";
import {NgForm} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import * as Papa from 'papaparse';
import {TimbreModel} from "../../../../model/timbre.model";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {TimbreService} from "../../../../shared/services/timbre/timbre.service";
import {UploadService} from "../../../../shared/services/upload.service";
import {DossierEnum} from "../../../../shared/enum/dossier.enum";
import {TimbreBlocModel} from "../../../../model/timbre-bloc.model";
import {TimbreAcquisModel} from "../../../../model/timbre-acquis.model";
import {AuthService} from "../../../../shared/services/auth.service";
import {UserModel} from "../../../../model/user.model";
import {BaseEnum} from "../../../../shared/enum/base.enum";
import {UtilsService} from "../../../../shared/services/utils.service";
import {TimbreBlocService} from "../../../../shared/services/timbre/timbre-bloc.service";

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

	identTimbre = 1;
	identBloc = 1;

	constructor(
		private authService: AuthService,
		private timbreService: TimbreService,
		private timbreBlocService: TimbreBlocService,
		private uploadService: UploadService,
		private utilsService: UtilsService,
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
			this.saveCsv(file)
		}
	}

	saveCsv(file) {
		const reader: FileReader = new FileReader();
		reader.onload = () => {
			const csvData = reader.result as string;
			this.parseCsv(csvData);
		};
		reader.readAsText(file);
	}


	parseCsv(csvData: string): void {

		combineLatest([
			this.utilsService.getMaxIdentAsync(BaseEnum.TIMBRE),
			this.utilsService.getMaxIdentAsync(BaseEnum.TIMBRE_BLOC),
			this.authService.getUser(),
		]).pipe(first(([maxIdentTimbre, maxIdentBloc, user]) => isNotNullOrUndefined(user))).subscribe(([maxIdentTimbre, maxIdentBloc, user]) => {
			if (isNotNullOrUndefined(maxIdentTimbre)) {
				this.identTimbre = maxIdentTimbre + 1;
			}
			if (isNotNullOrUndefined(maxIdentBloc)) {
				this.identBloc = maxIdentBloc + 1;
			}

			let timbresModel: TimbreModel[] = [];
			this.timbres$.next(null);

			Papa.parse(csvData, {
				header: true, // Pour transformer chaque ligne en un objet basé sur les en-têtes
				skipEmptyLines: true,
				complete: (result) => {
					if (isNotNullOrUndefined(result.data) && result.data?.length > 0) {
						result.data.forEach((item, index) => {
							timbresModel.push(this.setTimbre(item, user));
							this.identTimbre++;
							this.identBloc++;
							if (index == timbresModel.length - 1) {
								this.timbres$.next(timbresModel);
								this.load$.next(true);
								this.timbres$.pipe(first()).subscribe(timbresModel => {
									console.log(timbresModel)
								});
							}
						})
					}
				},
				error: (error) => {
					console.error('Erreur lors du parsing du CSV :', error);
				}
			});
		})
	}

	setTimbre(item, user: UserModel): TimbreModel {
		const timbreModel: TimbreModel = new TimbreModel();
		const id: number = item["CODE"] != "NULL" && item["CODE"] != "" ? Number(item["CODE"]) : null;
		const idBloc: number = item["IDENT_BLOC"] != "NULL" && item["IDENT_BLOC"] != "" ? Number(item["IDENT_BLOC"]) : null;
		const annee: number = item["ANNEE"] != "NULL" && item["ANNEE"] != "" ? Number(item["ANNEE"]) : null;
		const monnaie = item["MONNAIE"] != "NULL" && item["MONNAIE"] != "" ? item["MONNAIE"] : null;

		timbreModel.setId(this.identTimbre);
		//timbreModel.setId(item["ID"] != "NULL" ? item["ID"] : "");
		//timbreModel.setId(item["CODE"] != "NULL" && item["CODE"] != "" ? Number(item["CODE"]) : null);
		//timbreModel.setIdBloc(item["IDENT_BLOC"] != "NULL" && item["IDENT_BLOC"] != "" ? Number(item["IDENT_BLOC"]) : null);
		timbreModel.setType(item["TYPE"] != "NULL" && item["TYPE"] != "" ? item["TYPE"] : null);
		timbreModel.setYt(item["YT"] != "NULL" && item["YT"] != "" ? item["YT"] : null);

		const timbreAcquisModel: TimbreAcquisModel = new TimbreAcquisModel();
		timbreAcquisModel.setIdTimbre(timbreModel.getId());
		timbreAcquisModel.setIdUser(user.getId());
		timbreAcquisModel.setAcquis(item["ACQUIS"] == "1");
		timbreAcquisModel.setDoublon(item["DOUBLON"] == "1");
		timbreModel.setTimbreAcquisModel(timbreAcquisModel);

		let image: string = "/assets/images/timbres/" + annee + "/";
		let imageBloc: string = "";

		if (isNotNullOrUndefined(idBloc)) {
			image += "bloc/" + idBloc;
			imageBloc = image + ".png";
			image += "-";

			const timbreBlocModel: TimbreBlocModel = new TimbreBlocModel();
			//timbreBlocModel.setId(timbreModel.getIdBloc());
			timbreBlocModel.setId(this.identBloc);
			timbreBlocModel.setAnnee(annee);
			timbreBlocModel.setMonnaie(monnaie);
			this.uploadService.checkIfImageExists(imageBloc).pipe(first()).subscribe(
				exists => {
					if (exists) {
						timbreBlocModel.setImage(imageBloc);
						timbreBlocModel.setImageTable(imageBloc);
						timbreBlocModel.setImageZoom(imageBloc);
					}
				}
			);

			timbreModel.setIdBloc(timbreBlocModel?.getId());
			timbreModel.setTimbreBlocModel(timbreBlocModel);
		} else {
			timbreModel.setAnnee(annee);
			timbreModel.setMonnaie(monnaie);
		}

		image += id + ".png";
		this.uploadService.checkIfImageExists(image).pipe(first()).subscribe(
			exists => {
				if (exists) {
					timbreModel.setImage(image);
					timbreModel.setImageTable(image);
					timbreModel.setImageZoom(image);
				}
			}
		);

		return timbreModel
	}


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
					});
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
		combineLatest([
			this.timbreService.upload(timbreModel, DossierEnum.AUTRE),
			this.timbreService.upload(timbreModel, DossierEnum.TABLE),
			this.timbreService.upload(timbreModel, DossierEnum.ZOOM),
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
			//this.timbreService.ajouterSansId(timbreModel);
			if (isNotNullOrUndefined(timbreModel?.getTimbreAcquisModel()?.isAcquis())) {
				this.timbreService.acquis(timbreModel, timbreModel?.getTimbreAcquisModel()?.isDoublon());
			}
			if (isNotNullOrUndefined(timbreModel?.getTimbreBlocModel()?.getId())) {
				this.timbreBlocService.ajouter(timbreModel?.getTimbreBlocModel());
			}
			this.timbreService.ajouter(timbreModel);
			if (last) {
				this.load$.next(true);
				this.close();
			}
		});
	}

	close() {
		this.dialogRef.close();
	}
}
