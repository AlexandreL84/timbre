import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, first} from 'rxjs';
import {NgForm} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import * as Papa from 'papaparse';
import {TimbreModel} from '../../../../model/timbre.model';
import {isNotNullOrUndefined, isNullOrUndefined} from '../../../../shared/utils/utils';
import {TimbreService} from '../../../../shared/services/timbre/timbre.service';
import {UploadService} from '../../../../shared/services/upload.service';
import {DossierEnum} from '../../../../shared/enum/dossier.enum';
import {TimbreBlocModel} from '../../../../model/timbre-bloc.model';
import {TimbreAcquisModel} from '../../../../model/timbre-acquis.model';
import {AuthService} from '../../../../shared/services/auth.service';
import {UserModel} from '../../../../model/user.model';
import {BaseEnum} from '../../../../shared/enum/base.enum';
import {UtilsService} from '../../../../shared/services/utils.service';
import {TimbreBlocService} from '../../../../shared/services/timbre/timbre-bloc.service';
import {TimbreBlocAcquisModel} from "../../../../model/timbre-bloc-acquis.model";
import {TimbreUtilsService} from "../../../../shared/services/timbre/timbre-utils.service";
import {TypeTimbreEnum} from "../../../../shared/enum/type-timbre.enum";

@Component({
	selector: 'app-timbre-importer',
	templateUrl: './timbre-importer.component.html',
	styleUrls: ['./timbre-importer.component.scss']
})
export class TimbreImporterComponent implements OnInit {
	//dossier = "http://www.consdjeunes.123.fr/timbres//images/timbres/zoom/"
	dossier = '/assets/images/timbres/';
	timbres$: BehaviorSubject<TimbreModel[]> = new BehaviorSubject<TimbreModel[]>(null);
	messageError$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	messageLoad$: BehaviorSubject<string> = new BehaviorSubject<string>('Chargement en cours ...');
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
	idFile: string = 'fileImport';

	identTimbre = 1;
	identBloc = 1;
	timbresModel: TimbreModel[] = [];
	timbresBlocsModel: TimbreBlocModel[] = [];
	anneesDispo: number[] = [];
	annees: number[] = [new Date().getFullYear()];

	constructor(
		private authService: AuthService,
		private timbreService: TimbreService,
		private timbreBlocService: TimbreBlocService,
		private timbreUtilsService: TimbreUtilsService,
		private uploadService: UploadService,
		private utilsService: UtilsService,
		public dialogRef: MatDialogRef<TimbreImporterComponent>) {
	}

	ngOnInit() {
		/*this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE).pipe(first(annees => isNotNullOrUndefined(annees) && annees?.length > 0)).subscribe(annees => {
			for (let i = annees[0] - 1; i >= 1849; i--) {
				this.anneesDispo.push(i);
			}
		});*/

		for (let i = new Date().getFullYear(); i >= 1900; i--) {
			this.anneesDispo.push(i);
		}
	}

	triggerFileInput(): void {
		const fileInput = document.getElementById(this.idFile) as HTMLElement;
		fileInput.click();
	}

