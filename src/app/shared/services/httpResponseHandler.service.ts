import {Injectable} from "@angular/core";
import {NotificationTypeEnum} from "../enum/notification/notification-type.enum";
import {NotificationsService} from "angular2-notifications";
import {isNotNullOrUndefined} from "../utils/utils";

@Injectable()
export class HttpResponseHandlerService {

    constructor(
		private notificationsService: NotificationsService
    ) {
	}



	public showNotificationError(title: NotificationTypeEnum, message: string): void {
		this.notificationsService.error(this.getTitle(title), this.getMessage(message));
	}

	public showNotificationWarn(title: NotificationTypeEnum, message: string): void {
		this.notificationsService.warn(this.getTitle(title), this.getMessage(message));
	}

	public showNotificationSuccess(title: NotificationTypeEnum, message: string): void {
		this.notificationsService.success(this.getTitle(title), this.getMessage(message));
	}

	public showNotificationAlert(title: NotificationTypeEnum, message: string): void {
		this.notificationsService.alert(this.getTitle(title), this.getMessage(message));
	}

	public showNotificationInfo(title: NotificationTypeEnum, message: string): void {
		this.notificationsService.info(this.getTitle(title), this.getMessage(message));
	}

	getTitle(title: NotificationTypeEnum) {
		return '<div fxLayout="column" style="width: 500px"><span style="color: white !important; font-size: 1em !important">' + (isNotNullOrUndefined(title) ? title : "") + "</span>";
	}

	getMessage(message: string) {
		return '<span fxLayout="row" fxLayoutAlign="start center" class="notification" style="color: white !important;font-size: 0.750em !important;">' + message + "</span> </div>";
	}
}
