import {Component} from '@angular/core';
import {StyleManagerService} from "../../../shared/services/style-manager.service";
import {FontAwesomeEnum} from "../../../shared/enum/font-awesome";
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";
import {HeaderService} from "../../../shared/services/header.service";
import {RouteEnum} from "../../../shared/enum/route.enum";
import {DroitEnum} from "../../../shared/enum/droit.enum";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly DroitEnum = DroitEnum;

	constructor(public headerService: HeaderService, public styleManagerService: StyleManagerService, public authService: AuthService, private router: Router) {
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
