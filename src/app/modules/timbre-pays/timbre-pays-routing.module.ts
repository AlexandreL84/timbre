import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {TimbrePaysLayoutComponent} from "./layout/timbre-pays-layout.component";
import {TimbrePaysImporterComponent} from "./components/importer/timbre-pays-importer.component";

const routes: Routes = [
	{
		path: "",
		component: TimbrePaysLayoutComponent,
	},
	{
		path: "importer",
		component: TimbrePaysImporterComponent,
	},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TimbrePaysRoutingModule {}
