import {Injectable} from "@angular/core";
import {NotificationTypeEnum} from "../enum/notification/notification-type.enum";
import {NotificationsService} from "angular2-notifications";
import {isNotNullOrUndefined} from "../utils/utils";

@Injectable({
    providedIn: "root",
})
export class HttpResponseHandlerService {

    constructor(
		private notificationsService: NotificationsService
    ) {
	}

    /**
     * Shows error notification with given title and message
     *
     * @param title
     * @param message
     */
    public showNotificationError(title: NotificationTypeEnum, message: string): void {
        this.notificationsService.error(
            '<div fxLayout="column" style="width: 500px"><h5 style="color: white !important; font-size: 1em !important">' + (isNotNullOrUndefined(title) ? title : "") + "</h5>",
            '<span fxLayout="row" fxLayoutAlign="start center" class="notification" style="color: white !important;font-size: 0.750em !important;">' + message + "</span> </div>",
        );
    }

    /**
     * Shows warn notification with given title and message
     *
     * @param title
     * @param message
     */
    public showNotificationWarn(title: NotificationTypeEnum, message: string): void {
        this.notificationsService.warn(
            '<div fxLayout="column" style="width: 500px"><h5 style="color: white !important; font-size: 1em !important">' + (isNotNullOrUndefined(title) ? title : "") + "</h5>",
            '<span fxLayout="row" fxLayoutAlign="start center" class="notification" style="color: white !important; font-size: 0.750em !important;">' + message + "</span> </div>",
        );
    }

    public showNotificationSuccess(title: NotificationTypeEnum, message: string): void {
        this.notificationsService.success(
            '<div fxLayout="column"  style="width: 500px"><h5 style="color: white !important; font-size: 1em !important">' + (isNotNullOrUndefined(title) ? title : "") + "</h5>",
            '<span fxLayout="row" fxLayoutAlign="start center" class="notification" style="font-size: 0.750em !important;">' + message + "</span> </div>",
        );
    }

    public showNotificationAlert(title: NotificationTypeEnum, message: string): void {
        this.notificationsService.alert(
            '<div fxLayout="column"  style="width: 500px"><h5 style="color: white !important; font-size: 1em !important">' + (isNotNullOrUndefined(title) ? title : "") + "</h5>",
            '<span fxLayout="row" fxLayoutAlign="start center" class="notification" style="font-size: 0.750em !important;">' + message + "</span> </div>",
        );
    }
}
