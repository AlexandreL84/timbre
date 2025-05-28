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
import {DimensionImageEnum} from "../../enum/dimension-image.enum";
import {TypeTimbreEnum} from "../../enum/type-timbre.enum";
import {TotalModel} from "../../../model/total.model";
import {PreferenceEnum} from "../../enum/preference.enum";
import {PreferenceService} from "../preference.service";


@Injectable()
export class TimbreBlocService {
	total$: BehaviorSubject<TotalModel[]> = new BehaviorSubject<TotalModel[]>([]);
	timbresBlocModel$: BehaviorSubject<TimbreBlocModel[]> = new BehaviorSubject<TimbreBlocModel[]>(null);
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor(
		private firestore: AngularFirestore,
		private authService: AuthService,
		private uploadService: UploadService,
		private utilsService: UtilsService,
		private timbreUtilsService: TimbreUtilsService,
		private dialog: MatDialog,
		private preferenceService: PreferenceService
	) {
	}

	upload(timbreBlocModel: TimbreBlocModel, dossier: DossierEnum, ident?: number): Observable<string> {
		let witdth: number = DimensionImageEnum.WIDTH_TIMBRE;
		let height: number = DimensionImageEnum.HEIGTH_TIMBRE;
		if (dossier == DossierEnum.TABLE) {
			witdth = witdth * (DimensionImageEnum.HEIGTH_TABLE / height);
			height = DimensionImageEnum.HEIGTH_TABLE;
		} else if (dossier == DossierEnum.ZOOM) {
			witdth = witdth * (DimensionImageEnum.HEIGTH_TIMBRE_ZOOM / height);
			height = DimensionImageEnum.HEIGTH_TIMBRE_ZOOM;
		}
		return this.uploadService.processAndUploadImage(timbreBlocModel?.getImage(), witdth, height, ('bloc-' + timbreBlocModel.getId()), this.getDossier(timbreBlocModel, dossier, ident));
	}

	setTotal(timbreBlocModel: TimbreBlocModel, number: number) {
		this.total$.pipe(first()).subscribe(total => {
			const findTotal: TotalModel = total.find(total => total.getType() == timbreBlocModel?.getType());
			if (isNotNullOrUndefined(findTotal)) {
				findTotal.setTotal(findTotal.getTotal() + 1);
			} else {
				total.push(new TotalModel(timbreBlocModel?.getType(), 1))
			}
			this.total$.next(total );
		});
	}

