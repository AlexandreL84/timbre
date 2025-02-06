import {NgModule} from "@angular/core";
import {ZIconComponent} from "./z-icon.component";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "../../shared/modules/material.module";
import {AngularSvgIconModule} from "angular-svg-icon";

@NgModule({
    declarations: [ZIconComponent],
    imports: [CommonModule, MaterialModule, AngularSvgIconModule],
    exports: [ZIconComponent],
})
export class ZIconModule {}
