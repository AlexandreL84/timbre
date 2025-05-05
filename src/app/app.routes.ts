import {Routes} from '@angular/router';
import {AuthGuard} from "./shared/guards/auth.guard";
import {RouteEnum} from "./shared/enum/route.enum";

export const routes: Routes = [
	{path: "", redirectTo: "/login", pathMatch: "full"},
	{
		path: RouteEnum.LOGIN,
		loadChildren: () => import("./modules/authentification/authentification.module").then(m => m.AuthentificationModule),
	},
	{
		path: RouteEnum.TIMBRE,
		loadChildren: () => import("./modules/timbre/timbre.module").then(m => m.TimbreModule),
		canActivate: [AuthGuard],
	},
	{
		path: RouteEnum.BLOC,
		loadChildren: () => import("./modules/timbre-bloc/timbre-bloc.module").then(m => m.TimbreBlocModule),
		canActivate: [AuthGuard],
	},
	{
		path: RouteEnum.PAYS,
		loadChildren: () => import("./modules/timbre-pays/timbre-pays.module").then(m => m.TimbrePaysModule),
		canActivate: [AuthGuard],
	},
	{
		path: "**",
		pathMatch: "full",
		loadChildren: () => import("./modules/page-not-found/page-not-found.module").then(module => module.PageNotFoundModule),
	},
];
