import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {TimbreBlocLayoutComponent} from "./layout/timbre-bloc-layout.component";

const routes: Routes = [
	{
		path: "",
		component: TimbreBlocLayoutComponent,
	}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TimbreBlocRoutingModule {}
