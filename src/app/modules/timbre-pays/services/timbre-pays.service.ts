import {Injectable} from '@angular/core';
import {addDoc, collection, collectionData, deleteDoc, doc, Firestore} from "@angular/fire/firestore";

@Injectable()
export class TimbreService {
  constructor(private firestore: Firestore) {
  }

  getTimbre() {
    let bookCollection = collection(this.firestore, 'timbre');
    return collectionData(bookCollection, {idField: 'id'});
  }

  addTimbre(desc: string) {
    let data = {description: desc}
    let bookCollection = collection(this.firestore, 'timbre');
    return addDoc(bookCollection, data)
  }

  deleteTimbre(id: string) {
    let timbreRef = doc(this.firestore, 'timbre' + id);
    return deleteDoc(timbreRef)
  }
}
