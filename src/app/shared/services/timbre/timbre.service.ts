import {Injectable} from '@angular/core';
import {TimbreModel} from '../../../model/timbre.model';
import {BehaviorSubject, combineLatest, first, map, Observable, switchMap} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {isNotNullOrUndefined, isNullOrUndefined} from '../../utils/utils';
import {AuthService} from '../auth.service';
import {TimbreCritereModel} from '../../../model/timbre-critere.model';
import {TimbreBlocService} from './timbre-bloc.service';
import {UploadService} from '../upload.service';
import {DossierEnum} from '../../enum/dossier.enum';
import {BaseEnum} from '../../enum/base.enum';
import {UtilsService} from '../utils.service';
import {TimbreUtilsService} from './timbre-utils.service';
import {DroitEnum} from "../../enum/droit.enum";
import {TimbreModifierComponent} from "../../../modules/timbre/components/modifier/timbre-modifier.component";
import {LibModalComponent} from "../../components/lib-modal/lib-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {DimensionImageEnum} from "../../enum/dimension-image.enum";

@Injectable()
export class TimbreService {
	total$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	timbres$: BehaviorSubject<TimbreModel[]> = new BehaviorSubject<TimbreModel[]>(null);
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor(
		private firestore: AngularFirestore,
		private authService: AuthService,
		private timbreBlocService: TimbreBlocService,
		private uploadService: UploadService,
		private utilsService: UtilsService,
		private timbreUtilsService: TimbreUtilsService,
		private dialog: MatDialog) {
	}

	/*modifAll() {
		const timbreCritereModel = new TimbreCritereModel();

		const annees : number[] = []
		for (let i = 1849; i < 1850; i++) {
			annees.push(i);
		}
		timbreCritereModel.setAnnees(annees);

		this.timbreUtilsService.getAllTimbres(timbreCritereModel).pipe(first(timbres => timbres?.length > 0)).subscribe(timbres => {
			timbres.forEach(timbre => {
				const timbreModel = cloneDeep(timbre);
				timbreModel["imageTable"] = timbre["image"];
				timbreModel["image"] = timbre["imageTable"];

				this.firestore.collection(BaseEnum.TIMBRE)
					.ref.where('id', '==', timbreModel["id"])
					.get()
					.then(snapshot => {
						snapshot.forEach(doc => {
							doc.ref.update(timbreModel);
						});
					});
			})
		});
	}*/

	getTimbre(id: number): Observable<any> {
		return this.firestore.collection(BaseEnum.TIMBRE, ref => ref.where('id', '==', id)).valueChanges();
	}

	getTimbreByIdAsync(id: number): Observable<TimbreModel> {
		return combineLatest([
			this.getTimbre(id),
			this.timbreBlocService.getBlocsAsync()
		]).pipe(map(([data, timbresBlocModel]) => {
			return this.timbreUtilsService.constructTimbre(data[0], null, timbresBlocModel);
		}));
	}

	setTotal(number: number) {
		this.total$.pipe(first()).subscribe(total => {
			this.total$.next(total + number);
		});
	}

	getTotal(timbreCritereModel?: TimbreCritereModel) {
		this.total$.next(null);
		this.timbreUtilsService.getAllTimbres(timbreCritereModel).subscribe(timbres => {
			this.total$.next(timbres?.length);
		});
	}

	getTimbres(timbreCritereModel: TimbreCritereModel, total: boolean) {
		if (total) {
			this.getTotal();
		}
		this.timbres$.next(null);
		this.load$.next(false);
		combineLatest([
			this.timbreUtilsService.getAllTimbres(timbreCritereModel),
			this.getTimbreAcquis(),
			this.timbreBlocService.getBlocsAsync(timbreCritereModel)
		]).pipe(first()).subscribe(([timbres, timbresAcquis, timbresBlocModel]) => {
			let timbresRetour: TimbreModel[] = this.timbreUtilsService.constructTimbres(timbres, timbresAcquis, timbresBlocModel, timbreCritereModel);
			if (timbresRetour?.length > 0) {
				timbresRetour = timbresRetour.sort((a, b) => {
					return a.getIdBloc() - b.getIdBloc();
				}).sort((a, b) => {
					return a?.getTimbreBlocModel()?.getNbTimbres() - b?.getTimbreBlocModel()?.getNbTimbres();
				});
			}
			this.timbres$.next(timbresRetour);
			this.load$.next(true);
		});
	}

