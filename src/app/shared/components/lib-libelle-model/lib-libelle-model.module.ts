import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {LibLibelleModelComponent} from "./lib-libelle-model.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {LibIconModule} from "../lib-icon";

@NgModule({
    declarations: [LibLibelleModelComponent],
    imports: [CommonModule, LibIconModule, FlexLayoutModule],
    exports: [LibLibelleModelComponent],
    providers: [],
})
export class LibLibelleModelModule {}
