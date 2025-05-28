import {Component} from '@angular/core';
import {FontAwesomeEnum} from "../../../shared/enum/font-awesome";
import {HeaderService} from "../../../shared/services/header.service";
import {TimbreModifierComponent} from "../../timbre/components/modifier/timbre-modifier.component";
import {TimbreModifierBlocComponent} from "../../timbre-bloc/components/modifier-bloc/timbre-modifier-bloc.component";
import {TimbreImporterComponent} from "../../timbre/components/importer/timbre-importer.component";
import {TimbreService} from "../../../shared/services/timbre/timbre.service";
import {MatDialog} from "@angular/material/dialog";
import {RouteEnum} from "../../../shared/enum/route.enum";
import {FontAwesomeTypeEnum} from "../../../shared/enum/font-awesome/font-awesome-type.enum";
import {AuthService} from "../../../shared/services/auth.service";
import {DroitEnum} from "../../../shared/enum/droit.enum";
import {UserModel} from "../../../model/user.model";
import {isNotNullOrUndefined} from "../../../shared/utils/utils";
import {TimbreUtilsService} from "../../../shared/services/timbre/timbre-utils.service";
import {TimbreBlocService} from "../../../shared/services/timbre/timbre-bloc.service";
import {BaseEnum} from "../../../shared/enum/base.enum";
import {first} from "rxjs";
import {ModeEnum} from "../../../shared/enum/mode.enum";
import {PreferenceService} from "../../../shared/services/preference.service";
import {PreferenceEnum} from "../../../shared/enum/preference.enum";
import {plainToInstance} from "class-transformer";
import {TimbreCritereModel} from "../../../model/timbre-critere.model";

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly RouteEnum = RouteEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;
	readonly DroitEnum = DroitEnum;
	readonly ModeEnum = ModeEnum;

	constructor(private preferenceService: PreferenceService, public authService: AuthService, public headerService: HeaderService, private timbreService: TimbreService, private timbreBlocService: TimbreBlocService, private timbreUtilsService: TimbreUtilsService, private dialog: MatDialog) {
		this.verifRoute();
	}

	ajouter() {
		const refDialog = this.dialog.open(TimbreModifierComponent, {
			maxHeight: "95vh",
			width: "30%",
			minWidth: "300px"
		});

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}

	ajouterBloc() {
		const refDialog = this.dialog.open(TimbreModifierBlocComponent, {
			maxHeight: "95vh",
			width: "30%",
			minWidth: "300px"
		});

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}

	ajouterBouchon() {
		this.timbreService.ajouterSansId(this.timbreService.getBouchon());
	}

	importer() {
		const refDialog = this.dialog.open(TimbreImporterComponent, {
			//height: "25vh",
			//width: "20%",
			height: "90vh",
			width: "70%",
			minWidth: "300px"
		});

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}

	verifRoute() {
		if (window.location.href.indexOf("bloc") > 0) {
			//this.timbreBlocService.modifAll();
			this.preferenceService.getTimbreCritere(PreferenceEnum.BLOC_CRITERE).pipe(first()).subscribe(timbreCritereModel => {
				if (isNotNullOrUndefined(timbreCritereModel.getAnnees()) && timbreCritereModel.getAnnees().length > 0) {
					this.timbreBlocService.getBlocs(timbreCritereModel, true);
				} else {
					this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE_BLOC).pipe(first(annees => isNotNullOrUndefined(annees) && annees?.length > 0)).subscribe(annees => {
						timbreCritereModel.initCritere();
						timbreCritereModel.setAcquis("NON");
						timbreCritereModel.setAnnees([annees[0]]);
						this.preferenceService.timbreCritereBlocModel = timbreCritereModel;
						this.preferenceService.modifier(PreferenceEnum.BLOC_CRITERE, timbreCritereModel);
						this.timbreBlocService.getBlocs(timbreCritereModel, true);
					});
				}
			});
		} else {
			//this.timbreService.modifAll();
			//this.preferenceService.supprimer("timbreCritereModel2");
			this.preferenceService.getTimbreCritere(PreferenceEnum.TIMBRE_CRITERE).pipe(first()).subscribe(timbreCritereModel => {
				if (isNotNullOrUndefined(timbreCritereModel.getAnnees()) && timbreCritereModel.getAnnees().length > 0) {
					this.timbreService.getTimbres(timbreCritereModel, true);
				} else {
					this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE).pipe(first(annees => isNotNullOrUndefined(annees) && annees?.length > 0)).subscribe(annees => {
						timbreCritereModel.initCritere();
						timbreCritereModel.setAcquis("NON");
						timbreCritereModel.setAnnees([annees[0]]);
						this.preferenceService.timbreCritereModel = timbreCritereModel;
						this.preferenceService.modifier(PreferenceEnum.TIMBRE_CRITERE, timbreCritereModel);
						this.timbreService.getTimbres(timbreCritereModel, true);
					});
				}
			});
		}
	}

	setUser(userModel: UserModel) {
		this.authService.userSelect$.next(userModel);
		this.verifRoute();
		this.timbreUtilsService.reinitResume$.next(true);
	}
}
