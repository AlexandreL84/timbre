import {Component, Input, OnInit} from "@angular/core";
import {TimbreService} from "../../../../shared/services/timbre/timbre.service";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {Observable} from "rxjs";
import {TimbreUtilsService} from "../../../../shared/services/timbre/timbre-utils.service";
import {BaseEnum} from "../../../../shared/enum/base.enum";
import {AuthService} from "../../../../shared/services/auth.service";

@Component({
	selector: "app-timbre-recherche",
	templateUrl: "./timbre-recherche.component.html",
	styleUrls: ["./../../../styles/timbre-recherche.scss"],
})
export class TimbreRechercheComponent implements OnInit {
	@Input() modif: boolean = true;

	annees$: Observable<number[]>

	constructor(public authService: AuthService, public timbreService: TimbreService, public timbreUtilsService: TimbreUtilsService) {
	}

	ngOnInit(): void {
		this.annees$ = this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE);
	}

	filtreByCritere() {
		if (this.timbreUtilsService.timbreCritereModel.getCarnet() == "OUI") {
			this.timbreUtilsService.timbreCritereModel.setBloc("OUI");
		}
		if (this.timbreUtilsService.timbreCritereModel.getAcquis() == "NON") {
			this.timbreUtilsService.timbreCritereModel.setDoublon("TOUS");
		}
		if (isNotNullOrUndefined(this.timbreUtilsService.timbreCritereModel.getAnnees()) && this.timbreUtilsService.timbreCritereModel.getAnnees().length > 0) {
			this.timbreService.getTimbres(this.timbreUtilsService.timbreCritereModel);
		}
	}
}
