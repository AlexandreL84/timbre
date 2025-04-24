import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, first, map, Observable, switchMap} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {isNotNullOrUndefined, isNullOrUndefined} from '../../utils/utils';
import {TimbreCritereModel} from '../../../model/timbre-critere.model';
import {plainToInstance} from 'class-transformer';
import {TimbreBlocModel} from '../../../model/timbre-bloc.model';
import {DossierEnum} from '../../enum/dossier.enum';
import {UploadService} from '../upload.service';
import {BaseEnum} from '../../enum/base.enum';
import {UtilsService} from '../utils.service';
import {AuthService} from '../auth.service';
import {TimbreBlocAcquisModel} from '../../../model/timbre-bloc-acquis.model';
import {TimbreUtilsService} from './timbre-utils.service';
import {
	TimbreModifierBlocComponent
} from "../../../modules/timbre-bloc/components/modifier-bloc/timbre-modifier-bloc.component";
import {LibModalComponent} from "../../components/lib-modal/lib-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {DroitEnum} from "../../enum/droit.enum";

@Injectable()
export class TimbreBlocService {
	heigthTable: number = 50;
	widthTimbre: number = 100;
	heightTimbre: number = 100;
	widthTimbreZoom: number = 500;
	heightTimbreZoom: number = 500;

	total$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	totalCarnet$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	timbresBlocModel$: BehaviorSubject<TimbreBlocModel[]> = new BehaviorSubject<TimbreBlocModel[]>(null);

	constructor(
		private firestore: AngularFirestore,
		private authService: AuthService,
		private uploadService: UploadService,
		private utilsService: UtilsService,
		private timbreUtilsService: TimbreUtilsService,
		private dialog: MatDialog
	) {
	}

	upload(timbreBlocModel: TimbreBlocModel, dossier: DossierEnum, ident?: number): Observable<string> {
		let witdth: number = this.widthTimbre;
		let height: number = this.heightTimbre;
		if (dossier == DossierEnum.TABLE) {
			witdth = witdth * (this.heigthTable / height);
			height = this.heigthTable;
		} else if (dossier == DossierEnum.ZOOM) {
			witdth = witdth * (this.heightTimbreZoom / height);
			height = this.heightTimbreZoom;
		}
		return this.uploadService.processAndUploadImage(timbreBlocModel?.getImage(), witdth, height, ('bloc-' + timbreBlocModel.getId()), this.getDossier(timbreBlocModel, dossier, ident));
	}

	getTotal(timbreCritereModel?: TimbreCritereModel) {
		this.total$.next(null);
		this.totalCarnet$.next(null);
		this.getAllBlocs(timbreCritereModel).pipe(first(timbesBloc => isNotNullOrUndefined(timbesBloc) && timbesBloc?.length > 0)).subscribe(timbesBloc => {
			this.total$.next(timbesBloc?.filter(timbesBloc => !timbesBloc["carnet"])?.length);
			this.totalCarnet$.next(timbesBloc?.filter(timbesBloc => timbesBloc["carnet"])?.length);
		});
	}

	getBloc(id: number): Observable<any> {
		return this.firestore.collection(BaseEnum.TIMBRE_BLOC, ref => ref.where('id', '==', id))
			.valueChanges();
	}

	getBlocByIdAsync(id: number): Observable<TimbreBlocModel> {
		return this.getBloc(id).pipe(
			map((data: any) => {
				return plainToInstance(TimbreBlocModel, data[0]);
			}));
	}

	getAllBlocs(timbreCritereModel: TimbreCritereModel): Observable<any> {
		return this.firestore.collection(BaseEnum.TIMBRE_BLOC, ref => {
			let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
			if (isNotNullOrUndefined(timbreCritereModel)) {
				if (isNotNullOrUndefined(timbreCritereModel.getAnnees()) && timbreCritereModel.getAnnees()?.length > 0) {
					filteredQuery = filteredQuery.where("annee", "in", timbreCritereModel.getAnnees());
				}
				if (isNotNullOrUndefined(timbreCritereModel.getCarnet()) && timbreCritereModel.getCarnet() != "TOUS") {
					filteredQuery = filteredQuery.where("carnet", timbreCritereModel.getCarnet() != "OUI" ? "==" : "!=", null);
				}
			}
			filteredQuery = filteredQuery.orderBy('id', 'asc');
			return filteredQuery;
		})
			.valueChanges();
	}

