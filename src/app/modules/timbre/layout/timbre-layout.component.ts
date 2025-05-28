import {Component, OnInit} from "@angular/core";
import {TimbreService} from "../../../shared/services/timbre/timbre.service";
import {FontAwesomeTypeEnum} from "../../../shared/enum/font-awesome/font-awesome-type.enum";
import {FontAwesomeEnum} from "../../../shared/enum/font-awesome";
import {HeaderService} from "../../../shared/services/header.service";
import {ModeEnum} from "../../../shared/enum/mode.enum";

@Component({
	selector: "app-timbre-layout",
	templateUrl: "./timbre-layout.component.html",
	styleUrls: ["./../../styles/timbre-layout.component.scss"],
})
export class TimbreLayoutComponent implements OnInit {
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;
	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly ModeEnum = ModeEnum;

	constructor(public headerService: HeaderService, public timbreService: TimbreService) {
	}

	ngOnInit(): void {
		/*this.timbreService.timbres$.next(null);
		this.headerService.titre$.next("TIMBRES");
		this.timbreUtilsService.timbreCritereModel = new TimbreCritereModel();
		this.authService.userSelect$.pipe(first(userSelect => isNotNullOrUndefined(userSelect))).subscribe(userSelect=> {
			this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE).pipe(first(annees => isNotNullOrUndefined(annees) && annees?.length > 0)).subscribe(annees => {
				this.timbreUtilsService.timbreCritereModel.setAnnees([annees[0]]);
				this.timbreService.getTimbres(this.timbreUtilsService.timbreCritereModel, true);
			});
		});*/
	}
}
