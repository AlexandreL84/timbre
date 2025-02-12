import {Injectable} from '@angular/core';
import {ZDialogImageComponent} from "../components/z-dialog-image/z-dialog-image.component";
import {MatDialog} from "@angular/material/dialog";

@Injectable()
export class UtilsService {
	constructor(private dialog: MatDialog) {
	}

	zoom(url: string) {
		const refDialog = this.dialog.open(ZDialogImageComponent, {
			maxHeight: "70vh",
			//maxWidth: "70vh",
		});
		refDialog.componentInstance.url = url;

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}
}
