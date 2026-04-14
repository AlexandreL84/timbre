import {NgModule} from "@angular/core";
import {NotificationsService, SimpleNotificationsModule} from "angular2-notifications";
import {SimpleNotificationComponent} from "./simple-notification.component";
import {HttpResponseHandlerService} from "../../shared/services/httpResponseHandler.service";

@NgModule({
    declarations: [
		SimpleNotificationComponent
    ],
	imports: [
		SimpleNotificationsModule
	],
	exports: [
		SimpleNotificationComponent
	],
    providers: [ HttpResponseHandlerService],
})
export class SimpleNotificationModule {}
