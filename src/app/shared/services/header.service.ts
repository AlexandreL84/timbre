import {Injectable} from '@angular/core';
import {BehaviorSubject, first} from "rxjs";
import {FontAwesomeTypeEnum} from "../enum/font-awesome/font-awesome-type.enum";
import {FontAwesomeEnum} from "../enum/font-awesome";
import {IconeModel} from "../../model/icone.model";
import {RouteEnum} from "../enum/route.enum";
import {Router} from "@angular/router";
import {isNotNullOrUndefined, isNullOrUndefined} from "../utils/utils";


@Injectable()
export class HeaderService {
	titre$: BehaviorSubject<string> = new BehaviorSubject<string>("");
	choixRoutes$: BehaviorSubject<IconeModel[]> = new BehaviorSubject<IconeModel[]>(null);

	constructor(private router: Router) {
	}

	changeIcones(route: RouteEnum) {
		this.choixRoutes$.next(null);
		const iconeModels: IconeModel[] = [];
		if (route == RouteEnum.BLOC) {
			iconeModels.push(this.iconeTimbre());
			iconeModels.push(this.iconePays());
		} else if (route == RouteEnum.TIMBRE) {
			iconeModels.push(this.iconeBloc());
			iconeModels.push(this.iconePays());
		} else if (route == RouteEnum.PAYS) {
			iconeModels.push(this.iconeTimbre());
		}
		this.choixRoutes$.next(iconeModels);
	}

	iconeTimbre(): IconeModel {
		const iconeModel: IconeModel = new IconeModel();
		iconeModel.setIcone(FontAwesomeEnum.FLAG);
		iconeModel.setType(FontAwesomeTypeEnum.TYPE_LIGHT);
		iconeModel.setInfo("Timbres Français");
		iconeModel.setRoute(RouteEnum.TIMBRE);
		return iconeModel;
	}

	iconeBloc(): IconeModel {
		const iconeModel: IconeModel = new IconeModel();
		iconeModel.setIcone(FontAwesomeEnum.FOLDER);
		iconeModel.setType(FontAwesomeTypeEnum.TYPE_SOLID);
		iconeModel.setInfo("Bloc");
		iconeModel.setRoute(RouteEnum.BLOC);
		return iconeModel;
	}

	iconePays(): IconeModel {
		const iconeModel: IconeModel = new IconeModel();
		iconeModel.setIcone(FontAwesomeEnum.EARTH_EUROPE);
		iconeModel.setType(FontAwesomeTypeEnum.TYPE_SOLID);
		iconeModel.setInfo("Timbres Étranger");
		iconeModel.setRoute(RouteEnum.PAYS);
		return iconeModel;
	}

	setRoute(route: RouteEnum) {
		this.router.navigate(["/" + route]);
		this.changeIcones(route);
	}

	setRouteAfterLogin() {
		this.choixRoutes$.pipe(first(choixRoutes => isNullOrUndefined(choixRoutes) || choixRoutes?.length == 0)).subscribe(choixRoute => {
			if (window.location.href.indexOf("pays") > 0) {
				this.changeIcones(RouteEnum.PAYS);
			} else if (window.location.href.indexOf("bloc") > 0) {
				this.changeIcones(RouteEnum.BLOC);
			} else if (window.location.href.indexOf("timbre") > 0) {
				this.changeIcones(RouteEnum.TIMBRE);
			}
		});
	}
}
