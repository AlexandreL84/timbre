import {Injectable} from '@angular/core';
import {first, map, Observable, switchMap} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {PreferenceModel} from "../../model/preference.model";
import {BaseEnum} from "../enum/base.enum";
import {plainToInstance} from "class-transformer";
import {isNotNullOrUndefined} from "../utils/utils";
import {AuthService} from "./auth.service";
import {TimbreCritereModel} from "../../model/timbre-critere.model";
import {PreferenceEnum} from "../enum/preference.enum";

@Injectable()
export class PreferenceService {
	public timbreCritereModel: TimbreCritereModel = new TimbreCritereModel();
	public timbreCritereBlocModel: TimbreCritereModel = new TimbreCritereModel();

	constructor(
		private firestore: AngularFirestore,
		private authService: AuthService,
	) {
	}

	getTimbreCritere(key: PreferenceEnum): Observable<TimbreCritereModel> {
		return this.getPreferencesByKey(key).pipe(
			first(),
			map((preference) => {
				if (isNotNullOrUndefined(preference)) {
					const timbreCritereModel:TimbreCritereModel  = plainToInstance(TimbreCritereModel, preference.getValue());
					if (key == PreferenceEnum.TIMBRE_CRITERE) {
						this.timbreCritereModel = timbreCritereModel;
					} else if (key == PreferenceEnum.BLOC_CRITERE) {
						this.timbreCritereBlocModel = timbreCritereModel;
					}
					return timbreCritereModel;
				}
				return new TimbreCritereModel();
			}));
	}

	getPreferencesByKey(key: PreferenceEnum): Observable<PreferenceModel> {
		const preferenceModel = new PreferenceModel(key);

		return this.authService.userSelect$.pipe(
			first(userSelect => isNotNullOrUndefined(userSelect)),
			switchMap((userSelect) => {
				if (isNotNullOrUndefined(userSelect)) {
					preferenceModel.setIdUser(userSelect.getId());

					return this.firestore.collection(BaseEnum.PREFERENCE, ref => {
						return this.getRef(ref, preferenceModel);
					}).valueChanges()
						.pipe(first(), map(preferences => {
							if (isNotNullOrUndefined(preferences) && preferences?.length > 0) {
									return this.constructPreferences(preferences)[0];
								}
							}
						));
				}
				return null;
			}));
	}

	getRef(ref, preferenceModel: PreferenceModel) {
		let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
		if (isNotNullOrUndefined(preferenceModel)) {
			if (isNotNullOrUndefined(preferenceModel.getIdUser())) {
				filteredQuery = filteredQuery.where("idUser", "==", preferenceModel.getIdUser());
			}
			if (isNotNullOrUndefined(preferenceModel.getKey())) {
				filteredQuery = filteredQuery.where("key", "==", preferenceModel.getKey());
			}
			/*
			if (isNotNullOrUndefined(preferenceModel.getValue())) {
				filteredQuery = filteredQuery.where("value", "==", preferenceModel.getValue());
			}*/
		}
		return filteredQuery;
	}

	getPreference(preferenceModel: PreferenceModel): Observable<any> {
		return this.firestore.collection(BaseEnum.PREFERENCE, ref => {
			return this.getRef(ref, preferenceModel);
		}).valueChanges();
	}

	ajouter(key: string, value: any) {
		/*const findIndex: number = value.findIndex(value => isNotNullOrUndefined(value["type"]));
		if (findIndex >= 0) {
			value.splice(findIndex, 1);
		}*/
		//value.splice(value.indexOf("type"), 1);
		const jsonString = JSON.stringify(value);

		const preferenceModel = new PreferenceModel(key, jsonString);
		this.authService.userSelect$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			preferenceModel.setIdUser(user.getId());
			this.getPreference(preferenceModel).pipe(first()).subscribe(preferenceModelTrouve => {
				if (isNotNullOrUndefined(preferenceModelTrouve) && preferenceModelTrouve?.length > 0) {
					console.error("préférence déjà existante");
				} else {
					this.firestore.collection(BaseEnum.PREFERENCE).add(
						Object.assign(new Object(), preferenceModel)
					)
						.then((result) => {
						})
						.catch((error) => {
							console.error("Erreur d'ajout :", error);
						});
				}
			});
		});
	}


	modifier(key: string, value: any) {
		const jsonString = JSON.stringify(value);
		const preferenceModel = new PreferenceModel(key, jsonString);
		this.authService.userSelect$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			preferenceModel.setIdUser(user.getId());

			this.firestore.collection(BaseEnum.PREFERENCE, ref => {
				return this.getRef(ref, preferenceModel);
			})
				.get()
				.pipe().subscribe(snapshot => {

				if (isNotNullOrUndefined(snapshot) && snapshot?.size > 0) {
					snapshot.forEach(doc => {
						doc.ref.update(Object.assign(new Object(), preferenceModel))
							.then((result) => {
							})
							.catch((error) => {
								console.error('Erreur de modification :', error);
							});
					});
				} else {
					this.ajouter(key, value)
				}
			});
		});
	}

	supprimer(key: string) {
		const preferenceModel = new PreferenceModel(key);
		this.authService.userSelect$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			preferenceModel.setIdUser(user.getId());
			this.firestore.collection(BaseEnum.PREFERENCE, ref => {
				return this.getRef(ref, preferenceModel);
			})
				.get()
				.pipe().subscribe(snapshot => {
				if (isNotNullOrUndefined(snapshot) && snapshot?.size > 0) {
					snapshot.forEach(doc => {
						doc.ref.delete()
							.then((result) => {
							})
							.catch((error) => {
								console.error('Erreur de modification :', error);
							});
					});
				}
			})
		});
	}

	supprimerTout() {
		const preferenceModel = new PreferenceModel();
		this.authService.userSelect$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			preferenceModel.setIdUser(user.getId());
			this.firestore.collection(BaseEnum.PREFERENCE, ref => {
				return this.getRef(ref, preferenceModel);
			})
				.get()
				.pipe().subscribe(snapshot => {
				if (isNotNullOrUndefined(snapshot) && snapshot?.size > 0) {
					snapshot.forEach(doc => {
						doc.ref.delete()
							.then((result) => {
							})
							.catch((error) => {
								console.error('Erreur de modification :', error);
							});
					});
				}
			})
		});
	}

	/*supprimer(preferenceModel: PreferenceModel) {
		this.getPreference(preferenceModel).pipe(first(preferenceModel => isNotNullOrUndefined(preferenceModel))).subscribe(oldPreferenceModel => {
			oldPreferenceModel.ref.delete()
				.then((result) => {
				})
				.catch((error) => {
					console.error("Erreur de suppression :", error);
				});
		});
	}*/

	constructPreferences(preferences): PreferenceModel[] {
		let preferencesModel: PreferenceModel[] = [];
		if (preferences?.length > 0) {
			preferences.forEach((preference: any) => {
				preferencesModel.push(new PreferenceModel(preference.key, JSON.parse(preference.value), preference.idUser));
			});
		}
		return preferencesModel;
	}

	getAllPreferences(): Observable<any> {
		return this.firestore.collection(BaseEnum.PREFERENCE, null).valueChanges();
	}
}
