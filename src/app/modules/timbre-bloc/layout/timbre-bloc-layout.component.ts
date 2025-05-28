import {Component, OnInit} from "@angular/core";
import {FontAwesomeTypeEnum} from "../../../shared/enum/font-awesome/font-awesome-type.enum";
import {FontAwesomeEnum} from "../../../shared/enum/font-awesome";
import {TimbreBlocService} from "../../../shared/services/timbre/timbre-bloc.service";
import {HeaderService} from "../../../shared/services/header.service";
import {ModeEnum} from "../../../shared/enum/mode.enum";

@Component({
	selector: "app-timbre-bloc-layout",
	templateUrl: "./timbre-bloc-layout.component.html",
	styleUrls: ["./../../styles/timbre-layout.component.scss"],
})
export class TimbreBlocLayoutComponent implements OnInit {
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;
	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly ModeEnum = ModeEnum;

	constructor(public headerService: HeaderService, public timbreBlocService: TimbreBlocService) {
	}

	ngOnInit(): void {
		this.headerService.titre$.next("TIMBRES - BLOC");
		//this.timbreBlocService.getBlocs();
		/*this.authService.userSelect$.pipe(first(userSelect => isNotNullOrUndefined(userSelect))).subscribe(userSelect => {
			this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE_BLOC).pipe(first(annees => isNotNullOrUndefined(annees) && annees?.length > 0)).subscribe(annees => {
				this.timbreUtilsService.timbreCritereModel.setAnnees([annees[0]]);
				this.timbreBlocService.getBlocs(this.timbreUtilsService.timbreCritereModel);
			});
		});*/
	}
}
