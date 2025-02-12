import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: "ea-page-not-found",
    templateUrl: "./page-not-found.component.html",
    styleUrls: ["./page-not-found.component.scss"],
})
export class PageNotFoundComponent {

    constructor(private router: Router) {}

    navigate(route: string) {
        this.router.navigate([route]);
    }
}
