import {Component} from "@angular/core";
import {TimbrePaysService} from "../../services/timbre-pays.service";

@Component({
	selector: "app-timbre-pays-total",
	templateUrl: "./timbre-pays-total.component.html",
	styleUrls: ["./../../../styles/timbre-total.scss"],
})
export class TimbrePaysTotalComponent {
	constructor(public timbrePaysService: TimbrePaysService) {
	}
}
