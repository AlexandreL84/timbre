import {Injectable} from '@angular/core';
import {TimbreModel} from '../../../model/timbre.model';
import {catchError, combineLatest, EMPTY, first, from, map, Observable, of, switchMap, throwError,} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {isNotNullOrUndefined, isNullOrUndefined} from '../../utils/utils';
import {AuthService} from '../auth.service';
import {BaseEnum} from '../../enum/base.enum';
import {UtilsService} from '../utils.service';
import {TimbreUtilsService} from './timbre-utils.service';
import {DroitEnum} from "../../enum/droit.enum";
import {TimbreModifierComponent} from "../../../modules/timbre/components/modifier/timbre-modifier.component";
import {LibModalComponent} from "../../components/lib-modal/lib-modal.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {PreferenceEnum} from "../../enum/preference.enum";
import {PreferenceService} from "../preference.service";
import {NotificationTypeEnum} from "../../enum/notification/notification-type.enum";
import {NotificationMessageEnum} from "../../enum/notification/notification-message.enum";
import {HttpResponseHandlerService} from "../httpResponseHandler.service";
import {TimbreVarService} from "./timbre-var.service";
import {TimbreService} from "./timbre.service";
import {TimbreTotalService} from "./timbre-total.service";
import {DossierEnum} from "../../enum/dossier.enum";
import {take, tap} from "rxjs/operators";
import {TimbreUploadService} from "./timbre-upload.service";
import {TimbreBlocModel} from "../../../model/timbre-bloc.model";
import {
	TimbreModifierBlocComponent
} from "../../../modules/timbre-bloc/components/modifier-bloc/timbre-modifier-bloc.component";
import {TypeTimbreEnum} from "../../enum/type-timbre.enum";
import {TimbreBlocService} from "./timbre-bloc.service";
import {UserModel} from "../../../model/user.model";

@Injectable()
export class TimbreActionsService {

	constructor(
		private angularFirestore: AngularFirestore,
		private authService: AuthService,
		private timbreService: TimbreService,
		private utilsService: UtilsService,
		private timbreUtilsService: TimbreUtilsService,
		private dialog: MatDialog,
		private preferenceService: PreferenceService,
		private httpResponseHandlerService: HttpResponseHandlerService,
		private timbreVarService: TimbreVarService,
		private timbreTotalService: TimbreTotalService,
		private timbreUploadService: TimbreUploadService,
		private timbreBlocService: TimbreBlocService,
	) {
	}

	save(timbreModel: TimbreModel, dialogRef: MatDialogRef<any>, ajout: boolean, message: boolean) {
		timbreModel.setMonnaie(this.timbreUtilsService.resolveMonnaie(timbreModel.getAnnee()));

		this.timbreVarService.loadModifTimbre$.next(false);
		let retryCount: number = 0;

		if (!(timbreModel.getImage() instanceof File) && timbreModel.getImage()?.toString()?.includes('firebase')) {
			this.validAjout(timbreModel, dialogRef, ajout, message);
		} else {
			combineLatest([
				this.timbreUploadService.upload(timbreModel, DossierEnum.AUTRE),
				this.timbreUploadService.upload(timbreModel, DossierEnum.ZOOM),
			]).pipe(
				tap(() => {
					if (retryCount > 0) {
						this.httpResponseHandlerService.showNotificationAlert(
							NotificationTypeEnum.RETRY, "Tentative " + retryCount + 1 + "/" + this.timbreVarService.retryMax + "...");
					}
					retryCount++;
				}),
				switchMap(([image, imageZoom]) => {
					const imagesInvalides = [image, imageZoom].filter(
						(img) => !isNotNullOrUndefined(img) || img === 'nok'
					);
					if (imagesInvalides.length > 0) {
						this.httpResponseHandlerService.showNotificationError(
							NotificationTypeEnum.TRANSACTION_NOK,
							ajout ? NotificationMessageEnum.TIMBRE_AJOUT_NOK : NotificationMessageEnum.TIMBRE_MODIF_NOK
						);
						return throwError(() => new Error("Upload incomplet"));
					}
					return of([image, imageZoom]);
				}),
				take(1),
				catchError(error => {
					this.httpResponseHandlerService.showNotificationError(
						NotificationTypeEnum.TRANSACTION_NOK,
						ajout ? NotificationMessageEnum.TIMBRE_AJOUT_NOK : NotificationMessageEnum.TIMBRE_MODIF_NOK
					);
					this.timbreVarService.loadModifTimbre$.next(true);
					return EMPTY;
				})
			).subscribe(([image, imageZoom]) => {
				if (this.timbreUtilsService.isValidImage(image)) {
					timbreModel.setImage(image);
				}
				if (this.timbreUtilsService.isValidImage(imageZoom)) {
					timbreModel.setImageZoom(imageZoom);
				}
				this.validAjout(timbreModel, dialogRef, ajout, message);
			});
		}
	}

