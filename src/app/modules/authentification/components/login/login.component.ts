import {Component, ViewChild} from '@angular/core';
import {AuthService} from "../../../../shared/services/auth.service";
import {BehaviorSubject, first} from "rxjs";
import {NgForm} from "@angular/forms";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {HeaderService} from "../../../../shared/services/header.service";
import {RouteEnum} from "../../../../shared/enum/route.enum";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent {
	@ViewChild("formLogin") formLogin: NgForm;
	redirection$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
	messageError$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

	email: string;
	password: string;
	showPswd: boolean = false;
	readonly FontAwesomeEnum = FontAwesomeEnum;

	constructor(private headerService: HeaderService, private authService: AuthService) {
	}

	onSignIn() {
		this.messageError$.next(null);
		this.redirection$.next(null);
		if (this.formLogin?.valid) {
			this.authService.signIn(this.email, this.password)
				.then((result) => {
					this.authService.user$.next(null);
					this.authService.userSelect$.next(null);
					this.authService.getUser().pipe(first()).subscribe();
					this.headerService.setRoute(RouteEnum.TIMBRE);
					this.redirection$.next(true);
				})
				.catch((error) => {
					console.error(error);
					this.messageError$.next("Email ou mot de passe incorrect");
				});
		}
	}

	public showPassword() {
		this.showPswd = !this.showPswd;
	}
}
