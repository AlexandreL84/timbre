import {Component} from "@angular/core";
import {FontAwesomeTypeEnum} from "../../../shared/enum/font-awesome/font-awesome-type.enum";
import {FontAwesomeEnum} from "../../../shared/enum/font-awesome";
import {HeaderService} from "../../../shared/services/header.service";
import {ModeEnum} from "../../../shared/enum/mode.enum";
import {TimbreVarService} from "../../../shared/services/timbre/timbre-var.service";

@Component({
	selector: "app-timbre-layout",
	templateUrl: "./timbre-layout.component.html",
	styleUrls: ["./../../styles/timbre-layout.component.scss"],
})
export class TimbreLayoutComponent {
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;
	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly ModeEnum = ModeEnum;

	constructor(
		public headerService: HeaderService, public timbreVarService: TimbreVarService) {
	}
}
