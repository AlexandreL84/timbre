import {Component, Input, OnInit} from "@angular/core";
import {TimbreService} from "../../../../shared/services/timbre/timbre.service";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {Observable} from "rxjs";
import {TimbreUtilsService} from "../../../../shared/services/timbre/timbre-utils.service";
import {BaseEnum} from "../../../../shared/enum/base.enum";
import {AuthService} from "../../../../shared/services/auth.service";
import {TypeTimbreEnum} from "../../../../shared/enum/type-timbre.enum";
import {PreferenceService} from "../../../../shared/services/preference.service";
import {PreferenceEnum} from "../../../../shared/enum/preference.enum";

@Component({
	selector: "app-timbre-recherche",
	templateUrl: "./timbre-recherche.component.html",
	styleUrls: ["./../../../styles/timbre-recherche.scss"],
})
export class TimbreRechercheComponent implements OnInit {
	@Input() modif: boolean = true;

	annees$: Observable<number[]>
	readonly TypeTimbreEnum = TypeTimbreEnum;

	constructor(public authService: AuthService, public timbreService: TimbreService, public timbreUtilsService: TimbreUtilsService, public preferenceService: PreferenceService) {
	}

	ngOnInit(): void {
		this.annees$ = this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE);
	}

	filtreByCritere() {
		if (this.preferenceService.timbreCritereModel.getAcquis() == "NON") {
			this.preferenceService.timbreCritereModel.setDoublon("TOUS");
		}
		this.preferenceService.modifier(PreferenceEnum.TIMBRE_CRITERE, this.preferenceService.timbreCritereModel);
		this.recherche();
	}

	recherche(){
		if (isNotNullOrUndefined(this.preferenceService.timbreCritereModel.getAnnees()) && this.preferenceService.timbreCritereModel.getAnnees().length > 0) {
			this.timbreService.getTimbres(this.preferenceService.timbreCritereModel, false);
		}
	}
}