	getTimbreAcquis(): Observable<any> {
		return this.authService.userSelect$.pipe(
			first(userSelect => isNotNullOrUndefined(userSelect)),
			switchMap((user) => {
				if (isNotNullOrUndefined(user)) {
					return this.getTimbreAcquisByUser(user.getId()).pipe(first(),
						map(result => {
							return result;
						}));
				}
				return null;
			}));
	}

	getTimbreAcquisByUser(id): Observable<any> {
		return this.firestore.collection(BaseEnum.TIMBRE_ACQUIS, ref => ref.where('idUser', '==', id)).valueChanges();
	}

	ajouterSansId(timbreModel: TimbreModel) {
		this.utilsService.getMaxIdentAsync(BaseEnum.TIMBRE).pipe(first()).subscribe(id => {
			timbreModel.setId(id);
			if (isNotNullOrUndefined(timbreModel.getIdBloc())) {
				//timbreModel.setAnnee(null);
				timbreModel.setMonnaie(null);
			}
			this.ajouter(timbreModel, true);
		});
	}

	ajouter(timbreModel: TimbreModel, refresh: boolean) {
		this.getTimbre(timbreModel.getId()).pipe(first()).subscribe(data => {
			if (isNullOrUndefined(data) || isNullOrUndefined(data[0]) || (isNotNullOrUndefined(data[0]) && data[0]?.length == 0)) {
				timbreModel.setTimbreAcquisModel(null);
				timbreModel.setTimbreBlocModel(null);

				this.firestore.collection(BaseEnum.TIMBRE).add(
					Object.assign(new Object(), timbreModel)
				).then((result) => {
					if (refresh) {
						this.timbres$.pipe(first()).subscribe(timbres => {
							timbres.push(timbreModel);
							this.setTotal(1);
						});
						/*if (refresh) {
							this.getTimbres(this.timbreUtilsService.timbreCritereModel, true);
						}*/
						this.timbreUtilsService.reinitResume$.next(true);
					}
				})
				.catch((error) => {
					console.error("Erreur d'ajout :", error);
				});
			} else {
				console.error("timbre " + timbreModel.getId() + " déjà existant");
			}
		});
	}

