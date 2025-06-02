import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FlexLayoutModule} from "@angular/flex-layout";
import {LibUploadMultipleComponent} from "./lib-upload-multiple.component";
import {MaterialModule} from "../../modules/material.module";
import {UtilsService} from "../../services/utils.service";
import {LibLibelleModelModule} from "../lib-libelle-model";
import {LibIconModule} from "../lib-icon";

@NgModule({
    declarations: [LibUploadMultipleComponent],
    imports: [CommonModule, FlexLayoutModule, MaterialModule, LibLibelleModelModule, LibIconModule],
    exports: [LibUploadMultipleComponent],
	providers: [UtilsService]
})
export class LibUploadMultipleModule {}
