import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {TimbrePaysLayoutComponent} from "./layout/timbre-pays-layout.component";

const routes: Routes = [
    {
        path: "",
        component: TimbrePaysLayoutComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TimbrePaysRoutingModule {}
