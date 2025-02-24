import {Injectable} from '@angular/core';
import {LibDialogImageComponent} from "../components/lib-dialog-image/lib-dialog-image.component";
import {MatDialog} from "@angular/material/dialog";

@Injectable()
export class UtilsService {
	constructor(private dialog: MatDialog) {
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
}
