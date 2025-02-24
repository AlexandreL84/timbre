import {NgModule} from "@angular/core";
import {LibIconComponent} from "./lib-icon.component";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "../../modules/material.module";
import {AngularSvgIconModule} from "angular-svg-icon";

@NgModule({
    declarations: [LibIconComponent],
    imports: [CommonModule, MaterialModule, AngularSvgIconModule],
    exports: [LibIconComponent],
})
export class LibIconModule {}
