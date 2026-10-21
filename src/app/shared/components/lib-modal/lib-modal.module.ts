import {NgModule} from "@angular/core";
import {LibModalComponent} from "./lib-modal.component";
import {MaterialModule} from "../../modules/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {CommonModule} from "@angular/common";

@NgModule({
    imports: [LibModalComponent, CommonModule, FlexLayoutModule, MaterialModule],
    exports: [LibModalComponent],
})
export class LibModalModule {}
