import {Injectable} from "@angular/core";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {BehaviorSubject, combineLatest, first, map, Observable, of, switchMap} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {isNotNullOrUndefined, isNullOrUndefined} from "../utils/utils";
import {UserModel} from "../../model/user.model";
import {plainToInstance} from "class-transformer";
import {BaseEnum} from "../enum/base.enum";
import {DroitEnum} from "../enum/droit.enum";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    user$: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(null);
    userSelect$: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(null);
    users$: BehaviorSubject<UserModel[]> = new BehaviorSubject<UserModel[]>(null);

    constructor(
        private afAuth: AngularFireAuth,
        private angularFirestore: AngularFirestore
    ) {}

    // Méthode de connexion avec email et mot de passe
    signIn(email: string, password: string) {
        return this.afAuth.signInWithEmailAndPassword(email, password);
    }

    // Méthode d'inscription avec email et mot de passe
    signUp(email: string, password: string) {
        return this.afAuth.createUserWithEmailAndPassword(email, password);
    }

    // Méthode de déconnexion
    signOut() {
        this.user$.next(null);
        this.userSelect$.next(null);
        return this.afAuth.signOut();
    }

    // Méthode pour obtenir l'utilisateur actuellement connecté
    getCurrentUser() {
        return this.afAuth.authState;
    }

    // Méthode pour obtenir l'utilisateur actuellement connecté
    getUser(): Observable<UserModel> {
        return combineLatest([this.afAuth.authState, this.user$]).pipe(
            switchMap(([user, userConnect]) => {
                if (isNotNullOrUndefined(userConnect)) {
                    return of(userConnect);
                }
                if (isNullOrUndefined(user)) {
                    return of(null);
                }
                // Lecture du seul document de l'utilisateur connecté (1 lecture Firestore au lieu de toute la collection)
                return this.angularFirestore
                    .collection(BaseEnum.USER, ref => ref.where("id", "==", user.uid).limit(1))
                    .valueChanges()
                    .pipe(
                        map(users => {
                            const findUser = users?.[0];
                            if (isNullOrUndefined(findUser)) {
                                return null;
                            }
                            const userModel: UserModel = plainToInstance(UserModel, findUser);
                            this.user$.next(userModel);
                            this.initUserSelect(userModel);
                            return userModel;
                        })
                    );
            })
        );
    }

    // Utilisateur dont on consulte la collection : soi-même, ou un utilisateur au choix pour les droits étendus
    private initUserSelect(userModel: UserModel) {
        if (userModel?.getDroit() == DroitEnum.TOTAL || userModel?.getDroit() == DroitEnum.CONSULT_TOTAL) {
            this.getUsers(DroitEnum.PARTIEL)
                .pipe(first(users => isNotNullOrUndefined(users)))
                .subscribe(users => {
                    const findUser = users.find(user => user.getId() == userModel.getId());
                    if (findUser) {
                        this.userSelect$.next(findUser);
                    } else {
                        this.userSelect$.next(users.find(user => user.getNom() == "LEFAIX"));
                    }
                });
        } else {
            this.userSelect$.next(userModel);
        }
    }

    getUsers(droit?: DroitEnum) {
        this.users$.next(null);
        if (isNullOrUndefined(droit)) {
            droit = DroitEnum.CONSULT;
        }

        return this.angularFirestore
            .collection(BaseEnum.USER, ref => {
                let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
                filteredQuery = filteredQuery.where("droit", ">=", droit);
                return filteredQuery;
            })
            .valueChanges()
            .pipe(
                map((users: any) => {
                    const usersModel: UserModel[] = [];
                    if (users?.length > 0) {
                        users.forEach((user: any) => {
                            const userModel: UserModel = plainToInstance(UserModel, user);
                            usersModel.push(userModel);
                        });
                    }
                    this.users$.next(usersModel);
                    return usersModel;
                })
            );
    }
}