	onFileChange(event: any): void {
		const file = event.target.files[0];

		if (file) {
			this.load$.next(false);
			this.messageLoad$.next('Chargement en cours ...');
			this.saveCsv(file);
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
		if (isNotNullOrUndefined(this.annees) && this.annees.length > 0) {
			combineLatest([
				this.utilsService.getMaxIdentAsync(BaseEnum.TIMBRE),
				this.utilsService.getMaxIdentAsync(BaseEnum.TIMBRE_BLOC),
				this.authService.userSelect$
			]).pipe(first(([maxIdentTimbre, maxIdentBloc, user]) => isNotNullOrUndefined(user))).subscribe(([maxIdentTimbre, maxIdentBloc, user]) => {
				this.identTimbre = maxIdentTimbre;
				this.identBloc = maxIdentBloc;

				this.timbresModel = [];
				this.timbres$.next(null);

				Papa.parse(csvData, {
					header: true, // Pour transformer chaque ligne en un objet basé sur les en-têtes
					skipEmptyLines: true,
					complete: (result) => {
						if (isNotNullOrUndefined(result.data) && result.data?.length > 0) {
							this.timbresBlocsModel = [];

							result.data.forEach((item, index) => {
								const timbre: TimbreModel = this.setTimbre(item, user);
								if (isNotNullOrUndefined(timbre?.getId())) {
									this.timbresModel.push(timbre);
									this.identTimbre++;
								}
								if (index == result.data.length - 1) {
									this.timbres$.next(this.timbresModel)
									this.load$.next(true);
								}
							});
						}
					},
					error: (error) => {
						console.error('Erreur lors du parsing du CSV :', error);
					}
				});
			});
		}
	}

	setTimbre(item, user: UserModel): TimbreModel {
		const timbreModel: TimbreModel = new TimbreModel();
		const id: number = item["CODE"] != 'NULL' && item["CODE"] != '' ? Number(item["CODE"]) : null;
		const idBloc: number = item["IDENT_BLOC"] != 'NULL' && item["IDENT_BLOC"] != '' && isNotNullOrUndefined(item["IDENT_BLOC"]) ? Number(item["IDENT_BLOC"]) : null;
		const annee: number = item["ANNEE"] != 'NULL' && item["ANNEE"] != '' ? Number(item["ANNEE"]) : null;
		const monnaie = item["MONNAIE"] != 'NULL' && item["MONNAIE"] != '' ? item["MONNAIE"] : null;

		if (this.annees.includes(annee)) {
			timbreModel.setId(this.identTimbre);
			//timbreModel.setId(item["ID"] != "NULL" ? item["ID"] : "");
			//timbreModel.setId(item["CODE"] != "NULL" && item["CODE"] != "" ? Number(item["CODE"]) : null);
			//timbreModel.setIdBloc(item["IDENT_BLOC"] != "NULL" && item["IDENT_BLOC"] != "" ? Number(item["IDENT_BLOC"]) : null);
			timbreModel.setType(item["TYPE"] != 'NULL' && item["TYPE"] != '' ? item["TYPE"] : null);
			timbreModel.setYt(item["YT"] != 'NULL' && item["YT"] != '' ? item["YT"] : null);
			timbreModel.setAnnee(annee);

			const timbreAcquisModel: TimbreAcquisModel = new TimbreAcquisModel();
			timbreAcquisModel.setIdTimbre(timbreModel.getId());
			timbreAcquisModel.setIdUser(user.getId());
			timbreAcquisModel.setAcquis(item["ACQUIS"] == "1");
			timbreAcquisModel.setDoublon(item["DOUBLON"] == "1");
			timbreModel.setTimbreAcquisModel(timbreAcquisModel);

			let image: string = this.dossier + annee + '/';
			let imageBloc: string = '';

			if (isNotNullOrUndefined(idBloc)) {
				image += 'bloc/' + idBloc;
				imageBloc = image + '.png';
				image += '-';

				timbreModel.setTimbreBlocModel(this.timbresBlocsModel.find(bloc => bloc.getAnnee() == annee && bloc.idOrigine == idBloc));
				if (isNullOrUndefined(timbreModel.getTimbreBlocModel())) {
					const timbreBlocModel: TimbreBlocModel = new TimbreBlocModel();
					//timbreBlocModel.setId(timbreModel.getIdBloc());
					timbreBlocModel.setId(this.identBloc);
					timbreBlocModel.setAnnee(annee);
					timbreBlocModel.setMonnaie(monnaie);
					timbreBlocModel.setType(item["CARNET"] == "1"? TypeTimbreEnum.CARNET: TypeTimbreEnum.BLOC);
					timbreBlocModel.idOrigine = idBloc;

					const timbreBlocAcquisModel: TimbreBlocAcquisModel = new TimbreBlocAcquisModel();
					timbreBlocAcquisModel.setIdBloc(this.identBloc);
					timbreBlocAcquisModel.setIdUser(user.getId());
					timbreBlocAcquisModel.setAcquis(item["ACQUIS_BLOC"] == "1");
					timbreBlocAcquisModel.setDoublon(item["DOUBLON_BLOC"] == "1");
					timbreBlocModel.setTimbreBlocAcquisModel(timbreBlocAcquisModel);

					this.uploadService.checkIfImageExists(imageBloc).pipe(first()).subscribe(
						exists => {
							if (exists) {
								timbreBlocModel.setImage(imageBloc);
								timbreBlocModel.setImageTable(imageBloc);
								timbreBlocModel.setImageZoom(imageBloc);
							}
						}
					);

					this.timbresBlocsModel.push(timbreBlocModel);
					timbreModel.setTimbreBlocModel(timbreBlocModel);
					this.identBloc++;
				}

				timbreModel.setIdBloc(timbreModel.getTimbreBlocModel()?.getId());

			} else {
				timbreModel.setMonnaie(monnaie);
			}

			image += id + '.png';
			this.uploadService.checkIfImageExists(image).pipe(first()).subscribe(
				exists => {
					if (exists) {
						timbreModel.setImage(image);
						timbreModel.setImageTable(image);
						timbreModel.setImageZoom(image);
					}
				}
			);
		}
		return timbreModel;
	}


	valider(formModif: NgForm) {
		this.messageError$.next(null);
		if (formModif?.valid) {
			this.load$.next(false);
			this.messageLoad$.next('Import en cours ...');
			/*console.log(this.timbresBlocsModel);
			return*/

			if (isNotNullOrUndefined(this.timbresBlocsModel) && this.timbresBlocsModel?.length > 0) {
				this.timbresBlocsModel.forEach((timbreBlocModel, index) => {
					this.saveBloc(timbreBlocModel);
				});
			}

			this.timbres$.pipe(first()).subscribe(timbresModel => {
				if (isNotNullOrUndefined(timbresModel) && timbresModel?.length > 0) {
					timbresModel.forEach((timbreModel, index) => {
						this.saveTimbre(timbreModel, index == timbresModel.length - 1);
					});
				} else {
					this.messageError$.next('Données incorrectes');
					return;
				}
			});
		}
	}

	saveBloc(timbreBlocModel: TimbreBlocModel) {
		combineLatest([
			this.timbreBlocService.upload(timbreBlocModel, DossierEnum.AUTRE),
			this.timbreBlocService.upload(timbreBlocModel, DossierEnum.TABLE),
			this.timbreBlocService.upload(timbreBlocModel, DossierEnum.ZOOM)
		]).pipe(first(([image, imageTable, imageZoom]) => isNotNullOrUndefined(image) && isNotNullOrUndefined(imageZoom) && isNotNullOrUndefined(imageTable))).subscribe(([image, imageTable, imageZoom]) => {
			if (isNotNullOrUndefined(image) && image != 'nok') {
				timbreBlocModel.setImage(image);
			}
			if (isNotNullOrUndefined(imageTable) && imageTable != 'nok') {
				timbreBlocModel.setImageTable(imageTable);
			}
			if (isNotNullOrUndefined(imageZoom) && imageZoom != 'nok') {
				timbreBlocModel.setImageZoom(imageZoom);
			}
			if (timbreBlocModel?.getTimbreBlocAcquisModel()?.isAcquis()) {
				this.timbreUtilsService.addAcquisBloc(timbreBlocModel?.getTimbreBlocAcquisModel()?.getIdUser(), timbreBlocModel, timbreBlocModel?.getTimbreBlocAcquisModel()?.isDoublon());
			}
			this.timbreBlocService.ajouter(timbreBlocModel, false);
		});
	}

	saveTimbre(timbreModel: TimbreModel, last: boolean) {
		combineLatest([
			this.timbreService.upload(timbreModel, DossierEnum.AUTRE),
			this.timbreService.upload(timbreModel, DossierEnum.TABLE),
			this.timbreService.upload(timbreModel, DossierEnum.ZOOM)
		]).pipe(first(([image, imageTable, imageZoom]) => isNotNullOrUndefined(image) && isNotNullOrUndefined(imageZoom) && isNotNullOrUndefined(imageTable))).subscribe(([image, imageTable, imageZoom]) => {
			if (isNotNullOrUndefined(image) && image != 'nok') {
				timbreModel.setImage(image);
			}
			if (isNotNullOrUndefined(imageTable) && imageTable != 'nok') {
				timbreModel.setImageTable(imageTable);
			}
			if (isNotNullOrUndefined(imageZoom) && imageZoom != 'nok') {
				timbreModel.setImageZoom(imageZoom);
			}
			if (timbreModel?.getTimbreAcquisModel()?.isAcquis()) {
				this.timbreUtilsService.addAcquis(timbreModel?.getTimbreAcquisModel()?.getIdUser(), timbreModel, timbreModel?.getTimbreAcquisModel()?.isDoublon());
			}
			/*if (isNotNullOrUndefined(timbreModel?.getTimbreBlocModel()?.getId())) {
				this.timbreBlocService.ajouter(timbreModel?.getTimbreBlocModel(), false);
			}*/
			this.timbreService.ajouter(timbreModel, last);
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