	validAjout(timbreModel: TimbreModel, dialogRef: MatDialogRef<any>, ajout: boolean, message: boolean) {
		if (!ajout) {
			this.modifier(timbreModel, message);
		} else {
			this.ajouter(timbreModel, message);
		}
		this.timbreVarService.loadModifTimbre$.next(true);

		if (isNotNullOrUndefined(dialogRef)) {
			dialogRef.close();
		}
	}

	ajouterSansId(timbreModel: TimbreModel) {
		console.log("ajouterSansId")
		this.utilsService.getMaxIdentAsync(BaseEnum.TIMBRE).pipe(first()).subscribe(id => {
			if (isNullOrUndefined(id)) {
				id = 1;
			}
			timbreModel.setId(id);
			if (isNotNullOrUndefined(timbreModel.getIdBloc())) {
				//timbreModel.setAnnee(null);
				timbreModel.setMonnaie(null);
			}
			this.ajouter(timbreModel, true);
		});
	}

	ajouter(timbreModel: TimbreModel, message: boolean) {
		this.timbreService.getTimbre(timbreModel.getId()).pipe(first()).subscribe(data => {
			if (isNullOrUndefined(data) || isNullOrUndefined(data[0]) || (isNotNullOrUndefined(data[0]) && data[0]?.length == 0)) {
				timbreModel.setTimbreBlocModel(null);

				this.angularFirestore.collection(BaseEnum.TIMBRE).add(
					this.getTimbreEnvoi(timbreModel)
				).then((result) => {
					this.preferenceService.getTimbreCritere(PreferenceEnum.TIMBRE_CRITERE).pipe(first()).subscribe(timbreCritereModel => {
						if (isNotNullOrUndefined(timbreCritereModel.getAnnees().find(annee => annee == timbreModel.getAnnee()))) {
							this.timbreVarService.timbres$.pipe(first()).subscribe(timbres => {
								if (isNullOrUndefined(timbres)) {
									timbres = [];
								}
								timbres.push(timbreModel);
								this.timbreVarService.timbres$.next(timbres);
								this.timbreTotalService.setTotal(1);
							});
						}
					});

					this.timbreVarService.reinitResume$.next(true);
					this.timbreVarService.addMaxIdentTimbre();

					if (message) {
						this.httpResponseHandlerService.showNotificationSuccess(
							NotificationTypeEnum.TRANSACTION_OK, NotificationMessageEnum.TIMBRE_AJOUT
						);
					}
				})
					.catch((error) => {
						//console.error("Erreur d'ajout :", error);
						this.httpResponseHandlerService.showNotificationError(
							NotificationTypeEnum.TRANSACTION_NOK, NotificationMessageEnum.TIMBRE_AJOUT_NOK
						);
					});
			} else {
				this.httpResponseHandlerService.showNotificationAlert(
					NotificationTypeEnum.TRANSACTION_NOK, NotificationMessageEnum.ID_EXIST
				);
			}
		});
	}

	getTimbreEnvoi(timbreModel: TimbreModel) {
		return (({timbreBlocModel, ...rest}) => rest)(Object.assign({}, timbreModel))
	}

