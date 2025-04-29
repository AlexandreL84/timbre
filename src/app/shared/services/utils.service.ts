import {Injectable} from '@angular/core';
import {LibDialogImageComponent} from "../components/lib-dialog-image/lib-dialog-image.component";
import {MatDialog} from "@angular/material/dialog";
import {BaseEnum} from "../enum/base.enum";
import {map, Observable} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {isNotNullOrUndefined} from "../utils/utils";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DimensionImageEnum} from "../enum/dimension-image.enum";

@Injectable()
export class UtilsService {
	constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private firestore: AngularFirestore) {
	}

	zoom(url: string) {
		const refDialog = this.dialog.open(LibDialogImageComponent, {
			width: DimensionImageEnum.WIDTH_TIMBRE_ZOOM + 10 + "px",
			height: DimensionImageEnum.HEIGTH_TIMBRE_ZOOM + 40 + "px",
			maxHeight: "95vh",
			maxWidth: "95vh",
		});
		refDialog.componentInstance.url = url;

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}

	getMaxIdentAsync(baseEmun: BaseEnum, annee?: number): Observable<number> {
		return this.firestore.collection(baseEmun, ref => {
			let filteredQuery: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
			/*if (isNotNullOrUndefined(annee)) {
				filteredQuery = filteredQuery.where("annee", "==", annee);
			}*/
			filteredQuery = filteredQuery.orderBy("id", "desc");
			filteredQuery = filteredQuery.limit(1);
			return filteredQuery;
		}).valueChanges().pipe(
			map(docs => {
				return isNotNullOrUndefined(docs[0]) ? docs[0]["id"] + 1 : 1
			})
		);
	}

	droitInsuffisant() {
		this.snackBar.open("Droit insuffisant", null, {
			duration: 6000,
		});
	}
}
