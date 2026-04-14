import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, first, forkJoin, map, Observable, switchMap} from 'rxjs';
import {isNotNullOrUndefined, isNullOrUndefined} from '../../utils/utils';
import {TimbreCritereModel} from '../../../model/timbre-critere.model';
import {TimbreResumeModel} from "../../../model/timbre-resume.model";
import {TypeTimbreEnum} from "../../enum/type-timbre.enum";
import {BaseEnum} from "../../enum/base.enum";
import {TimbreVarService} from "./timbre-var.service";
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {TimbreBlocModel} from "../../../model/timbre-bloc.model";
import {plainToInstance} from 'class-transformer';
import {TimbreResumeTypeModel} from "../../../model/timbre-resume-type.model";
import {TimbreResumeAcquisModel} from "../../../model/timbre-resume-acquis.model";
import {TimbreModel} from "../../../model/timbre.model";
import {AuthService} from "../auth.service";

@Injectable()
export class TimbreResumeService {
	loadGeneration$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	timbresResume$: BehaviorSubject<TimbreResumeModel[]> = new BehaviorSubject<TimbreResumeModel[]>([]);

	constructor(
		private angularFirestore: AngularFirestore,
		private timbreVarService: TimbreVarService,
		private authService: AuthService
	) {
	}

	getResumeByUser(refresh: boolean) {
		if (!refresh) {
			this.loadGeneration$.next(true);
		}
		this.load$.next(false);
		combineLatest([
			this.authService.userSelect$,
			this.getAllWithIds(),
		]).pipe(first()).subscribe(([user, timbresWithIds]) => {
			let timbresRetour = [];
			if (isNotNullOrUndefined(timbresWithIds) && timbresWithIds.length > 0) {
				timbresWithIds.forEach(({id, data}) => {
					let timbreRetour: TimbreResumeModel = plainToInstance(TimbreResumeModel, data);
					timbreRetour.setId(id); // ← on stocke l'id Firestore dans le model
					timbresRetour.push(timbreRetour);
				});
				this.timbresResume$.next(timbresRetour);
			}
			this.load$.next(true);
		});
	}

	getAllWithIds() {
		return this.angularFirestore.collection(BaseEnum.TIMBRE_RESUME)
			.snapshotChanges()
			.pipe(
				map(actions => actions.map(a => ({
					id: a.payload.doc.id,
					data: a.payload.doc.data()
				})))
			);
	}

	refreshResume(choixAnnee?: number) {
		this.load$.next(false);
		this.loadGeneration$.next(false);

		this.getResumeByUser(true);

		let anneeDebut: number;
		let anneeFin: number;
		if (isNotNullOrUndefined(choixAnnee)) {
			anneeDebut = choixAnnee;
			anneeFin = choixAnnee;
		} else {
			anneeDebut = 1849;
			anneeFin = 2026;
		}

		this.load$.pipe(
			first(isLoaded => isLoaded === true),
			switchMap(() => this.timbresResume$.pipe(first())),
		).subscribe(timbresResume => {

			const timbresReset = timbresResume.map(t => {
				if (t.getAnnee() >= anneeDebut && t.getAnnee() <= anneeFin) {
					console.log('reset annee', t.getAnnee());
					t.setTotal(0);
					t.setTimbresResumeTypeModel(null);
				}
				return t;
			});
			this.timbresResume$.next(timbresReset); // ← force la mise à jour

			const appels = [];
			for (let annee = anneeDebut; annee <= anneeFin; annee++) {
				appels.push(
					forkJoin([
						this.getTotalTimbreObs(annee),
						this.getTotalBlocObs(annee)
					])
				);
			}

			forkJoin(appels).subscribe(() => {
				this.timbresResume$.pipe(first()).subscribe(timbresResume => {
					timbresResume
						?.filter(t => t.getAnnee() >= anneeDebut && t.getAnnee() <= anneeFin)
						?.forEach(timbreResume => {
							console.log(timbreResume)
							const plainData = JSON.parse(JSON.stringify(timbreResume));

							if (isNotNullOrUndefined(timbreResume.getId())) {
								this.angularFirestore.collection(BaseEnum.TIMBRE_RESUME)
									.doc(String(timbreResume.getId()))
									.set(plainData)
									.then(() => console.log('Modifié annee ' + timbreResume.getAnnee() + " - " + timbreResume.getTotal()))
									.catch(err => console.error('Erreur modification annee ' + timbreResume.getAnnee(), err));
							} else {
								this.angularFirestore.collection(BaseEnum.TIMBRE_RESUME)
									.add(plainData)
									.then(docRef => {
										timbreResume.setId(docRef.id as any);
										console.log('Ajouté annee ' + timbreResume.getAnnee());
									})
									.catch(err => console.error('Erreur ajout annee ' + timbreResume.getAnnee(), err));
							}
						});
				});

				this.timbreVarService.reinitResume$.next(false);
				this.loadGeneration$.next(true);
			});
		});
	}

