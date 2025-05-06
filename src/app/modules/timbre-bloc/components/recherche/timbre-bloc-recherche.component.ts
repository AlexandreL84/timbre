import {Component, Input, OnInit} from "@angular/core";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {Observable} from "rxjs";
import {TimbreUtilsService} from "../../../../shared/services/timbre/timbre-utils.service";
import {BaseEnum} from "../../../../shared/enum/base.enum";
import {AuthService} from "../../../../shared/services/auth.service";
import {TimbreBlocService} from "../../../../shared/services/timbre/timbre-bloc.service";
import {TypeTimbreEnum} from "../../../../shared/enum/type-timbre.enum";

@Component({
	selector: "app-timbre-bloc-recherche",
	templateUrl: "./timbre-bloc-recherche.component.html",
	styleUrls: ["./../../../styles/timbre-recherche.scss"],
})
export class TimbreBlocRechercheComponent implements OnInit {
	@Input() modif: boolean = true;

	annees$: Observable<number[]>

	readonly TypeTimbreEnum = TypeTimbreEnum;

	constructor(public authService: AuthService, public timbreBlocService: TimbreBlocService, public timbreUtilsService: TimbreUtilsService) {
	}

	ngOnInit(): void {
		this.annees$ = this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE_BLOC);
	}

	filtreByCritereEvent(code) {
		this.timbreUtilsService.timbreCritereBlocModel[code] = "OUI";
		this.recherche();
	}

	filtreByCritere() {
		if (this.timbreUtilsService.timbreCritereBlocModel.getAcquis() == "NON") {
			this.timbreUtilsService.timbreCritereBlocModel.setDoublon("TOUS");
		}
		this.recherche();
	}

	recherche(){
		if (isNotNullOrUndefined(this.timbreUtilsService.timbreCritereBlocModel.getAnnees()) && this.timbreUtilsService.timbreCritereBlocModel.getAnnees().length > 0) {
			this.timbreBlocService.getBlocs(this.timbreUtilsService.timbreCritereBlocModel, false);
		}
	}
}
