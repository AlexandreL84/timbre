import {Component} from '@angular/core';
import {StyleManagerService} from "../../../shared/services/style-manager.service";
import {FontAwesomeEnum} from "../../../shared/enum/font-awesome";
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";
import {HeaderService} from "../../../shared/services/header.service";
import {RouteEnum} from "../../../shared/enum/route.enum";
import {DroitEnum} from "../../../shared/enum/droit.enum";
import {PreferenceService} from "../../../shared/services/preference.service";
import {LibModalComponent} from "../../../shared/components/lib-modal/lib-modal.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly DroitEnum = DroitEnum;

	constructor(
		public headerService: HeaderService,
		public styleManagerService: StyleManagerService,
		public authService: AuthService,
		private preferenceService: PreferenceService,
		private router: Router,
		private dialog: MatDialog
	) {
	}


	supprimerPreference() {
		const dialogModal = this.dialog.open(LibModalComponent, {
			maxHeight: "95vh",
			data: {
				titre: "Confirmation",
				message: "Souhaitez-vous les préférences ?",
				btnDroite: "Oui",
				btnGauche: "Non",
			},
		});

		dialogModal.afterClosed().subscribe(() => {
			if (dialogModal.componentInstance.data.resultat === "valider") {
				this.preferenceService.supprimerTout();
			}
		});
	}

	toggleDarkTheme() {
		this.styleManagerService.toggleDarkTheme();
		this.styleManagerService.isDark = !this.styleManagerService.isDark;
	}

	logout() {
		this.authService.signOut();
		this.router.navigate(["/" + RouteEnum.LOGIN]);
		this.headerService.choixRoutes$.next([]);
		this.headerService.choixRoutesTimbre$.next([]);
	}
}
