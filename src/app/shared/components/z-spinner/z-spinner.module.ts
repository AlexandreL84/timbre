import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ZSpinnerComponent} from "./z-spinner.component";
import {MaterialModule} from "../../modules/material.module";

@NgModule({
    declarations: [ZSpinnerComponent],
    imports: [CommonModule, FlexLayoutModule, MaterialModule],
    exports: [ZSpinnerComponent],
})
export class ZSpinnerModule {}
