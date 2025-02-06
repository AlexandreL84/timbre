import {Component, Inject} from "@angular/core";
import {Router} from "@angular/router";
import {ApplicationEnum} from "../../enums";

@Component({
    selector: "ea-page-not-found",
    templateUrl: "./page-not-found.component.html",
    styleUrls: ["./page-not-found.component.scss"],
})
export class PageNotFoundComponent {
    readonly ApplicationEnum = ApplicationEnum;

    constructor(@Inject("application") public application: string, private router: Router) {}

    navigate(route: string) {
        this.router.navigate([route]);
    }
}
