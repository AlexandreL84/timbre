import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FlexLayoutModule} from "@angular/flex-layout";
import {LibUploadNewComponent} from "./lib-upload-new.component";
import {MaterialModule} from "../../modules/material.module";
import {UtilsService} from "../../services/utils.service";
import {LibLibelleModelModule} from "../lib-libelle-model";
import {LibIconModule} from "../lib-icon";

@NgModule({
    declarations: [LibUploadNewComponent],
    imports: [CommonModule, FlexLayoutModule, MaterialModule, LibLibelleModelModule, LibIconModule],
    exports: [LibUploadNewComponent],
	providers: [UtilsService]
})
export class LibUploadNewModule {}
