import {Component, Input, OnInit} from "@angular/core";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {Observable} from "rxjs";
import {TimbreUtilsService} from "../../../../shared/services/timbre/timbre-utils.service";
import {BaseEnum} from "../../../../shared/enum/base.enum";
import {AuthService} from "../../../../shared/services/auth.service";
import {TimbreBlocService} from "../../../../shared/services/timbre/timbre-bloc.service";
import {TypeTimbreEnum} from "../../../../shared/enum/type-timbre.enum";
import {PreferenceService} from "../../../../shared/services/preference.service";
import {PreferenceEnum} from "../../../../shared/enum/preference.enum";

@Component({
	selector: "app-timbre-bloc-recherche",
	templateUrl: "./timbre-bloc-recherche.component.html",
	styleUrls: ["./../../../styles/timbre-recherche.scss"],
})
export class TimbreBlocRechercheComponent implements OnInit {
	@Input() modif: boolean = true;

	annees$: Observable<number[]>

	readonly TypeTimbreEnum = TypeTimbreEnum;

	constructor(public authService: AuthService, public timbreBlocService: TimbreBlocService, public timbreUtilsService: TimbreUtilsService, public preferenceService: PreferenceService) {
	}

	ngOnInit(): void {
		this.annees$ = this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE_BLOC);
	}

	filtreByCritere() {
		if (this.preferenceService.timbreCritereBlocModel.getAcquis() == "NON") {
			this.preferenceService.timbreCritereBlocModel.setDoublon("TOUS");
		}
		this.preferenceService.modifier(PreferenceEnum.BLOC_CRITERE, this.preferenceService.timbreCritereBlocModel);
		this.recherche();
	}

	recherche(){
		if (isNotNullOrUndefined(this.preferenceService.timbreCritereBlocModel.getAnnees()) && this.preferenceService.timbreCritereBlocModel.getAnnees().length > 0) {
			this.timbreBlocService.getBlocs(this.preferenceService.timbreCritereBlocModel, false);
		}
	}
}
