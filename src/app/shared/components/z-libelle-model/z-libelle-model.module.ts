import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ZLibelleModelComponent} from "./z-libelle-model.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ZIconModule} from "../z-icon";
@NgModule({
    declarations: [ZLibelleModelComponent],
    imports: [CommonModule, ZIconModule, FlexLayoutModule],
    exports: [ZLibelleModelComponent],
    providers: [],
})
export class ZLibelleModelModule {}