	getTimbreBlocAcquis(): Observable<any> {
		return this.authService.userSelect$.pipe(
			first(userSelect => isNotNullOrUndefined(userSelect)),
			switchMap((userSelect) => {
				if (isNotNullOrUndefined(userSelect)) {
					return this.getTimbreBlocAcquisByUser(userSelect.getId()).pipe(first(),
						map(result => {
							return result;
						}));
				}
				return null;
			}));
	}

	getTimbreBlocAcquisByUser(id): Observable<any> {
		return this.firestore.collection(BaseEnum.TIMBRE_BLOC_ACQUIS, ref => ref.where('idUser', '==', id)).valueChanges();
	}

	getBlocs(timbreCritereModel?: TimbreCritereModel) {
		this.timbresBlocModel$.next(null);
		combineLatest([
			this.getAllBlocs(timbreCritereModel),
			this.getTimbreBlocAcquis()
		]).pipe(first()).subscribe(([timbresBloc, timbresBlocAcquis]) => {
			this.constructBlocs(timbresBloc, timbresBlocAcquis, timbreCritereModel);
			this.getTotal();
		});
	}

	getBlocsAsync(timbreCritereModel?: TimbreCritereModel): Observable<TimbreBlocModel[]> {
		this.timbresBlocModel$.next(null);
		return this.getAllBlocs(timbreCritereModel).pipe(first(), map(blocs => {
				return this.constructBlocs(blocs, null, timbreCritereModel);
			}
		));
	}

	constructBloc(bloc: TimbreBlocModel, timbresBlocAcquis): TimbreBlocModel {
		const timbreBlocModel: TimbreBlocModel = plainToInstance(TimbreBlocModel, bloc);
		if (isNotNullOrUndefined(timbresBlocAcquis)) {
			const findTimbreBlocAcquis = timbresBlocAcquis.find(timbre => timbre['idBloc'] == timbreBlocModel.getId());
			if (isNotNullOrUndefined(findTimbreBlocAcquis)) {
				timbreBlocModel.setTimbreBlocAcquisModel(plainToInstance(TimbreBlocAcquisModel, findTimbreBlocAcquis));
			} else {
				timbreBlocModel.setTimbreBlocAcquisModel(new TimbreBlocAcquisModel());
			}
		}
		return timbreBlocModel;
	}

	constructBlocs(blocs, timbresBlocAcquis, timbreCritereModel: TimbreCritereModel): TimbreBlocModel[] {
		let timbresBlocModel: TimbreBlocModel[] = [];
		if (blocs?.length > 0) {
			blocs.forEach((bloc: any) => {
				const timbreBlocModel: TimbreBlocModel = this.constructBloc(bloc, timbresBlocAcquis);
				this.getTimbresByBlocAsync(timbreBlocModel.getId()).subscribe(timbres => {
					timbreBlocModel.setNbTimbres(timbres?.length);
				});

				let ajout: boolean = true;
				if (isNotNullOrUndefined(timbreCritereModel) && isNotNullOrUndefined(timbreBlocModel.getTimbreBlocAcquisModel())) {
					if (isNotNullOrUndefined(timbreCritereModel.getAcquis()) && !(timbreCritereModel.getAcquis() == 'TOUS' || (timbreCritereModel.getAcquis() == 'OUI' && timbreBlocModel.getTimbreBlocAcquisModel().isAcquis()) || (timbreCritereModel.getAcquis() == 'NON' && !timbreBlocModel.getTimbreBlocAcquisModel().isAcquis()))) {
						ajout = false;
					}
					if (isNotNullOrUndefined(timbreCritereModel.getDoublon()) && !(timbreCritereModel.getDoublon() == 'TOUS' || (timbreCritereModel.getDoublon() == 'OUI' && timbreBlocModel.getTimbreBlocAcquisModel().isDoublon()) || (timbreCritereModel.getDoublon() == 'NON' && !timbreBlocModel.getTimbreBlocAcquisModel().isDoublon()))) {
						ajout = false;
					}
				}
				if (ajout == true) {
					timbresBlocModel.push(timbreBlocModel);
				}
			});
		}
		this.timbresBlocModel$.next(timbresBlocModel);
		return timbresBlocModel;
	}

