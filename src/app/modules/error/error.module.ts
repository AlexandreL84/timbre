import {ErrorHandler, ModuleWithProviders, NgModule} from "@angular/core";
import {ErrorControlComponent} from "./error-control.component";
import {PageErrorComponent} from "./composants/page-error.component";
import {ErrorRoutingModule} from "./error-routing.module";
import {GlobalErrorHandler} from "./shared/error.handler";
import {ServerDownComponent} from "./server-down/server-down.component";
import {FlexLayoutModule, FlexModule} from "@angular/flex-layout";
import {CommonModule} from "@angular/common";
import {ZIconModule} from "../../ui/z-icon/z-icon.module";
import {ErrorStoreModule} from "../../store/error/error-store.module";
import {LogApiService} from "../../services/api/log.api.service";
import {ErrorsService} from "../../services/services/error.service";
import {ThrowErrorComponent} from "./throw-error/throw-error.component";
import {AdministrationApiService} from "../../services/api/administration-api.service";
import {MaterialModule} from "../material.module";

@NgModule({
    declarations: [ErrorControlComponent, PageErrorComponent, ServerDownComponent, ThrowErrorComponent],
    imports: [CommonModule, MaterialModule, FlexModule, FlexLayoutModule, ErrorStoreModule, ErrorRoutingModule, ZIconModule],
    exports: [ErrorControlComponent, PageErrorComponent, ServerDownComponent],
    providers: [
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler,
        },
        LogApiService,
        ErrorsService,
        AdministrationApiService,
    ],
})
export class ErrorModule {
    static forRoot(): ModuleWithProviders<ErrorModule> {
        return {
            ngModule: ErrorModule,

            providers: [
                {
                    provide: ErrorHandler,
                    useClass: GlobalErrorHandler,
                },
            ],
        };
    }
}
