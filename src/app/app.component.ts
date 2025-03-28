import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FlexModule} from "@angular/flex-layout";
import {SimpleNotificationModule} from "./modules/simple-notification/simple-notification.module";
import {HeaderModule} from "./modules/header/header.module";

@Component({
	selector: 'app-root',
	standalone: true,
    imports: [RouterOutlet, FlexModule, HeaderModule, SimpleNotificationModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {

}

