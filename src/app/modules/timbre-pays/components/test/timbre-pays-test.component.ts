import {Component, OnInit} from "@angular/core";
import {UploadService} from "../../../../shared/services/upload.service";

@Component({
	selector: "app-timbre-pays-test",
	templateUrl: "./timbre-pays-test.component.html",
	styleUrls: ["./timbre-pays-test.component.scss"],
})
export class TimbrePaysTestComponent implements OnInit {
	constructor(
		private uploadService: UploadService
	) {
	}

	ngOnInit() {
		//this.uploadService.onUpload()
		const imagePath = '/assets/images/drapeau/AD.png';
		this.uploadService.processAndUploadImage(imagePath, 620, 430, "test", "test").subscribe(
			url=> {
				console.log(url)
			});
	}
}
