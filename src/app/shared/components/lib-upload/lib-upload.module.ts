import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FlexLayoutModule} from "@angular/flex-layout";
import {LibUploadComponent} from "./lib-upload.component";
import {MaterialModule} from "../../modules/material.module";
import {UtilsService} from "../../services/utils.service";
import {LibLibelleModelModule} from "../lib-libelle-model";
import {LibIconModule} from "../lib-icon";

@NgModule({
    declarations: [LibUploadComponent],
    imports: [CommonModule, FlexLayoutModule, MaterialModule, LibLibelleModelModule, LibIconModule],
    exports: [LibUploadComponent],
	providers: [UtilsService]
})
export class LibUploadModule {}
