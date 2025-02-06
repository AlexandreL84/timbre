import {Component,} from "@angular/core";
import {Options} from "angular2-notifications";
@Component({
	selector: "app-simple-notification",
	templateUrl: "./simple-notification.component.html",
	styleUrls: ["./simple-notification.component.scss"],
})
export class SimpleNotificationComponent {
	public notificationOptions: Options = {
		position: ['top', 'right'],
		timeOut: 5000,
		maxStack: 5,
		lastOnBottom: true
	};
}
