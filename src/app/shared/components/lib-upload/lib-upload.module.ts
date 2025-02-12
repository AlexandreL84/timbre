import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FlexLayoutModule} from "@angular/flex-layout";
import {LibUploadComponent} from "./lib-upload.component";
import {MaterialModule} from "../../modules/material.module";
import {ZLibelleModelModule} from "../z-libelle-model";
import {ZIconModule} from "../z-icon";
import {UtilsService} from "../../services/utils.service";

@NgModule({
    declarations: [LibUploadComponent],
    imports: [CommonModule, FlexLayoutModule, MaterialModule, ZLibelleModelModule, ZIconModule],
    exports: [LibUploadComponent],
	providers: [UtilsService]
})
export class LibUploadModule {}