	acquis(timbreBlocModel: TimbreBlocModel, doublon: boolean) {
		return this.authService.userSelect$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			if (isNotNullOrUndefined(timbreBlocModel?.getTimbreBlocAcquisModel()?.getIdUser())) {
				this.firestore.collection(BaseEnum.TIMBRE_BLOC_ACQUIS)
					.ref.where('idBloc', '==', timbreBlocModel.getId()).where('idUser', '==', user.getId())
					//.limit(1)
					.get()
					.then(snapshot => {
						snapshot.forEach(doc => {
							// Mise à jour du document
							const timbreBlocAcquisModel: TimbreBlocAcquisModel = timbreBlocModel.getTimbreBlocAcquisModel();
							if (doublon) {
								timbreBlocAcquisModel.setAcquis(true);
								timbreBlocAcquisModel.setDoublon(!timbreBlocAcquisModel.isDoublon());
							} else {
								timbreBlocAcquisModel.setAcquis(!timbreBlocAcquisModel.isAcquis());
								if (!timbreBlocAcquisModel.isAcquis()) {
									timbreBlocAcquisModel.setDoublon(false);
								}
							}
							doc.ref.update(Object.assign(new Object(), timbreBlocAcquisModel));
						});
					})
					.catch(error => {
						console.error('Erreur de mise à jour:', error);
					});
			} else {
				this.addAcquis(user?.getId(), timbreBlocModel, doublon);
			}
			this.timbreUtilsService.reinitResume$.next(true);
		});
	}

	addAcquis(idUser: string, timbreBlocModel: TimbreBlocModel, doublon: boolean) {
		const timbreBlocAcquisModel = new TimbreBlocAcquisModel();
		timbreBlocAcquisModel.setIdUser(idUser);
		timbreBlocAcquisModel.setIdBloc(timbreBlocModel.getId());
		timbreBlocAcquisModel.setAcquis(true);
		timbreBlocAcquisModel.setDoublon(doublon);
		timbreBlocModel.setTimbreBlocAcquisModel(timbreBlocAcquisModel);
		this.firestore.collection(BaseEnum.TIMBRE_BLOC_ACQUIS).add(
			Object.assign(new Object(), timbreBlocAcquisModel)
		);
	}

	ajouterSansId(timbreBlocModel: TimbreBlocModel) {
		this.utilsService.getMaxIdentAsync(BaseEnum.TIMBRE_BLOC).pipe(first()).subscribe(id => {
			timbreBlocModel.setId(id);
			this.ajouter(timbreBlocModel, true);
		});
	}

	ajouter(timbreBlocModel: TimbreBlocModel, refresh: boolean) {
		this.getBloc(timbreBlocModel.getId()).pipe(first()).subscribe(data => {
			if (isNullOrUndefined(data) || isNullOrUndefined(data[0]) || (isNotNullOrUndefined(data[0]) && data[0]?.length == 0)) {
				timbreBlocModel.setTimbreBlocAcquisModel(null);

				this.firestore.collection(BaseEnum.TIMBRE_BLOC).add(
					Object.assign(new Object(), timbreBlocModel)
				);
				if (refresh) {
					this.getBlocs();
				}
				this.timbreUtilsService.reinitResume$.next(true);
			} else {
				console.error("bloc " + timbreBlocModel.getId() + " déjà existant");
			}
		});
	}

	isCarnet(timbreBlocModel: TimbreBlocModel) {
		this.authService.user$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			if (user?.getDroit() >= DroitEnum.PARTIEL) {
				timbreBlocModel.setCarnet(!timbreBlocModel.isCarnet());
				this.modifier(timbreBlocModel);
			} else {
				this.utilsService.droitInsuffisant();
			}
		});
	}

	modifier(timbreBlocModel: TimbreBlocModel) {
		this.firestore.collection(BaseEnum.TIMBRE_BLOC)
			.ref.where('id', '==', timbreBlocModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					doc.ref.update(Object.assign(new Object(), timbreBlocModel));
					this.getBlocs();
				});
			})
			.catch(error => {
				console.error('Erreur de mise à jour:', error);
			});
	}

	getTimbresByBlocAsync(idBloc: number) {
		const timbreCritereModel: TimbreCritereModel = new TimbreCritereModel();
		timbreCritereModel.setIdBloc(idBloc);
		return this.timbreUtilsService.getTimbresByCritereAsync(timbreCritereModel);
	}


	supprimer(timbreBlocModel: TimbreBlocModel) {
		this.getTimbresByBlocAsync(timbreBlocModel.getId()).pipe(first()).subscribe(timbres => {
			timbres.forEach(timbreModel => {
				this.timbreUtilsService.supprimerTimbreAcquis(timbreModel);
				this.timbreUtilsService.supprimerTimbre(timbreModel);
			});
		});

		this.firestore.collection(BaseEnum.TIMBRE_BLOC_ACQUIS)
			.ref.where('idBloc', '==', timbreBlocModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					doc.ref.delete();
				});
			});

		this.firestore.collection(BaseEnum.TIMBRE_BLOC)
			.ref.where('id', '==', timbreBlocModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					doc.ref.delete();
					this.getBlocs();
				});
			})
			.catch(error => {
				console.error('Erreur de suppression :', error);
			});
		this.timbreUtilsService.reinitResume$.next(true);
	}

	getDossier(timbreBlocModel: TimbreBlocModel, dossier, ident: number): string {
		let dossierImage = DossierEnum.TIMBRE + '/' + timbreBlocModel.getAnnee();
		if (isNotNullOrUndefined(dossier)) {
			dossierImage = dossierImage + '/' + dossier;
		}
		dossierImage = dossierImage + '/bloc/' + (isNotNullOrUndefined(ident) ? ident : timbreBlocModel.getId());
		return dossierImage;
	}

	getBouchon(): TimbreBlocModel {
		let timbreBlocModel: TimbreBlocModel = new TimbreBlocModel();
		timbreBlocModel.setAnnee(new Date().getFullYear());
		timbreBlocModel.setMonnaie('E');
		return timbreBlocModel;
	}

	acquisDoublon(timbreBlocModel: TimbreBlocModel, doublon: boolean) {
		this.authService.user$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			if (user?.getDroit() >= DroitEnum.PARTIEL) {
				this.acquis(timbreBlocModel, doublon);
			} else {
				this.utilsService.droitInsuffisant();
			}
		});
	}

	modifierDialog(timbreBlocModel: TimbreBlocModel) {
		const refDialog = this.dialog.open(TimbreModifierBlocComponent, {
			height: "75vh",
			maxHeight: "750px",
			width: "30%",
		});
		refDialog.componentInstance.id = timbreBlocModel.getId();

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}

	supprimerDialog(timbreBlocModel: TimbreBlocModel) {
		this.getTimbresByBlocAsync(timbreBlocModel.getId()).pipe(first()).subscribe(timbres => {
			let message: string = "";
			if (isNotNullOrUndefined(timbres) && timbres?.length > 0) {
				message = "<span class='warn'>Attention <b>" + timbres.length + "</b> timbre";
				if (timbres?.length > 1) {
					message += "s sont reliés";
				} else {
					message += " est relié";
				}
				message += " à ce bloc.</span></br></br>";
			}
			message += "Souhaitez-vous supprimer le bloc <b>n° " + timbreBlocModel?.getId() + "</b> ?";

			const dialogModal = this.dialog.open(LibModalComponent, {
				maxHeight: "95vh",
				data: {
					titre: "Confirmation",
					message: message,
					btnDroite: "Oui",
					btnGauche: "Non",
				},
			});

			dialogModal.afterClosed().subscribe(() => {
				if (dialogModal.componentInstance.data.resultat === "valider") {
					this.supprimer(timbreBlocModel)
				}
			});
		});
	}
}
