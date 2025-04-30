import {Component, Input, OnInit} from "@angular/core";
import {TimbreModel} from "../../../../model/timbre.model";
import {TimbreService} from "../../../../shared/services/timbre/timbre.service";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {BehaviorSubject, first, Observable} from "rxjs";
import {UtilsService} from "../../../../shared/services/utils.service";
import {TimbreAcquisModel} from "../../../../model/timbre-acquis.model";
import {FontAwesomeTypeEnum} from "../../../../shared/enum/font-awesome/font-awesome-type.enum";
import {TimbreUtilsService} from "../../../../shared/services/timbre/timbre-utils.service";
import {BaseEnum} from "../../../../shared/enum/base.enum";
import {AuthService} from "../../../../shared/services/auth.service";

@Component({
	selector: "app-timbre-resultat",
	templateUrl: "./timbre-resultat.component.html",
	styleUrls: ["./../../../styles/timbre-resultat.scss"],
})
export class TimbreResultatComponent implements OnInit {
	@Input() timbres$: BehaviorSubject<TimbreModel[]> | Observable<TimbreModel[]>;
	@Input() load$: BehaviorSubject<boolean> | Observable<boolean>;
	@Input() total$: BehaviorSubject<number> | Observable<number>;
	@Input() modif: boolean = true;

	public timbre: TimbreModel = new TimbreModel();
	annees$: Observable<number[]>

	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;

	constructor(public authService: AuthService, public timbreService: TimbreService, public timbreUtilsService: TimbreUtilsService, public utilsService: UtilsService) {
	}

	ngOnInit(): void {
		this.annees$ = this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE);
		this.timbre.setTimbreAcquisModel(new TimbreAcquisModel());
	}
}