	getTotalBlocObs(annee: number): Observable<any> {
		const timbreCritereModel = new TimbreCritereModel();
		timbreCritereModel.setAnnees([annee]);

		return this.getAllTimbres(timbreCritereModel).pipe(
			first(),
			map(timbres => {
				this.timbresResume$.pipe(first()).subscribe(timbresResume => {
					let timbreResumeModel: TimbreResumeModel = timbresResume?.find(timbreResumeModel => timbreResumeModel.getAnnee() == annee);
					if (isNullOrUndefined(timbreResumeModel)) {
						timbreResumeModel = new TimbreResumeModel();
						timbreResumeModel.setAnnee(annee);
						timbresResume.push(timbreResumeModel);
					}
					const timbreResumeTypeModel = new TimbreResumeTypeModel();
					timbreResumeTypeModel.setType(TypeTimbreEnum.TIMBRE);

					if (timbres?.length > 0) {
						timbres.forEach(timbre => {
							const timbreModel: TimbreModel = plainToInstance(TimbreModel, timbre);
							timbreResumeTypeModel.setNombreTimbre(timbreResumeTypeModel.getNombreTimbre() + 1);

							let timbresResumeAcquisModel: TimbreResumeAcquisModel[] = [];
							if (isNotNullOrUndefined(timbreModel.getUsersAcquis()) && timbreModel.getUsersAcquis().length > 0) {
								timbreModel.getUsersAcquis().forEach(userAcquis => {
									const timbreResumeAcquisModel = new TimbreResumeAcquisModel();
									timbreResumeAcquisModel.setIdUser(userAcquis);
									timbreResumeAcquisModel.setNbTimbresAcquis(1);
									timbresResumeAcquisModel.push(timbreResumeAcquisModel);
								});
							}
							if (isNotNullOrUndefined(timbreModel.getUsersDoublon()) && timbreModel.getUsersDoublon().length > 0) {
								timbreModel.getUsersDoublon().forEach(userAcquis => {
									const timbreResumeAcquisModel = new TimbreResumeAcquisModel();
									timbreResumeAcquisModel.setIdUser(userAcquis);
									timbreResumeAcquisModel.setNbTimbresDoublon(1);
									timbresResumeAcquisModel.push(timbreResumeAcquisModel);
								});
							}

							timbreResumeModel.setTotal(timbreResumeModel.getTotal() + 1);
							timbreResumeModel.addTimbresResumeTypeModel(timbreResumeTypeModel, timbresResumeAcquisModel);
						});
					}
				});
			})
		);
	}


	getTotalTimbreObs(annee: number): Observable<any> {
		const timbreCritereModel = new TimbreCritereModel();
		timbreCritereModel.setAnnees([annee]);

		const timbreResumeTypeModel = new TimbreResumeTypeModel();
		timbreResumeTypeModel.setType(TypeTimbreEnum.TIMBRE);


		return this.getAllBlocs(timbreCritereModel).pipe(
			first(),
			map(blocs => {
				if (blocs?.length > 0) {
					blocs.forEach(bloc => {
						const timbreBlocModel: TimbreBlocModel = plainToInstance(TimbreBlocModel, bloc);

						this.timbresResume$.pipe(first()).subscribe(timbresResume => {
							let timbreResumeModel: TimbreResumeModel = timbresResume?.find(timbreResumeModel => timbreResumeModel.getAnnee() == annee);
							if (isNullOrUndefined(timbreResumeModel)) {
								timbreResumeModel = new TimbreResumeModel();
								timbreResumeModel.setAnnee(annee);
								timbresResume.push(timbreResumeModel);
							}
							const timbreResumeTypeModel = new TimbreResumeTypeModel();
							timbreResumeTypeModel.setType(timbreBlocModel.getType());
							timbreResumeTypeModel.setNombreTimbre(timbreBlocModel.getNbTimbres());

							let timbresResumeAcquisModel: TimbreResumeAcquisModel[] = [];
							if (isNotNullOrUndefined(timbreBlocModel.nbTimbresAcquisByUser) && timbreBlocModel.nbTimbresAcquisByUser.length > 0) {
								timbreBlocModel.nbTimbresAcquisByUser.forEach(timbreBlocAcquis => {
									const timbreResumeAcquisModel = new TimbreResumeAcquisModel();
									timbreResumeAcquisModel.setIdUser(timbreBlocAcquis.getIdUser());
									timbreResumeAcquisModel.setNbTimbresAcquis(timbreBlocAcquis.getNbAcquis());
									timbreResumeAcquisModel.setNbTimbresDoublon(timbreBlocAcquis.getNbDoublon());
									if (isNotNullOrUndefined(timbreBlocModel?.getUsersAcquis()?.find(idUser => idUser == timbreBlocAcquis.getIdUser()))) {
										timbreResumeAcquisModel.setNbAcquis(1);
									}
									if (isNotNullOrUndefined(timbreBlocModel?.getUsersDoublon()?.find(idUser => idUser == timbreBlocAcquis.getIdUser()))) {
										timbreResumeAcquisModel.setNbDoublon(1);
									}
									timbresResumeAcquisModel.push(timbreResumeAcquisModel);
								});
							}

							timbreResumeModel.addTimbresResumeTypeModel(timbreResumeTypeModel, timbresResumeAcquisModel);

							timbreResumeModel.setTotal(timbreResumeModel.getTotal() + timbreBlocModel.getNbTimbres());
							this.timbresResume$.next(timbresResume);
						});
					});
				}
			})
		);
	}

	getAllTimbres(timbreCritereModel: TimbreCritereModel) {
		return this.angularFirestore.collection(BaseEnum.TIMBRE, ref => {
			let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
			if (isNotNullOrUndefined(timbreCritereModel)) {
				if (isNotNullOrUndefined(timbreCritereModel.getAnnees()) && timbreCritereModel.getAnnees()?.length > 0) {
					filteredQuery = filteredQuery.where('annee', '==', timbreCritereModel.getAnnees()[0]);
				}
				filteredQuery = filteredQuery.where('idBloc', '==', null);
			}
			return filteredQuery;
		}).valueChanges();
	}

	getAllBlocs(timbreCritereModel: TimbreCritereModel): Observable<any> {
		return this.angularFirestore.collection(BaseEnum.TIMBRE_BLOC, ref => {
			return this.getRefBloc(ref, timbreCritereModel);
		}).valueChanges();
	}

	getRefBloc(ref, timbreCritereModel: TimbreCritereModel) {
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
}
