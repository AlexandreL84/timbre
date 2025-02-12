import { NgModule} from "@angular/core";
import {ErrorControlComponent} from "./error-control.component";
import {FlexLayoutModule, FlexModule} from "@angular/flex-layout";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "../../shared/modules/material.module";

@NgModule({
    declarations: [ErrorControlComponent,],
    imports: [CommonModule, MaterialModule, FlexModule, FlexLayoutModule],
    exports: [],
    providers: [
    ],
})
export class ErrorModule {

}
