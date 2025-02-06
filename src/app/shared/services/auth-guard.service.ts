import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable()
export class AuthGuardService  {

  constructor(private router: Router) {
  }

}
