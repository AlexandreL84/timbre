import {Injectable} from '@angular/core';
import {TimbreModel} from '../../../model/timbre.model';
import {BehaviorSubject, combineLatest, first, map, Observable, switchMap} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {isNotNullOrUndefined, isNullOrUndefined} from '../../utils/utils';
import {AuthService} from '../auth.service';
import {TimbreAcquisModel} from '../../../model/timbre-acquis.model';
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

@Injectable()
export class TimbreService {
	heigthTable: number = 50;
	widthTimbre: number = 100;
	heightTimbre: number = 100;
	widthTimbreZoom: number = 500;
	heightTimbreZoom: number = 500;

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
			this.timbres$.next(this.timbreUtilsService.constructTimbres(timbres, timbresAcquis, timbresBlocModel, timbreCritereModel));
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

	acquis(timbreModel: TimbreModel, doublon: boolean) {
		return this.authService.userSelect$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			if (isNotNullOrUndefined(timbreModel?.getTimbreAcquisModel()?.getIdUser())) {
				this.firestore.collection(BaseEnum.TIMBRE_ACQUIS)
					.ref.where('idTimbre', '==', timbreModel.getId()).where('idUser', '==', user.getId())
					//.limit(1)
					.get()
					.then(snapshot => {
						snapshot.forEach(doc => {
							const timbreAcquisModel: TimbreAcquisModel = timbreModel.getTimbreAcquisModel();
							if (doublon) {
								timbreAcquisModel.setAcquis(true);
								timbreAcquisModel.setDoublon(!timbreAcquisModel.isDoublon());
							} else {
								timbreAcquisModel.setAcquis(!timbreAcquisModel.isAcquis());
								if (!timbreAcquisModel.isAcquis()) {
									timbreAcquisModel.setDoublon(false);
								}
							}
							doc.ref.update(Object.assign(new Object(), timbreAcquisModel));
						});
					})
					.catch(error => {
						console.error('Erreur de mise à jour:', error);
					});
			} else {
				this.addAcquis(user?.getId(), timbreModel, doublon);
			}
			this.timbreUtilsService.reinitResume$.next(true);
		});
	}

	addAcquis(idUser: string, timbreModel: TimbreModel, doublon: boolean) {
		const timbreAcquisModel = new TimbreAcquisModel();
		timbreAcquisModel.setIdUser(idUser);
		timbreAcquisModel.setIdTimbre(timbreModel.getId());
		timbreAcquisModel.setAcquis(true);
		timbreAcquisModel.setDoublon(doublon);
		timbreModel.setTimbreAcquisModel(timbreAcquisModel);
		this.firestore.collection(BaseEnum.TIMBRE_ACQUIS).add(
			Object.assign(new Object(), timbreAcquisModel)
		);
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
					this.timbres$.pipe(first()).subscribe(timbres => {
						timbres.push(timbreModel);
						this.setTotal(1);
					});
					/*if (refresh) {
						this.getTimbres(this.timbreUtilsService.timbreCritereModel, true);
					}*/
					this.timbreUtilsService.reinitResume$.next(true);
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
					doc.ref.update(Object.assign(new Object(), timbreModel));
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
							this.getTimbres(this.timbreUtilsService.timbreCritereModel, true);
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
		let witdth: number = this.widthTimbre;
		let height: number = this.heightTimbre;
		if (dossier == DossierEnum.TABLE) {
			witdth = witdth * (this.heigthTable / height);
			height = this.heigthTable;
		} else if (dossier == DossierEnum.ZOOM) {
			witdth = witdth * (this.heightTimbreZoom / height);
			height = this.heightTimbreZoom;
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
				this.acquis(timbreModel, doublon);
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
