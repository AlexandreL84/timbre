import {Injectable} from "@angular/core";
import {NotificationsService} from "angular2-notifications";
import {ConfigService} from "../services/services/config.service";
import {Router} from "@angular/router";
import {Observable, throwError} from "rxjs";
import {AuthDataService} from "../store/auth/auth-data.service";
import {FrontError} from "../models";
import {ErrorDataService} from "../store/error/error.data.service";
import {NotificationMessageEnum} from "../enums/notification/notification-message.enum";
import {NotificationTypeEnum} from "../enums/notification/notification-type.enum";
import {isNotNullOrUndefined} from "../utils";

@Injectable({
    providedIn: "root",
})
export class HttpResponseHandler {
    constructor(
        private router: Router,
        private notificationsService: NotificationsService,
        private configService: ConfigService,
        private errorDataService: ErrorDataService,
        private autDataService: AuthDataService
    ) {}

    /**
     * Global http error handler.
     *
     * @param response
     * @param source
     * @returns {Observable}
     */
    public onCatch(response: any, source: Observable<any>): Observable<any> {
        switch (response.status) {
            case 400:
                this.handleBadRequest(response);
                break;
            case 401:
                this.handleUnauthorized(response);
                break;
            case 403:
                this.handleForbidden(response);
                break;
            case 404:
                this.handleNotFound(response);
                break;
            case 406:
                this.t9RuntimeException(response);
                break;
            case 422:
                this.showNotificationError(NotificationTypeEnum.ERREUR, response.error.message);
                break;
            case 500:
            case 0:
                this.handleServerError(response);
                break;
            default:
                break;
        }
        return throwError(response);
    }

    /**
     * Shows notification errors when server response status is 401
     * @param error
     */
    private handleBadRequest(responseBody: any): void {
        if (responseBody._body) {
            try {
                const bodyParsed = responseBody.json();
                this.handleErrorMessages(bodyParsed);
            } catch (error) {
                this.handleServerError(responseBody);
            }
        } else {
            this.handleServerError(responseBody);
        }
    }

    /**
     * Shows notification errors when server response status is 401 and redirects user to login page
     * @param responseBody
     */
    private handleUnauthorized(responseBody: any): void {
        // Read configuration in order to see if we need to display 401 notification message
        let unauthorizedEndpoints: Array<string> = this.configService.get("notifications").unauthorizedEndpoints;

        unauthorizedEndpoints = unauthorizedEndpoints.filter(endpoint => this.getRelativeUrl(responseBody.url) === endpoint);
        // this.router.navigate(['/login']);

        if (unauthorizedEndpoints.length) {
            this.notificationsService.info("Info", "ServerError401", this.configService.get("notifications").options);
        }
    }

    /**
     * Shows notification errors when server response status is 403
     */
    private handleForbidden(responseBody: any): void {
        /*   let url: string[] = responseBody['url'].split("/");
		   let method = url[url.length - 1];
		   this.notificationsService.warn('Erreur', 'Accès refusé #' + method, this.configService.get('notifications').options);
		 */
        this.autDataService.logout();
        this.errorDataService.putErrorAction(responseBody);
    }

    /**
     * Shows notification errors when server response status is 404
     *
     * @param responseBody
     */
    private handleNotFound(responseBody: any): void {
        const message: NotificationMessageEnum = NotificationMessageEnum.ERREUR_404,
            title: NotificationTypeEnum = NotificationTypeEnum.ERREUR_404;

        this.showNotificationError(title, message);
    }

    private t9RuntimeException(response: any): void {
        const error = new FrontError(response);
        error.name = response["error"]["code"];
        error.message = response["error"]["message"];
        this.errorDataService.putErrorAction(error);
    }

    /**
     * Shows notification errors when server response status is 500
     */
    private handleServerError(error: any): void {
        this.errorDataService.putErrorAction(new FrontError(error));
    }

    /**
     * Parses server response and shows notification errors with translated messages
     *
     * @param response
     */
    private handleErrorMessages(response: any): void {
        if (!response) return;

        for (const key of Object.keys(response)) {
            if (Array.isArray(response[key])) {
                response[key].forEach(value => this.showNotificationError(NotificationTypeEnum.ERREUR, this.getTranslatedValue(value)));
            } else {
                this.showNotificationError(NotificationTypeEnum.ERREUR, response[key]);
            }
        }
    }

    /**
     * Extracts and returns translated value from server response
     *
     * @param value
     * @returns {string}
     */
    private getTranslatedValue(value: string): string {
        if (value.indexOf("[") > -1) {
            const key = value.substring(value.lastIndexOf("[") + 1, value.lastIndexOf("]"));
            value = key;
        }
        return value;
    }

    /**
     * Returns relative url from the absolute path
     *
     * @param responseBody
     * @returns {string}
     */
    private getRelativeUrl(url: string): string {
        return url.toLowerCase().replace(/^(?:\/\/|[^\/]+)*\//, "");
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
            this.configService.get("notifications").options
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
            this.configService.get("notifications").options
        );
    }

    public showNotificationSuccess(title: NotificationTypeEnum, message: string): void {
        this.notificationsService.success(
            '<div fxLayout="column"  style="width: 500px"><h5 style="color: white !important; font-size: 1em !important">' + (isNotNullOrUndefined(title) ? title : "") + "</h5>",
            '<span fxLayout="row" fxLayoutAlign="start center" class="notification" style="font-size: 0.750em !important;">' + message + "</span> </div>",
            this.configService.get("notifications").options
        );
    }

    public showNotificationAlert(title: NotificationTypeEnum, message: string): void {
        this.notificationsService.alert(
            '<div fxLayout="column"  style="width: 500px"><h5 style="color: white !important; font-size: 1em !important">' + (isNotNullOrUndefined(title) ? title : "") + "</h5>",
            '<span fxLayout="row" fxLayoutAlign="start center" class="notification" style="font-size: 0.750em !important;">' + message + "</span> </div>",
            this.configService.get("notifications").options
        );
    }
}
