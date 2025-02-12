import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "../../modules/material.module";
import {ZDialogImageComponent} from "./z-dialog-image.component";
import {ZIconModule} from "../z-icon";
import {FlexLayoutModule} from "@angular/flex-layout";

@NgModule({
    declarations: [ZDialogImageComponent],
	imports: [CommonModule, MaterialModule, FlexLayoutModule, ZIconModule],
    exports: [ZDialogImageComponent],
})
export class ZDialogImageModule {}
