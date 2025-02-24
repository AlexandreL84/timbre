import {Component, Input} from '@angular/core';
import {StyleManagerService} from "../../../../shared/services/style-manager.service";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {AuthService} from "../../../../shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

	@Input() titre: string

	readonly FontAwesomeEnum = FontAwesomeEnum;

	constructor(public styleManagerService: StyleManagerService, private authService: AuthService, private router: Router) {
	}

	toggleDarkTheme() {
		this.styleManagerService.toggleDarkTheme();
		this.styleManagerService.isDark = !this.styleManagerService.isDark;
	}

	logout() {
		this.authService.signOut();
		this.router.navigate(['/login']);
	}
}
