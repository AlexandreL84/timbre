import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {TimbreLayoutComponent} from "./layout/timbre-layout.component";
import {TimbreImporterComponent} from "./components/importer/timbre-importer.component";

const routes: Routes = [
	{
		path: "",
		component: TimbreLayoutComponent,
	},
	{
		path: "importer",
		component: TimbreImporterComponent,
	},
	/*{
		path: "bloc",
		loadChildren: () => import("./modules/bloc/timbre-bloc.module").then(m => m.TimbreBlocModule),
	},*/
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TimbreRoutingModule {}
