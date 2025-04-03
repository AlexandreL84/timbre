import {Injectable} from '@angular/core';
import {LibDialogImageComponent} from "../components/lib-dialog-image/lib-dialog-image.component";
import {MatDialog} from "@angular/material/dialog";
import {BaseEnum} from "../enum/base.enum";
import {map, Observable} from "rxjs";
import {collectionData} from "@angular/fire/firestore";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {isNotNullOrUndefined} from "../utils/utils";

interface DocumentData {
	id: number; // Assurez-vous que vos documents ont une propriété numérique "id"
}

@Injectable()
export class UtilsService {
	constructor(private dialog: MatDialog, private firestore: AngularFirestore) {
	}

	zoom(url: string) {
		const refDialog = this.dialog.open(LibDialogImageComponent, {
			maxHeight: "70vh",
			//maxWidth: "70vh",
		});
		refDialog.componentInstance.url = url;

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}

	getMaxIdentAsync(baseEmun: BaseEnum, annee?: number): Observable<number> {
		const query =
			this.firestore.collection(baseEmun, ref => {
				let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
				if (isNotNullOrUndefined(annee)) {
					filteredQuery = filteredQuery.where("annee", "==", annee);
				}
				filteredQuery = filteredQuery.orderBy('id', 'desc');
				filteredQuery = filteredQuery.limit(1)
				return filteredQuery;
			});

		return collectionData(query).pipe(
			map((docs: DocumentData[]) => (docs.length > 0 ? docs[0].id + 1 : 1))
		);
	}
}