	getTotal(timbreCritereModel?: TimbreCritereModel) {
		this.total$.next(null);
		this.getAllBlocs(timbreCritereModel)
			.subscribe(timbesBloc => {
				let total: TotalModel[] = [];
				Object.keys(TypeTimbreEnum).forEach(type=> {
					if (type != TypeTimbreEnum.TIMBRE) {
						total.push(new TotalModel(type, timbesBloc?.filter(timbesBloc => timbesBloc["type"] == type)?.length));
					}
				})
				this.total$.next(total);
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

	getRef(ref, timbreCritereModel: TimbreCritereModel) {
		let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
		if (isNotNullOrUndefined(timbreCritereModel)) {
			if (isNotNullOrUndefined(timbreCritereModel.getAnnees()) && timbreCritereModel.getAnnees()?.length > 0) {
				filteredQuery = filteredQuery.where("annee", "in", timbreCritereModel.getAnnees());
			}
			if (isNotNullOrUndefined(timbreCritereModel.getType()) && timbreCritereModel.getType()?.length > 0) {
				filteredQuery = filteredQuery.where("type", "in", timbreCritereModel.getType());
			}

			/*if (isNotNullOrUndefined(timbreCritereModel.getCarnet()) && timbreCritereModel.getCarnet() != "TOUS") {
				filteredQuery = filteredQuery.where("carnet", timbreCritereModel.getCarnet() != "OUI" ? "==" : "!=", false);
			}*/
		}
		filteredQuery = filteredQuery.orderBy("id", timbreCritereModel?.getSort() == "desc" ? "desc" : "asc");
		return filteredQuery;
	}

	getAllBlocs(timbreCritereModel: TimbreCritereModel): Observable<any> {
		return this.firestore.collection(BaseEnum.TIMBRE_BLOC, ref => {
			return this.getRef(ref, timbreCritereModel);
		}).valueChanges();
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

	/*modifAll() {
		const timbreCritereModel = new TimbreCritereModel();

		const annees: number[] = []
		for (let i = 2020; i < 2025; i++) {
			annees.push(i);
		}
		timbreCritereModel.setAnnees(annees);

		this.getAllBlocs(timbreCritereModel).pipe(first(timbres => timbres?.length > 0)).subscribe(timbres => {
			timbres.forEach(timbre => {
				const timbreModel = cloneDeep(timbre);
				timbreModel["imageTable"] = timbre["image"];
				timbreModel["image"] = timbre["imageTable"];

				this.firestore.collection(BaseEnum.TIMBRE_BLOC)
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

	getBlocs(timbreCritereModel: TimbreCritereModel, total: boolean) {
		this.load$.next(false);
		this.timbresBlocModel$.next(null);
		if (total) {
			this.getTotal();
		}
		combineLatest([
			this.getAllBlocs(timbreCritereModel),
			this.getTimbreBlocAcquis()
		]).pipe(first()).subscribe(([timbresBloc, timbresBlocAcquis]) => {
			this.timbresBlocModel$.next(this.constructBlocs(timbresBloc, timbresBlocAcquis, timbreCritereModel));
			this.load$.next(true);
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
				if (isNotNullOrUndefined(timbreCritereModel)) {
					/*if (timbreCritereModel?.getType()?.find(type => type == TypeTimbreEnum.CARNET) && timbreBlocModel?.getType() == TypeTimbreEnum.CARNET) {
						ajout = true;
					} else if (timbreCritereModel?.getType()?.find(type => type == TypeTimbreEnum.BLOC) && timbreBlocModel?.getType() == TypeTimbreEnum.BLOC) {
						ajout = true;
					} else if (timbreCritereModel?.getType()?.find(type => type == TypeTimbreEnum.COLLECTOR) && timbreBlocModel?.getType() == TypeTimbreEnum.COLLECTOR) {
						ajout = true;
					}*/

					if (isNotNullOrUndefined(timbreBlocModel.getTimbreBlocAcquisModel())) {
						if (isNotNullOrUndefined(timbreCritereModel.getAcquis()) && !(timbreCritereModel.getAcquis() == 'TOUS' || (timbreCritereModel.getAcquis() == 'OUI' && timbreBlocModel.getTimbreBlocAcquisModel().isAcquis()) || (timbreCritereModel.getAcquis() == 'NON' && !timbreBlocModel.getTimbreBlocAcquisModel().isAcquis()))) {
							ajout = false;
						}
						if (isNotNullOrUndefined(timbreCritereModel.getDoublon()) && !(timbreCritereModel.getDoublon() == 'TOUS' || (timbreCritereModel.getDoublon() == 'OUI' && timbreBlocModel.getTimbreBlocAcquisModel().isDoublon()) || (timbreCritereModel.getDoublon() == 'NON' && !timbreBlocModel.getTimbreBlocAcquisModel().isDoublon()))) {
							ajout = false;
						}
					}
				} else {
					ajout = true;
				}

				if (ajout == true) {
					timbresBlocModel.push(timbreBlocModel);
				}
			});
		}
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
							doc.ref.update(Object.assign(new Object(), timbreBlocAcquisModel))
								.then(snapshot => {
									timbreBlocModel.setTimbreBlocAcquisModel(timbreBlocAcquisModel);
								})
								.catch(error => {
									console.error('Erreur de mise à jour:', error);
								});
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
				timbreBlocModel.setIdOrigine(null);

