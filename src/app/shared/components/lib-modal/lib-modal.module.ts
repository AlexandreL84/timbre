import {NgModule} from "@angular/core";
import {LibModalComponent} from "./lib-modal.component";
import {MaterialModule} from "../../modules/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [LibModalComponent],
    imports: [CommonModule, FlexLayoutModule, MaterialModule],
    exports: [LibModalComponent],
})
export class LibModalModule {}
