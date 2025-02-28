import {Component, ViewChild} from '@angular/core';
import {AuthService} from "../../../../shared/services/auth.service";
import {BehaviorSubject} from "rxjs";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";

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

	constructor(private authService: AuthService, private router: Router) {
	}

	onSignIn() {
		this.messageError$.next(null);
		this.redirection$.next(null);
		if (this.formLogin?.valid) {
			this.authService.signIn(this.email, this.password)
				.then((result) => {
					this.router.navigate(['/pays']);
					this.redirection$.next(true);
				})
				.catch((error) => {
					console.log(error)
					this.messageError$.next("Email ou mot de pase incorrect")
				});
		}
	}

	public showPassword() {
		this.showPswd = !this.showPswd;
	}
}
