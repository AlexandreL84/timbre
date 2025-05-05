import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {RouteEnum} from "../../shared/enum/route.enum";
import {FontAwesomeEnum} from "../../shared/enum/font-awesome";
import {FontAwesomeTypeEnum} from "../../shared/enum/font-awesome/font-awesome-type.enum";

@Component({
    selector: "app-page-not-found",
    templateUrl: "./page-not-found.component.html",
    styleUrls: ["./page-not-found.component.scss"],
})
export class PageNotFoundComponent {
	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;

    constructor(private router: Router) {}

    navigate() {
		this.router.navigate(["/" + RouteEnum.LOGIN]);
    }
}
