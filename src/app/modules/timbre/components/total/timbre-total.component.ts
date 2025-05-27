import {Component, Input} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {BehaviorSubject,  Observable} from "rxjs";
import {FontAwesomeTypeEnum} from "../../../../shared/enum/font-awesome/font-awesome-type.enum";
import {TimbreResumeComponent} from "../resume/timbre-resume.component";

@Component({
	selector: "app-timbre-total",
	templateUrl: "./timbre-total.component.html",
	styleUrls: ["./../../../styles/timbre-total.scss"],
})
export class TimbreTotalComponent {
	@Input() total$: BehaviorSubject<number> | Observable<number>;

	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;

	constructor(private dialog: MatDialog) {
	}

	resume() {
		this.dialog.open(TimbreResumeComponent, {
			height: "auto",
			//maxHeight: "750px",
			maxHeight: "95vh",
			width: "1200px",
		});
	}
}
