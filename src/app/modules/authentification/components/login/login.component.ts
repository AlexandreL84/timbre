import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {AuthService} from "../../../../shared/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  @ViewChild("loginForm") public loginForm!: NgForm;
  errorMessage: string = "";

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
  }


  onSubmit() {
    console.log(this.loginForm.value);

    /*const email = this.loginForm['email'].value;
    const password = this.signupForm.get('password').value;
    this.authService.createNewUser(email, password)*/
  }
}
