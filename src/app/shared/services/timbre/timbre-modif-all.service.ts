import {Injectable} from '@angular/core';
import {TimbreModel} from '../../../model/timbre.model';
import {combineLatest, first, Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {isNotNullOrUndefined, isNullOrUndefined} from '../../utils/utils';
import {TimbreCritereModel} from '../../../model/timbre-critere.model';
import {BaseEnum} from '../../enum/base.enum';
import {UserModel} from '../../../model/user.model';
import {plainToInstance} from "class-transformer";
import {TypeTimbreEnum} from "../../enum/type-timbre.enum";
import {TimbreBlocModel} from "../../../model/timbre-bloc.model";
import {TimbreOldModel} from "../../../model/OLD/timbre-old.model";
import {TimbreAcquisOldModel} from "../../../model/OLD/timbre-acquis-old.model";
import {TimbreBlocOldModel} from "../../../model/OLD/timbre-bloc-old.model";
import {TimbreBlocAcquisOldModel} from "../../../model/OLD/timbre-bloc-acquis-old.model";

@Injectable()
export class TimbreModifAllService {

	constructor(
		private angularFirestore: AngularFirestore,
	) {
	}

	getAnnees(): number[] {
		/*
		let anneeDepart = 1926;
		if (baseEmun == BaseEnum.TIMBRE) {
			anneeDepart = 1849
		}*/
		//1920
		const anneeDebut = 1840;
		const anneeFin = 1849;
		const annees: number[] = []
		for (let i = anneeDebut; i <= anneeFin; i++) {
			annees.push(i);
		}
		return annees;
	}

	verifNbTimbres(annee?: number) {
		const timbreCritereModel = new TimbreCritereModel();
		timbreCritereModel.initCritere();
		timbreCritereModel.setType([TypeTimbreEnum.CARNET, TypeTimbreEnum.BLOC]);
		timbreCritereModel.setAnnees(isNotNullOrUndefined(annee)? [annee] : this.getAnnees());

		combineLatest([
			this.getAllTimbres(timbreCritereModel, BaseEnum.TIMBRE),
			this.getAllBlocs(timbreCritereModel, BaseEnum.TIMBRE_BLOC),
		]).pipe(first(([timbres, blocs]) => isNotNullOrUndefined(timbres) && timbres?.length > 0 && isNotNullOrUndefined(blocs) && blocs?.length > 0)).subscribe(([timbres, blocs]) => {

			let timbresModel: TimbreModel[] = [];
			let blocsModel: TimbreBlocModel[] = [];

			blocs.forEach(bloc => {
				blocsModel.push(plainToInstance(TimbreBlocModel, bloc));
			});

			timbres.forEach(timbre => {
				const newTimbre: TimbreModel = plainToInstance(TimbreModel, timbre)
				if (isNotNullOrUndefined(newTimbre.getIdBloc())) {
					timbresModel.push(newTimbre);
				}
			});

			if (timbresModel?.length > 0) {
				let blocsModelModif: TimbreBlocModel[] = [];
				blocsModel.forEach(bloc => {
					bloc.setNbTimbres(timbresModel.filter(timbre => timbre?.getIdBloc() == bloc.getId())?.length);

					const listeUserAcquis = timbresModel.filter(timbre => timbre?.getIdBloc() == bloc.getId() && timbre.getUsersAcquis()?.length > 0);
					if (listeUserAcquis?.length > 0) {
						listeUserAcquis.forEach(timbreModel => {
							timbreModel.getUsersAcquis().forEach(user => {
								const userModel = new UserModel();
								userModel.setId(user);
								bloc.addTimbresAcquisByUser(userModel);
							});
						});
					}

					const listeUserDoublon = timbresModel.filter(timbre => timbre?.getIdBloc() == bloc.getId() && timbre.getUsersDoublon()?.length > 0);
					if (listeUserDoublon?.length > 0) {
						listeUserDoublon.forEach(timbreModel => {
							timbreModel.getUsersDoublon().forEach(user => {
								const userModel = new UserModel();
								userModel.setId(user);
								bloc.addTimbresDoublonByUser(userModel);
							});
						});
					}
					blocsModelModif.push(bloc);
				});

				if (blocsModelModif?.length > 0) {
					blocsModelModif.forEach(bloc => {
						//console.log(bloc);
						this.modifierBloc(bloc);
					})
				}
			}

			//console.log(blocsModelModif);
		})
	}

	ajoutAll() {
		const timbreCritereModel = new TimbreCritereModel();
		timbreCritereModel.initCritere();
		timbreCritereModel.setAnnees(this.getAnnees());

		this.getAllTimbres(timbreCritereModel, "/timbres").pipe(first())
			.subscribe(timbres => {
				let timbresRetour: TimbreModel[] = [];
				if (isNotNullOrUndefined(timbres) && timbres.length > 0) {
					timbres.forEach(timbre => {
						const timbreModel: TimbreOldModel = plainToInstance(TimbreOldModel, timbre);
						this.ajouter(timbreModel)
						timbresRetour.push(timbreModel);
					})
				}

				//console.log(timbresRetour)
			});
	}

	addAllAcquis() {
		const user = new UserModel();
		const timbreCritereModel = new TimbreCritereModel();
		timbreCritereModel.initCritere();
		timbreCritereModel.setAnnees(this.getAnnees());

		this.getAllTimbres(timbreCritereModel, BaseEnum.TIMBRE).pipe(first())
			.subscribe(timbres => {
				let timbresRetourAcquis: TimbreModel[] = [];
				let timbresRetour: TimbreModel[] = [];
				if (isNotNullOrUndefined(timbres) && timbres.length > 0) {
					timbres.forEach(timbre => {
						const timbreModel: TimbreModel = plainToInstance(TimbreModel, timbre);
						timbresRetour.push(timbreModel);
					});

					this.getAll("timbres_acquis").pipe(first()).subscribe(timbresAcquis => {
						if (isNotNullOrUndefined(timbresAcquis) && timbresAcquis.length > 0) {
							timbresAcquis.forEach(timbreAcquis => {
								const timbreAcquisOldModel: TimbreAcquisOldModel = plainToInstance(TimbreAcquisOldModel, timbreAcquis);

								const timbre = timbresRetour.find(timbre => timbre.getId() == timbreAcquisOldModel.idTimbre);
								//console.log(timbre)
								if (isNotNullOrUndefined(timbre)) {
									if (timbreAcquisOldModel.acquis) {
										user.setId(timbreAcquisOldModel.idUser);
										timbre.addUserAcquis(user);
									}
									if (timbreAcquisOldModel.doublon) {
										user.setId(timbreAcquisOldModel.idUser);
										timbre.addUserDoublon(user);
									}
									timbresRetourAcquis.push(timbre)
								}
							})
							if (isNotNullOrUndefined(timbresRetourAcquis) && timbresAcquis.length > 0) {
								//console.log(timbresRetourAcquis)
								timbresRetourAcquis.forEach(timbreAcquisOldModel => {
									this.modifier(timbreAcquisOldModel);
								})
							}

						}
					})
				}
			});
	}

	getAll(base: string) {
		return this.angularFirestore.collection(base, ref => {
			let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
			return filteredQuery;
		}).valueChanges();
	}

	getAllTimbres(timbreCritereModel: TimbreCritereModel, base: string) {
		return this.angularFirestore.collection(base, ref => {
			let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
			if (isNotNullOrUndefined(timbreCritereModel)) {
				if (isNotNullOrUndefined(timbreCritereModel.getAnnees()) && timbreCritereModel.getAnnees()?.length > 0) {
					filteredQuery = filteredQuery.where('annee', 'in', timbreCritereModel.getAnnees());
				}
				if (timbreCritereModel?.getType()?.length == 0 || (timbreCritereModel?.getType()?.length == 1 && isNotNullOrUndefined(timbreCritereModel?.getType()?.find(type => type == TypeTimbreEnum.TIMBRE)))) {
					filteredQuery = filteredQuery.where('idBloc', '==', null);
				} else if (timbreCritereModel?.getType()?.length > 0 && isNullOrUndefined(timbreCritereModel?.getType()?.find(type => type == TypeTimbreEnum.TIMBRE))) {
					filteredQuery = filteredQuery.where('idBloc', '!=', null);
				} else if (isNotNullOrUndefined(timbreCritereModel.getIdBloc())) {
					filteredQuery = filteredQuery.where('idBloc', '==', timbreCritereModel.getIdBloc());
				}
			}
			return filteredQuery;
		}).valueChanges();
	}

	ajouter(timbreModel: TimbreOldModel) {
		timbreModel.setTimbreBlocModel(null);

		this.angularFirestore.collection(BaseEnum.TIMBRE).add(
			this.getTimbreEnvoiOld(timbreModel)
		).then((result) => {
			console.log("Ajout :", timbreModel.getId());
		})
			.catch((error) => {
				console.error("Erreur d'ajout :", error);
			});
	}

	modifier(timbreModel: TimbreModel) {
		this.angularFirestore.collection(BaseEnum.TIMBRE)
			.ref.where('id', '==', timbreModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					doc.ref.update(this.getTimbreEnvoi(timbreModel))
						.then((result) => {
							console.log("Modif :", timbreModel.getId());
						})
						.catch((error) => {
							console.error("Erreur modif :", error);
						});
				});
			})
			.catch(error => {
				console.error("Erreur modif id introuvable :", error);
			});
	}

	getTimbreEnvoi(timbreModel: TimbreModel) {
		return (({
					 timbreBlocModel,
					 ...rest
				 }) => rest)(Object.assign({}, timbreModel));
	}

	getTimbreEnvoiOld(timbreModel: TimbreOldModel) {
		return (({
					 timbreBlocModel,
					 timbreAcquisModel,
					 imageTable,
					 type,
					 ...rest
				 }) => rest)(Object.assign({}, timbreModel));
	}




	/* PARTIE BLOC */

	ajoutAllBloc() {
		const timbreCritereModel = new TimbreCritereModel();
		timbreCritereModel.initCritere();
		timbreCritereModel.setAnnees(this.getAnnees());

		this.getAllBlocs(timbreCritereModel, "/timbres_bloc").pipe(first())
			.subscribe(timbres => {
				let timbresRetour: TimbreBlocOldModel[] = [];
				if (isNotNullOrUndefined(timbres) && timbres.length > 0) {
					timbres.forEach(timbre => {
						const timbreModel: TimbreBlocOldModel = plainToInstance(TimbreBlocOldModel, timbre);

						this.ajouterBloc(timbreModel)
						timbresRetour.push(timbreModel);
					})
				}

				//console.log(timbresRetour)
			});
	}


	addAllBlocAcquis() {
		const user = new UserModel();
		const timbreCritereModel = new TimbreCritereModel();
		timbreCritereModel.initCritere();
		timbreCritereModel.setAnnees(this.getAnnees());

		this.getAllBlocs(timbreCritereModel, BaseEnum.TIMBRE_BLOC).pipe(first())
			.subscribe(timbres => {
				let timbresRetourAcquis: TimbreBlocModel[] = [];
				let timbresRetour: TimbreBlocModel[] = [];
				if (isNotNullOrUndefined(timbres) && timbres.length > 0) {
					timbres.forEach(timbre => {
						const timbreModel: TimbreBlocModel = plainToInstance(TimbreBlocModel, timbre);
						timbresRetour.push(timbreModel);
					});

					this.getAll("timbres_bloc_acquis").pipe(first()).subscribe(timbresAcquis => {
						if (isNotNullOrUndefined(timbresAcquis) && timbresAcquis.length > 0) {
							timbresAcquis.forEach(timbreAcquis => {
								const timbreAcquisOldModel: TimbreBlocAcquisOldModel = plainToInstance(TimbreBlocAcquisOldModel, timbreAcquis);

								const timbre = timbresRetour.find(timbre => timbre.getId() == timbreAcquisOldModel.idBloc);
								//console.log(timbre)
								if (isNotNullOrUndefined(timbre)) {
									if (timbreAcquisOldModel.acquis) {
										user.setId(timbreAcquisOldModel.idUser);
										timbre.addUserAcquis(user);
									}
									if (timbreAcquisOldModel.doublon) {
										user.setId(timbreAcquisOldModel.idUser);
										timbre.addUserDoublon(user);
									}
									timbresRetourAcquis.push(timbre)
								}
							})
							if (isNotNullOrUndefined(timbresRetourAcquis) && timbresAcquis.length > 0) {
								//console.log(timbresRetourAcquis)
								timbresRetourAcquis.forEach(timbreAcquisOldModel => {
									this.modifierBloc(timbreAcquisOldModel);
								})
							}

						}
					})
				}
			});
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
		}
		return filteredQuery;
	}

	getAllBlocs(timbreCritereModel: TimbreCritereModel, base: string): Observable<any> {
		return this.angularFirestore.collection(base, ref => {
			return this.getRef(ref, timbreCritereModel);
		}).valueChanges();
	}

	ajouterBloc(timbreBlocOldModel: TimbreBlocOldModel) {
		this.angularFirestore.collection(BaseEnum.TIMBRE_BLOC).add(
			this.getBlocEnvoiOld(timbreBlocOldModel)
		).then((result) => {
			console.log("Ajout :", timbreBlocOldModel.getId());
		})
			.catch((error) => {
				console.log("Erreur d'ajout :", timbreBlocOldModel.getId());
			});
	}

	modifierBloc(timbreBlocModel: TimbreBlocModel) {
		this.angularFirestore.collection(BaseEnum.TIMBRE_BLOC)
			.ref.where('id', '==', timbreBlocModel.getId())
			.get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					const plainData = JSON.parse(JSON.stringify(this.getBlocEnvoi(timbreBlocModel)));

					doc.ref.update(this.getBlocEnvoi(plainData))
						.then((result) => {
							console.log("Modif :", timbreBlocModel.getId());
						})
						.catch((error) => {
							console.log("Erreur Modif :", timbreBlocModel.getId());
						});
				});
			})
			.catch(error => {
				console.error("Erreur modif id introuvable :", error);
			});
	}

	getBlocEnvoi(timbreBlocModel: TimbreBlocModel) {
		return (({
					 timbres,
					 idOrigine,
					 //nbTimbres,
					 ...rest
				 }) => rest)(Object.assign({}, timbreBlocModel));
	}

	getBlocEnvoiOld(timbreBlocModel: TimbreBlocOldModel) {
		return (({
					 timbres,
					 idOrigine,
					 nbTimbres,
					 imageTable,
					 nbTimbresAcquis,
					 timbreBlocAcquisModel,
					 ...rest
				 }) => rest)(Object.assign({}, timbreBlocModel));
	}

}
