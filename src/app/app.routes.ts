import {Routes} from '@angular/router';
import {AuthGuard} from "./shared/guards/auth.guard";

export const routes: Routes = [
	{
		path: 'login',
		loadChildren: () => import("./modules/authentification/authentification.module").then(m => m.AuthentificationModule),
	},
	/*{
		path: 'auth/signin',
		loadChildren: () => import("./modules/authentification/authentification.module").then(m => m.AuthentificationModule),
	},*/
	{
		path: "pays",
		//canActivate: [AuthGuardService],
		loadChildren: () => import("./modules/timbre-pays/timbre-pays.module").then(m => m.TimbrePaysModule),
		canActivate: [AuthGuard],
	},
	/*{
		path: "**",
		pathMatch: "full",
		loadChildren: () => import("./modules/page-not-found/page-not-found.module").then(module => module.PageNotFoundModule),
	},*/
];

