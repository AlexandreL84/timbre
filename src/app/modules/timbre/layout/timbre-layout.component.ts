import {Component, OnInit} from "@angular/core";
import {TimbreService} from "../../../shared/services/timbre/timbre.service";
import {FontAwesomeTypeEnum} from "../../../shared/enum/font-awesome/font-awesome-type.enum";
import {FontAwesomeEnum} from "../../../shared/enum/font-awesome";
import {HeaderService} from "../../../shared/services/header.service";
import {TimbreCritereModel} from "../../../model/timbre-critere.model";
import {TimbreUtilsService} from "../../../shared/services/timbre/timbre-utils.service";

@Component({
	selector: "app-timbre-layout",
	templateUrl: "./timbre-layout.component.html",
	styleUrls: ["./timbre-layout.component.scss"],
})
export class TimbreLayoutComponent implements OnInit {
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;
	readonly FontAwesomeEnum = FontAwesomeEnum;

	constructor(private headerService: HeaderService, public timbreService: TimbreService, private timbreUtilsService: TimbreUtilsService) {
	}

	ngOnInit(): void {
		this.headerService.titre$.next("TIMBRES");
		this.timbreUtilsService.timbreCritereModel = new TimbreCritereModel();
		this.timbreUtilsService.timbreCritereModel.setAnnees([new Date().getFullYear()]);
		this.timbreService.getTimbres(this.timbreUtilsService.timbreCritereModel);
	}
}
