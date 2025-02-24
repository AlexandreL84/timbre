import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	constructor(private afAuth: AngularFireAuth) {}

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
}
