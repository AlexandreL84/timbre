import {Component, OnInit} from "@angular/core";
import {TimbreBlocModel} from "../../../../model/timbre-bloc.model";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {Observable} from "rxjs";
import {UtilsService} from "../../../../shared/services/utils.service";
import {FontAwesomeTypeEnum} from "../../../../shared/enum/font-awesome/font-awesome-type.enum";
import {TimbreUtilsService} from "../../../../shared/services/timbre/timbre-utils.service";
import {BaseEnum} from "../../../../shared/enum/base.enum";
import {TypeTimbreEnum} from "../../../../shared/enum/type-timbre.enum";
import {DroitEnum} from "../../../../shared/enum/droit.enum";
import {AuthService} from "../../../../shared/services/auth.service";
import {TimbreVarService} from "../../../../shared/services/timbre/timbre-var.service";
import {TimbreActionsService} from "../../../../shared/services/timbre/timbre-actions.service";

@Component({
	selector: "app-timbre-bloc-resultat",
	templateUrl: "./timbre-bloc-resultat.component.html",
	styleUrls: ["./../../../styles/timbre-resultat.scss"],
})
export class TimbreBlocResultatComponent implements OnInit {
	public timbreBlocModel: TimbreBlocModel = new TimbreBlocModel();
	annees$: Observable<number[]>;
	modif: boolean = true;

	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;
	readonly TypeTimbreEnum = TypeTimbreEnum;

	constructor(public authService: AuthService, public timbreActionsService: TimbreActionsService, public timbreVarService: TimbreVarService, public timbreUtilsService: TimbreUtilsService, public utilsService: UtilsService) {
	}

	ngOnInit(): void {
		//this.timbreBlocService.modifAll()
		this.annees$ = this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE_BLOC);
	}

    protected readonly DroitEnum = DroitEnum;
}
