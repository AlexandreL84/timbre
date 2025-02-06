import {NgModule} from "@angular/core";
import {NotificationsService, SimpleNotificationsModule} from "angular2-notifications";
import {SimpleNotificationComponent} from "./simple-notification.component";
import {HttpResponseHandlerService} from "../../services/httpResponseHandler.service";

@NgModule({
    declarations: [
		SimpleNotificationComponent
    ],
	imports: [
		SimpleNotificationsModule.forRoot(),
	],
	exports: [
		SimpleNotificationComponent
	],
    providers: [NotificationsService, HttpResponseHandlerService],
})
export class SimpleNotificationModule {}
