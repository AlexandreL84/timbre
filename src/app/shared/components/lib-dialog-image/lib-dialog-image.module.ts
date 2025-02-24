import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "../../modules/material.module";
import {LibDialogImageComponent} from "./lib-dialog-image.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {LibIconModule} from "../lib-icon";

@NgModule({
    declarations: [LibDialogImageComponent],
	imports: [CommonModule, MaterialModule, FlexLayoutModule, LibIconModule],
    exports: [LibDialogImageComponent],
})
export class LibDialogImageModule {}