	modifier(timbreModel: TimbreModel, message: boolean) {
		this.angularFirestore.collection(BaseEnum.TIMBRE)
			.ref.where('id', '==', timbreModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					doc.ref.update(this.getTimbreEnvoi(timbreModel))
						.then((result) => {
							this.timbreVarService.timbres$.pipe(first(timbres => isNotNullOrUndefined(timbres) && timbres?.length > 0)).subscribe(timbres => {
								const findTimbre: TimbreModel = timbres.find(timbre => timbre.getId() == timbreModel.getId());
								if (isNotNullOrUndefined(findTimbre)) {
									Object.assign(findTimbre, timbreModel);
								}
								if (message) {
									this.httpResponseHandlerService.showNotificationSuccess(
										NotificationTypeEnum.TRANSACTION_OK, NotificationMessageEnum.TIMBRE_MODIF
									);
								}
							});
						})
						.catch((error) => {
							//console.error('Erreur de mise à jour :', error);
							this.httpResponseHandlerService.showNotificationError(
								NotificationTypeEnum.TRANSACTION_NOK, NotificationMessageEnum.TIMBRE_MODIF_NOK
							);
						});
				});
			})
			.catch(error => {
				this.httpResponseHandlerService.showNotificationError(
					NotificationTypeEnum.TRANSACTION_NOK, NotificationMessageEnum.ID_INTROUVABLE
				);
			});
	}

	supprimerTimbre(timbreModel: TimbreModel, message: boolean) {
		console.log(timbreModel);
		this.angularFirestore.collection(BaseEnum.TIMBRE)
			.ref.where('id', '==', timbreModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					doc.ref.delete()
						.then((result) => {
							this.timbreUploadService.supprimerImages(timbreModel);

							this.timbreVarService.timbres$.pipe(first()).subscribe(timbresModel => {
								const findIndex: number = timbresModel.findIndex(timbre => timbre.getId() == timbreModel.getId());
								if (findIndex >= 0) {
									timbresModel.splice(findIndex, 1);
									this.timbreTotalService.setTotal(-1);
									this.timbreVarService.timbres$.next(timbresModel);
								}

								if (message) {
									this.httpResponseHandlerService.showNotificationSuccess(
										NotificationTypeEnum.TRANSACTION_OK, NotificationMessageEnum.TIMBRE_SUPPRIM
									);
								}
							});
						})
						.catch((error) => {
							this.httpResponseHandlerService.showNotificationError(
								NotificationTypeEnum.TRANSACTION_NOK, NotificationMessageEnum.TIMBRE_SUPPRIM_NOK
							);
						});
				});
			})
			.catch(error => {
				this.httpResponseHandlerService.showNotificationAlert(
					NotificationTypeEnum.TRANSACTION_NOK, NotificationMessageEnum.ID_INTROUVABLE
				);
			});
	}

	supprimer(timbreModel: TimbreModel) {
		this.supprimerTimbre(timbreModel, true);
		this.timbreVarService.reinitResume$.next(true);
	}

	acquis(timbreModel: TimbreModel, acquis: boolean) {
		this.authService.user$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			if (user?.getDroit() >= DroitEnum.PARTIEL) {
				if (acquis) {
					if (isNotNullOrUndefined(timbreModel.getTimbreBlocModel())) {
						timbreModel.getTimbreBlocModel().addTimbresAcquisByUser(user);
						this.verifAcquisDoublonBloc(timbreModel.getTimbreBlocModel(), user);
					}
					timbreModel.addUserAcquis(user);
				} else {
					if (isNotNullOrUndefined(timbreModel.getTimbreBlocModel())) {
						timbreModel.getTimbreBlocModel().removeTimbresAcquisByUser(user);
						if (timbreModel.getUsersDoublon()?.findIndex(userDoublon => userDoublon == user.getId()) >= 0) {
							timbreModel.getTimbreBlocModel().removeUserDoublon(user);
						}
						this.verifAcquisDoublonBloc(timbreModel.getTimbreBlocModel(), user);
					}
					timbreModel.removeUserAcquis(user);
					timbreModel.removeUserDoublon(user);
				}
				this.modifier(timbreModel, false);
				//this.verifBloc(timbreModel.getTimbreBlocModel());
				this.timbreVarService.reinitResume$.next(true);
			} else {
				this.utilsService.droitInsuffisant();
			}
		});
	}

	doublon(timbreModel: TimbreModel, doublon: boolean) {
		this.authService.user$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			if (user?.getDroit() >= DroitEnum.PARTIEL) {
				if (doublon) {
					if (isNotNullOrUndefined(timbreModel.getTimbreBlocModel())) {
						timbreModel.getTimbreBlocModel().addTimbresDoublonByUser(user);
						timbreModel.getTimbreBlocModel().addTimbresDoublonByUser(user);
						this.verifAcquisDoublonBloc(timbreModel.getTimbreBlocModel(), user);
					}
					timbreModel.addUserAcquis(user);
					timbreModel.addUserDoublon(user);
				} else {
					if (isNotNullOrUndefined(timbreModel.getTimbreBlocModel())) {
						timbreModel.getTimbreBlocModel().removeTimbresDoublonByUser(user);
						this.verifAcquisDoublonBloc(timbreModel.getTimbreBlocModel(), user);
					}
					timbreModel.removeUserDoublon(user);
				}
				this.modifier(timbreModel, false);
				//this.verifBloc(timbreModel.getTimbreBlocModel());
				this.timbreVarService.reinitResume$.next(true);
			} else {
				this.utilsService.droitInsuffisant();
			}
		});
	}

	verifAcquisDoublonBloc(timbreBlocModel: TimbreBlocModel, user: UserModel) {
		if (timbreBlocModel?.getNbTimbresAcquisByUser(user) == 0 && timbreBlocModel.isAcquis(user)) {
			timbreBlocModel.removeUserAcquis(user);
		} else if (timbreBlocModel?.getNbTimbres() == timbreBlocModel?.getNbTimbresAcquisByUser(user)) {
			timbreBlocModel.addUserAcquis(user);
		}
		if (timbreBlocModel?.getNbTimbresDoublonByUser(user) == 0 && timbreBlocModel.isDoublon(user)) {
			timbreBlocModel.removeUserDoublon(user);
		} else if (timbreBlocModel?.getNbTimbres() == timbreBlocModel?.getNbTimbresDoublonByUser(user)) {
			timbreBlocModel.addUserDoublon(user);
		}
		this.modifierBloc(timbreBlocModel, false);
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
		});
	}



	/* PARTIE BLOC */


	saveBloc(timbreBlocModel: TimbreBlocModel, dialogRef: MatDialogRef<any>, ajout?: boolean) {
		timbreBlocModel.setMonnaie(this.timbreUtilsService.resolveMonnaie(timbreBlocModel.getAnnee()));
		let retryCount: number = 0;

		if (!(timbreBlocModel.getImage() instanceof File) && timbreBlocModel.getImage()?.toString()?.includes('firebase')) {
			this.validAjoutBloc(timbreBlocModel, dialogRef, ajout);
		} else {
			combineLatest([
				this.timbreUploadService.uploadBloc(timbreBlocModel, DossierEnum.AUTRE),
				this.timbreUploadService.uploadBloc(timbreBlocModel, DossierEnum.ZOOM),
			]).pipe(
				tap(() => {
					if (retryCount > 0) {
						this.httpResponseHandlerService.showNotificationAlert(
							NotificationTypeEnum.RETRY, "Tentative " + retryCount + 1 + "/" + this.timbreVarService.retryMax + "...");
					}
					retryCount++;
				}),
				switchMap(([image, imageZoom]) => {
					const imagesInvalides = [image, imageZoom].filter(
						(img) => !isNotNullOrUndefined(img) || img === 'nok'
					);
					if (imagesInvalides.length > 0) {
						this.httpResponseHandlerService.showNotificationError(
							NotificationTypeEnum.TRANSACTION_NOK,
							ajout ? NotificationMessageEnum.TIMBRE_AJOUT_NOK : NotificationMessageEnum.TIMBRE_MODIF_NOK
						);
						return throwError(() => new Error("Upload incomplet"));
					}
					return of([image, imageZoom]);
				}),
				take(1),
				catchError(error => {
					this.httpResponseHandlerService.showNotificationError(
						NotificationTypeEnum.TRANSACTION_NOK,
						ajout ? NotificationMessageEnum.TIMBRE_AJOUT_NOK : NotificationMessageEnum.TIMBRE_MODIF_NOK
					);
					this.timbreVarService.loadModifBloc$.next(true);
					return EMPTY;
				})
			).subscribe(([image, imageZoom]) => {
				if (this.timbreUtilsService.isValidImage(image)) {
					timbreBlocModel.setImage(image);
				}
				if (this.timbreUtilsService.isValidImage(imageZoom)) {
					timbreBlocModel.setImageZoom(imageZoom);
				}
				this.validAjoutBloc(timbreBlocModel, dialogRef, ajout);
			});
		}
	}

	validAjoutBloc(timbreBlocModel: TimbreBlocModel, dialogRef: MatDialogRef<any>, ajout: boolean) {
		if (!ajout) {
			this.ajouterBloc(timbreBlocModel);
		} else {
			this.ajouterBloc(timbreBlocModel).pipe(first()).subscribe(verifAjout => {
				if (verifAjout && timbreBlocModel?.getTimbres()?.length > 0) {
					this.saveTimbres(timbreBlocModel, ajout);
				}
			});
		}

		this.timbreVarService.loadModifBloc$.next(true);

		if (isNotNullOrUndefined(dialogRef)) {
			dialogRef.close();
		}
	}

	saveTimbres(timbreBlocModel: TimbreBlocModel, ajout: boolean) {
		if (timbreBlocModel?.getTimbres()?.length > 0) {
			this.utilsService.getMaxIdentAsync(BaseEnum.TIMBRE).pipe(first()).subscribe(id => {
				timbreBlocModel?.getTimbres().forEach((timbreModel, index) => {
					timbreModel.setIdBloc(timbreBlocModel.getId());
					timbreModel.setTimbreBlocModel(timbreBlocModel);
					timbreModel.setAnnee(timbreBlocModel.getAnnee());
					timbreModel.setId(id);
					id++;

					this.save(timbreModel, null, true, false)
				});
			});
		}
	}


	ajouterBlocSansId(timbreBlocModel: TimbreBlocModel) {
		this.utilsService.getMaxIdentAsync(BaseEnum.TIMBRE_BLOC).pipe(first()).subscribe(id => {
			timbreBlocModel.setId(id);
			this.ajouterBloc(timbreBlocModel);
		});
	}

	getBlocEnvoi(timbreBlocModel: TimbreBlocModel) {
		return (({
					 timbres,
					 idOrigine,
					 nbTimbres,
					 ...rest
				 }) => rest)(Object.assign({}, timbreBlocModel));
	}

	ajouterBloc(timbreBlocModel: TimbreBlocModel): Observable<boolean> {
		return this.timbreBlocService.getBloc(timbreBlocModel.getId()).pipe(
			first(),
			switchMap(data => {
				if (isNullOrUndefined(data) || isNullOrUndefined(data[0]) || (isNotNullOrUndefined(data[0]) && data[0]?.length == 0)) {
					const plainData = JSON.parse(JSON.stringify(this.getBlocEnvoi(timbreBlocModel)));
					return from(
						this.angularFirestore.collection(BaseEnum.TIMBRE_BLOC).add(
							this.getBlocEnvoi(plainData),
						)
					).pipe(
						switchMap(() =>
							this.preferenceService.getTimbreCritere(PreferenceEnum.TIMBRE_CRITERE).pipe(
								first(),
								switchMap(timbreCritereModel => {
									if (isNotNullOrUndefined(timbreCritereModel.getAnnees().find(annee => annee == timbreBlocModel.getAnnee()))) {
										return this.timbreVarService.timbresBlocModel$.pipe(
											first(),
											tap(timbresBlocModel => {
												if (isNullOrUndefined(timbresBlocModel)) {
													timbresBlocModel = [];
												}
												timbresBlocModel.push(timbreBlocModel);
												this.timbreVarService.timbresBlocModel$.next(timbresBlocModel);
												this.timbreTotalService.setTotalBloc(timbreBlocModel, 1);
											})
										);
									}
									return of(null);
								})
							)
						),
						tap(() => {
							this.httpResponseHandlerService.showNotificationSuccess(
								NotificationTypeEnum.TRANSACTION_OK, NotificationMessageEnum.BLOC_AJOUT
							);
							this.timbreVarService.addMaxIdentBloc();
							this.timbreVarService.reinitResume$.next(true);
						}),
						map(() => true),
						catchError(error => {
							this.httpResponseHandlerService.showNotificationError(
								NotificationTypeEnum.TRANSACTION_NOK, NotificationMessageEnum.BLOC_AJOUT_NOK
							);
							return of(false);
						})
					);
				} else {
					this.httpResponseHandlerService.showNotificationAlert(
						NotificationTypeEnum.TRANSACTION_NOK, NotificationMessageEnum.ID_BLOC_EXIST
					);
					return of(false);
				}
			})
		);
	}

	modifierBloc(timbreBlocModel: TimbreBlocModel, message: boolean) {
		this.angularFirestore.collection(BaseEnum.TIMBRE_BLOC)
			.ref.where('id', '==', timbreBlocModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					const plainData = JSON.parse(JSON.stringify(this.getBlocEnvoi(timbreBlocModel)));
					doc.ref.update(plainData)
						.then((result) => {
							this.timbreVarService.timbresBlocModel$.pipe(first(timbresBlocModel => isNotNullOrUndefined(timbresBlocModel) && timbresBlocModel?.length > 0)).subscribe(timbresBlocModel => {
								const findTimbreBloc: TimbreBlocModel = timbresBlocModel.find(timbreBloc => timbreBloc.getId() == timbreBlocModel.getId());
								if (isNotNullOrUndefined(findTimbreBloc)) {
									Object.assign(findTimbreBloc, timbreBlocModel);
								}
								this.timbreVarService.timbresBlocModel$.next(timbresBlocModel);
							});
							if (message) {
								this.httpResponseHandlerService.showNotificationSuccess(
									NotificationTypeEnum.TRANSACTION_OK, NotificationMessageEnum.BLOC_MODIF
								);
							}
						})
						.catch((error) => {
							//console.error('Erreur de mise à jour :', error);
							if (message) {
								this.httpResponseHandlerService.showNotificationError(
									NotificationTypeEnum.TRANSACTION_NOK, NotificationMessageEnum.BLOC_MODIF_NOK
								);
							}
						});
				});
			})
			.catch(error => {
				//console.error('Erreur de mise à jour id introuvable :', error);
				if (message) {
					this.httpResponseHandlerService.showNotificationError(
						NotificationTypeEnum.TRANSACTION_NOK, NotificationMessageEnum.ID_BLOC_INTROUVABLE
					);
				}
			});
	}


	supprimerBloc(timbreBlocModel: TimbreBlocModel) {
		this.timbreBlocService.getTimbresByBlocAsync(timbreBlocModel.getId()).pipe(first()).subscribe(timbres => {
			timbres.forEach(timbreModel => {
				this.supprimerTimbre(timbreModel, false);
			});
		});

		this.angularFirestore.collection(BaseEnum.TIMBRE_BLOC)
			.ref.where('id', '==', timbreBlocModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					doc.ref.delete()
						.then((result) => {
							this.timbreUploadService.supprimerImages(timbreBlocModel);

							this.timbreVarService.timbresBlocModel$.pipe(first()).subscribe(timbresBlocModel => {
								const findIndex: number = timbresBlocModel.findIndex(timbreBloc => timbreBloc.getId() == timbreBlocModel.getId());
								if (findIndex >= 0) {
									timbresBlocModel.splice(findIndex, 1);
									this.timbreVarService.timbresBlocModel$.next(timbresBlocModel);
									this.timbreTotalService.setTotalBloc(timbreBlocModel, -1);
								}
							});
							this.httpResponseHandlerService.showNotificationSuccess(
								NotificationTypeEnum.TRANSACTION_OK, NotificationMessageEnum.BLOC_SUPPRIM
							);
						})
						.catch((error) => {
							//console.error('Erreur de suppression :', error);
							this.httpResponseHandlerService.showNotificationError(
								NotificationTypeEnum.TRANSACTION_NOK, NotificationMessageEnum.BLOC_SUPPRIM_NOK
							);
						});
				});
			})
			.catch(error => {
				//console.error('Erreur de suppression id introuvable :', error);
				this.httpResponseHandlerService.showNotificationError(
					NotificationTypeEnum.TRANSACTION_NOK, NotificationMessageEnum.ID_BLOC_INTROUVABLE
				);
			});
		this.timbreVarService.reinitResume$.next(true);
	}


	// a verifier acquisCarnetDialog
	acquisCarnetDialog(timbreBlocModel: TimbreBlocModel, doublon: boolean) {
		this.authService.userSelect$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			let text: string = "";
			if (!timbreBlocModel?.isDoublon(user) && doublon) {
				text = "enlever les doublons";
			} else if (!timbreBlocModel?.isAcquis(user)) {
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
						this.timbreBlocService.getTimbresByBlocAsync(timbreBlocModel.getId()).pipe(first()).subscribe(timbres => {
							timbres.forEach(timbreModel => {
								if (doublon) {
									if (timbreBlocModel?.isDoublon(user)) {
										timbreModel.addUserAcquis(user);
										timbreModel.addUserDoublon(user);
									} else {
										timbreModel.removeUserDoublon(user);
									}
								} else {
									if (timbreBlocModel?.isAcquis(user)) {
										timbreModel.addUserAcquis(user);
									} else {
										timbreModel.removeUserAcquis(user);
										timbreModel.removeUserDoublon(user);
									}
								}
								this.modifier(timbreModel, false)
							});

							if (doublon) {
								if (timbreBlocModel?.isDoublon(user)) {
									timbreBlocModel.addTimbresAcquisByUser(user, timbreBlocModel.getNbTimbres());
									timbreBlocModel.addTimbresDoublonByUser(user, timbreBlocModel.getNbTimbres());
									this.modifierBloc(timbreBlocModel, false);
								} else {
									this.removeAllTimbresByUser(user, timbreBlocModel, false);
								}
							} else {
								if (timbreBlocModel?.isAcquis(user)) {
									console.log(timbreBlocModel.getNbTimbres())
									timbreBlocModel.addTimbresAcquisByUser(user, timbreBlocModel.getNbTimbres());
									this.modifierBloc(timbreBlocModel, false);
								} else {
									this.removeAllTimbresByUser(user, timbreBlocModel, true);
								}
							}
						});
					});
				}
			})
		})
	}

	removeAllTimbresByUser(user: UserModel, timbreBlocModel: TimbreBlocModel, acquis: boolean) {
		if (isNotNullOrUndefined(user) && isNotNullOrUndefined(timbreBlocModel.nbTimbresAcquisByUser)) {
			const find = timbreBlocModel.nbTimbresAcquisByUser.find(timbreBlocAcquis => timbreBlocAcquis.getIdUser() == user?.getId());
			if (isNotNullOrUndefined(find)) {
				let trouve: boolean = false;
				if (acquis && find.getNbAcquis() > 0) {
					find.setNbAcquis(0);
					trouve = true;
				}
				if (find.getNbDoublon() > 0) {
					find.setNbDoublon(0);
					trouve = true;
				}

				if (trouve) {
					this.modifierBloc(timbreBlocModel, false);
				}
			}
		}
	}

	modifierBlocDialog(timbreBlocModel: TimbreBlocModel) {
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

	supprimerBlocDialog(timbreBlocModel: TimbreBlocModel) {
		this.timbreBlocService.getTimbresByBlocAsync(timbreBlocModel.getId()).pipe(first()).subscribe(timbres => {
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
					this.supprimerBloc(timbreBlocModel)
				}
			});
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
				this.modifierBloc(timbreBlocModel, true);
			} else {
				this.utilsService.droitInsuffisant();
			}
		});
	}

	acquisBloc(timbreBlocModel: TimbreBlocModel, acquis: boolean) {
		this.authService.userSelect$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			if (user?.getDroit() >= DroitEnum.PARTIEL) {
				if (acquis) {
					timbreBlocModel.addUserAcquis(user);
				} else {
					timbreBlocModel.removeUserAcquis(user);
					timbreBlocModel.removeUserDoublon(user);
				}
				this.modifierBloc(timbreBlocModel, true);
				if (timbreBlocModel?.getNbTimbres() > 0) {
					this.acquisCarnetDialog(timbreBlocModel, false);
				}
				this.timbreVarService.reinitResume$.next(true);
			} else {
				this.utilsService.droitInsuffisant();
			}
		});
	}

	doublonBloc(timbreBlocModel: TimbreBlocModel, doublon: boolean) {
		this.authService.userSelect$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			if (user?.getDroit() >= DroitEnum.PARTIEL) {
				if (doublon) {
					timbreBlocModel.addUserAcquis(user);
					timbreBlocModel.addUserDoublon(user);
				} else {
					timbreBlocModel.removeUserDoublon(user);
				}
				this.modifierBloc(timbreBlocModel, true);
				if (timbreBlocModel?.getNbTimbres() > 0) {
					this.acquisCarnetDialog(timbreBlocModel, true);
				}
				this.timbreVarService.reinitResume$.next(true);
			} else {
				this.utilsService.droitInsuffisant();
			}
		});
	}
}
