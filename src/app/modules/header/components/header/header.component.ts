import {Component, Input, OnInit} from '@angular/core';
import {StyleManagerService} from "../../../../shared/services/style-manager.service";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {AuthService} from "../../../../shared/services/auth.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {UserModel} from "../../../../model/user.model";
import {IconeModel} from "../../../../model/icone.model";
import {FontAwesomeTypeEnum} from "../../../../shared/enum/font-awesome/font-awesome-type.enum";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	@Input() titre: string

	readonly FontAwesomeEnum = FontAwesomeEnum;
	user$: Observable<UserModel>;

	iconAutre: IconeModel = new IconeModel();

	constructor(public styleManagerService: StyleManagerService, private authService: AuthService, private router: Router) {
		this.user$ = this.authService.getUser();
	}

	ngOnInit() {
		if (window.location.href.indexOf("pays") > 0) {
			this.iconAutre.setIcone(FontAwesomeEnum.FLAG);
			this.iconAutre.setType(FontAwesomeTypeEnum.TYPE_LIGHT);
			this.iconAutre.setInfo("Timbres Français");
			this.iconAutre.setLien("/timbre");
		} else if (window.location.href.indexOf("timbre") > 0) {
			this.iconAutre.setIcone(FontAwesomeEnum.EARTH_EUROPE);
			this.iconAutre.setType(FontAwesomeTypeEnum.TYPE_SOLID);
			this.iconAutre.setInfo("Timbres Étranger");
			this.iconAutre.setLien("/pays");
		}
		console.log(window.location.href)
		console.log(this.iconAutre)
	}

	navigate(lien: string) {
		this.router.navigate([lien]);
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
