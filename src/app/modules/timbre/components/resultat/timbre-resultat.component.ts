import {Component, Input, OnInit} from "@angular/core";
import {TimbreModel} from "../../../../model/timbre.model";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {Observable} from "rxjs";
import {UtilsService} from "../../../../shared/services/utils.service";
import {FontAwesomeTypeEnum} from "../../../../shared/enum/font-awesome/font-awesome-type.enum";
import {TimbreUtilsService} from "../../../../shared/services/timbre/timbre-utils.service";
import {BaseEnum} from "../../../../shared/enum/base.enum";
import {AuthService} from "../../../../shared/services/auth.service";
import {DroitEnum} from "../../../../shared/enum/droit.enum";
import {TimbreActionsService} from "../../../../shared/services/timbre/timbre-actions.service";
import {TimbreVarService} from "../../../../shared/services/timbre/timbre-var.service";
import {PreferenceService} from "../../../../shared/services/preference.service";

@Component({
	selector: "app-timbre-resultat",
	templateUrl: "./timbre-resultat.component.html",
	styleUrls: ["./../../../styles/timbre-resultat.scss"],
})
export class TimbreResultatComponent implements OnInit {
	@Input() modif: boolean = true;

	public timbre: TimbreModel = new TimbreModel();
	annees$: Observable<number[]>

	readonly DroitEnum = DroitEnum;
	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;

	constructor(
		public authService: AuthService,
		public timbreVarService: TimbreVarService,
		public timbreActionsService: TimbreActionsService,
		public timbreUtilsService: TimbreUtilsService,
		public utilsService: UtilsService,
		public preferenceService: PreferenceService
	) {
	}

	ngOnInit(): void {
		this.annees$ = this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE);
	}
}
