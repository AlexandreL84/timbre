import {Component, OnInit} from "@angular/core";
import {FontAwesomeTypeEnum} from "../../../shared/enum/font-awesome/font-awesome-type.enum";
import {FontAwesomeEnum} from "../../../shared/enum/font-awesome";
import {TimbreBlocService} from "../../../shared/services/timbre/timbre-bloc.service";
import {HeaderService} from "../../../shared/services/header.service";
import {first} from "rxjs";
import {isNotNullOrUndefined} from "../../../shared/utils/utils";
import {BaseEnum} from "../../../shared/enum/base.enum";
import {AuthService} from "../../../shared/services/auth.service";
import {TimbreUtilsService} from "../../../shared/services/timbre/timbre-utils.service";

@Component({
	selector: "app-timbre-bloc-layout",
	templateUrl: "./timbre-bloc-layout.component.html",
})
export class TimbreBlocLayoutComponent implements OnInit {
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;
	readonly FontAwesomeEnum = FontAwesomeEnum;

	constructor(private authService: AuthService, private timbreUtilsService: TimbreUtilsService, private headerService: HeaderService, public timbreBlocService: TimbreBlocService) {
	}

	ngOnInit(): void {
		this.headerService.titre$.next("TIMBRES - BLOC");
		//this.timbreBlocService.getBlocs();

		this.authService.userSelect$.pipe(first(userSelect => isNotNullOrUndefined(userSelect))).subscribe(userSelect=> {
			this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE_BLOC).pipe(first(annees => isNotNullOrUndefined(annees) && annees?.length > 0)).subscribe(annees => {
				this.timbreUtilsService.timbreCritereModel.setAnnees([annees[0]]);
				this.timbreBlocService.getBlocs(this.timbreUtilsService.timbreCritereModel);
			});
		});
	}
}
