import {Injectable} from '@angular/core';

@Injectable()
export class AuthService {
  constructor() {
  }

  /*createNewUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
      }
    );
  }

  signInUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
      }
    );
  }

  signOutUser() {
    firebase.auth().signOut();
  }*/
}
