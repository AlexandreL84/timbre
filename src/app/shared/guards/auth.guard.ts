import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {first, map} from "rxjs/operators";
import {isNotNullOrUndefined} from "../utils/cleva-utils";
import {AuthDataService} from "../store/auth/auth-data.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authDataService: AuthDataService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.authDataService.userAuthenticated$.pipe(
            first(logged => isNotNullOrUndefined(logged)),
            map(logged => {
                if (!logged) {
                    this.router.navigate(["/login"]);
                    sessionStorage.setItem("urlToLoad", state.url.toString());
                    return false;
                }
                return true;
            })
        );
    }
}
