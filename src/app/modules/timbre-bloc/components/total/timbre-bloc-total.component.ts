import {Component} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {FontAwesomeTypeEnum} from "../../../../shared/enum/font-awesome/font-awesome-type.enum";
import {TimbreResumeComponent} from "../../../timbre/components/resume/timbre-resume.component";
import {TimbreVarService} from "../../../../shared/services/timbre/timbre-var.service";

@Component({
	selector: "app-timbre-bloc-total",
	templateUrl: "./timbre-bloc-total.component.html",
	styleUrls: ["./../../../styles/timbre-total.scss"],
})
export class TimbreBlocTotalComponent {
	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;

	constructor(private dialog: MatDialog, public timbreVarService: TimbreVarService) {
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
