import {Injectable} from '@angular/core';
import {LibDialogImageComponent} from "../components/lib-dialog-image/lib-dialog-image.component";
import {MatDialog} from "@angular/material/dialog";
import {BaseEnum} from "../enum/base.enum";
import {BehaviorSubject, catchError, first, map, Observable, of, switchMap} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {isNotNullOrUndefined, isNullOrUndefined} from "../utils/utils";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DimensionImageEnum} from "../enum/dimension-image.enum";
import {TimbreVarService} from "./timbre/timbre-var.service";
import {tap} from "rxjs/operators";

@Injectable()
export class UtilsService {
	constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private angularFirestore: AngularFirestore, private timbreVarService: TimbreVarService) {
	}

	zoom(url: string) {
		let maxWidth = DimensionImageEnum.WIDTH_TIMBRE_ZOOM + 10;
		const width = window.innerWidth - 50;
		let maxHeight = DimensionImageEnum.HEIGTH_TIMBRE_ZOOM + 40;
		const height = window.innerWidth - 50;
		if (width > maxWidth) {
			maxWidth = width;
		}
		if (height > maxHeight) {
			maxHeight = height;
		}

		const refDialog = this.dialog.open(LibDialogImageComponent, {
			maxWidth: maxWidth + "px",
			maxHeight: maxHeight + "px",
		});
		refDialog.componentInstance.url = url;

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}

	getMaxIdentAsync(baseEnum: BaseEnum): Observable<number> {
		const subjectMap: Partial<Record<BaseEnum, BehaviorSubject<number | null>>> = {
			[BaseEnum.TIMBRE]: this.timbreVarService.maxIdentTimbre$,
			[BaseEnum.PAYS]:   this.timbreVarService.maxIdentPays$,
			[BaseEnum.TIMBRE_BLOC]:   this.timbreVarService.maxIdentBloc$,
		};

		const subject = subjectMap[baseEnum];

		if (isNullOrUndefined(subject)) {
			return this.getMaxIdentByBaseAsync(baseEnum).pipe(first());
		}

		return subject.pipe(
			first(),
			switchMap(maxIdent => {
				if (isNullOrUndefined(maxIdent)) {
					return this.getMaxIdentByBaseAsync(baseEnum).pipe(
						first(),
						tap(newMaxIdent => subject.next(newMaxIdent))
					);
				} else {
					return of(maxIdent);
				}
			})
		);
	}

	getMaxIdentByBaseAsync(baseEnum: BaseEnum, annee?: number): Observable<number> {
		return this.angularFirestore.collection(baseEnum, ref => {
			let query: firebase.default.firestore.CollectionReference
				| firebase.default.firestore.Query = ref;

			/*if (isNotNullOrUndefined(annee)) {
				query = query.where("annee", "==", annee);
			}*/

			return query.orderBy("id", "desc").limit(1);
		}).valueChanges().pipe(
			map(docs => {
				if (!docs.length || !isNotNullOrUndefined(docs[0])) return 1;

				const topDoc = docs[0] as { id?: number };
				return typeof topDoc.id === "number" ? topDoc.id + 1 : 1;
			}),
			catchError(err => {
				console.error("getMaxIdentAsync a échoué :", err);
				return of(1); // valeur par defaut
			})
		);
	}

	droitInsuffisant() {
		this.snackBar.open("Droit insuffisant", null, {
			duration: 6000,
		});
	}
}
