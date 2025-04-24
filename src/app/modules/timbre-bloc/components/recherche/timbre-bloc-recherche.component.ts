import {Component, Input, OnInit} from "@angular/core";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {Observable} from "rxjs";
import {TimbreUtilsService} from "../../../../shared/services/timbre/timbre-utils.service";
import {BaseEnum} from "../../../../shared/enum/base.enum";
import {AuthService} from "../../../../shared/services/auth.service";
import {TimbreBlocService} from "../../../../shared/services/timbre/timbre-bloc.service";

@Component({
	selector: "app-timbre-bloc-recherche",
	templateUrl: "./timbre-bloc-recherche.component.html",
	styleUrls: ["./../../../styles/timbre-recherche.scss"],
})
export class TimbreBlocRechercheComponent implements OnInit {
	@Input() modif: boolean = true;

	annees$: Observable<number[]>

	constructor(public authService: AuthService, public timbreBlocService: TimbreBlocService, public timbreUtilsService: TimbreUtilsService) {
	}

	ngOnInit(): void {
		this.annees$ = this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE);
	}

	filtreByCritere() {
		if (this.timbreUtilsService.timbreCritereBlocModel.getAcquis() == "NON") {
			this.timbreUtilsService.timbreCritereBlocModel.setDoublon("TOUS");
		}
		if (isNotNullOrUndefined(this.timbreUtilsService.timbreCritereBlocModel.getAnnees()) && this.timbreUtilsService.timbreCritereBlocModel.getAnnees().length > 0) {
			this.timbreBlocService.getBlocs(this.timbreUtilsService.timbreCritereBlocModel, false);
		}
	}
}
