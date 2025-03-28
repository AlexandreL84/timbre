import {Component, OnInit} from "@angular/core";
import {FontAwesomeTypeEnum} from "../../../shared/enum/font-awesome/font-awesome-type.enum";
import {FontAwesomeEnum} from "../../../shared/enum/font-awesome";
import {TimbreBlocService} from "../../../shared/services/timbre/timbre-bloc.service";
import {HeaderService} from "../../../shared/services/header.service";

@Component({
	selector: "app-timbre-bloc-layout",
	templateUrl: "./timbre-bloc-layout.component.html",
})
export class TimbreBlocLayoutComponent implements OnInit {
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;
	readonly FontAwesomeEnum = FontAwesomeEnum;

	constructor(private headerService: HeaderService, public timbreBlocService: TimbreBlocService) {
	}

	ngOnInit(): void {
		this.headerService.titre$.next("TIMBRES - BLOC");
		this.timbreBlocService.getBlocs();
	}
}
