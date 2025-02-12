import {Routes} from '@angular/router';
import {AuthGuardService} from "./shared/services/auth-guard.service";

export const routes: Routes = [
	/*{
		path: 'auth/signup',
		loadChildren: () => import("./modules/authentification/authentification.module").then(m => m.AuthentificationModule),
	},
	{
		path: 'auth/signin',
		loadChildren: () => import("./modules/authentification/authentification.module").then(m => m.AuthentificationModule),
	},*/
	{
		path: "pays",
		//canActivate: [AuthGuardService],
		loadChildren: () => import("./modules/timbre-pays/timbre-pays.module").then(m => m.TimbrePaysModule),
	},
	/*{
		path: "**",
		pathMatch: "full",
		loadChildren: () => import("./modules/page-not-found/page-not-found.module").then(module => module.PageNotFoundModule),
	},*/
];

