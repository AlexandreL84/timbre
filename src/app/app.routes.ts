import {Routes} from '@angular/router';
import {AuthGuard} from "./shared/guards/auth.guard";

export const routes: Routes = [
	{
		path: 'login',
		loadChildren: () => import("./modules/authentification/authentification.module").then(m => m.AuthentificationModule),
	},
	{
		path: "timbre",
		loadChildren: () => import("./modules/timbre/timbre.module").then(m => m.TimbreModule),
		canActivate: [AuthGuard],
	},
	{
		path: "pays",
		loadChildren: () => import("./modules/timbre-pays/timbre-pays.module").then(m => m.TimbrePaysModule),
		canActivate: [AuthGuard],
	},
	/*{
		path: "**",
		pathMatch: "full",
		loadChildren: () => import("./modules/page-not-found/page-not-found.module").then(module => module.PageNotFoundModule),
	},*/
];

