import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {TimbrePaysLayoutComponent} from "./layout/timbre-pays-layout.component";
import {TimbrePaysImporterComponent} from "./components/importer/timbre-pays-importer.component";
import {TimbrePaysTestComponent} from "./components/test/timbre-pays-test.component";

const routes: Routes = [
	{
		path: "",
		component: TimbrePaysLayoutComponent,
	},
	{
		path: "importer",
		component: TimbrePaysImporterComponent,
	},
	{
		path: "test",
		component: TimbrePaysTestComponent,
	},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TimbrePaysRoutingModule {}
