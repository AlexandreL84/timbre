import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FlexLayoutModule, FlexModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {TimbrePaysRoutingModule} from "./timbre-pays-routing.module";
import {MaterialModule} from "./material.module";
import {TimbrePaysLayoutComponent} from "./layout/timbre-pays-layout.component";

@NgModule({
    declarations: [
      TimbrePaysLayoutComponent,
    ],
    imports: [
        TimbrePaysRoutingModule,
        CommonModule,
        FlexModule,
        FlexLayoutModule,
        MatButtonModule,
        RouterLink,
        MaterialModule,
        FormsModule,
    ],
    exports: [TimbrePaysLayoutComponent],
    providers: [],
})
export class TimbrePaysModule {}