	modifier(timbreModel: TimbreModel) {
		timbreModel.setTimbreBlocModel(null);
		timbreModel.setTimbreAcquisModel(null);
		this.firestore.collection(BaseEnum.TIMBRE)
			.ref.where('id', '==', timbreModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					doc.ref.update(Object.assign(new Object(), timbreModel))
						.then((result) => {
							this.timbres$.pipe(first(timbres => isNotNullOrUndefined(timbres) && timbres?.length > 0)).subscribe(timbres => {
								const findTimbre: TimbreModel = timbres.find(timbre => timbre.getId() == timbreModel.getId());
								if (isNotNullOrUndefined(findTimbre)) {
									Object.assign(findTimbre, timbreModel);
								}
							});
						})
						.catch((error) => {
							console.error('Erreur de mise à jour :', error);
						});
				});
			})
			.catch(error => {
				console.error('Erreur de mise à jour id introuvable :', error);
			});
	}

	supprimerTimbre(timbreModel: TimbreModel) {
		this.firestore.collection(BaseEnum.TIMBRE)
			.ref.where('id', '==', timbreModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					doc.ref.delete()
						.then((result) => {
							//this.getTimbres(this.timbreUtilsService.timbreCritereModel, true);
							this.timbres$.pipe(first()).subscribe(timbresModel => {
								const findIndex: number = timbresModel.findIndex(timbre => timbre.getId() == timbreModel.getId());
								if (findIndex >= 0) {
									timbresModel.splice(findIndex, 1);
									this.setTotal(-1);
								}
							});
						})
						.catch((error) => {
							console.error('Erreur de suppression :', error);
						});
				});
			})
			.catch(error => {
				console.error('Erreur de suppression id introuvable :', error);
			});
	}

	supprimer(timbreModel: TimbreModel) {
		this.timbreUtilsService.supprimerTimbreAcquis(timbreModel);
		this.supprimerTimbre(timbreModel);
		this.timbreUtilsService.reinitResume$.next(true);
	}

	getBouchon(): TimbreModel {
		let timbre: TimbreModel = new TimbreModel();
		timbre.setAnnee(new Date().getFullYear());
		timbre.setMonnaie('E');
		timbre.setType('');
		timbre.setYt('');
		return timbre;
	}

	upload(timbreModel: TimbreModel, dossier: DossierEnum, ident?: number): Observable<string> {
		let witdth: number = DimensionImageEnum.WIDTH_TIMBRE;
		let height: number = DimensionImageEnum.HEIGTH_TIMBRE;
		if (dossier == DossierEnum.TABLE) {
			witdth = witdth * (DimensionImageEnum.HEIGTH_TABLE / height);
			height = DimensionImageEnum.HEIGTH_TABLE;
		} else if (dossier == DossierEnum.ZOOM) {
			witdth = witdth * (DimensionImageEnum.HEIGTH_TIMBRE_ZOOM / height);
			height = DimensionImageEnum.HEIGTH_TIMBRE_ZOOM;
		}
		return this.uploadService.processAndUploadImage(timbreModel?.getImage(), witdth, height, isNotNullOrUndefined(ident) ? ident : timbreModel?.getId(), this.getDossier(timbreModel, dossier));
	}

	getDossier(timbreModel: TimbreModel, dossier: string): string {
		let dossierImage = DossierEnum.TIMBRE + '/';
		if (isNotNullOrUndefined(timbreModel.getIdBloc())) {
			dossierImage = dossierImage + timbreModel.getTimbreBlocModel().getAnnee();
		} else {
			dossierImage = dossierImage + timbreModel.getAnnee();
		}
		if (isNotNullOrUndefined(dossier)) {
			dossierImage = dossierImage + '/' + dossier;
		}
		if (isNotNullOrUndefined(timbreModel.getIdBloc())) {
			dossierImage = dossierImage + '/bloc/' + timbreModel.getIdBloc();
		}
		return dossierImage;
	}

	acquisDoublon(timbreModel: TimbreModel, doublon: boolean) {
		this.authService.user$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			if (user?.getDroit() >= DroitEnum.PARTIEL) {
				this.timbreUtilsService.acquis(timbreModel, doublon);
			} else {
				this.utilsService.droitInsuffisant();
			}
		});
	}

	modifierDialog(timbreModel: TimbreModel) {
		const refDialog = this.dialog.open(TimbreModifierComponent, {
			height: "75vh",
			maxHeight: "750px",
			width: "30%",
		});
		refDialog.componentInstance.id = timbreModel.getId();

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}

	supprimerDialog(timbreModel: TimbreModel) {
		const dialogModal = this.dialog.open(LibModalComponent, {
			maxHeight: "95vh",
			data: {
				titre: "Confirmation",
				message: "Souhaitez-vous supprimer le timbre <b>n° " + timbreModel?.getId() + "</b> ?",
				btnDroite: "Oui",
				btnGauche: "Non",
			},
		});

		dialogModal.afterClosed().subscribe(() => {
			if (dialogModal.componentInstance.data.resultat === "valider") {
				this.supprimer(timbreModel)
			}
		})
	}
}
