import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {combineLatest, map, Observable} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {isNotNullOrUndefined} from "../utils/utils";
import {UserModel} from "../../model/user.model";
import {plainToInstance} from "class-transformer";
import {BaseEnum} from "../enum/base.enum";

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
	}

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
		return this.afAuth.signOut();
	}

	// Méthode pour obtenir l'utilisateur actuellement connecté
	getCurrentUser() {
		return this.afAuth.authState;
	}

	// Méthode pour obtenir l'utilisateur actuellement connecté
	getUser(): Observable<UserModel> {
		const collectionUser = this.firestore.collection(BaseEnum.USER).valueChanges();
		return combineLatest([this.afAuth.authState, collectionUser]).pipe(map(([user, users]) => {
				const findUser = users.find(userFind => userFind["id"] == user?.uid);
				if (isNotNullOrUndefined(findUser)) {
					return plainToInstance(UserModel, findUser);
				}
				return null;
			})
		);
	}
}
