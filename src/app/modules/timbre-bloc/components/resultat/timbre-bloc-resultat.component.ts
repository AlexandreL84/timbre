import {Component, OnInit} from "@angular/core";
import {TimbreBlocModel} from "../../../../model/timbre-bloc.model";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {Observable} from "rxjs";
import {UtilsService} from "../../../../shared/services/utils.service";
import {TimbreBlocAcquisModel} from "../../../../model/timbre-bloc-acquis.model";
import {FontAwesomeTypeEnum} from "../../../../shared/enum/font-awesome/font-awesome-type.enum";
import {TimbreBlocService} from "../../../../shared/services/timbre/timbre-bloc.service";
import {TimbreUtilsService} from "../../../../shared/services/timbre/timbre-utils.service";
import {BaseEnum} from "../../../../shared/enum/base.enum";
import {TypeTimbreEnum} from "../../../../shared/enum/type-timbre.enum";

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

	constructor(public timbreBlocService: TimbreBlocService, public timbreUtilsService: TimbreUtilsService, public utilsService: UtilsService) {
	}

	ngOnInit(): void {
		//this.timbreBlocService.modifAll()
		this.annees$ = this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE_BLOC);
		this.timbreBlocModel.setTimbreBlocAcquisModel(new TimbreBlocAcquisModel());
	}
}
