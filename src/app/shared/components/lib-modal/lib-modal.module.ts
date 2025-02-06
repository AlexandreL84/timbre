import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ZModalComponent} from "./z-modal.component";
import {MaterialModule} from "../../modules/material.module";
import {ZBlocInfoModule} from "../z-bloc-info/z-bloc-info.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {DirectiveLibModule} from "../directives/directive-lib.module";

@NgModule({
    declarations: [ZModalComponent],
    imports: [CommonModule, FlexLayoutModule, MaterialModule, ZBlocInfoModule, DragDropModule, DirectiveLibModule],
    exports: [ZModalComponent],
})
export class ZModalModule {}
