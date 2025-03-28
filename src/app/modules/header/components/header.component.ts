import {Component} from '@angular/core';
import {StyleManagerService} from "../../../shared/services/style-manager.service";
import {FontAwesomeEnum} from "../../../shared/enum/font-awesome";
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {UserModel} from "../../../model/user.model";
import {HeaderService} from "../../../shared/services/header.service";
import {RouteEnum} from "../../../shared/enum/route.enum";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
})
export class HeaderComponent {
	readonly FontAwesomeEnum = FontAwesomeEnum;
	user$: Observable<UserModel>;


	constructor(public headerService: HeaderService, public styleManagerService: StyleManagerService, private authService: AuthService, private router: Router) {
		this.user$ = this.authService.getUser();
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
