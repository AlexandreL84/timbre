import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FlexLayoutModule} from "@angular/flex-layout";
import {LibSpinnerComponent} from "./lib-spinner.component";
import {MaterialModule} from "../../modules/material.module";

@NgModule({
    declarations: [LibSpinnerComponent],
    imports: [CommonModule, FlexLayoutModule, MaterialModule],
    exports: [LibSpinnerComponent],
})
export class LibSpinnerModule {}