				this.firestore.collection(BaseEnum.TIMBRE_BLOC).add(
					Object.assign(new Object(), timbreBlocModel)
				).then((result) => {
					this.preferenceService.getTimbreCritere(PreferenceEnum.TIMBRE_CRITERE).pipe(first()).subscribe(timbreCritereModel => {
						if (isNotNullOrUndefined(timbreCritereModel.getAnnees().find(annee => annee == timbreBlocModel.getAnnee()))) {
							this.timbresBlocModel$.pipe(first()).subscribe(timbresBlocModel => {
								timbresBlocModel.push(timbreBlocModel);
								this.setTotal(timbreBlocModel, 1);
							});
						}
					});
					/*if (refresh) {
						this.getBlocs(this.timbreUtilsService.timbreCritereBlocModel, false);
					}*/
					this.timbreUtilsService.reinitResume$.next(true);
				})
					.catch((error) => {
						console.error("Erreur d'ajout :", error);
					});
			} else {
				console.error("bloc " + timbreBlocModel.getId() + " déjà existant");
			}
		});
	}

	isCarnet(timbreBlocModel: TimbreBlocModel) {
		this.authService.user$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			if (user?.getDroit() >= DroitEnum.PARTIEL) {
				if (timbreBlocModel.getType() == TypeTimbreEnum.BLOC) {
					timbreBlocModel.setType(TypeTimbreEnum.CARNET);
				} else if (timbreBlocModel.getType() == TypeTimbreEnum.CARNET) {
					timbreBlocModel.setType(TypeTimbreEnum.COLLECTOR);
				} else {
					timbreBlocModel.setType(TypeTimbreEnum.BLOC);
				}
				this.modifier(timbreBlocModel);
			} else {
				this.utilsService.droitInsuffisant();
			}
		});
	}

	modifier(timbreBlocModel: TimbreBlocModel) {
		timbreBlocModel.setTimbreBlocAcquisModel(null);
		this.firestore.collection(BaseEnum.TIMBRE_BLOC)
			.ref.where('id', '==', timbreBlocModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					doc.ref.update(Object.assign(new Object(), timbreBlocModel))
						.then((result) => {
							this.timbresBlocModel$.pipe(first(timbresBlocModel => isNotNullOrUndefined(timbresBlocModel) && timbresBlocModel?.length > 0)).subscribe(timbresBlocModel => {
								const findTimbreBloc: TimbreBlocModel = timbresBlocModel.find(timbreBloc => timbreBloc.getId() == timbreBlocModel.getId());
								if (isNotNullOrUndefined(findTimbreBloc)) {
									Object.assign(findTimbreBloc, timbreBlocModel);
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
					doc.ref.delete()
						.then((result) => {
							//this.getBlocs(this.timbreUtilsService.timbreCritereBlocModel, true);
							this.timbresBlocModel$.pipe(first()).subscribe(timbresBlocModel => {
								const findIndex: number = timbresBlocModel.findIndex(timbreBloc => timbreBloc.getId() == timbreBlocModel.getId());
								if (findIndex >= 0) {
									timbresBlocModel.splice(findIndex, 1);
									this.setTotal(timbreBlocModel, -1);
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
				if (timbreBlocModel?.getType() == TypeTimbreEnum.CARNET) {
					this.acquisCarnetDialog(timbreBlocModel, doublon);
				} else {
					this.acquis(timbreBlocModel, doublon);
				}
			} else {
				this.utilsService.droitInsuffisant();
			}
		});
	}

	acquisCarnetDialog(timbreBlocModel: TimbreBlocModel, doublon: boolean) {
		let text: string = "";
		if (timbreBlocModel?.getTimbreBlocAcquisModel()?.isDoublon() && doublon) {
			text = "enlever les doublons";
		} else if (timbreBlocModel?.getTimbreBlocAcquisModel()?.isAcquis()) {
			text = "enlever les acquis";
		} else {
			text = "mettre en " + (doublon ? "doublon" : "acquis") + " tous";
		}

		const dialogModal = this.dialog.open(LibModalComponent, {
			maxHeight: "95vh",
			data: {
				titre: "Confirmation",
				message: "Souhaitez-vous <b>" + text + "</b> les timbres du " + timbreBlocModel?.getType()?.toLowerCase() + " ?",
				btnDroite: "Oui",
				btnGauche: "Non",
			},
		});

		dialogModal.afterClosed().subscribe(() => {
			if (dialogModal.componentInstance.data.resultat === "valider") {
				this.authService.userSelect$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
					this.getTimbresByBlocAsync(timbreBlocModel.getId()).pipe(first()).subscribe(timbres => {
						timbres.forEach(timbreModel => {
							this.timbreUtilsService.acquis(timbreModel, doublon, !timbreBlocModel?.getTimbreBlocAcquisModel()?.isAcquis());
							//this.timbreUtilsService.supprimerAcquisTimbreByUser(user.getId(), timbreModel, doublon, !timbreBlocModel?.getTimbreBlocAcquisModel()?.isAcquis());
						});
					});
					this.acquis(timbreBlocModel, doublon);
				});
			}
		})
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

	modifAll() {
		const timbreCritereModel = new TimbreCritereModel();

		/*const annees: number[] = []
		for (let i = 1849; i < 1850; i++) {
			annees.push(i);
		}
		timbreCritereModel.setAnnees(annees);*/

		this.getAllBlocs(timbreCritereModel).pipe(first(blocs => blocs?.length > 0)).subscribe(blocs => {
			blocs.forEach(bloc => {
				if (bloc["carnet"] == true) {
					bloc["type"] = TypeTimbreEnum.CARNET;
				} else {
					bloc["type"] = TypeTimbreEnum.BLOC;
				}

				this.firestore.collection(BaseEnum.TIMBRE_BLOC)
					.ref.where('id', '==', bloc["id"])
					.get()
					.then(snapshot => {
						snapshot.forEach(doc => {
							doc.ref.update(bloc);
						});
					});
			})
		});
	}
}
